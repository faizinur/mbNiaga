import { Device } from 'framework7/framework7-lite.esm.bundle.js';
let log = (...args) => { console.log(...args) }
let info = (...args) => { (!Device.android && !Device.ios) ? console.info(...args) : false; }
let warn = (...args) => { (!Device.android && !Device.ios) ? console.warn(...args) : false; }

export {
    log,
    info,
    warn,
}
