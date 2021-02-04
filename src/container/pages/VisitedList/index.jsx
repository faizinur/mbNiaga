import React, { Component, useEffect, useState } from 'react';
import {
	Page,
} from 'framework7-react';

import { navigate } from '../../../config/redux/actions/routerActions';
import { log, Connection, SQLite, SQLiteTypes, Filter } from '../../../utils';
import { useDispatch, useSelector } from "react-redux";
import { DefaultNavbar } from '../../../components/atoms';
import { SystemInfo, KunjunganItem } from '../../../components/molecules';
var {DAFTAR_DIKUNJUNGI} = SQLiteTypes;

const VisitedList = (props) => {
	const [listDikunjungi, setListDikunjungi] = useState([]);
	useEffect(() => {
		SQLite.query('SELECT * FROM collection where key = ?', [DAFTAR_DIKUNJUNGI])
			.then(res => {
				Filter.select(res, [{'column':'transaction_type', 'operator':'EQUAL', 'value': 'KUNJUNGAN' }]).then((resFilter) => {
					var arr_result = [];
					resFilter.map((item, index) => arr_result.push({
						namaDebitur: item.detailCust.name,
						nomorKartu: item.detailCust.card_no,
						alamat: item.detailCust.home_address_1,
						produk: item.detailCust.loan_type,
						tagihan: item.detailCust.dpd_cur_days,
						bucket: item.detailCust.current_bucket,
						dpd: item.detailCust.day_past_due,
						data: item.detailCust
					}));
					setListDikunjungi(arr_result);
				}).catch(err => log(err))
			})
			.catch(err => log(err))
		log('MOUNT OR UPDATE visitedList');
		return () => {
			log('UNMOUNT visitedList');
		}
	}, []);
	const dispatch = useDispatch();
	const listTemp = [{"namaDebitur":"debitur D069451","nomorKartu":"18022050005860","alamat":"home_address_1 D069451","produk":"","tagihan":"640169","bucket":"","dpd":"0","data":{"name":"debitur D069451","cif_number":"D069451","branch_code":"","card_no":"18022050005860","sex":"","date_of_birth":"1988-03-23","account_number":"2050005860","outstanding_balance":"61718750","due_date":"2021-10-07","last_payment_date":"2020-11-26","last_payment_amount":"504894","charge_off_date":"","current_bucket":"","day_past_due":"0","over_limit_flag":"","total_due":"61718750","total_curr_due":"","minimum_payment":"","dpd_cur_days":"640169","dpd_x_days":"441096","dpd_30_days":"284975","dpd_60_days":"101586","dpd_90_days":"653004","dpd_120_days":"960263","dpd_150_days":"842304","dpd_180_days":"330729","dpd_210_days":"126732","total_overdue_amount":"","last_puchase_date":"","last_purchase_amount":"","last_transaction_code":"","loan_type":"","card_type":"","open_date":"","cycle_date":"127","princple_os":"","princple_amount_due":"","reason_code":"","home_post_code":"","maturity_date":"","tenor":"","installment_number":"","bill_amount":"","contact_address_1":"contact_address_1 D069451","home_address_1":"home_address_1 D069451","office_address_1":"office_address_1 D069451","refferal_address_1":"refferal_address_1 D069451","handphone":"handphone D0694","home_phone":"home_phone D069","office_phone":"office_phone D0","home_email":"home_email D069451","refferal_name":"refferal_name D069451","option_payment_1":"4380858","option_payment_2":"4254126","option_payment_3":"3923397","option_payment_4":"3081093","option_payment_5":"2120830","option_payment_6":"1467826","option_payment_7":"1366240","option_payment_8":"1081265","option_payment_9":"640169"}}];
	return (
		<Page noToolbar noNavbar style={{paddingBottom : 60}}>
			<DefaultNavbar
				title={'Daftar Dikunjungi'}
				network={Connection()}
			/>
			<SystemInfo />
			<br/>
			<br/>
			<KunjunganItem
				item={listDikunjungi}
				onItemClick={(e) => log(e)}
			/>
		</Page>
	)
}

export default VisitedList;