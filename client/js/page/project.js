$Page.AUTOSAVE_THRESHOLD = 50 // 글자 이상 치면 자동으로 저장
$Page.projectId = "";
$Page.projectInfo = null;

(() => {
    let splitted = window.location.pathname.split("/");
    $Page.projectId = splitted[splitted.length - 1];

    // Get the information
    Ajax.get(`/api/projects/${$Page.projectId}`).then(async(res) => {
        res.json().then(data => {
            $Page.projectInfo = data;
            $Page.updateDataValue()
        });
    })
})();

$Page.reloadDocumentList = async function() {
    let docs = await Ajax.get(`/api/projects/${$Page.projectId}/documents`);
    docs = await docs.json();
    $("#project-nav-content").empty();
    docs.forEach(doc => {
        let docId = doc._id.split("/")[1]
        $("#project-nav-content").append(
            $("<li>").append(
                $("<a>").text(doc.name).attr("href", `#${docId}`)
            )
        )
    });
}

$Page.renderDocument = async function(docId) {
    Ajax.get(`/api/projects/${$Page.projectId}/documents/${docId}`, {})
        .then(async(res) => {
            res = await res.json();
            $("#main-container").attr("contenteditable", "true").html(res.content);
            $Page.updateDataValue();
        })
}

$Page.renderFrontPage = function() {
    $("#main-container").html(`
        <h1 data-value="project-name">Project Name</h1>
        <p data-value="project-desc">Project Description</p>
    `).attr("contenteditable", false)
    $Page.updateDataValue();
}

$Page.save = function() {
    if ($Page.saveCounter == 0) {
        // Content not changed
        return;
    }
    $Page.saveCounter = 0;

    let content = $("#main-container").html();
    let docId = $Page.lastHash.replace("#", "");
    if (docId.length !== 4) {
        // Invalid docId
        return;
    }
    Ajax.patch(`/api/projects/${$Page.projectId}/documents/${docId}`, {
        body: {
            content: content
        }
    });
}

$Page.updateDataValue = async function() {
    while (!$Page.projectInfo) {
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    $("[data-value=project-name]").each((k, v) => {
        $(v).text($Page.projectInfo.name)
    })

    $("[data-value=project-desc]").each((k, v) => {
        $(v).text($Page.projectInfo.desc)
    })
}

$Page.handleHash = function() {
    if (window.location.hash.length >= 4) {
        $Page.renderDocument(window.location.hash.replace("#", ""));
    } else if (window.location.hash.length <= 1) {
        $Page.renderFrontPage();
    }
}

$("#new-document-button").on("click", () => {
    let filename = prompt("문서 이름을 입력해주세요.");
    if (!filename) return;

    Ajax.post(`/api/projects/${$Page.projectId}/documents`, {
        body: {
            name: filename,
            path: "/",
            type: "note",
        }
    }).then(ret => { $Page.reloadDocumentList() });
})

$Page.saveCounter = 0;
$("#main-container").on("input", () => {
    $Page.saveCounter++;
    if ($Page.saveCounter >= $Page.AUTOSAVE_THRESHOLD) {
        $Page.save();
    }
})

$Page.lastHash = window.location.hash;
$(window).on("hashchange", () => {
    $Page.save();
    $Page.handleHash();
    $Page.lastHash = window.location.hash;
})

$(window).on("beforeunload", () => {
    if ($Page.saveCounter > 1) {
        $Page.save();
        return "아직 저장되지 않은 내용이 있습니다. 저장하지 않고 나가시겠습니까?";
    }
})

$($Page.reloadDocumentList)
$($Page.handleHash)