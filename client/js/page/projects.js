HDT.getCurrentUser().then(user => {
    if (!user) {
        // Login required to create a project
        $("#button-create-project").remove();
    }
})

$Page.addProjectInfo = function(id, name, desc, ownerName, isPublic) {
    let project = $("<div>")
        .addClass("project-info").attr("id", `proj-${id}`);
    let projectName = $("<a>")
        .addClass("project-name").text(name).attr("href", `/projects/${id}`);
    let projectIcon = $("<span>").addClass(isPublic ? "project-public-icon" : "project-private-icon");
    let projectOwner = $("<span>").addClass("project-owner").text(`${ownerName}`);
    let br = $("<br>");
    let projectDesc = $("<span>").addClass("project-description").text(desc);

    project.append(projectName, projectIcon, projectOwner, br, projectDesc);
    project.appendTo($("#project-list"))
}

Ajax.get("/api/projects")
    .then(async res => {
        let data = await res.json()
        data.forEach(d => {
            let ownerName = (d.owner && d.owner.name) ? d.owner.name : "";
            $Page.addProjectInfo(d._id, d.name, d.desc, ownerName, d.public);
        });
    })

$("#button-create-project").on("click", () => {
    let name = prompt("프로젝트 이름을 입력하세요.");
    if (!name) return;
    let desc = prompt("프로젝트 설명을 입력하세요.");
    let isPublic = confirm("공개 프로젝트로 생성하시겠습니까? (취소: 아니오, 확인: 예)");
    Ajax.post("/api/projects", { body: { name: name, desc: desc, public: isPublic } })
        .then(async res => {
            if (res.status === 200) {
                let data = await res.json();
                let ownerName = await HDT.getCurrentUser().then(user => user.name);
                $Page.addProjectInfo(data._id, data.name, data.desc, ownerName, data.public);
            } else {
                let data = await res.json();
                alert(data.error);
            }
        })
});