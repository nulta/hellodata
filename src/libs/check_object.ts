type CheckObjectResult = [boolean, string?];
type InputTemplate = {
    [key: string]: ("string" | "number" | "boolean" | "array" | "nanoid(4)" | "nanoid(6)" | InputTemplate)
}

function checkNanoid(value: any, length: number): boolean {
    if (typeof value !== 'string') return false
    if (value.length !== length) return false
    if (!/^[0-9a-zA-Z\-_]*$/.test(value)) return false
    return true
}

/**
 * Compare the given object with given template.
 * If the given object's structure is not the same as the template, returns `[false, failedKey]`.
 * Otherwise, returns `[true, null]`.
 * 
 * If the key on template's name is ending with `?`, the key is considered optional.
 * @param obj The object to be checked.
 * @param template The template to be checked against.
 * @param exactSize If true, don't allow any extra keys on the object.
 * @returns [isSame, failedKey || null]
 */
function checkObject(obj: Record<any, any>, template: InputTemplate, exactSize: boolean): CheckObjectResult {
    let sizeOfTemplate = template.length;
    for (let key in template) {
        // If the key is optional and the object doesn't have the key, skip it.
        if (key.endsWith('?')) {
            key = key.slice(0, -1)
            if (obj[key] === undefined) continue
        }

        // If the type is nanoid, pass it to checkNanoid.
        if (typeof template[key] === "string") {
            if (template[key] === "nanoid(4)") {
                if (!checkNanoid(obj[key], 4)) return [false, key]
                continue
            }
            if (template[key] === "nanoid(6)") {
                if (!checkNanoid(obj[key], 6)) return [false, key]
                continue
            }
        }

        // Check the type of the key.
        if (typeof obj[key] !== typeof template[key]) return [false, key]

        // If the key is an object, recursively check it.
        if (typeof template[key] === 'object') {
            let recurseCheck = checkObject(obj[key], template[key] as InputTemplate, exactSize);
            if (!recurseCheck[0]) {
                // Failed on sub object
                recurseCheck[1] = key + '.' + recurseCheck[1];
                return recurseCheck;
            }
        }
    }

    // Passed all checks
    return [true, ];
}

export default checkObject;