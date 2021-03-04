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
import { navigate, back } from '../../../config/redux/actions/routerActions';
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
			tabLinkActive: 'profile'
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
		const { detailCust, profile } = this.props;
		let [Y, M, D] = detailCust.date_of_birth.split("-");
		let today = new Date();
		let tabData = [
			{
				id: 'profile',
				data: [
					{
						key: 'Customer Name',
						value: detailCust.name || '-',
					},
					{
						key: 'Loan No.',
						value: detailCust.card_type == "CC" ? detailCust.card_no : detailCust.account_number || '-',
					},
					{
						key: 'Sex',
						value: detailCust.sex || '-',
					},
					{
						key: 'DOB',
						value: `${Math.abs(today.getFullYear() - Y)} thn ${Math.abs((today.getMonth() + 1) - M)} Bln ${Math.abs((today.getDate() + 1) - D)} Hr` || '-',
					},
					{
						key: 'ID Card No.',
						value: detailCust.card_no || '',
					},
					{
						key: 'Home Address',
						value: detailCust.home_address_1 || '-',
					},
					{
						key: 'CIF No.',
						value: detailCust.cif_number || '-',
					},
					{
						key: 'Company Name',
						value: 'value',
					},
					{
						key: 'Company Address',
						value: 'value',
					},
					{
						key: 'Office Address',
						value: detailCust.office_address_1 || '-',
					},
					{
						key: 'Position',
						value: 'value',
					},
					{
						key: 'Grup Industri',
						value: detailCust.group_id || '-',
					},
					{
						key: 'Jenis Usaha',
						value: 'value',
					},
					{
						key: 'Phone 1',
						value: detailCust.handphone || '-',
					},
					{
						key: 'Phone 2',
						value: 'value',
					},
					{
						key: 'Home Phone',
						value: detailCust.home_phone || '-',
					},
					{
						key: 'Office Phone',
						value: detailCust.office_phone || '-',
					},
				]
			},
			{
				id: 'contract',
				data: [
					{
						key: 'Customer Name.',
						value: detailCust.name || '-',
					},
					{
						key: 'Loan No.',
						value: detailCust.card_type == "CC" ? detailCust.card_no : detailCust.account_number || '-',
					},
					{
						key: 'Source Code',
						value: 'value',
					},
					{
						key: 'Credit Segment',
						value: 'value',
					},
					{
						key: 'Sector Code',
						value: 'value',
					},
					{
						key: 'Sector Description',
						value: 'value',
					},
					{
						key: 'Product',
						value: detailCust.loan_type || '-',
					},
					{
						key: 'MoB',
						value: 'value',
					},
					{
						key: 'Tenor',
						value: this._formatCurrency(detailCust.tenor || 0),
					},
					{
						key: 'Due Date/Cycle',
						value: `${detailCust.due_date}/${detailCust.cycle_date}` || '-',
					},
				]
			},
			{
				id: 'loan',
				data: [
					{
						key: 'Customer Name.',
						value: detailCust.name || '-',
					},
					{
						key: 'Loan No.',
						value: detailCust.card_type == "CC" ? detailCust.card_no : detailCust.account_number || '-',
					},
					{
						key: 'Tunggakan Pokok',
						value: this._formatCurrency(detailCust.princple_amount_due || 0),
					},
					{
						key: 'Tunggakan Bunga',
						value: this._formatCurrency(detailCust.dpd_cur_days || 0),
					},
					{
						key: 'Denda',
						value: this._formatCurrency(detailCust.total_due || 0)
					},
					{
						key: 'Biaya Lainnya',
						value: 'value',
					},
					{
						key: 'Total Kewajiban',
						value: 'value',
					},
					{
						key: 'Bucket',
						value: this._formatCurrency(detailCust.current_bucket || 0),
					},
					{
						key: 'DPD',
						value: detailCust.day_past_due || '-',
					},
					{
						key: 'Due Date/Cycle',
						value: `${detailCust.due_date}/${detailCust.cycle_date}` || '-',
					},
					{
						key: 'Charge Off Status',
						value: 'value',
					},
					{
						key: 'Charge Off Date',
						value: detailCust.charge_off_date || '-',
					},
					{
						key: 'Block Code',
						value: 'value',
					},
					{
						key: 'Block Code Date',
						value: 'value',
					},
					{
						key: 'Outstanding Pokok',
						value: this._formatCurrency(detailCust.princple_os || 0),
					},
					{
						key: 'Outstanding Bunga',
						value: 'value',
					},
					{
						key: 'Outstanding Balance',
						value: this._formatCurrency(detailCust.outstanding_balance || 0),
					},
					{
						key: 'Saldo Denda',
						value: 'value',
					},
					{
						key: 'Flag Restructure',
						value: detailCust.over_limit_flag || '-',
					},
					{
						key: 'Restructure Date',
						value: 'value',
					},
					{
						key: 'Maturity Date',
						value: detailCust.maturity_date || '-',
					},
				]
			},
			{
				id: 'call',
				data: [
					{
						list: [
							{
								key: 'Call Date',
								value: 'value',
							},
							{
								key: 'Call Result',
								value: 'value',
							},
							{
								key: 'Called By',
								value: 'value',
							},
							{
								key: 'PTP Date',
								value: 'value',
							},
							{
								key: 'PTP Amount',
								value: 'value',
							},
							{
								key: 'Succes Phone',
								value: 'value',
							},

						]
					},
				]
			},
			{
				id: 'visit',
				data: [
					{
						list: [
							{
								key: 'Visit Date',
								value: 'value',
							},
							{
								key: 'Visit Result',
								value: 'value',
							},
							{
								key: 'Visited By',
								value: 'value',
							},
							{
								key: 'PTP Date',
								value: 'value',
							},
							{
								key: 'PTP Amount',
								value: 'value',
							},
							{
								key: 'Success Address',
								value: 'value',
							},
						]
					}
				]
			},
			{
				id: 'payment',
				data: [
					{
						list: [
							{
								key: 'Pay Date',
								value: 'value',
							},
							{
								key: 'Pay Amount',
								value: 'value',
							},
							{
								key: 'Pay Via',
								value: 'value',
							},
						]
					}
				]
			},
		]
		return (
			<Page name="InfoDebitur" pageContent={false} style={{ paddingBottom: 60 }}>
				<DefaultNavbar title="DETAIL DEBITUR" network={Connection()} backLink />
				<Toolbar inner={false} tabbar top style={{ position: 'unset', flexDirection: 'row', display: 'flex', flex: 1, flexWrap: 'wrap', alignContent: 'flex-start', height: 'fit-content', backgroundColor: '#000000' }}>
					{
						tabData.map((item, index) => (
							<div key={"Toolbar" + index} style={{ height: 30, width: '24.35%', overflow: 'hidden', backgroundColor: '#666666', borderColor: 'white', borderWidth: 1, borderStyle: 'groove' }}>
								<Link style={{ width: '100%', paddingRight: 5, paddingLeft: 5, height: 30, color: this.state.tabLinkActive === item.id ? '#ff6666' : 'white' }} tabLinkActive={this.state.tabLinkActive === item.id} onClick={() => this.setState({ tabLinkActive: item.id })} tabLink={`#${item.id}`}>{item.id}</Link>
							</div>
						))
					}
				</Toolbar>

				<Tabs swipeable >
					{
						tabData.map((item, index) => (
							<Tab key={"Tab" + index} id={item.id} className="page-content" style={{ paddingTop: 0, paddingBottom: 200, paddingLeft: 10, paddingRight: 10 }}>
								{
									item.data.map((data, key) => (
										(item.id == "call" || item.id == "visit" || item.id == "payment") &&
										(
											<div key={key} style={{ backgroundColor: '#666666', marginTop: 5, borderColor: '#000000', borderWidth: 2, borderStyle: 'groove', paddingLeft: 5, paddingRight: 5, paddingTop: 10, paddingBottom: 10 }}>
												{data.list.map((list, listKey) => (
													<div key={listKey} style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
														<div style={{ display: 'flex', flex: 1 }}>
															<p style={{ margin: 0, color: 'white' }}>{list.key}</p>
														</div>
														<div style={{ width: 10 }}>
															<p style={{ margin: 0, color: 'white' }}> : </p>
														</div>
														<div style={{ display: 'flex', flex: 2 }}>
															<p style={{ margin: 0, color: 'white' }}>{list.value}</p>
														</div>
													</div>
												))}
											</div>
										)
										||
										(item.id == "profile" || item.id == "contract" || item.id == "loan") &&
										(
											<Row key={key} noGap style={{ margin: 5, margin: 5 }}>
												<Col width="30" style={{ height: '100% style={{marginTop : 5, marginBottom : 5}}', marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>{data.key}</Col>
												<Col width="65" style={{ height: '100%', marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>{data.value}</Col>
											</Row>
										)
									))
								}
							</Tab>
						))
					}
				</Tabs>

				<div style={{ position: 'absolute', left: 0, bottom: 56, height: 58, width: '100%', backgroundColor: '#666666', zIndex: 99 }}>
					<Block style={{ margin: 0, padding: 0 }}>
						<Row>
							<Col width="50">
								<Block style={{ margin: 12 }}>
									<Row>
										<Col width="100">
											<Button
												onClick={() => this.props.navigate('/AddKunjungan/')}
												round
												style={{ backgroundColor: '#0085FC', color: '#ffffff' }}
												text="Input Visit"
											/>
										</Col>
									</Row>
								</Block>
							</Col>
							<Col width="50">
								<Block style={{ margin: 12 }}>
									<Row>
										<Col width="100">
											<Button
												onClick={() => this.props.back()}
												round
												style={{ backgroundColor: '#FF6666', color: '#ffffff' }}
												text="Back"
											/>
										</Col>
									</Row>
								</Block>
							</Col>
						</Row>
					</Block>
				</div>
			</Page>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.main.user,
		detailCust: state.user.detailCust,
		profile: state.user.profile,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		navigate: (nav) => dispatch(navigate(nav)),
		back: () => dispatch(back()),
		setDetailCustomer: (detailCust) => dispatch(setDetailCustomer(detailCust)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(InfoDebitur);