import DocumentRenderer from "../renderer.js"

$Page.AUTOSAVE_THRESHOLD = 50 // 글자 이상 치면 자동으로 저장
$Page.projectId = "";
$Page.projectInfo = null;
$Page.documentId = "";
$Page.documentList = [];

(() => {
    let splitted = window.location.pathname.split("/");
    $Page.projectId = splitted[2];
    $Page.documentId = splitted[3];

    // Get the information
    Ajax.get(`/api/projects/${$Page.projectId}`).then(async(res) => {
        res.json().then(data => {
            $Page.projectInfo = data;
            $Page.updateDataValue();

            // Handle documentId
            $Page.gotoDocument($Page.documentId, true);
        });
    })

    $("#project-nav-name").attr("href", `/projects/${$Page.projectId}`);
})();



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

$Page.makeInternalLink = function(docId) {
    return `/projects/${$Page.projectId}/${docId}`;
}

$Page.getInternalLinkDocId = function(link) {
    link = link.replace(window.location.origin, "");
    if (link.startsWith(`/projects/${$Page.projectId}`)) {
        link = link.replace(`/projects/${$Page.projectId}`, "").replace(/^\//, "");
        return link; // could be ""
    }
    return false;
}

$Page.reloadDocumentList = async function() {
    let docs = await Ajax.get(`/api/projects/${$Page.projectId}/documents`);
    docs = await docs.json();
    docs = docs.sort((a, b) => { return (a.path + a.name).localeCompare(b.path + b.name) });
    $Page.documentList = docs;

    $("#project-nav-content").empty();

    let indentTable = { "/": true };
    docs.forEach((doc, idx) => {
        let docId = doc._id.split("/")[1]
        let indents = 0;
        let displayName = doc.name;

        // Calculate indents
        if (indentTable[doc.path]) {
            indents = doc.path.split("/").length - 2;
            indentTable[`${doc.path}${doc.name}/`] = true;
        } else {
            // Path exists, but parent doesn't // Path doesn't exist
            // => display the full name
            displayName = `${doc.path.slice(1)}${doc.name}`;
        }

        // Add element
        $("#project-nav-content").append(
            $("<a class='project-nav-document' draggable='true'>")
            .text(displayName)
            .attr("href", $Page.makeInternalLink(docId))
            .attr("data-doc-id", docId)
            .css("margin-left", indents ? `${indents}em` : "")
        )
    });
}


$Page.renderDocument = async function(docId) {
    Ajax.get(`/api/projects/${$Page.projectId}/documents/${docId}`, {})
        .then(async(res) => {
            let target = $("#main-container")
            DocumentRenderer.clear(target);

            let content;
            content = await res.json();
            if (!res.ok) {
                DocumentRenderer.renderError(res.statusText, content.error, target);
                return;
            }

            DocumentRenderer.renderHeader(content, target);
            DocumentRenderer.renderNote(content, target);
            $Page.updateDataValue();
        })
}

$Page.renderFrontPage = function() {
    // $("#main-container").html(`
    //     <h1 data-value="project-name">Project Name</h1>
    //     <p data-value="project-desc">Project Description</p>
    // `).attr("contenteditable", false)
    let target = $("#main-container")
    DocumentRenderer.clear(target);
    DocumentRenderer.renderHeader($Page.projectInfo, target);
    DocumentRenderer.renderNote({ content: $Page.projectInfo.desc }, target);

    $Page.updateDataValue();
}

$Page.save = function() {
    if ($Page.saveCounter == 0) {
        // Content not changed
        return;
    }
    $Page.saveCounter = 0;

    let content = $("#main-container").html();
    Ajax.patch(`/api/projects/${$Page.projectId}/documents/${$Page.documentId}`, {
        body: {
            content: content
        }
    });
}


/**
 * Returns the cached document.
 * @param {string | Element | JQuery} docId 
 * @returns {HDTDocument}
 */
$Page.getDocument = function(docId) {
    if (docId.getAttribute) {
        docId = docId.getAttribute("data-doc-id");
    } else if (docId.attr) {
        docId = docId.attr("data-doc-id");
    }

    if (docId.length == 4) {
        docId = $Page.projectId + "/" + docId;
    }

    return $Page.documentList.find(doc => doc._id === docId);
}

$Page.isEqualDocument = function(a, b) {
    if (a._id) {
        a = a._id;
        if (a.length == 11) {
            a = a.slice(-4);
        }
    }
    if (b._id) {
        b = b._id;
        if (b.length == 11) {
            b = b.slice(-4);
        }
    }
    return a === b;
}

$Page.deleteDocument = function(docId) {
    Ajax.delete(`/api/projects/${$Page.projectId}/documents/${docId}`).then(() => {
        $Page.reloadDocumentList();
    });
}

$Page.setDocumentPath = function(docId, path) {
    path = path || "/";
    if (!path.endsWith("/")) {
        path += "/";
    }

    Ajax.patch(`/api/projects/${$Page.projectId}/documents/${docId}`, {
        body: {
            path: path
        }
    }).then(() => {
        $Page.reloadDocumentList();
    });
}

$Page.gotoDocument = function(docId, dontPushState) {
    let pushState = dontPushState ? () => {} : history.pushState.bind(history);

    $Page.documentId = docId;
    if (!docId) {
        pushState(null, null, `/projects/${$Page.projectId}`);
        $Page.renderFrontPage();
        return;
    }
    pushState(null, null, `/projects/${$Page.projectId}/${docId}`);
    $Page.renderDocument(docId);
}



// New document button
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

// Handle hyperlink
$("body").on("click", "a", e => {
    let href = $(e.target).closest("a").attr("href");
    if (!href) return;

    let internalLinkDocId = $Page.getInternalLinkDocId(href);
    if (internalLinkDocId !== false) {
        // Same project, internal link
        e.preventDefault();
        $Page.save();
        $Page.gotoDocument(internalLinkDocId);
    }
})

// Document list context menu
$("#project-nav-content").on("contextmenu", ".project-nav-document", e => {
    e.preventDefault();
    let docId = $(e.target).attr("data-doc-id");
    HDT.contextMenu(e.pageX, e.pageY, {
        "삭제": () => {
            if (confirm(`정말 '${$(e.target).text()}' 문서를 삭제하시겠습니까?`)) {
                $Page.deleteDocument(docId)
            }
        },
        "이름 변경": () => {
            let newName = prompt("문서 이름을 입력해주세요.");
            if (!newName) return;

            Ajax.patch(`/api/projects/${$Page.projectId}/documents/${docId}`, {
                body: {
                    name: newName
                }
            }).then(() => { $Page.reloadDocumentList() });
        }
    })
})

// Document list drag and drop => set path
$("#project-nav-content").on("dragstart", ".project-nav-document", e => {
    e.originalEvent.dataTransfer.setData("text/plain", $(e.target).attr("data-doc-id"));
})
$("#project-nav-content").on("dragover", ".project-nav-document", e => {
    e.preventDefault();
    e.originalEvent.dataTransfer.dropEffect = "move";
})
$("#project-nav-content").on("drop", ".project-nav-document", e => {
    e.preventDefault();
    let docId = e.originalEvent.dataTransfer.getData("text/plain");
    let destinationDocument = $Page.getDocument(e.target);
    if (!destinationDocument) return;

    let path;
    if ($Page.isEqualDocument(docId, destinationDocument)) {
        path = "/";
    } else {
        path = destinationDocument.path + destinationDocument.name;
    }

    $Page.setDocumentPath(docId, path);
})

// Autosave
$Page.saveCounter = 0;
$("#main-container").on("input", () => {
    $Page.saveCounter++;
    if ($Page.saveCounter >= $Page.AUTOSAVE_THRESHOLD) {
        $Page.save();
    }
})

// Save notifier
$(window).on("beforeunload", () => {
    if ($Page.saveCounter > 1) {
        $Page.save();
        return "아직 저장되지 않은 내용이 있습니다. 저장하지 않고 나가시겠습니까?";
    }
})

$($Page.reloadDocumentList)