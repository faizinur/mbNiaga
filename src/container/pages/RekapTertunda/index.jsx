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
    BlockTitle,
    Card,
    CardHeader,
    CardContent,
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
            listTertunda: []
        }
    }

    componentDidMount() {
        log('componentDidMount RekapTertunda')
        SQLite.query('SELECT * FROM collection where key = ?', [REKAP_TERTUNDA])
            .then(res => {
                log("REKAP TERTUNDA", res)
                if (res.length == 0) return false;
                Filter.select(res, [{ 'column': 'transaction_type', 'operator': 'EQUAL', 'value': 'KUNJUNGAN' }])
                    .then((resFilter) => {
                        this.setState({ listTertunda: resFilter })
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
                    <Card key={key} style={{ border: '2px solid #c0392b' }}>
                        <CardHeader style={{ backgroundColor: "#c0392b", }}>
                            <div style={{
                                display: 'flex',
                                flex: 1,
                                height: 58,
                                backgroundColor: "#c0392b",
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
                                        paddingLeft: 16,
                                        paddingRight: 16,
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
                        </CardHeader>
                        <CardContent>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Nomor Kartu</td>
                                        <td>:</td>
                                        <td>{item.card_no}</td>
                                    </tr>
                                    <tr>
                                        <td>Nama</td>
                                        <td>:</td>
                                        <td>{item.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Metode Kontak</td>
                                        <td>:</td>
                                        <td>{item.contact_mode}</td>
                                    </tr>
                                    <tr>
                                        <td>Kontak</td>
                                        <td>:</td>
                                        <td>{item.contact_person}</td>
                                    </tr>
                                    <tr>
                                        <td>Tempat Kunjungan</td>
                                        <td>:</td>
                                        <td>{item.place_contacted}</td>
                                    </tr>
                                    <tr>
                                        <td>Hasil Kunjungan</td>
                                        <td>:</td>
                                        <td>{item.call_result}</td>
                                    </tr>
                                    <tr>
                                        <td>Detail Hasil Kunjungan</td>
                                        <td>:</td>
                                        <td>{item.notepad}</td>
                                    </tr>
                                    <tr>
                                        <td>Waktu Visit</td>
                                        <td>:</td>
                                        <td>{item.created_time}</td>
                                    </tr>
                                    <tr>
                                        <td>Petugas</td>
                                        <td>:</td>
                                        <td>{item.user_id}</td>
                                    </tr>
                                    <tr>
                                        <td>Tanggal PTP</td>
                                        <td>:</td>
                                        <td>{item.ptp_date}</td>
                                    </tr>
                                    <tr>
                                        <td>Jumlah PTP</td>
                                        <td>:</td>
                                        <td>{item.ptp_amount}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
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


/*
 <List key={key} noHairlinesMd style={{ fontSize: 1, paddingBottom: 80 }}>

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
*/