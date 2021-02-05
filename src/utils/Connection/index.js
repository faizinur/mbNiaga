// import { getDevice }  from 'framework7/lite-bundle';
import { Device } from 'framework7/framework7-lite.esm.bundle.js';
const Connection = () => {
    if (!Device.android && !Device.ios) return "OFFLINE";
    var network = "";
    var networkState = navigator.connection.type;
    switch (networkState) {
        case 'wifi':
            network = "WIFI";
            break;
        case '2g':
        case '3g':
        case '4g':
            network = "MOBILE DATA";
            break;
        case 'none':
            network = "OFFLINE";
            break;
        default:
            network = networkState;
    }
    return network;
}

export default Connection;

/*
-Connection
framework7 cordova plugin add cordova-plugin-network-information
connection.js

Contoh:
const checkConn = () => {
    Connection.checkConnection().then((res)=>{
        //res = string
        alert("Success: " + res);
    }).catch((err)=>{
        alert("Error: " + err);
    });
}
*/