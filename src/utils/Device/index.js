// import { getDevice } from 'framework7/lite-bundle';
import { Device as Perangkat } from 'framework7/framework7-lite.esm.bundle.js';
var Device = {
    getInformation: () => {
        return new Promise((resolve, reject) => {
            // var deviceType = getDevice();
            (!Perangkat.android && !Perangkat.ios) ? reject("Device not support") : resolve(device);
        });
    },
}
export default Device;

/*
-Device
framework7 cordova plugin add cordova-plugin-device
device.js

Contoh:
const deviceInformation = () => {
    Device.getInformation().then((res)=>{
        //res = array
        alert("Success: " + JSON.stringify(res));
    }).catch((err)=>{
        alert("Error: " + err);
    });
}
*/