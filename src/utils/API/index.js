import axios from 'axios';
import { Encrypt, Decrypt } from '../Encryption/';
import { f7 } from 'framework7-react';
import { log } from '../Consoles/';
const API = axios.create({
	baseURL: `https://app56.ecentrix.net/niaga_api_coll/`,
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
	},
	transformRequest: [function (data, headers) {
		// Do whatever you want to transform the data
		// log('transformRequest : ', data)
		return data;
	}],
	transformResponse: [function (data) {
		// Do whatever you want to transform the data
		// log('transformResponse : ', JSON.parse(Decrypt(JSON.parse(data))))
		return JSON.parse(Decrypt(JSON.parse(data)));
	}],
});

const POST = (url, data) => {
	f7.preloader.show();
	return new Promise((resolve, reject) => {
		const params = new URLSearchParams();
		params.append('msg', Encrypt(data));
		API.post(url, params)
			.then(res => {
				f7.preloader.hide();
				if(res.data == "error" || res.status != 200) {
					f7.dialog.alert(res.message)
					reject(res);
					return false;
				}
				resolve(res.data)
				// resolve({
				// 	...res,
				// 	...{
				// 		data: res.data
				// 	}
				// });
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
POST(`Login`, {}, false)
	.then(res => log(res))
	.catch(err => log(err));
*/