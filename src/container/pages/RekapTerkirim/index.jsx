import React, { useEffect, useState } from 'react';
import {
    Page,
    Card,
    CardHeader,
    CardContent,
    List,
    Block,
    Row,
    Col,
    Button,
    ListInput,
    f7,
} from 'framework7-react';
import { useDispatch, useSelector } from "react-redux";
import { navigate } from '../../../config/redux/actions/routerActions';
import { log, Connection, SQLite, SQLiteTypes, Filter } from '../../../utils/';
import { DefaultNavbar } from '../../../components/atoms';
import { SystemInfo, KunjunganItem } from '../../../components/molecules';
import { RekapTerkirim as Strings } from '../../../utils/Localization';
const { REKAP_TERKIRIM } = SQLiteTypes;

const RekapTerkirim = (props) => {
    useEffect(() => {
        log('MOUNT OR UPDATE RekapTerkirim');
        Strings.setLanguage(bahasa);
        _tambahParameter();
        _getRekapTerkirim();
        return () => {
            log('UNMOUNT RekapTerkirim');
        }
    }, [])
    let bahasa = useSelector(state => state.main.bahasa);
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
    const _getRekapTerkirim = () => {
        SQLite.query('SELECT * FROM collection where key = ?', [REKAP_TERKIRIM])
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
                            setSearchResult(arr_result);
                        }
                    })
                    .catch(err => log(err))
            }).catch(err => log(err))
    }
    const _search = async () => {
        var param = searchParameter.filter(obj => obj.column != "" && obj.operator != "");
        if (param.length == 0) return false;
        SQLite.query('SELECT * FROM collection where key = ?', [REKAP_TERTUNDA])
            .then(res => {
                Filter.select(res, param)
                    .then((resFilter) => {
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
                        setSearchResult(arr_result)
                    }).catch(err => log(err))
            })
            .catch(err => log(err))
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
        <Page noToolbar noNavbar name="RekapTerkirim" >
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
                                        label={Strings.condition}
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
                                            setSearchParameter(searchParameter.map((item, index) => index == key ? Object.assign(item, { column: target.value }) : item))
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
            {/* {listTerkirim.map((item, key) => (
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
            ))} */}
        </Page>
    )
}
export default RekapTerkirim;