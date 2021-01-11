import axios from 'axios';
import { Encrypt, Decrypt } from '../Encryption/';
import { f7 } from 'framework7-react';
import { log } from '../Consoles/';
// const API = axios.create({ baseURL: `http://jsonplaceholder.typicode.com/` });
const API = axios.create({ baseURL: `https://rnd.ecentrix.net/onboarding/mega_auto/api/` });

const POST = (url, data, encryptMode = true) => {
	f7.preloader.show();
	//decrypt
	let formdata = new FormData();
	formdata.append('msg', Encrypt(data));
	log('formdata: ', formdata);
	return new Promise((resolve, reject) => {
		API.post(url, !encryptMode ? data : Encrypt(data))
			.then(res => {
				f7.preloader.hide();
				resolve({
					...res,
					...{
						//encrypt
						data: !encryptMode ? res.data : JSON.parse(Decrypt(res.data))
					}
				});
			}).catch(err => {
				f7.preloader.hide();
				reject(err);
			});
	});
}

export {
	API,
	POST,
} 

//PENGGUNAAN
/*
import { POST } from '../utils/API';
var user = {
	nip : 'nip2',
	password : '1234',
}
// POST(`Login`, user)
POST(`users`, user, false)
	.then(res => log(res))
	.catch(err => log(err));
	*/