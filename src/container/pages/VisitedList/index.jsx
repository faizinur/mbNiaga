import React, { Component, useEffect, useState } from 'react';
import {
	Page,
	List,
	Block,
	Row,
	Col,
	Button,
	ListInput,
	f7,
} from 'framework7-react';

import { navigate } from '../../../config/redux/actions/routerActions';
import { log, Connection, SQLite, SQLiteTypes, Filter } from '../../../utils';
import { useDispatch, useSelector } from "react-redux";
import { DefaultNavbar } from '../../../components/atoms';
import { SystemInfo, KunjunganItem } from '../../../components/molecules';
import { VisitedList as Strings } from '../../../utils/Localization';
const { DAFTAR_DIKUNJUNGI, ACTIVITY_HISTORY } = SQLiteTypes;

const VisitedList = (props) => {
	useEffect(() => {
		log('MOUNT OR UPDATE visitedList');
		Strings.setLanguage(bahasa);
		_tambahParameter();
		_getVisitedList();
		return () => {
			log('UNMOUNT visitedList');
		}
	}, []);
	const dispatch = useDispatch();
	let bahasa = useSelector(state => state.main.bahasa);
	const [listDikunjungi, setListDikunjungi] = useState([]);
	let [listTerkirim, setListTerkirim] = useState([]);
	let [parameter, setParameter] = useState([
		{ code: 'name', description: 'Nama' },
		{ code: 'home_address_1', description: 'Alamat' },
		{ code: 'outstanding_balance', description: 'OS Balance' },
		{ code: 'current_bucket', description: 'Bucket' },
		{ code: 'day_past_due', description: 'DPD' },
		{ code: 'loan_type', description: 'Product' },
		{ code: '', description: 'Area' },
		{ code: 'home_post_code', description: 'Zipcode' },
		{ code: 'branch_code', description: 'Branch Code' },
		{ code: '', description: 'Branch Name' },
	]);
	let [kondisi, setKondisi] = useState([
		{ code: 'EQUAL', description: 'Equal' },
		{ code: 'DOES_NOT_EQUAL', description: 'Does Not Equal' },
		{ code: 'GREATHER_THAN_EQUAL_TO', description: 'Greather Than Equal To' },
		{ code: 'LESS_THAN_EQUAL_TO', description: 'Less Than Equal To' },
		// { code: 'BETWEEN', description: 'Between' },
		{ code: 'BEGIN_WITH', description: 'Begin With' },
		{ code: 'END_WITH', description: 'End With' },
		{ code: 'CONTAINS', description: 'Contains' },
		{ code: 'DOES_NOT_CONTAINS', description: 'Does Not Contain' },
		{ code: 'DOES_NOT_BEGIN_WITH', description: 'Does Not Begin With' },
		{ code: 'DOES_NOT_END_WITH', description: 'Does Not End With' },
		{ code: 'GREATHER_THAN', description: 'Greather Than' },
		{ code: 'LESS_THAN', description: 'Less Than' },
		{ code: 'NOT_BETWEEN', description: 'Not Between' },
	]);
	let [selectedParameter, setSelectedParameter] = useState('');
	let [selectedKondisi, setSelectedKondisi] = useState('');
	let [searchValue, setSearchValue] = useState('');
	let [searchResult, setSearchResult] = useState([]);
	let [searchParameter, setSearchParameter] = useState([]);
	const _getVisitedList = async () => {
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
									namaDebitur: item.detailCust.name || '-',
									nomorKartu: item.detailCust.card_no || '-',
									alamat: item.detailCust.home_address_1 || '-',
									office_address: item.detailCust.office_address_1 || '-',
									home_post_code: item.detailCust.home_post_code || '-',
									data: item.detailCust
								})
							}
						});
						setSearchResult(res[0][0]);
					}).catch(err => log(err))
			})
			.catch(err => log(err));
	}
	const _search = async () => {
		var param = searchParameter.filter(obj => obj.column != "" && obj.operator != "");
		if (param.length == 0) return false;
		Promise.all([
			SQLite.query('SELECT * FROM collection where key = ?', [ACTIVITY_HISTORY]),
			SQLite.query('SELECT * FROM collection where key = ?', [DAFTAR_DIKUNJUNGI])
		])
			.then(res => {
				Filter.select(res[1], param)
					.then((resFilter) => {
						let filteredData = [];
						resFilter.map((item, index) => {
							if (!res[0].some((el) => el.account_number === item.created_time && el.created_time === item.account_number)) {
								filteredData.push({
									namaDebitur: item.detailCust.name,
									nomorKartu: item.detailCust.card_no,
									alamat: item.detailCust.home_address_1,
									office_address: item.detailCust.office_address_1,
									home_post_code: item.detailCust.home_post_code,
									data: item.detailCust
								})
							}
						});
						setSearchResult(filteredData);
					}).catch(err => log(err))
			})
			.catch(err => log(err));
	}
	const _tambahParameter = () => {
		var searchParam = searchParameter;
		if (searchParam.length == parameter.length) return false;
		searchParam.push({ 'column': '', 'operator': '', 'value': '' })
		setSearchParameter(searchParam);
	}
	const _kurangiParameter = () => {
		var searchParam = searchParameter;
		if (searchParam.length == 1) return false;
		searchParam = searchParam.slice(0, -1);
		setSearchParameter(searchParam);
	}
	const _clear = () => {
		setSearchParameter([]);
		setSearchParameter([{ 'column': '', 'operator': '', 'value': '' }]);
	}
	return (
		<Page noToolbar noNavbar style={{ paddingBottom: 60 }} name="VisitedList" backLink>
			<DefaultNavbar
				title={Strings.title}
				network={Connection()}
				backLink
			/>
			<List noHairlinesMd style={{ margin: 0, padding: 0 }}>
				<SystemInfo />
				<Block style={{ margin: 0, padding: 0 }}>
					{searchParameter.map((item, key) => (
						<Row key={key} noGap style={{ backgroundColor: 'black' }}>
							<Col width="40" tag="span" style={{ margin: 0, padding: 0 }}>
								<List style={{ marginBottom: 8, marginTop: 8, padding: 0 }}>
									<ListInput
										outline
										label="Parameter"
										inputStyle={{ backgroundColor: '#666666', color: 'white' }}
										style={{ backgroundColor: 'black' }}
										type="select"
										defaultValue=""
										onChange={({ target }) => {
											setSearchParameter(searchParameter.map((item, index) => index == key ? Object.assign(item, { column: target.value }) : item))
										}}
									>
										<option value="" disabled>{Strings.choose}</option>
										{
											parameter.map((item, key) => (
												<option key={key} value={item.code}>{item.description}</option>
											))
										}

									</ListInput>
								</List>
							</Col>
							<Col width="30" tag="span" style={{ margin: 0, padding: 0 }}>
								<List style={{ marginBottom: 8, marginTop: 8, padding: 0 }}>
									<ListInput
										outline
										label="kondisi"
										inputStyle={{ backgroundColor: '#666666', color: 'white' }}
										style={{ backgroundColor: 'black' }}
										type="select"
										defaultValue=""
										onChange={({ target }) => {
											setSearchParameter(searchParameter.map((item, index) => index == key ? Object.assign(item, { operator: target.value }) : item));
										}}
									>
										<option value="" disabled>{Strings.choose}</option>
										{
											kondisi.map((item, key) => (
												<option key={key} value={item.code}>{item.description}</option>
											))
										}

									</ListInput>
								</List>
							</Col>
							<Col width="30" tag="span" style={{ margin: 0, padding: 0 }}>
								<List style={{ marginBottom: 8, marginTop: 8, padding: 0 }}>
									<ListInput
										outline
										label="Value"
										type="text"
										inputStyle={{ backgroundColor: '#666666', color: 'white' }}
										style={{ backgroundColor: 'black' }}
										onChange={({ target }) => {
											setSearchParameter(searchParameter.map((item, index) => index == key ? Object.assign(item, { value: target.value }) : item));
										}}
									>
									</ListInput>
								</List>
							</Col>
						</Row>
					))}
					<Block strong style={{ margin: 0, backgroundColor: 'black' }}>
						<Row>
							<Col width="50">
								<Button fill raised onClick={() => _tambahParameter()} style={{ backgroundColor: '#0085FC', fontSize: 12 }}>{Strings.add}</Button>
							</Col>
							<Col width="50">
								<Button fill raised onClick={() => _kurangiParameter()} style={{ backgroundColor: '#0085FC', fontSize: 12 }}>{Strings.less}</Button>
							</Col>
						</Row>
					</Block>
					<Block strong style={{ margin: 0, backgroundColor: 'black' }}>
						<Row >
							<Col width="50">
								<Button fill raised onClick={() => _clear()} style={{ backgroundColor: '#FFBC26', fontSize: 12 }}>{Strings.clear}</Button>
							</Col>
							<Col width="50">
								<Button fill raised onClick={() => _search()} style={{ backgroundColor: '#60A917', fontSize: 12 }}>{Strings.search}</Button>
							</Col>
						</Row>
					</Block>
				</Block>
			</List>
			<KunjunganItem
				item={searchResult}
				onItemClick={(e) => log(e)}
			/>
		</Page>
	)
}

export default VisitedList;