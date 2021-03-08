import React, { Component } from 'react';
import {
	Page,
	f7,
	Block,
	Row,
	Col,
	Button,
	Card,
	CardHeader,
	CardContent,
	Toolbar,
	Link,
	Tabs,
	Tab,
	Fab,
	FabButtons,
	FabButton,
	Icon,
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
			arrDetailDemo: [],
			arrOtherFacility: [],
			history: [],
			infoUpdateData: [
				// {kategori : 'ALAMAT RUMAH', perubahan : []},
				// {kategori : 'ALAMAT KANTOR', perubahan : []},
				// {kategori : 'ALAMAT EMERGENCY', perubahan : []},
			],
			tabLinkActive: 'info-costumer-content',
		}
	}
	componentDidMount() {
		var arrDetailCust = [];
		var arrDetailDemo = [];
		var arrOtherFacility = [];
		let hiddenKeyCust = ['account_number', 'outstanding_balance', 'belum_ada', 'due_date', 'last_payment_date', 'last_payment_amount', 'charge_off_date', 'current_bucket', 'day_past_due', 'over_limit_flag', 'total_due', 'total_curr_due', 'minimum_payment', 'dpd_cur_days', 'dpd_x_days', 'dpd_30_days', 'dpd_60_days', 'dpd_90_days', 'dpd_120_days', 'dpd_150_days', 'dpd_180_days', 'dpd_210_days', 'total_overdue_amount', 'last_puchase_date', 'last_purchase_amount', 'last_transaction_code', 'loan_type', 'card_type', 'open_date', 'cycle_date', 'princple_os', 'princple_amount_due', 'reason_code', 'home_post_code', 'maturity_date', 'tenor', 'installment_number', 'bill_amount'];
		let aliasKeyCust = ['Account_no', 'OS_Biling', 'CURRENT_ACC_BALANCE', 'PAYMENT_DUE_DATE', 'LAST_PAYMENT_DATE', 'LAST_PAYMENT_AMT', 'CHARGE_OFF_DATE', 'BUCKET', 'DPD', 'OVER_LIMIT_FLAG', 'TOTAL_AMT_DUE', 'TOTAL_CURR_DUE', 'MIN_AMOUNT_DUE', 'Tunggakan_Curr', 'Tunggakan_XDAYS', 'Tunggakan_30DPD', 'Tunggakan_60DDP', 'Tunggakan_90DDPD', 'Tunggakan_120DPD', 'Tunggakan_150DPD', 'Tunggakan_180DPD', 'Tunggakan_210DPD', 'AMOUNT_OVERDUE', 'LAST_PURCH_DATE', 'LAST_PURCH_AMT', 'Last', 'PRODUCT_TYPE', 'CARD_TYPE', 'MOB', 'COLLECTION_CYCLE', 'PRINCIPLE_OUTSTANDING', 'PRINCIPLE_OVERDUE', 'REASON_CODE', 'ZIPCODE', 'Maturity_Date', 'Tenor', 'No_of_Installment_Due', 'Total_Billed_Amount'];
		let hiddenKeyDemo = ['contact_address_1', 'home_address_1', 'office_address_1', 'refferal_address_1', 'handphone', 'home_phone', 'office_phone', 'home_email', 'refferal_name'];
		let aliasKeyDemo = ['CONTACT_ADDRES', 'HOME_ADRESS', 'OFFICE_ADDRESS', 'ECON_ADDRESS', 'MOBILE_PHONE', 'HOME_PHONE', 'OFFICE_PHONE', 'EMAIL', 'ECON_NAME'];
		let hiddenKeyOtherFacility = [this.props.detailCust.card_type == "CC" ? 'card_no' : 'account_number', 'current_bucket', 'day_past_due', 'outstanding_balance', 'bill_amount'];
		let aliasKeyOtherFacility = ['Card_no', 'Bucket', 'DPD', 'Outstanding', 'amount_due'];
		//gak ada zip code
		for (const key in this.props.detailCust) {
			if (hiddenKeyCust.includes(key)) arrDetailCust = [...arrDetailCust, { 'key': aliasKeyCust[hiddenKeyCust.indexOf(key)], 'value': this.props.detailCust[key] }]
			if (hiddenKeyDemo.includes(key)) arrDetailDemo = [...arrDetailDemo, { 'key': aliasKeyDemo[hiddenKeyDemo.indexOf(key)], 'value': this.props.detailCust[key] }]
			if (hiddenKeyOtherFacility.includes(key)) arrOtherFacility = [...arrOtherFacility, { 'key': aliasKeyOtherFacility[hiddenKeyOtherFacility.indexOf(key)], 'value': this.props.detailCust[key] }]
		}
		this.setState({
			arrDetailCust: arrDetailCust,
			arrDetailDemo: arrDetailDemo,
			arrOtherFacility: arrOtherFacility,
		})
		SQLite.query('SELECT * FROM COLLECTION where key = ?', [ACTIVITY_HISTORY])
			.then(res => {
				Filter.select(res, [{ 'column': 'account_number', 'operator': 'EQUAL', 'value': this.props.detailCust.account_number }]).then((resFilter) => {
					log("HASIL FILTER", resFilter)
					// resFilter.slice(0, 5);
					this.setState({ history: resFilter });
				}).catch(err => log(err))
			}).catch(err => log(err))

		SQLite.query('SELECT * FROM COLLECTION where key = ?', [UPDATE_HISTORY])
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
				// log("STATE", this.state)

			}).catch(err => log(err))
	}

	_capitalize = (sentence = '') => {
		if (sentence == '') return null;
		const words = sentence.toLowerCase().replaceAll('_', ' ').split(' ');
		words.map((item, index) => words[index] = item[0].toUpperCase() + item.slice(1, item.length))
		return words.join(" ");
	}

	_updateData() {
		this.props.navigate('/UpdateDebitur/');
	}
	_rencanaKunjungan() {
		f7.dialog.confirm("Apakah akan dimasukkan ke rencana kunjungan?", () => {
			SQLite.query('SELECT * FROM collection where key = ?', [RENCANA_KUNJUNGAN])
				.then(res => {
					Filter.select(res, [{ 'column': 'account_number', 'operator': 'EQUAL', 'value': this.props.detailCust.account_number }]).then((resFilter) => {
						if (resFilter.length == 0) {
							var data = res.length != 0 ? res[0] : res;
							data.push((this.props.detailCust))
							SQLite.query(`INSERT OR REPLACE INTO collection (key, value) VALUES(?,?)`, [RENCANA_KUNJUNGAN, data])
								.then(insert => {
									log(insert)
									this.props.navigate('/ListDebitur/');
								}).catch(err => log(err))
						} else {
							this.props.navigate('/ListDebitur/');
						}
					}).catch(err => log(err))
				})
				.catch(err => log(err))
		}, () => log("cancel"))
	}
	_formatCurrency = (number) => {
		return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(parseFloat(number))
	}
	_renderEl = (data, child) => {
		return data.map((item, index) => child(item, index))
	}
	render() {
		const { arrDetailCust, history, infoUpdateData, arrDetailDemo, arrOtherFacility } = this.state;
		const { detailCust } = this.props;
		let [Y, M, D] = detailCust.date_of_birth.split("-");
		let today = new Date();
		let tabdata = [
			{
				title: 'CUSTOMER',
				tabLink: 'info-costumer-content',
				id: 'info-costumer',
			},
			{
				title: 'ACCOUNT',
				tabLink: 'info-akun-content',
				id: 'info-akun',
			},
			{
				title: 'DEMOGRAFI',
				tabLink: 'info-demografi-content',
				id: 'info-demografi',
			},
			{
				title: 'OTHER FACILITY',
				tabLink: 'info-fasilitas-content',
				id: 'info-fasilitas-lain',
			},
			{
				title: 'HISTORIKAL ACTIVITY',
				tabLink: 'aktivitas-historikal-content',
				id: 'aktivitas-historikal',
			},
			{
				title: 'ADDITIONAL INFO',
				tabLink: 'info-tambahan-content',
				id: 'info-tambahan',
			},
		];

		return (
			<Page name="InfoDebitur" pageContent={false} style={{ paddingBottom: 60 }}>
				<DefaultNavbar title="DETAIL DEBITUR" network={Connection()} backLink />
				<Toolbar inner={false} tabbar top style={{ position: 'unset', flexDirection: 'row', display: 'flex', flex: 1, flexWrap: 'wrap', alignContent: 'flex-start', height: 'fit-content' }}>
					{
						tabdata.map((item, key) => (
							<div key={key} style={{ width: '24.35%', overflow: 'hidden', backgroundColor: '#666666', borderColor: 'white', borderWidth: 1, borderStyle: 'groove' }}>
								<Link
									style={{ padding: 5, }}
									onClick={() => this.setState({ tabLinkActive: item.tabLink })}
									tabLink={`#${item.tabLink}`}
									id={item.id}
								>
									<center>
										<p style={{ fontSize: 'smaller', margin: 0, textOverflow: 'ellipsis', width: '100%', whiteSpace: 'break-spaces', overflow: 'hidden', color: this.state.tabLinkActive === item.tabLink ? '#ff6666' : 'white' }}
										>{item.title}</p>
									</center>
								</Link>
							</div>
						))
					}
				</Toolbar>
				<Tabs swipeable >
					<Tab id="info-costumer-content" className="page-content" style={{ paddingTop: 0 }}>
						<Block style={{ height: '65vh', overflow: 'auto', marginTop: 12 }}>
							<Row noGap style={{ margin: 5, margin: 5 }}>
								<Col width="30" style={{ height: '100% style={{marginTop : 5, marginBottom : 5}}', marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>
									Customer Name
								</Col>
								<Col width="65" style={{ height: '100%', marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>
									{detailCust.name || '-'}
								</Col>
							</Row>
							<Row noGap style={{ margin: 5, margin: 5 }}>
								<Col width="30" style={{ height: '100% style={{marginTop : 5, marginBottom : 5}}', marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>
									Card Number
								</Col>
								<Col width="65" style={{ height: '100%', marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>
									{detailCust.card_no || '-'}
								</Col>
							</Row>
							<Row noGap style={{ margin: 5, margin: 5 }}>
								<Col width="30" style={{ height: '100% style={{marginTop : 5, marginBottom : 5}}', marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>
									Jenis Kelamin
								</Col>
								<Col width="65" style={{ height: '100%', marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>
									{detailCust.sex || '-'}
								</Col>
							</Row>
							<Row noGap style={{ margin: 5, margin: 5 }}>
								<Col width="30" style={{ height: '100% style={{marginTop : 5, marginBottom : 5}}', marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>
									DOB
								</Col>
								<Col width="65" style={{ height: '100%', marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>
									{Math.abs(today.getFullYear() - Y)} thn {Math.abs((today.getMonth() + 1) - M)} Bln {Math.abs((today.getDate() + 1) - D)} Hr
								</Col>
							</Row>
						</Block>
					</Tab>
					<Tab id="info-akun-content" className="page-content" style={{ paddingTop: 0 }}>
						<Block style={{ height: '75vh', overflow: 'auto', marginTop: 12 }}>
							{arrDetailCust.map((item, key) => (
								<Row key={key} noGap style={{ margin: 5, margin: 5 }}>
									<Col width="30" style={{ height: '100% style={{marginTop : 5, marginBottom : 5}}', marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>
										{this._capitalize(item.key)}
									</Col>
									<Col width="65" style={{ height: '100%', marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>
										{
											['OS_Biling', 'LAST_PAYMENT_AMT', 'TOTAL_AMT_DUE', 'TOTAL_CURR_DUE', 'MIN_AMOUNT_DUE', 'Tunggakan_Curr', 'Tunggakan_XDAYS', 'Tunggakan_30DPD', 'Tunggakan_60DDP', 'Tunggakan_90DDPD', 'Tunggakan_120DPD', 'Tunggakan_150DPD', 'Tunggakan_180DPD', 'Tunggakan_210DPD', 'AMOUNT_OVERDUE', 'LAST_PURCH_AMT', 'PRINCIPLE_OUTSTANDING', 'PRINCIPLE_OVERDUE', 'Total_Billed_Amount']
												.includes(item.key) ?
												this._formatCurrency(item.value || 0) : item.value || '-'
										}
									</Col>
								</Row>
							))}
						</Block>
					</Tab>
					<Tab id="info-demografi-content" className="page-content" style={{ paddingTop: 0 }}>
						<Block style={{ height: '75vh', overflow: 'auto', marginTop: 12 }}>
							{arrDetailDemo.map((item, key) => (
								<Row key={key} noGap style={{ margin: 5, margin: 5 }}>
									<Col width="30" style={{ height: '100% style={{marginTop : 5, marginBottom : 5}}', marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>
										{this._capitalize(item.key || '-')}
									</Col>
									<Col width="65" style={{ height: '100%', marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>
										{item.value || '-'}
									</Col>
								</Row>
							))}
						</Block>
					</Tab>
					<Tab id="info-fasilitas-content" className="page-content" style={{ paddingTop: 0 }}>
						<Block style={{ height: '65vh', overflow: 'auto', marginTop: 12 }}>
							{arrOtherFacility.map((item, key) => (
								<Row key={key} noGap style={{ margin: 5, margin: 5 }}>
									<Col width="30" style={{ height: '100% style={{marginTop : 5, marginBottom : 5}}', marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>
										{this._capitalize(item.key || '-')}
									</Col>
									<Col width="65" style={{ height: '100%', marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>
										{item.value || '-'}
									</Col>
								</Row>
							))}
						</Block>
					</Tab>
					<Tab id="aktivitas-historikal-content" className="page-content" style={{ paddingTop: 0 }}>
						<Block style={{ height: '70vh', overflow: 'auto', marginTop: 12 }}>
							{history.map((item, key) => (
								<div key={key} style={{ backgroundColor: '#666666', marginTop: 5, borderColor: '#000000', borderWidth: 2, borderStyle: 'groove', paddingLeft: 5, paddingRight: 5, paddingTop: 10, paddingBottom: 10 }}>
									<div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
										<div style={{ display: 'flex', flex: 1 }}>
											<p style={{ margin: 0, color: 'white' }}>TANGGAL</p>
										</div>
										<div style={{ width: 10 }}>
											<p style={{ margin: 0, color: 'white' }}> : </p>
										</div>
										<div style={{ display: 'flex', flex: 2 }}>
											<p style={{ margin: 0, color: 'white' }}>{item.created_time.slice(0, 10)}</p>
										</div>
									</div>


									<div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
										<div style={{ display: 'flex', flex: 1 }}>
											<p style={{ margin: 0, color: 'white' }}>WAKTU</p>
										</div>
										<div style={{ width: 10 }}>
											<p style={{ margin: 0, color: 'white' }}> : </p>
										</div>
										<div style={{ display: 'flex', flex: 2 }}>
											<p style={{ margin: 0, color: 'white' }}>{item.created_time.slice(11, 19)}</p>
										</div>
									</div>


									<div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
										<div style={{ display: 'flex', flex: 1 }}>
											<p style={{ margin: 0, color: 'white' }}>METODE KONTAK</p>
										</div>
										<div style={{ width: 10 }}>
											<p style={{ margin: 0, color: 'white' }}> : </p>
										</div>
										<div style={{ display: 'flex', flex: 2 }}>
											<p style={{ margin: 0, color: 'white' }}>{item.contact_mode}</p>
										</div>
									</div>


									<div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
										<div style={{ display: 'flex', flex: 1 }}>
											<p style={{ margin: 0, color: 'white' }}>KONTAK</p>
										</div>
										<div style={{ width: 10 }}>
											<p style={{ margin: 0, color: 'white' }}> : </p>
										</div>
										<div style={{ display: 'flex', flex: 2 }}>
											<p style={{ margin: 0, color: 'white' }}>{item.contact_person}</p>
										</div>
									</div>


									<div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
										<div style={{ display: 'flex', flex: 1 }}>
											<p style={{ margin: 0, color: 'white' }}>KETERANGAN</p>
										</div>
										<div style={{ width: 10 }}>
											<p style={{ margin: 0, color: 'white' }}> : </p>
										</div>
										<div style={{ display: 'flex', flex: 2 }}>
											<p style={{ margin: 0, color: 'white' }}>{item.notepad}</p>
										</div>
									</div>


								</div>

							))}
						</Block>
					</Tab>
					<Tab id="info-tambahan-content" className="page-content" style={{ paddingTop: 0 }}>
						<Block style={{ height: '65vh', overflow: 'auto', marginTop: 12 }}>
							{infoUpdateData.map((item, key) => (
								<Row key={key} noGap style={{ margin: 5, margin: 5 }}>
									<Col width="30" style={{ height: '100% style={{marginTop : 5, marginBottom : 5}}', marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>
										<p style={{ margin: 8, textAlign: 'center' }}>{this._capitalize(item.kategori || '-')}</p>
									</Col>
									<Col width="65" style={{ height: '100%', minHeight: 62, marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>
										{item.perubahan.map((val, idx) => (
											<div key={idx}>
												<div style={{ border: 1, borderStyle: 'solid', borderColor: '#666666', borderCollapse: 'collapse', marginBottom: 8 }}>
													<p style={{ margin: 8, textAlign: 'center' }}>{val || '-'}</p>
												</div>
											</div>
										))}
									</Col>
								</Row>
							))}
						</Block>
					</Tab>
				</Tabs>
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