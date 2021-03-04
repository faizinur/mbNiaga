import React, { Component } from 'react';
import {
	Page,
	List,
	ListInput,
	Block,
	Row,
	Col,
	Button,
	Icon,
} from 'framework7-react';

import { connect } from 'react-redux';
import { navigate, setDetailCustomer } from '../../../config/redux/actions/';
import { log, Filter, SQLite, SQLiteTypes, Connection } from '../../../utils/';
import { SystemInfo, KunjunganItem } from '../../../components/molecules';
import { DefaultNavbar } from '../../../components/atoms'
const { DETAIL_COSTUMER } = SQLiteTypes;
class ListDebitur extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			parameter: [
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
			],
			kondisi: [
				{ code: 'EQUAL', description: 'Equal' },
				{ code: 'DOES_NOT_EQUAL', description: 'Does Not Equal' },
				{ code: 'GREATHER_THAN_EQUAL_TO', description: 'Greather Than Equal To' },
				{ code: 'LESS_THAN_EQUAL_TO', description: 'Less Than Equal To' },
				{ code: 'BETWEEN', description: 'Between' },
				{ code: 'BEGIN_WITH', description: 'Begin With' },
				{ code: 'END_WITH', description: 'End With' },
				{ code: 'CONTAINS', description: 'Contains' },
				{ code: 'DOES_NOT_CONTAINS', description: 'Does Not Contain' },
				{ code: 'DOES_NOT_BEGIN_WITH', description: 'Does Not Begin With' },
				{ code: 'DOES_NOT_END_WITH', description: 'Does Not End With' },
				{ code: 'GREATHER_THAN', description: 'Greather Than' },
				{ code: 'LESS_THAN', description: 'Less Than' },
				{ code: 'NOT_BETWEEN', description: 'Not Between' },
			],
			selectedParameter: '',
			selectedKondisi: '',
			searchValue: '',
			searchResult: [],
			searchParameter: [],
		}
	}
	componentDidMount() {
		this._tambahParameter()
		SQLite.query('SELECT * FROM collection where key = ?', [DETAIL_COSTUMER])
			.then(res => {
				var arr_result = [];
				(res.length == 0 ? [] : res[0]).map((item, index) =>
					arr_result.push({
						namaDebitur: item.name || '-',
						nomorKartu: item.card_no || '-',
						alamat: item.home_address_1 || '-',
						office_address: item.office_address_1 || '-',
						home_post_code: item.home_post_code || '-',
						data: item,
					})
				);
				this.setState({ searchResult: arr_result });
			})
			.catch(err => log(err))
	}
	_next(data) {
		this.props.setDetailCustomer(data);
		// this.props.navigate('/InfoDebitur/');
		this.props.navigate('/DetailDebitur/');
	}
	_search = async () => {
		var param = this.state.searchParameter.filter(obj => obj.column != "" && obj.operator != "");
		// var param = JSON.parse('[{"column":"name","operator":"DOES_NOT_EQUAL","value":""}]');
		if (param.length == 0) return false;
		SQLite.query('SELECT * FROM collection where key = ?', [DETAIL_COSTUMER])
			.then(res => {
				Filter.select(res, param).then((resFilter) => {
					var arr_result = [];
					resFilter.map((item, index) => arr_result.push({
						namaDebitur: item.name,
						nomorKartu: item.card_no,
						alamat: item.home_address_1,
						produk: item.loan_type,
						tagihan: item.dpd_cur_days,
						bucket: item.current_bucket,
						dpd: item.day_past_due,
						data: item
					}));
					this.setState({ searchResult: arr_result });
				}).catch(err => log(err))
			})
			.catch(err => log(err))
	}
	_tambahParameter() {
		var searchParam = this.state.searchParameter;
		if (searchParam.length == this.state.parameter.length) return false;
		searchParam.push({ 'column': '', 'operator': '', 'value': '' })
		this.setState({ searchParameter: searchParam });
	}
	_kurangiParameter() {
		var searchParam = this.state.searchParameter;
		if (searchParam.length == 1) return false;
		searchParam = searchParam.slice(0, -1);
		this.setState({ searchParameter: searchParam });
	}
	_clear = () => {
		this.setState({ searchParameter: [] })
		this.setState({ searchParameter: [{ 'column': '', 'operator': '', 'value': '' }] })
	}
	render() {
		return (
			<Page name="ListDebitur" noToolbar noNavbar style={{ paddingBottom: 58 }}>
				<DefaultNavbar title="DAFTAR DEBITUR" network={Connection()} profile />
				<List noHairlinesMd style={{ margin: 0, padding: 0 }}>
					<SystemInfo />
					<Block style={{ margin: 0, padding: 0 }}>
						{this.state.searchParameter.map((item, key) => (
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
												this.setState(prevState => ({
													searchParameter: prevState.searchParameter.map((item, index) => index == key ? Object.assign(item, { column: target.value }) : item)
												}))
											}}
										>
											<option value="" disabled>Choose</option>
											{
												this.state.parameter.map((item, key) => (
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
												this.setState(prevState => ({
													searchParameter: prevState.searchParameter.map((item, index) => index == key ? Object.assign(item, { operator: target.value }) : item)
												}))
											}}
										>
											<option value="" disabled>Choose</option>
											{
												this.state.kondisi.map((item, key) => (
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
												this.setState(prevState => ({
													searchParameter: prevState.searchParameter.map((item, index) => index == key ? Object.assign(item, { value: target.value }) : item)
												}))
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
									<Button fill raised onClick={() => this._tambahParameter()} style={{ backgroundColor: '#0085FC', fontSize: 12 }}>Add Parameter</Button>
								</Col>
								<Col width="50">
									<Button fill raised onClick={() => this._kurangiParameter()} style={{ backgroundColor: '#0085FC', fontSize: 12 }}>Less Parameter</Button>
								</Col>
							</Row>
						</Block>
						<Block strong style={{ margin: 0, backgroundColor: 'black' }}>
							<Row >
								<Col width="50">
									<Button fill raised onClick={() => this._clear()} style={{ backgroundColor: '#FFBC26', fontSize: 12 }}>Clear All</Button>
								</Col>
								<Col width="50">
									<Button fill raised onClick={() => this._search()} style={{ backgroundColor: '#60A917', fontSize: 12 }}>Search</Button>
								</Col>
							</Row>
						</Block>
					</Block>
				</List>
				<KunjunganItem
					item={this.state.searchResult}
					onItemClick={(e) => this._next(e)}
				/>
			</Page>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		detailCust: state.user.detailCust,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		navigate: (nav) => dispatch(navigate(nav)),
		setDetailCustomer: (detailCust) => dispatch(setDetailCustomer(detailCust))
	};
};


export default connect(mapStateToProps, mapDispatchToProps)(ListDebitur);