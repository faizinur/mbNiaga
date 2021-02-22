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
    f7,
} from 'framework7-react';

import { connect } from 'react-redux';
import { navigate } from '../../../config/redux/actions/routerActions';
import { log, Connection, SQLite, SQLiteTypes, Filter, POST } from '../../../utils/';
import { DefaultNavbar } from '../../../components/atoms';
const { REKAP_TERTUNDA } = SQLiteTypes;

class RekapTertunda extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listTertunda: []
        }
    }

    componentDidMount() {
        log('componentDidMount RekapTertunda');
        SQLite.query('SELECT * FROM collection where key = ?', [REKAP_TERTUNDA])
            .then(res => {
                log("REKAP TERTUNDA", res)
                if (res.length == 0) return false;
                Filter.select(res, [{ 'column': 'transaction_type', 'operator': 'EQUAL', 'value': 'KUNJUNGAN' }])
                    .then((resFilter) => {
                        if (resFilter.length == 0) {
                            f7.dialog.alert('Tidak ada Rekap Tertunda.',
                                (e) => this.props.navigate('/Main/'));
                        } else {
                            this.setState({ listTertunda: resFilter })
                        }
                    }).catch(err => log(err))
            }).catch(err => log(err))
    }
    _kirimRekapTertunda = () => {
        const { maxBedaJam } = this.props;
        if (Connection() == "OFFLINE") {
            f7.dialog.alert('Pastikan Perangkat terhubung dengan internet.');
            return false;
        }
        log('_kirimRekapTertunda : ')
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        let seconds = date.getSeconds();
        let jam_mobile = `${year}-${month < 9 ? '0' + month : month}-${day} ${hours}:${minutes}:${seconds}`;

        POST(`Get_server_time`, { jam_mobile: jam_mobile })
            .then(res => {
                this.props.setUser({
                    ...this.props.profile,
                    ...{
                        mobileTime: ClockTick(res.data.jam_mobile),
                        jam_server: ClockTick(res.data.jam_server),
                    }
                });
                _saveTime();
                let bedaJam = Math.abs(new Date(res.data.jam_server) - new Date(res.data.jam_mobile)) / 1000;
                if (bedaJam > maxBedaJam) {
                    f7.dialog.alert(`Pastikan perbedaan Waktu Pada Perangkat dan Server kurang dari ${maxBedaJam / 60} Menit.`);
                    return false;
                }
                this._getDelayedList()
                    .then(res => this.props.navigate('/Main/'))
                    .catch(err => log(err));
            })
            .catch(err => log(err));
    }
    _saveTime = () => {
        SQLite.query('SELECT * FROM COLLECTION WHERE KEY=?', [LIST_ACCOUNT])
            .then(res => SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)',
                [
                    LIST_ACCOUNT,
                    {
                        ...res[0],
                        ...{
                            mobileTime: this.props.profile.mobileTime,
                            jam_server: this.props.profile.jam_server,
                        }
                    }
                ])
            ).catch(err => log(err))
    }
    _getDelayedList = () => {
        return new Promise((resolve, reject) => {
            SQLite.query('SELECT value from Collection where key=?', [REKAP_TERTUNDA])
                .then(select => {
                    if (select.length == 0) {
                        resolve(true);
                        return;
                    }
                    if (select[0].length == 0) {
                        resolve(true);
                        return;
                    };
                    var params = [];
                    select[0].map((item) => params = [...params, [item.transaction_type == 'KUNJUNGAN' ? 'save_visit_history' : 'save_update_data', item]])
                    this._kirimDataTertunda(params)
                        .then(res => {
                            log("HASIL KIRIM: ", res)
                            var gagalKirim = [];
                            res.map((item, index) => {
                                if (item == "GAGAL")
                                    gagalKirim = [...gagalKirim, select[0][index]]
                            })
                            SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [REKAP_TERTUNDA, gagalKirim])
                                .then(insert => gagalKirim.length != 0 ? reject("GAGAL KIRIM REKAP TERTUNDA") : resolve(true))
                                .catch(err => reject(err));
                        }).catch(err => reject(err))
                }).catch(err => reject(err));
        })
    }
    _kirimDataTertunda = (params) => {
        let reqList = [];
        log('_kirimDataTertunda params', params)
        params.map(item =>
            reqList.push(
                new Promise((resolve, reject) => {
                    POST(...item)
                        .then(res => resolve(res.status != 'success' ? "GAGAL" : "BERHASIL")
                        ).catch(err => reject(err));
                })
            ));
        log(reqList)
        return Promise.all(reqList);
    }
    render() {
        return (
            <Page noToolbar noNavbar
                style={{ paddingBottom: 60 }}
                name="RekapTertunda"
                
            >
                <DefaultNavbar
                    title="Rekap Tertunda"
                    network={Connection()}
                    backLink
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
                {
                    this.state.listTertunda.length > 0 && (
                        <List noHairlinesMd>
                            <Block>
                                <Row>
                                    <Col width="100">
                                        <Button
                                            onClick={() => this._kirimRekapTertunda()}
                                            style={{ backgroundColor: '#c0392b', color: 'white' }}
                                            text="Upload Data"
                                        />
                                    </Col>
                                </Row>
                            </Block>
                        </List>
                    )
                }
            </Page>
        );
    }
    _next() {
        this.props.navigate('/DetailHasilKunjungan/');
    }
}

const mapStateToProps = (state) => {
    return {
        maxBedaJam: state.reference.maxBedaJam,
        profile: state.user.profile,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (nav) => dispatch(navigate(nav)),
        setUser: (data) => dispatch(setUser(data)),
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