HDT.getCurrentUser().then(user => {
    if (!user) {
        window.location = "/";
        return;
    }
    $("#input-email").val(user.email);
    $("#input-name").val(user.name);
    $("#input-meta").val(user.meta);
})

$("#button-submit").on("click", async() => {
    let user = await HDT.getCurrentUser();
    let id = user._id
    let name = $("#input-name").val() || undefined;
    let meta = $("#input-meta").val() || undefined;

    // Try parse meta
    try {
        JSON.parse(meta);
    } catch (e) {
        let go = confirm("메타데이터가 올바른 JSON 형식이 아닌 것 같습니다. 정말 저장하시겠습니까?");
        if (!go) return;
    }

    $A.patch(`/api/users/${id}`, {
        body: {
            "name": name,
            "meta": meta
        }
    }).then(async res => {
        if (!res.ok) {
            let err = await res.json().error;
            alert("업데이트 실패: " + err);
            return;
        } else {
            alert("적용되었습니다.");
            window.location.reload();
        }
    })
})

HDT.fileLoaded("projectlist.js");