import CryptoJS from 'crypto-js';
// module.exports = function(ciphertext) {    
const Decrypt = (ciphertext) => {
    var obj_json = JSON.parse(ciphertext);
    //console.log("obj_json",obj_json);
    var passphrase = 'idonotknowit';
    var encrypted = obj_json.ciphertext;
    var salt = CryptoJS.enc.Hex.parse(obj_json.salt);
    var iv = CryptoJS.enc.Hex.parse(obj_json.iv);

    var key = CryptoJS.PBKDF2(passphrase, salt, { hasher: CryptoJS.algo.SHA512, keySize: 64 / 8, iterations: 10 });


    var decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv });

    return decrypted.toString(CryptoJS.enc.Utf8);


};

export default Decrypt;