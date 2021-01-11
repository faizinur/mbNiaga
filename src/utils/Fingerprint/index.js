// import { getDevice }  from 'framework7/lite-bundle';
import { Device } from 'framework7/framework7-lite.esm.bundle.js';
var Fingerprint = {
    scan: () => {
        return new Promise((resolve, reject) => {
            // var device = getDevice();
            if (!Device.android && !Device.ios) reject("Device not support");
            window.FingerprintAuth.isAvailable((result) => {
                if (!result.isAvailable) reject("Fingerprint not available.");
                var encryptConfig = {
                    clientId: "myAppName",
                    username: "currentUser",
                    password: "currentUserPassword",
                    disableBackup: true,
                    dialogTitle: "Biometric Login",
                    dialogMessage: "Log in using your biometric credential",
                    dialogHint: "Sentuh sensor sidik jari"
                };
                window.FingerprintAuth.encrypt(encryptConfig, (ress) => {
                    if (ress.withFingerprint) resolve(ress);
                }, (error) => {
                    reject(error != "FINGERPRINT_CANCELLED" ? error : "");
                });
            }, (message) => {
                reject(message);
            });
        });
    }
}

export default Fingerprint;

/*
-Fingerprint
framework7 cordova plugin add cordova-plugin-android-fingerprint-auth
fingerprint.js

Contoh: 
const scanFingerprint = () => {
    Fingerprint.scan().then(res => {
        //res = array
        alert('sucess : ' + JSON.stringify(res));
    }
    ).catch(err => {
        if(err != "") alert('error : ' + err);
    })
}
*/