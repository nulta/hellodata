// .current-user-info Handling
$(async() => {
    if ($(".current-user-info").length) {
        let user = await HDT.getCurrentUser();
        if (!user) {
            $(".current-user-info").text("로그인");
            $(".current-user-info").on("click", () => {
                window.location.href = "/auth";
            })
        } else {
            $(".current-user-info").text(user.name);
            $(".current-user-info").on("click", function(ev) {
                HDT.contextMenu(ev.clientX, this.clientTop + this.clientHeight, {
                        "로그아웃": HDT.logout,
                        "설정": () => { document.location = "/settings" }
                    })
                    // Cancel event propagation (prevent click event on document)
                return false;
            })
        }
    }
})