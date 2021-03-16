// import { getDevice } from 'framework7/lite-bundle';
import { Device } from 'framework7/framework7-lite.esm.bundle.js';
import { f7 } from 'framework7-react';
var Camera = {
    start: () => {
        return new Promise((resolve, reject) => {
            // var device = getDevice();
            if (!Device.android && !Device.ios) reject("Device not support");
            var options = {
                quality: 50,
                destinationType: 0,
                sourceType: 1,
                encodingType: 0,
                mediaType: 0,
                correctOrientation: true  //Corrects Android orientation quirks
            }
            navigator.camera.getPicture(imageData => {
                // countImageSize(imageData);
                let imgData = imageData;
                navigator.camera.cleanup(()=>{}, ()=>{});
                resolve("data:image/jpeg;base64," + imgData);
            }, (message) => {
                reject(message != "No Image Selected" ? 'Failed because: ' + message : "");
            }, options);
        });
    }
}

let countImageSize = imageData => {
    const buffer = Buffer.from(imageData.substring(imageData.indexOf(',') + 1));
    f7.dialog.alert(`Byte length: ${buffer.length} \n MB: ${buffer.length / 1e+6}`);
}
export default Camera;

/*
-Camera
framework7 cordova plugin add cordova-plugin-camera
camera.js

Contoh:
const startCamera = () => {
    Camera.start().then(res => {
        //res = string jpeg base64
        log(res);
    }
    ).catch(err => {
        if(err != "") alert("Error: " + err);
    });
}


*/