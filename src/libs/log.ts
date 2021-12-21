// Colors //
import Color from "./ansicolor"

// Prefixes //
function padZero(num: number): string {
    if (("" + num).length == 1)
        return "0" + num
    else
        return "" + num
}

function prefix(color?: Color): string {
    color = color || Color.DimGrey
    var t = new Date()
    return color + `[${padZero(t.getHours())}:${padZero(t.getMinutes())}:${padZero(t.getSeconds())}] ` + Color.Reset
}

function fileprefix(): string {
    var t = new Date()
    return `[${t.getFullYear()}-${t.getMonth()}-${t.getDay()} ${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}] `
}

const colorRegex = /\x1b\[\d+m/g
function stripColors(str: string): string {
    return str.replace(colorRegex,"")
}


// Functions //

/**
 * Prints information into console.
 */
function print(...str: any[]) {
    console.log(prefix(), ...str)
}

/**
 * Logs str into console.
 */
function info(...str: any[]) {
    console.log(prefix(Color.Cyan), ...str)
}

/**
 * Logs warning.
 */
function warn(...str: any[]) {
    console.log(prefix(Color.Yellow) + `${Color.Bright + Color.Yellow}?! `, ...str)
}

/**
 * Logs error.
 */
function error(...str: any[]) {
    console.log(prefix(Color.Red) + `${Color.Bright + Color.Red}!! `, ...str)
}

export default {print, info, warn, error}