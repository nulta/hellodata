/**
 * 'Hello, Data!'
 * Global namespace for the client.
 */
const HDT = {}


/**
 * Global util namespace.
 */
const $U = {}

$U.logFileLoaded = function(filename) {
    console.log(
        `%cLoaded: %c%s %c(%sms)`,
        'color: #00dd88',
        'color: inherit',
        filename,
        'color: #00fff877',
        new Date().getTime() - $U.logFileLoaded.startTime
    );
    $U.logFileLoaded.startTime = new Date().getTime()
}


/**
 * Global ajax util namespace for HelloData.
 */
const $A = {};

/**
 * Send a POST request to the server using fetch API.
 * @param {RequestInfo} url The url to send the request to.
 * @param {RequestInit} data The data to send. Will be converted to JSON.
 * @returns {Promise<Response>} A promise that resolves to the response.
 */
$A.post = async function(url, data) {
    console.log(">> %cPOST %c%s", "color: #ffaa00", "color: inherit", url);

    data.method = "POST";
    data.headers = data.headers || {};
    data.headers["Content-Type"] = "application/json";
    data.body = data.body ? JSON.stringify(data.body) : data.body;
    const res = await fetch(url, data);
    return res;
}

/**
 * Send a GET request to the server using fetch API.
 * @param {RequestInfo} url The url to send the request to.
 * @param {RequestInit} data
 * @returns {Promise<Response>} A promise that resolves to the response.
 */
$A.get = async function(url, data) {
    console.log(">> %cGET %c%s", "color: #00aaff", "color: inherit", url);

    data.method = "GET";
    const res = await fetch(url, data);
    return res;
}


$U.logFileLoaded.startTime = new Date().getTime()
$U.logFileLoaded("global.js")