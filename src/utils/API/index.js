import axios from 'axios';
import { Encrypt, Decrypt } from '../Encryption/';
import { f7 } from 'framework7-react';
import { log } from '../../utils/';
const API = axios.create({
	baseURL: `https://app56.ecentrix.net/niaga_api_coll/`,
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
	},
	transformRequest: [(data, headers) => {
		// Do whatever you want to transform the data
		f7.preloader.show();
		const params = new URLSearchParams();
		params.append('msg', Encrypt(data));
		return params;
	}],
	transformResponse: [data => {
		// Do whatever you want to transform the data
		f7.preloader.hide();
		return JSON.parse(Decrypt(data));
	}],
});

const POST = (...params) => {
	switch (typeof params[0]) {
		case "string":
			const [url, data] = params;
			return new Promise((resolve, reject) => {
				API.post(url, data)
					.then(result => 
						(result.data.status == "error" || result.status != 200) ?
							f7.dialog.alert(result.data.message) && reject(result.data.message) : resolve(result.data)
					).catch(err => reject(err));
			});
		case "object":
			let reqList = [];
			params.map(item =>
				reqList.push(
					new Promise((resolve, reject) => {
						API.post(...item)
							.then(res =>
								(res.data == "error" || res.status != 200) ?
									f7.dialog.alert(res.message) && reject(res) : resolve(res.data)
							).catch(err => reject(err));
					})
				));
			return Promise.all(reqList);
		default: return new Promise(resolve => resolve());
	}
}

export {
	POST,
}

//PENGGUNAAN
/*
import { POST } from '../utils/API';
POST([`Login`,data], [`Login`,data]) // kalau mau banyak.
POST(`Login`, {}) // satu satu aja.
	.then(res => log(res))
	.catch(err => log(err));
*/