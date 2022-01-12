/**
 * 'Hello, Data!'
 * Global namespace for the client.
 */
const HDT = {};
HDT.currentUser = undefined;

/**
 * @returns {Promise<UserData>}
 */
HDT.getCurrentUser = async function() {
    if (HDT.currentUser === 0) {
        // User is locked
        while (HDT.currentUser === 0) {
            // Wait until user is unlocked
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        return HDT.currentUser
    } else {
        // User is not locked
        if (HDT.currentUser !== undefined) {
            // User is already cached
            return HDT.currentUser;
        }
        // Lock the user
        HDT.currentUser = 0
    }

    // Fetch the user
    let res = await Ajax.get("/api/auth/user");
    if (res.status === 200) {
        let user = await res.json();
        user = user.user;
        HDT.currentUser = user;
        return user;
    } else {
        HDT.currentUser = null;
        return null;
    }
};

/**
 * @returns {Promise<Record<any,any>>} User.meta
 */
HDT.getUserMeta = async function() {
    let user = await HDT.getCurrentUser();

    if (!user) return {};
    return user.meta
}

HDT.logout = async function() {
    let res = await Ajax.post("/api/auth/logout");
    window.location = "/";
}

/**
 * Open a context menu on given position.
 * @param {number} x 
 * @param {number} y 
 * @param {Record<string, function():void>} data
 */
HDT.contextMenu = function(x, y, data) {
    let menu = $("#context-menu");
    menu.empty();
    for (let key in data) {
        menu.append(
            $("<button>").text(key).on("click", data[key])
        )
    }
    menu.css("left", x);
    menu.css("top", y);
    $("#context-menu-container").addClass("active");

    if (x + menu.width() > window.innerWidth) {
        x = x - menu.width();
        menu.css("left", x);
    }

    $("#context-menu-container")[0].onclick = function(ev) {
        $(this).removeClass("active");
    }
}

HDT.requireAuth = async function() {
    let user = await HDT.getCurrentUser();
    if (!user) {
        window.location.href = "/auth";
    }
};

export default HDT;