declare const $q = document.querySelector;
declare const $qAll = document.querySelectorAll;

/**
 * Creates a new element with given settings.
 * @return {Element} The new element.
 */
declare function $new(tag: string, { parent, attributes, classes, text, id }: {
    parent: Element;
    attributes?: Record<string, any>;
    classes?: string[];
    text?: string;
    id?: string;
}): Element;

/**
 * Creates a global event on body, which is triggered when the event target matches the given selector.
 * @param {string} event The event to listen for.
 * @param {string} selector The selector to match.
 * @param {EventListenerOrEventListenerObject} callback The callback to call when the event is triggered.
 * @param {boolean | AddEventListenerOptions} [options] The options to use.
 */
declare function $globalEvent(event: string, selector: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined): void;
declare namespace $ajax {
    export const _baseURI: string;
    export const _logToConsole: boolean;
    export function _request(method: string, url: string, data: string, color?: string): Promise<Response>;
    /**
     * Send a POST request to the server using fetch API.
     * @param {RequestInfo} url The url to send the request to.
     * @param {RequestInit} data The data to send. Will be converted to JSON.
     * @returns {Promise<Response>} A promise that resolves to the response.
     */
    export function post(url: RequestInfo, data: RequestInit): Promise<Response>;
    /**
     * Send a GET request to the server using fetch API.
     * @param {RequestInfo} url The url to send the request to.
     * @param {RequestInit} data
     * @returns {Promise<Response>} A promise that resolves to the response.
     */
    export function get(url: RequestInfo, data: RequestInit): Promise<Response>;
    /**
     * Send a PATCH request to the server using fetch API.
     * @param {RequestInfo} url The url to send the request to.
     * @param {RequestInit} data The data to send. Will be converted to JSON.
     * @returns {Promise<Response>} A promise that resolves to the response.
     */
    export function patch(url: RequestInfo, data: RequestInit): Promise<Response>;
    /**
     * Send a PUT request to the server using fetch API.
     * @param {RequestInfo} url The url to send the request to.
     * @param {RequestInit} data The data to send. Will be converted to JSON.
     * @returns {Promise<Response>} A promise that resolves to the response.
     */
    export function put(url: RequestInfo, data: RequestInit): Promise<Response>;
    /**
     * Send a DELETE request to the server using fetch API.
     * @param {RequestInfo} url The url to send the request to.
     * @param {RequestInit} data The data to send. Will be converted to JSON.
     * @returns {Promise<Response>} A promise that resolves to the response.
     */
    function _delete(url: RequestInfo, data: RequestInit): Promise<Response>;
    export { _delete as delete };
}
