const DraftMark = {}

DraftMark.INSTRUCTIONS = {
    "굵게": "<b>",
    "기울여": "<i>",
    "밑줄": "<u>",
    "취소선": "<del>",
    "코드": "<code>",

    "색": "<span style='color: $1;'>",
    "크기": "<span style='font-size: $1;'>",
    "링크": "<a href='$1'>",
    "http": "<a href='http:$1'>",
    "https": "<a href='https:$1'>",
    "설명": "<span class='with-note' title='$1'>",
}

DraftMark.SPECIAL_INSTRUCTIONS = [
    [/^(#[0-9a-fA-F]{3,8})/, "<span style='color: $1;'>"],
]

let escapeHTML = function(str) {
    str = str.replaceAll("&", "&amp");
    str = str.replaceAll(";", "&semi;");
    str = str.replaceAll("&amp", "&amp;");

    str = str.replaceAll("'", "&apos;");
    str = str.replaceAll("\"", "&quot;");
    str = str.replaceAll("<", "&lt;");
    str = str.replaceAll(">", "&gt;");
    return str;
}

let escapeValue = function(str) {
    if (str.startsWith('&quot;') && str.endsWith('&quot;')) {
        str = str.slice(6, -6);
    }

    str = str.replaceAll("$", "&dollar;");
    return str
}

let generateEndTag = function(tag) {
    return `</${tag.split(" ")[0].replace(/(\<|\>)/g,"")}>`
}

let instructionToTag = function(instruction) {
    instruction = instruction.trim();
    if (DraftMark.INSTRUCTIONS[instruction]) {
        return DraftMark.INSTRUCTIONS[instruction];
    } else {
        instruction = escapeValue(instruction);
        for (let data in DraftMark.SPECIAL_INSTRUCTIONS) {
            data = DraftMark.SPECIAL_INSTRUCTIONS[data];
            if (instruction.match(data[0])) {
                return instruction.replace(data[0], data[1]);
            }
        }
    }
}

let splitInstructions = function(str) {
    let result = [];
    let current = "";
    let inLiterial = false;
    let isValue = false;
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        let next = str[i + 1];

        if (char === ":" && !isValue) {
            isValue = true;
            current += char;
            continue;
        }

        if (char === '&' && isValue && str.slice(i + 1, i + 6) === "quot;") {
            // found a escaped "
            inLiterial = !inLiterial;
            current += "&quot;";
            i += 5;
            continue;
        }

        if (char === ',' && !inLiterial) {
            isValue = false;
            result.push(current);
            current = "";
            continue;
        }

        if (char === '\\' && inLiterial) {
            if (next === '"' || next === '\\') {
                current += next;
                i++;
                continue;
            } else if (next === 'n') {
                current += '\n';
                i++;
                continue;
            } else {
                current += char;
                continue;
            }
        }

        current += char;
    }
    result.push(current);
    return result;
}

/**
 * @param {string} instructions
 * @returns {[string, string]} [startingTag, endingTag]
 */
let parseInstructions = function(instructions) {
    // Split instructions
    // "bold, italic, color:#FFF" => ["bold", "italic", "color:#FFF"]
    let split = splitInstructions(instructions);
    let startingTags = [];
    let endingTags = [];

    // Parse instructions
    // "bold" => startingTags.push("<b>")
    split.forEach(instruction => {
        let splitted = instruction.split(/ *: */)
        let name = splitted[0];
        let value = splitted.slice(1).join();
        value = escapeValue(value);

        let tag = instructionToTag(name);
        if (!tag) return;

        startingTags.push(tag.replace("$1", value));
    })

    // Generate ending tags in reverse order
    startingTags.forEach(tag => {
        endingTags.unshift(generateEndTag(tag));
    })

    return [startingTags.join(""), endingTags.join("")];
}

DraftMark.parseLine = function(line) {
    line = escapeHTML(line);

    let stack = [];
    line = line.replace(/(?:\((.+?)\)\[|\])/g, (match, instructions) => {
        if (match == "]") {
            // Pop stack
            return stack.pop() || "";
        } else {
            // Push to stack
            let [startingTag, endingTag] = parseInstructions(instructions);
            stack.push(endingTag);
            return startingTag;
        }
    })

    // EOF, pop all stack
    while (stack.length > 0) {
        line += (stack.pop() || "");
    }

    return line;
}

DraftMark.parse = function(text, noBr) {
    return text.split("\n").map(line => DraftMark.parseLine(line)).join(noBr && "\n" || "<br>\n");
}
export default DraftMark;