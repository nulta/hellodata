import DraftMark from "./draftmark.js";

const DocumentRenderer = {}

DocumentRenderer.clear = function(element) {
    $(element).empty();
}

DocumentRenderer.renderError = function(errorcode, text, element) {
    $(element)
        .append("<h1>").text(errorcode).append("</h1>")
        .append("<p>").text(text).append("</p>")
}

/**
 * @param {HDTDocument} doc 
 */
DocumentRenderer.renderHeader = function(doc, element) {
    let header =
        $("<header class='document-header'>")
        .append(
            $("<h1 class='document-title'>").text(doc.name),
            $("<p class='document-path'>").text(doc.path ? doc.path + doc.name : "/"),
        );

    header.appendTo(element);
}

DocumentRenderer.renderNote = function(doc, element) {
    $(element).append("<main class='document-content'>")
    let main = $(element).children("main");
    let parsed = DraftMark.parse(doc.content, true);
    main.append(parsed)
}

DocumentRenderer.renderEditor = function(doc, element) {
    $(element).append("<main class='document-content'>")
    let main = $(element).children("main");
    main.attr("contenteditable", true);
}

export default DocumentRenderer