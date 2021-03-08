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
import { SystemInfo, KunjunganItem } from '../../../components/molecules';
import { RekapTertunda as Strings } from '../../../utils/Localization';
const { REKAP_TERTUNDA, RENCANA_KUNJUNGAN } = SQLiteTypes;

class RekapTertunda extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // listTertunda: [],
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
            language: props.bahasa,
        };
        Strings.setLanguage(this.state.language);
    }

    componentDidMount() {
        this._tambahParameter();
        SQLite.query('SELECT * FROM collection where key = ?', [REKAP_TERTUNDA])
            .then(res => {
                if (res.length == 0) return false;
                Filter.select(res, [{ 'column': 'transaction_type', 'operator': 'EQUAL', 'value': 'KUNJUNGAN' }])
                    .then((resFilter) => {
                        if (resFilter.length == 0) {
                            f7.dialog.alert('Tidak ada Rekap Tertunda.',
                                (e) => this.props.navigate('/Main/'));
                        } else {
                            var arr_result = [];
                            var data = res.length != 0 ? res[0] : res;
                            data.map((item, index) =>
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
                        }
                    }).catch(err => log(err))
            }).catch(err => log(err));

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

    _search = async () => {
        var param = this.state.searchParameter.filter(obj => obj.column != "" && obj.operator != "");
        if (param.length == 0) return false;
        SQLite.query('SELECT * FROM collection where key = ?', [REKAP_TERTUNDA])
            .then(res => {
                Filter.select(res, param).then((resFilter) => {
                    var arr_result = [];
                    resFilter.map((item, index) =>
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
            <Page noToolbar noNavbar
                style={{ paddingBottom: 60 }}
                name={Strings.title}

            >
                <DefaultNavbar
                    title={Strings.title}
                    network={Connection()}
                    backLink
                />
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
                                            <option value="" disabled>{Strings.choose}</option>
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
                                            <option value="" disabled>{Strings.choose}</option>
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
                                    <Button fill raised onClick={() => this._tambahParameter()} style={{ backgroundColor: '#0085FC', fontSize: 12 }}>{Strings.add}</Button>
                                </Col>
                                <Col width="50">
                                    <Button fill raised onClick={() => this._kurangiParameter()} style={{ backgroundColor: '#0085FC', fontSize: 12 }}>{Strings.less}</Button>
                                </Col>
                            </Row>
                        </Block>
                        <Block strong style={{ margin: 0, backgroundColor: 'black' }}>
                            <Row >
                                <Col width="50">
                                    <Button fill raised onClick={() => this._clear()} style={{ backgroundColor: '#FFBC26', fontSize: 12 }}>{Strings.clear}</Button>
                                </Col>
                                <Col width="50">
                                    <Button fill raised onClick={() => this._search()} style={{ backgroundColor: '#60A917', fontSize: 12 }}>{Strings.search}</Button>
                                </Col>
                            </Row>
                        </Block>
                    </Block>
                </List>
                <KunjunganItem
                    item={this.state.searchResult}
                    onItemClick={(e) => log(e)}
                />
                {/* {this.state.listTertunda.map((item, key) => (
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
                } */}
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
        bahasa: state.main.bahasa,
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