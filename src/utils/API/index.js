import axios from 'axios';
import { Encrypt, Decrypt } from '../Encryption/';
import { f7 } from 'framework7-react';
import { log } from '../Consoles/';
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
		return Decrypt(data);
	}],
});

const POST = (url, data) => {
	return new Promise((resolve, reject) => {
		API.post(url, data)
			.then(res =>
				(res.data == "error" || res.status != 200) ?
					f7.dialog.alert(res.message) && reject(res) : resolve(JSON.parse(res.data))
			).catch(err => reject(err));
	});
}

export {
	POST,
}

//PENGGUNAAN
/*
import { POST } from '../utils/API';
POST(`Login`, {}, false)
	.then(res => log(res))
	.catch(err => log(err));
*/