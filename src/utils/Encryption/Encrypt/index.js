import CryptoJS from 'crypto-js';
import KEY from '../key';
// module.exports = function (props) {
const Encrypt = (props) => {
	var key = KEY;
	var encryptMethod = 'AES-256-CBC';
	// get only number from string.
	// @link https://stackoverflow.com/a/10003709/128761 Reference.
	var aesNumber = encryptMethod.match(/\d+/)[0];
	// eslint-disable-next-line radix
	var encryptMethods = parseInt(aesNumber);
	var iv = CryptoJS.lib.WordArray.random(16); // the reason to be 16, please read on `encryptMethod` property.

	var salt = CryptoJS.lib.WordArray.random(256);
	var iterations = 10;
	var encryptMethodLength = encryptMethods / 4; // example: AES number is 256 / 4 = 64
	var hashKey = CryptoJS.PBKDF2(key, salt, {
		hasher: CryptoJS.algo.SHA512,
		keySize: encryptMethodLength / 8,
		iterations: iterations,
	});

	// log('AES', hashKey);
	var encrypted = CryptoJS.AES.encrypt(JSON.stringify(props), hashKey, {
		mode: CryptoJS.mode.CBC,
		iv: iv,
	});
	var encryptedString = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);

	var output = {
		ciphertext: encryptedString,
		iv: CryptoJS.enc.Hex.stringify(iv),
		salt: CryptoJS.enc.Hex.stringify(salt),
		iterations: iterations,
	};
	var x = CryptoJS.enc.Base64.stringify(
		CryptoJS.enc.Utf8.parse(JSON.stringify(output)),
	);
	return x;
};

export default Encrypt;