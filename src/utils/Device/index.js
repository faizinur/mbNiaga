import { getDevice } from 'framework7/lite-bundle';
var Device = {
    getInformation: () => {
        return new Promise((resolve, reject) => {
            var deviceType = getDevice();
            if (!deviceType.android && !deviceType.ios) reject("Device not support");
            resolve(device);

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