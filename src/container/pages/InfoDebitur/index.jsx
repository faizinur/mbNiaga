import React, { Component } from 'react';
import {
	Page,
	Navbar,
	List,
	ListInput,
	Block,
	Row,
	Col,
	Button,
	Card,
	CardHeader,
	CardContent
} from 'framework7-react';

import { connect } from 'react-redux';
import { navigate } from '../../../config/redux/actions/routerActions';
import { DefaultNavbar, CustomBlockTitle } from '../../../components/atoms';
import { Connection, log, SQLiteTypes, SQLite, Filter } from '../../../utils';
const { ACTIVITY_HISTORY, RENCANA_KUNJUNGAN, UPDATE_HISTORY } = SQLiteTypes;

class InfoDebitur extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// detailCust: props.detailCust,
			arrDetailCust: [],
			history: [],
			infoUpdateData: [
				// {kategori : 'ALAMAT RUMAH', perubahan : []},
				// {kategori : 'ALAMAT KANTOR', perubahan : []},
				// {kategori : 'ALAMAT EMERGENCY', perubahan : []},
			]
		}
	}
	componentDidMount() {
		var arrDetailCust = [];
		var hiddenKey = ['account_number', 'outstanding_balance', 'due_date', 'last_payment_date', 'last_payment_amount', 'charge_off_date', 'current_bucket', 'day_past_due', 'over_limit_flag', 'total_due', 'total_curr_due', 'minimum_payment', 'dpd_cur_days', 'dpd_x_days', 'dpd_30_days', 'dpd_60_days', 'dpd_90_days', 'dpd_120_days', 'dpd_150_days', 'dpd_180_days', 'dpd_210_days', 'home_post_code', 'total_overdue_amount', 'last_puchase_date', 'last_purchase_amount', 'last_transaction_code', 'loan_type', 'card_type', 'open_date', 'cycle_date', 'princple_os', 'princple_amount_due', 'reason_code', 'maturity_date', 'tenor', 'installment_number', 'bill_amount'];
		var aliasKey = ['Account_no', 'OS_Biling', 'PAYMENT_DUE_DATE', 'LAST_PAYMENT_DATE', 'LAST_PAYMENT_AMT', 'CHARGE_OFF_DATE', 'BUCKET', 'DPD', 'OVER_LIMIT_FLAG', 'TOTAL_AMT_DUE', 'TOTAL_CURR_DUE', 'MIN_AMOUNT_DUE', 'Tunggakan_Curr', 'Tunggakan_XDAYS', 'Tunggakan_30DPD', 'Tunggakan_60DDP', 'Tunggakan_90DDPD', 'Tunggakan_120DPD', 'Tunggakan_150DPD', 'Tunggakan_180DPD', 'Tunggakan_210DPD', 'ZIP CODE', 'AMOUNT_OVERDUE', 'LAST_PURCH_DATE', 'LAST_PURCH_AMT', 'Last Transaction Type', 'PRODUCT_TYPE', 'CARD_TYPE', 'MOB', 'COLLECTION_CYCLE', 'PRINCIPLE_OUTSTANDING', 'PRINCIPLE_OVERDUE', 'REASON_CODE', 'Maturity_Date', 'Tenor', 'No_of_Installment_Due', 'Total_Billed_Amount'];
		//gak ada zip code
		for (const key in this.props.detailCust) {
			if (hiddenKey.includes(key)) arrDetailCust = [...arrDetailCust, { 'key': aliasKey[hiddenKey.indexOf(key)], 'value': this.props.detailCust[key] }]
		}
		this.setState({ arrDetailCust: arrDetailCust })
		SQLite.query('SELECT * FROM collection where key = ?', [ACTIVITY_HISTORY])
			.then(res => {
				Filter.select(res, [{ 'column': 'account_number', 'operator': 'EQUAL', 'value': this.props.detailCust.account_number }]).then((resFilter) => {
					log("HASIL FILTER", resFilter)
					// resFilter.slice(0, 5);
					this.setState({ history: resFilter });
				}).catch(err => log(err))
			}).catch(err => log(err))

		SQLite.query('SELECT * FROM collection where key = ?', [UPDATE_HISTORY])
			.then(res => {
				log("UPDATE_HITORY", res)
				Filter.select(res, [
					{ 'column': 'account_number', 'operator': 'EQUAL', 'value': this.props.detailCust.account_number },
					{ 'column': 'home_address_1', 'operator': 'DOES_NOT_EQUAL', 'value': '' }
				]).then((resFilter) => {
					resFilter.slice(0, 3);
					this.setState(prevState => ({
						infoUpdateData: [...prevState.infoUpdateData, { kategori: "ALAMAT RUMAH", perubahan: resFilter.map(({ home_address_1 }) => home_address_1) }]
					}))
				}).catch(err => log(err))

				Filter.select(res, [
					{ 'column': 'account_number', 'operator': 'EQUAL', 'value': this.props.detailCust.account_number },
					{ 'column': 'office_address_1', 'operator': 'DOES_NOT_EQUAL', 'value': '' }
				]).then((resFilter) => {
					resFilter.slice(0, 3);
					this.setState(prevState => ({
						infoUpdateData: [...prevState.infoUpdateData, { kategori: "ALAMAT KANTOR", perubahan: resFilter.map(({ office_address_1 }) => office_address_1) }]
					}))
				}).catch(err => log(err))

				Filter.select(res, [
					{ 'column': 'account_number', 'operator': 'EQUAL', 'value': this.props.detailCust.account_number },
					{ 'column': 'refferal_address_1', 'operator': 'DOES_NOT_EQUAL', 'value': '' }
				]).then((resFilter) => {
					resFilter.slice(0, 3);
					this.setState(prevState => ({
						infoUpdateData: [...prevState.infoUpdateData, { kategori: "ALAMAT EMERGENCY", perubahan: resFilter.map(({ refferal_address_1 }) => refferal_address_1) }]
					}))
				}).catch(err => log(err))
				log("STATE", this.state)

			}).catch(err => log(err))
	}
	_updateData() {
		this.props.navigate('/UpdateDebitur/');
	}
	_rencanaKunjungan() {
		SQLite.query('SELECT * FROM collection where key = ?', [RENCANA_KUNJUNGAN])
			.then(res => {
				Filter.select(res, [{ 'column': 'account_number', 'operator': 'EQUAL', 'value': this.props.detailCust.account_number }]).then((resFilter) => {
					if (resFilter.length != 0) return false;
					var data = res.length != 0 ? res[0] : res;
					data.push((this.props.detailCust))
					SQLite.query(`INSERT OR REPLACE INTO collection (key, value) VALUES(?,?)`, [RENCANA_KUNJUNGAN, data])
						.then(insert => {
							log(insert)
							this.props.navigate('/Main/');
						}).catch(err => log(err))
				}).catch(err => log(err))
			})
			.catch(err => log(err))
	}
	render() {
		const { arrDetailCust, history, infoUpdateData } = this.state;
		const { detailCust } = this.props;
		let [Y, M, D] = detailCust.date_of_birth.split("-");
		let today = new Date();
		return (
			<Page noToolbar noNavbar style={{ paddingBottom: 60 }}>
				<DefaultNavbar title="DETAIL DEBITUR" network={Connection()} />
				<Card style={{ border: '2px solid #c0392b' }}>
					<CardHeader style={{ backgroundColor: "#c0392b", }}>
						<p style={{ color: 'white', textAlign: 'center' }}>INFO COSTUMER</p>
					</CardHeader>
					<CardContent>
						<p><b>Customer Name:</b> {detailCust.name}</p>
						<p><b>Card Number:</b> {detailCust.card_no}</p>
						<p><b>Jenis Kelamin:</b> {detailCust.sex}</p>
						<p><b>DOB:</b> {Math.abs(today.getFullYear() - Y)} thn {Math.abs((today.getMonth() + 1) - M)} Bln {Math.abs((today.getDate() + 1) - D)} Hr</p>
					</CardContent>
				</Card>
				<Block>
					<Row>
						<Col width="50">
							<Button fill raised onClick={() => this._updateData()} style={{ backgroundColor: '#c0392b', fontSize: 12 }}>Update Data</Button>
						</Col>
						<Col width="50">
							<Button fill raised onClick={() => this._rencanaKunjungan()} style={{ backgroundColor: '#c0392b', fontSize: 12 }}>Rencana Kunjungan</Button>
						</Col>
					</Row>
				</Block>
				<CustomBlockTitle noGap title="INFO AKUN" />
				<Block>
					{arrDetailCust.map((item, key) => (
						<Row key={key} noGap>
							<Col width="50" style={{ border: 1, borderStyle: 'solid', borderColor: '#a9a9a9', borderCollapse: 'collapse', alignSelf: 'stretch' }}>
								<p style={{ margin: 8, wordBreak: 'break-word' }}>{item.key}</p>
							</Col>
							<Col width="50" style={{ border: 1, borderStyle: 'solid', borderColor: '#a9a9a9', borderCollapse: 'collapse', alignSelf: 'stretch' }}>
								<p style={{ margin: 8, wordBreak: 'break-word' }}>{item.value}</p>
							</Col>
						</Row>
					))}
				</Block>
				<CustomBlockTitle title="INFO DEMOGRAFI" />
				<Block>
					<Card style={{ border: '2px solid #c0392b' }}>
						<CardContent>
							<p><b>CONTACT_ADDRES : </b>{detailCust.contact_address_1}</p>
							<p><b>HOME_ADRESS : </b>{detailCust.home_address_1}</p>
							<p><b>OFFICE_ADDRESS : </b>{detailCust.office_address_1}</p>
							<p><b>ECON_ADDRESS : </b>{detailCust.refferal_address_1}</p>
							<p><b>MOBILE PHONE : </b>{detailCust.handphone}</p>
							<p><b>HOME_PHONE : </b>{detailCust.home_phone}</p>
							<p><b>OFFICE_PHONE : </b>{detailCust.office_phone}</p>
							<p><b>EMAIL : </b>{detailCust.home_email}</p>
							<p><b>ECON_NAME : </b>{detailCust.refferal_name}</p>
						</CardContent>
					</Card>
				</Block>
				<CustomBlockTitle title="INFO FASILITAS LAIN" />
				<Block>
					<Card style={{ border: '2px solid #c0392b' }}>
						<CardContent>
							<p><b>Card_no : </b>{detailCust.card_type == "CC" ? detailCust.card_no : detailCust.account_number}</p>
							<p><b>Bucket : </b>{detailCust.current_bucket}</p>
							<p><b>DPD : </b>{detailCust.day_past_due}</p>
							<p><b>Outstanding : </b>{detailCust.outstanding_balance}</p>
							<p><b>amount_due : </b>{detailCust.bill_amount}</p>
						</CardContent>
					</Card>
				</Block>
				<CustomBlockTitle title="AKTIVITAS HISTORIKAL" />
				<Block style={{ margin: 0 }}>
					{history.map((item, key) => (
						<Card key={key} style={{ border: '2px solid #c0392b' }}>
							<CardHeader style={{ backgroundColor: "#c0392b", color: 'white' }}>
								<p>HISTORI PENANGANAN</p>
							</CardHeader>
							<CardContent>
								<p><b>TANGGAL:</b> {item.created_time.slice(0, 10)}</p>
								<p><b>WAKTU:</b> {item.created_time.slice(11, 19)}</p>
								<p><b>METODE KONTAK:</b> {item.contact_mode}</p>
								{/* <p><b>DETAIL METODE:</b> {item.call_result}</p> */}
								<p><b>KONTAK:</b> {item.contact_person}</p>
								{/* <p><b>TEMPAT KUNJUNGAN:</b> {item.place_contacted} </p> */}
								{/* <p><b>BERTEMU DENGAN:</b> {item.contact_person}</p> */}
								<p><b>KETERANGAN:</b> {item.notepad}</p>
								{/* <p><b>PETUGAS:</b> {item.user_id}</p> */}
							</CardContent>
						</Card>
					))}
				</Block>
				<CustomBlockTitle noGap title="INFO TAMBAHAN" />
				<Block>
					{infoUpdateData.map((item, key) => (
						<Row key={key} style={{ alignItems: 'center', marginBottom: 16 }}>
							<Col width="45" style={{ backgroundColor: '#c0392b', color: '#fff' }}>
								<p style={{ margin: 8, textAlign: 'center' }}>{item.kategori}</p>
							</Col>
							<Col width="55">
								{item.perubahan.map((val, idx) => (
									<div key={idx}>
										<div style={{ border: 1, borderStyle: 'solid', borderColor: '#c0392b', borderCollapse: 'collapse', marginBottom: 8 }}>
											<p style={{ margin: 8, textAlign: 'center' }}>{val}</p>
										</div>
									</div>
								))}
							</Col>
						</Row>
					))}
				</Block>
			</Page>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.main.user,
		detailCust: state.user.detailCust,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		//onUpdateUser: (data) => dispatch(updateUser(data)),
		//onLogin: () => dispatch(login()),
		navigate: (nav) => dispatch(navigate(nav)),
		setDetailCustomer: (detailCust) => dispatch(setDetailCustomer(detailCust)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(InfoDebitur);