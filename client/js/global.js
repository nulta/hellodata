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
        'color: #00fff877',
        new Date().getTime() - HDT.fileLoaded.startTime
    );
    HDT.fileLoaded.startTime = new Date().getTime();
};

HDT.getCurrentUser = async function() {
    if (HDT.getCurrentUser.user !== undefined) {
        // User is already cached
        return HDT.getCurrentUser.user;
    }

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

HDT.logout = async function() {
    let res = await $A.post("/api/auth/logout");
    window.location = "/";
}

/**
 * Global util namespace.
 */
const $U = {};


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
            $(".current-user-info").on("click", () => {
                if (confirm("로그아웃하시겠습니까?")) {
                    HDT.logout();
                }
            })
        }
    }
})


HDT.fileLoaded.startTime = new Date().getTime();
HDT.fileLoaded("global.js");