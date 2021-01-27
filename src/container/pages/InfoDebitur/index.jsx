import React, { Component } from 'react';
import {
	Page,
	Navbar,
	List,
	ListInput,
	Block,
	Row,
	Col,
	Button
} from 'framework7-react';

import { connect } from 'react-redux';
import { navigate } from '../../../config/redux/actions/routerActions';
import { DefaultNavbar, CustomBlockTitle } from '../../../components/atoms'
import { Connection, log, SQLiteTypes, SQLite, Filter } from '../../../utils'

class InfoDebitur extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			detailCust : this.props.detailCust,
			arrDetailCust : [],
			history : {
				tanggal : '26 NOVEMBER 2020 08:30:05',
				metodeKontak : 'VISIT',
				detailMetode : 'BERTEMU DENGAN DEBITUR',
				kontak : 'PEMBAYARAN DI AMBIL',
				tempatKunjungan : 'ALAMAT KTP',
				bertemuDengan : 'DEBITUR',
				keterangan : 'DIKUNJUNGI',
				petugas : 'NA',
			},
			infoUpdateData : [
				{kategori : 'ALAMAT RUMAH', perubahan : 'PROVINSI, KOTA/KABUPATEN, KECAMATAN, KELURAHAN, ALAMAT, ZIP CODE, NO TELEPHONE'},
				{kategori : 'ALAMAT KANTOR', perubahan : 'PROVINSI, KOTA/KABUPATEN, KECAMATAN, KELURAHAN, ALAMAT, ZIP CODE, NO TELEPHONE'},
				{kategori : 'ALAMAT EMERGENCY', perubahan : 'PROVINSI, KOTA/KABUPATEN, KECAMATAN, KELURAHAN, ALAMAT, ZIP CODE, NO TELEPHONE'},
				{kategori : 'ALAMAT RUMAH', perubahan : 'PROVINSI, KOTA/KABUPATEN, KECAMATAN, KELURAHAN, ALAMAT, ZIP CODE, NO TELEPHONE'},
			]
		}
	}
	componentDidMount(){
		var arrDetailCust = [];
		for (const key in this.state.detailCust) {
			arrDetailCust.push({'key' : key, 'value' : this.state.detailCust[key]})
		}
		this.setState({arrDetailCust : arrDetailCust})
	}
	_updateData(){
		this.props.navigate('/UpdateDebitur/');
	}
	_rencanaKunjungan(){
		SQLite.query('SELECT * FROM collection where key = ?', [SQLiteTypes.RENCANA_KUNJUNGAN])
        .then(res => {
            Filter.select(res, [{'column':'account_number', 'operator':'EQUAL', 'value': this.state.detailCust.account_number }]).then((resFilter) => {
				if(resFilter.length != 0) return false;
				var data = res.length != 0 ? res[0] : res;
				data.push((this.state.detailCust))
				SQLite.query(`INSERT OR REPLACE INTO collection (id, key, value) VALUES(?,?,?)`, [SQLiteTypes.RENCANA_KUNJUNGAN, data])
				.then(insert => {
					log(insert)
					this.props.navigate('/Main/');
				}).catch(err => log(err))
            }).catch(err => log(err))
        })
        .catch(err => log(err))
	}
	render() {
		const {detailCust, arrDetailCust, history, infoUpdateData} = this.state;
		return (
			<Page noToolbar noNavbar style={{ paddingBottom: 60 }}>
				<DefaultNavbar title="DETAIL DEBITUR" network={Connection()} />
				<CustomBlockTitle center title="INFO DEBITUR" />
				<List noHairlinesMd style={{ fontSize: 1 }}>
					<ListInput
						outline
						disabled={true}
						label="Customer Name"
						type="text"
						value={detailCust.name}
					>
					</ListInput>
					<ListInput
						outline
						disabled={true}
						label="Card Number"
						type="text"
						value={detailCust.card_no}
					>
					</ListInput>
					<ListInput
						outline
						disabled={true}
						label="Jenis Kelamin"
						type="text"
						value={detailCust.sex}
					>
					</ListInput>
					<ListInput
						outline
						disabled={true}
						label="DOB"
						type="text"
						value={detailCust.date_of_birth}
					>
					</ListInput>
				</List>
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
				<CustomBlockTitle noGap title="INFO KONTRAK" rightTitle="HASIL KUNJUNGAN" />
				<Block>
					{arrDetailCust.map((item, key) => (
						<Row key={key} noGap>
							<Col width="50" style={{border:1, borderStyle:'solid', borderColor:'#a9a9a9', borderCollapse: 'collapse'}}>
								<p style={{margin:8}}>{item.key.toUpperCase()}</p>
							</Col>
							<Col width="50" style={{border:1, borderStyle:'solid', borderColor:'#a9a9a9', borderCollapse: 'collapse'}}>
								<p style={{margin:8}}>{item.value}</p>
							</Col>
						</Row>
					))}
				</Block>
				<CustomBlockTitle title="HISTORI PENANGANAN" />
				<List noHairlinesMd style={{ fontSize: 1 }}>
					<ListInput
						outline
						disabled={true}
						type="text"
						value={history.tanggal}
					/>
					<ListInput
						outline
						disabled={true}
						type="text"
						value={"METODE KONTAK: " + history.metodeKontak}
					/>
					<ListInput
						outline
						disabled={true}
						type="text"
						value={"DETAIL METODE: " + history.detailMetode}
					/>
					<ListInput
						outline
						disabled={true}
						type="text"
						value={"KONTAK: " + history.kontak}
					/>
					<ListInput
						outline
						disabled={true}
						type="text"
						value={"TEMPAT KUNJUNGAN: " + history.tempatKunjungan}
					/>
					<ListInput
						outline
						disabled={true}
						type="text"
						value={"BERTEMU DENGAN: " + history.bertemuDengan}
					/>
					<ListInput
						outline
						disabled={true}
						type="text"
						value={"KETERANGAN: " + history.keterangan}
					/>
					<ListInput
						outline
						disabled={true}
						type="text"
						value={"PETUGAS: " + history.petugas}
					/>
				</List>
				<CustomBlockTitle noGap title="INFORMASI UPDATE DATA" />
				<Block>
					{infoUpdateData.map((item, key) => (
						<Row key={key} style={{alignItems:'center', marginBottom:16}}>
							<Col width="45" style={{backgroundColor:'#c0392b', color: '#fff'}}>
								<p style={{margin:8, textAlign: 'center'}}>{item.kategori}</p>
							</Col>
							<Col width="55" style={{border:1, borderStyle:'solid', borderColor:'#c0392b', borderCollapse: 'collapse'}}>
								<p style={{margin:8, textAlign: 'center'}}>{item.perubahan}</p>
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
		detailCust : state.user.detailCust,
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