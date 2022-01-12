/**
 * Global ajax util namespace for HelloData.
 */
const Ajax = {};
Ajax.baseURI = "";

/**
 * Send a POST request to the server using fetch API.
 * @param {RequestInfo} url The url to send the request to.
 * @param {RequestInit} data The data to send. Will be converted to JSON.
 * @returns {Promise<Response>} A promise that resolves to the response.
 */
Ajax.post = async function(url, data) {
    console.log(">> %cPOST %c%s", "color: #ffaa00", "color: inherit", url);

    if (typeof url === "string") {
        url = Ajax.baseURI + url;
    } else if (url.url) {
        url.url = Ajax.baseURI + url.url;
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
Ajax.get = async function(url, data) {
    console.log(">> %cGET %c%s", "color: #00aaff", "color: inherit", url);

    if (typeof url === "string") {
        url = Ajax.baseURI + url;
    } else if (url.url) {
        url.url = Ajax.baseURI + url.url;
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
Ajax.patch = async function(url, data) {
    console.log(">> %cPATCH %c%s", "color: #ffaa00", "color: inherit", url);

    if (typeof url === "string") {
        url = Ajax.baseURI + url;
    } else if (url.url) {
        url.url = Ajax.baseURI + url.url;
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
Ajax.put = async function(url, data) {
    console.log(">> %cPUT %c%s", "color: #ffaa00", "color: inherit", url);

    if (typeof url === "string") {
        url = Ajax.baseURI + url;
    } else if (url.url) {
        url.url = Ajax.baseURI + url.url;
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

export default Ajax;