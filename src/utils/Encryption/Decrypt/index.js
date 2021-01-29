import CryptoJS from 'crypto-js';
import KEY from '../key';

// module.exports = function(ciphertext) {    
const Decrypt = (ciphertext) => {
    var obj_json = ciphertext;
    do {
        obj_json = JSON.parse(obj_json);
    }
    while (typeof obj_json === "string");
    // log("Decrypt : obj_json ---->",typeof obj_json);
    var passphrase = KEY;
    var encrypted = obj_json.ciphertext;
    var salt = CryptoJS.enc.Hex.parse(obj_json.salt);
    var iv = CryptoJS.enc.Hex.parse(obj_json.iv);

    var key = CryptoJS.PBKDF2(passphrase, salt, { hasher: CryptoJS.algo.SHA512, keySize: 64 / 8, iterations: 10 });


    var decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv });

    return decrypted.toString(CryptoJS.enc.Utf8);


};

const selfDecrypt = (ciphertext) => {
    var encryptedString = CryptoJS.enc.Utf8.stringify(
        CryptoJS.enc.Base64.parse(ciphertext)
    );
    return JSON.parse(Decrypt(encryptedString).replace(/\:null/gi, "\:\"\""));
}
export { Decrypt, selfDecrypt };