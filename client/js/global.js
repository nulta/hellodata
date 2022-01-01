/**
 * @typedef {{_id:string,name:string,email:string,meta:string}} UserData
 */

/**
 * 'Hello, Data!'
 * Global namespace for the client.
 */
const HDT = {};

HDT.fileLoaded = function(filename) {
    console.log(
        `%cLoaded: %c%s %c(%sms)`,
        'color: #00dd88',
        'color: inherit',
        filename,
        'color: #0077f8aa',
        new Date().getTime() - HDT.fileLoaded.startTime
    );
    HDT.fileLoaded.startTime = new Date().getTime();
};

/**
 * @returns {Promise<UserData>}
 */
HDT.getCurrentUser = async function() {
    if (HDT.getCurrentUser.user === 0) {
        // User is locked
        while (!HDT.getCurrentUser.user) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    } else if (HDT.getCurrentUser.user !== undefined) {
        // User is already cached
        return HDT.getCurrentUser.user;
    }
    HDT.getCurrentUser.user = 0 // Lock the user

    let res = await $A.get("/api/auth/user");
    if (res.status === 200) {
        let user = await res.json();
        user = user.user;
        HDT.getCurrentUser.user = user;
        return user;
    } else {
        HDT.getCurrentUser.user = null;
        return null;
    }
};

/**
 * @returns {Promise<Record<any,any>>} User.meta
 */
HDT.getUserMeta = async function() {
    let user = await HDT.getCurrentUser();
    let meta;

    if (!user) return {};
    try {
        meta = JSON.parse(user.meta);
    } catch (e) {
        console.warn("User meta is not a valid JSON\n", e);
        meta = {};
    }
    return meta
}

HDT.logout = async function() {
    let res = await $A.post("/api/auth/logout");
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


/**
 * Global ajax util namespace for HelloData.
 */
const $A = {};
$A.baseURI = "";

/**
 * Send a POST request to the server using fetch API.
 * @param {RequestInfo} url The url to send the request to.
 * @param {RequestInit} data The data to send. Will be converted to JSON.
 * @returns {Promise<Response>} A promise that resolves to the response.
 */
$A.post = async function(url, data) {
    console.log(">> %cPOST %c%s", "color: #ffaa00", "color: inherit", url);

    if (typeof url === "string") {
        url = $A.baseURI + url;
    } else if (url.url) {
        url.url = $A.baseURI + url.url;
    }

    data = data || {};
    data.method = "POST";
    data.headers = data.headers || {};
    data.headers["Content-Type"] = "application/json";
    data.body = data.body ? JSON.stringify(data.body) : data.body;
    data.credentials = 'include';
    const res = await fetch(url, data);
    return res;
};

/**
 * Send a GET request to the server using fetch API.
 * @param {RequestInfo} url The url to send the request to.
 * @param {RequestInit} data
 * @returns {Promise<Response>} A promise that resolves to the response.
 */
$A.get = async function(url, data) {
    console.log(">> %cGET %c%s", "color: #00aaff", "color: inherit", url);

    if (typeof url === "string") {
        url = $A.baseURI + url;
    } else if (url.url) {
        url.url = $A.baseURI + url.url;
    }

    data = data || {};
    data.method = "GET";
    data.credentials = 'include';
    const res = await fetch(url, data);
    return res;
};

/**
 * Send a PATCH request to the server using fetch API.
 * @param {RequestInfo} url The url to send the request to.
 * @param {RequestInit} data The data to send. Will be converted to JSON.
 * @returns {Promise<Response>} A promise that resolves to the response.
 */
$A.patch = async function(url, data) {
    console.log(">> %cPATCH %c%s", "color: #ffaa00", "color: inherit", url);

    if (typeof url === "string") {
        url = $A.baseURI + url;
    } else if (url.url) {
        url.url = $A.baseURI + url.url;
    }

    data = data || {};
    data.method = "PATCH";
    data.headers = data.headers || {};
    data.headers["Content-Type"] = "application/json";
    data.body = data.body ? JSON.stringify(data.body) : data.body;
    data.credentials = 'include';
    const res = await fetch(url, data);
    return res;
};

/**
 * Send a PUT request to the server using fetch API.
 * @param {RequestInfo} url The url to send the request to.
 * @param {RequestInit} data The data to send. Will be converted to JSON.
 * @returns {Promise<Response>} A promise that resolves to the response.
 */
$A.put = async function(url, data) {
    console.log(">> %cPUT %c%s", "color: #ffaa00", "color: inherit", url);

    if (typeof url === "string") {
        url = $A.baseURI + url;
    } else if (url.url) {
        url.url = $A.baseURI + url.url;
    }

    data = data || {};
    data.method = "PUT";
    data.headers = data.headers || {};
    data.headers["Content-Type"] = "application/json";
    data.body = data.body ? JSON.stringify(data.body) : data.body;
    data.credentials = 'include';
    const res = await fetch(url, data);
    return res;
};


/**
 * Global namespace for the current page.
 */
const $Page = {};

$Page.requireAuth = async function() {
    let user = await HDT.getCurrentUser();
    if (!user) {
        window.location.href = "/auth";
    }
};

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
            $(".current-user-info").on("click", (ev) => {
                HDT.contextMenu(ev.clientX, ev.clientY, {
                    "로그아웃": HDT.logout,
                    "설정": () => { document.location = "/settings" }
                })
            })
        }
    }
})

// Metadata Parsing
$(async() => {
    let meta = await HDT.getUserMeta()

    // meta.bg
    if (meta.bg) {
        $(document.body).css("background-image", meta.bg)
    } else if (meta.bgcolor) {
        $(document.body).css("background-image", null)
        $(document.body).css("background-color", meta.bgcolor)
    }
})


HDT.fileLoaded.startTime = new Date().getTime();
HDT.fileLoaded("global.js");