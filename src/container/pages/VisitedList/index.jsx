import React, { Component, useEffect, useState } from 'react';
import {
	Page,
} from 'framework7-react';

import { navigate } from '../../../config/redux/actions/routerActions';
import { log, Connection, SQLite, SQLiteTypes, Filter } from '../../../utils';
import { useDispatch, useSelector } from "react-redux";
import { DefaultNavbar } from '../../../components/atoms';
import { SystemInfo, KunjunganItem } from '../../../components/molecules';
const { DAFTAR_DIKUNJUNGI, ACTIVITY_HISTORY } = SQLiteTypes;

const VisitedList = (props) => {
	const [listDikunjungi, setListDikunjungi] = useState([]);
	useEffect(() => {
		log('MOUNT OR UPDATE visitedList');
		_getVisitedList();
		return () => {
			log('UNMOUNT visitedList');
		}
	}, []);
	const dispatch = useDispatch();
	const _getVisitedList = () => {
		Promise.all([
			SQLite.query('SELECT * FROM collection where key = ?', [ACTIVITY_HISTORY]),
			SQLite.query('SELECT * FROM collection where key = ?', [DAFTAR_DIKUNJUNGI])
		])
			.then(res => {
				Filter.select(res[1], [{ 'column': 'transaction_type', 'operator': 'EQUAL', 'value': 'KUNJUNGAN' }])
					.then((resFilter) => {
						resFilter.map((item, index) => {
							if (!res[0].some((el) => el.account_number === item.created_time && el.created_time === item.account_number)) {
								res[0][0].push({
									namaDebitur: item.detailCust.name,
									nomorKartu: item.detailCust.card_no,
									alamat: item.detailCust.home_address_1,
									produk: item.detailCust.loan_type,
									tagihan: item.detailCust.dpd_cur_days,
									bucket: item.detailCust.current_bucket,
									dpd: item.detailCust.day_past_due,
									data: item.detailCust
								})
							}
						});
						setListDikunjungi(res[0][0]);
					}).catch(err => log(err))
			})
			.catch(err => log(err));
	}
	return (
		<Page noToolbar noNavbar style={{ paddingBottom: 60 }} name="VisitedList" backLink>
			<DefaultNavbar
				title={'Daftar Dikunjungi'}
				network={Connection()}
				backLink
			/>
			<SystemInfo />
			<KunjunganItem
				item={listDikunjungi}
				onItemClick={(e) => log(e)}
			/>
		</Page>
	)
}

export default VisitedList;