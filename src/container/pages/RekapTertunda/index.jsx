import React, { Component } from 'react';
import {
    Page,
    Navbar,
    List,
    ListInput,
    ListItem,
    Block,
    Row,
    Col,
    Button,
    BlockTitle
} from 'framework7-react';

import { connect } from 'react-redux';
import { navigate } from '../../../config/redux/actions/routerActions';
import { log, Connection, SQLite, SQLiteTypes, Filter } from '../../../utils/';
import { DefaultNavbar } from '../../../components/atoms';
var { REKAP_TERTUNDA } = SQLiteTypes;

class RekapTertunda extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listTertunda : []
        }
    }

    componentDidMount(){
        log('componentDidMount RekapTertunda')
        SQLite.query('SELECT * FROM collection where key = ?', [REKAP_TERTUNDA])
        .then(res => {
			log("REKAP TERTUNDA", res)
            if(res.length == 0) return false;
            Filter.select(res, [{'column':'transaction_type', 'operator':'EQUAL', 'value': 'KUNJUNGAN' }]).then((resFilter) => {
				this.setState({listTertunda : resFilter})
            }).catch(err => log(err))
		}).catch(err => log(err))
    }
    _onPTPclick = () => {
        log('_onPTPclick');
    }

    render() {
        return (
            <Page noToolbar noNavbar>
                <DefaultNavbar
                    title="Rekap Tertunda"
                    network={Connection()}
                />
                {this.state.listTertunda.map((item, key) => (
                    <List key={key} noHairlinesMd style={{ fontSize: 1, paddingBottom: 80 }}>
                        <div style={{
                            display: 'flex',
                            height: 58,
                            backgroundColor: "#c0392b",
                            paddingLeft: '5%',
                            paddingRight: '5%',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                        // onClick={()=> this._onPTPclick()}
                        >
                            <p style={{
                                fontSize: 14,
                                fontWeight: 'initial',
                                color: '#fcf5f4',
                                lineHeight: 16
                            }}>{item.account_number}</p>
                            <div
                                style={{
                                    height: 40,
                                    paddingLeft:16,
                                    paddingRight:16,
                                    backgroundColor: 'red',
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    borderColor: 'blue',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                }}
                            >
                                <p style={{
                                    fontSize: 14,
                                    fontWeight: 'initial',
                                    color: '#fcf5f4',
                                    margin: 0,
                                }}>{item.call_result}</p>
                            </div>
                        </div>
                        <ListInput
                            outline
                            label="Nomor Kartu"
                            type="text"
                            value={item.card_no}
                            disabled={true}
                        />
                        <ListInput
                            outline
                            label="Nama"
                            type="text"
                            value={item.name}
                            disabled={true}
                        />
                        <ListInput
                            outline
                            label="Metode Kontak"
                            type="text"
                            value={item.contact_mode}
                            disabled={true}
                        />
                        <ListInput
                            outline
                            label="Kontak"
                            type="text"
                            value={item.contact_person}
                            disabled={true}
                        />
                        <ListInput
                            outline
                            label="Tempat Kunjungan"
                            type="text"
                            value={item.place_contacted}
                            disabled={true}
                        />
                        <ListInput
                            outline
                            label="Hasil Kunjungan"
                            type="text"
                            value={item.call_result}
                            disabled={true}
                        />
                        <ListInput
                            outline
                            label="Detail Hasil Kunjungan"
                            type="text"
                            value={item.notepad}
                            disabled={true}
                        />
                        <ListInput
                            outline
                            label="Waktu Visit"
                            type="text"
                            value={item.created_time}
                            disabled={true}
                        />
                        <ListInput
                            outline
                            label="Petugas"
                            type="text"
                            value={item.user_id}
                            disabled={true}
                        />
                        <ListInput
                            outline
                            label="Tanggal PTP"
                            type="text"
                            value={item.ptp_date}
                            disabled={true}
                        />
                        <ListInput
                            outline
                            label="Jumlah PTP"
                            type="text"
                            value={item.ptp_amount}
                            disabled={true}
                        />
                    </List>
                ))}
            </Page>
        );
    }
    _next() {
        this.props.navigate('/DetailHasilKunjungan/');
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (nav) => dispatch(navigate(nav))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RekapTertunda);