import { getDevice }  from 'framework7/lite-bundle';
var Connection = {
    checkConnection: () => {
        return new Promise((resolve, reject) => {
            var device = getDevice();
            if (!device.android && !device.ios) reject("Device not support");
            var networkState = navigator.connection.type;
            switch(networkState){
                case 'wifi':
                    reject("Tidak boleh menggunakan koneksi WIFI");
                break;
                case 'none':
                    reject("Koneksi tidak tersedia");
                break;
                default : 
                    resolve("Koneksi tersedia(" + networkState + ")");
            }
            
        });
    },
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