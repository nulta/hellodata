
export default function IsValidNanoID(str: string, len: number): boolean {
    return /^[0-9A-Za-z-_]+$/.test(str) && str.length === len;
}