/**
 * Filters an object by given keys.
 * 
 * @example filterObject({a: 1, b: 2, c: 3}, ["a", "b"]) => {a: 1, b: 2}
 * 
 * @param obj The object to be filtered.
 * @param keys The keys to compare with.
 * @returns The filtered object.
 */
export default function filterObject(obj: Record<any,any>, keys: string[]): Record<any,any> {
    return Object.fromEntries(
        Object.keys(obj)
            .filter(key => keys.includes(key))
            .map(key => [key, obj[key]])
    )
}