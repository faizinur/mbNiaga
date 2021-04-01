import React from 'react';
import {
    Page,
    List,
    ListInput,
    Block,
    Row,
    Col,
    Button,
    f7,
    Icon,
} from 'framework7-react';

import { connect } from 'react-redux';
import { navigate, back, setGeolocation } from '../../../config/redux/actions/';
import { DefaultNavbar, CustomBlockTitle, Maps } from '../../../components/atoms';
import { Camera } from '../../../components/molecules';
import { CustomerInfo } from '../../../components/molecules/';
import { Connection, log, SQLite, SQLiteTypes, Filter, POST, Geolocation, uuid } from '../../../utils';
import { AddKunjungan as Strings } from '../../../utils/Localization';
const { REKAP_TERTUNDA, REKAP_TERKIRIM, DAFTAR_DIKUNJUNGI, GEOLOCATION } = SQLiteTypes;
import { Device } from 'framework7/framework7-lite.esm.bundle.js';

class AddKunjungan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ptp: 'PTP',
            maxDayPtp: 3,
            online: true,
            detailCust: props.detailCust,
            contactMode: props.contactMode,
            contactPerson: props.contactPerson,
            placeContacted: props.placeContacted,
            callResult: props.callResult,
            formData: {
                id: null,
                card_no: props.detailCust.card_no,
                name: props.detailCust.name,
                account_number: props.detailCust.account_number,
                overdue_days: '',//GATAU DARIMANA
                phone_number: props.detailCust.handphone,
                dial_result: 'MT1',
                call_result: '',
                contact_person: '',
                payment_option: 0,
                notepad: '',
                user_id: props.user.user_id,
                contact_mode: '',
                place_contacted: '',
                gambar: [
                    'data:image/jpeg;base64/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIe',
                    'data:image/jpeg;base64/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIe',
                    'data:image/jpeg;base64/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIe',
                    '',
                ],
                longitude: props.geolocation.longitude,
                latitude: props.geolocation.latitude,
                altitude: props.geolocation.altitude,
                created_time: props.user.mobileTime,
                ptp_date: '',
                ptp_amount: '',
                transaction_type: 'KUNJUNGAN',
                province: '',
                regency: '',
                district: '',
                subDistrict: '',
                alamat: '',
                phone_number_1_type: '',
                phone_number_1: '',
                phone_number_2_type: '',
                phone_number_2: '',
                home_address_1: props.detailCust.home_address_1,
                office_address_1: props.detailCust.office_address_1,
                home_post_code: props.detailCust.home_post_code
            },
            language: props.bahasa,
            sendState: false,
        };
        Strings.setLanguage(this.state.language);
        this.cameraRef = React.createRef();
    }
    componentDidMount() {
        log('componentDidMount AddKunjungan');
    }
    _kirim = async () => {
        // f7.dialog.confirm('Apakah anda akan menyimpan hasil kunjungan ?.',
        //     () => {

        // async () => {
        //     let tmpGambar = Object.assign({}, this.state.formData);
        //     Promise.all([
        //         await this.cameraRef.current._getBase64(tmpGambar.uri[0]),
        //         await this.cameraRef.current._getBase64(tmpGambar.uri[1]),
        //         await this.cameraRef.current._getBase64(tmpGambar.uri[2]),
        //         await this.cameraRef.current._getBase64(tmpGambar.uri[3]),
        //     ]).then(data => {
        //         log('=======================HASIL=======================');
        //         tmpGambar.gambar = data;
        //         this.setState({ formData: tmpGambar });
        //         log('=======================HASIL=======================');
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                id: uuid(),
            }
        }))
        var { formData, ptp } = this.state;

        var mandatoryField = ['place_contacted', 'call_result', 'notepad', 'gambar'];
        if (formData.call_result == ptp) mandatoryField = [...mandatoryField, 'ptp_date', 'ptp_amount'];
        for (var item in formData) {
            if (mandatoryField.includes(item)) {
                if (typeof (formData[item]) == 'string') {
                    if (formData[item].toString() == "") {
                        alert(item)
                        // f7.dialog.alert("Harap Isi Semua Input.");
                        return false;
                    }
                } else {
                    var gambar = formData[item].filter(item => item != '');
                    if (gambar.length == 0) {
                        f7.dialog.alert("Harap Isi Semua Input. 1");
                        return false;
                    }
                }
            }
        }

        if (Connection() != "OFFLINE") {
            this.setState({ sendState: true });
            POST('save_visit_history', formData)
                .then(res => {
                    // log('save_visit_history ', res)
                    //set Gambar = ['','','','']
                    if (res.status != 'success') {
                        this._saveRekapTertunda()
                    } else {
                        this._clearBase64();
                        this._saveRekapTerkirim()
                    }
                    this.setState({ sendState: false });
                })
                .catch(err => {
                    log(err);
                    this.setState({ sendState: false });
                });
        } else {
            //     //set Gambar = ['','','','']
            this._saveRekapTertunda();
        }
        // });
        // }
        // );
    }
    _saveRekapTerkirim() {
        SQLite.query('SELECT value from Collection where key=?', [REKAP_TERKIRIM])
            .then(select => {
                var data = select.length != 0 ? select[0] : [];
                data.push(this.state.formData);
                SQLite.query('INSERT OR REPLACE INTO Collection (key, value) VALUES(?,?)', [REKAP_TERKIRIM, data])
                    .then(insert => {
                        this._saveDaftarDikunjungi();
                        f7.dialog.alert('Data Behasil disimpan.');
                        this.setState({ sendState: false });
                    }).catch(err => log(err));
            }).catch(err => log(err));
    }
    _saveRekapTertunda() {
        SQLite.query('SELECT value from Collection where key=?', [REKAP_TERTUNDA])
            .then(select => {
                var data = select.length != 0 ? select[0] : [];
                var { formData } = this.state;

                let formDataTmp = Object.assign({}, formData);
                let img_tmp = [];
                for (let i = 0; i < formDataTmp.gambar.length; i++) {
                    if (formDataTmp.gambar[i] != '') {
                        img_tmp.push(
                            {
                                parentId: formDataTmp.id,
                                value: formDataTmp.gambar[i],
                            }
                        )
                    }
                }
                formDataTmp.gambar = ['', '', '', ''];
                data.push(formDataTmp);
                SQLite.query('INSERT OR REPLACE INTO Collection (key, value) VALUES(?,?)', [REKAP_TERTUNDA, data])
                    .then(insert => {
                        Promise.all(img_tmp.map(img => SQLite._setImage(img)))
                            .then(data => {
                                this._clearBase64()
                                this._saveDaftarDikunjungi();
                                this.setState({ sendState: false });
                            })
                            .catch(err => log('REKAP_TERTUNDA ERROR', JSON.stringify(err)));
                    }).catch(err => log(err));
            }).catch(err => log(err));
    }
    _saveDaftarDikunjungi() {
        SQLite.query('SELECT value from Collection where key=?', [DAFTAR_DIKUNJUNGI])
            .then(select => {
                var data = select.length != 0 ? select[0] : [];
                data.push({ ...this.state.formData, detailCust: this.state.detailCust });
                SQLite.query('INSERT OR REPLACE INTO Collection (key, value) VALUES(?,?)', [DAFTAR_DIKUNJUNGI, data])
                    .then(insert => this.props.navigate('/Main/')).catch(err => log(err));
            }).catch(err => log(err));
    }
    _foto = (index) => this.cameraRef.current.start(index)
    _fotoResult = (data) => {
        log(`_fotoResult : ${JSON.stringify(data)}`);
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                gambar: prevState.formData.gambar.map((item, key) => data.index == key ? data.base64 : item)
            }
        }))
    }
    _hapusFoto(index) {
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                gambar: prevState.formData.gambar.map((item, key) => index == key ? '' : item),
            }
        }))
    }
    _clearBase64 = () => {
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                gambar: ['', '', '', ''],
            }
        }))
    }
    _getGeo = () => {
        Geolocation.currentLocation()
            .then(res => {
                if (res.longitude != 0 && res.latitude != 0) {
                    SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [GEOLOCATION, res])
                        .then(dbRes => this.props.setGeolocation(res))
                        .catch(err => log(err))
                }
            })
            .catch(err => {
                if (err != "") log('error : ' + JSON.stringify(err));
            })
    }

    _formatCurrency = (number) => { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(parseFloat(number)) }
    render() {
        var { detailCust, contactMode, contactPerson, placeContacted, callResult } = this.state;
        var [year, month, day] = this.state.detailCust.due_date.split('-');
        // var [year, month, day] = '12-10-2020'.split('-');
        var minDate = new Date();
        var maxDate = new Date();
        var dueDate = new Date(year, month - 1, day);
        var diff = Math.ceil(Math.abs(dueDate.getTime() - minDate.getTime()) / (1000 * 3600 * 24));
        var lastDay = new Date(minDate.getFullYear(), minDate.getMonth() + 1, 0);
        var limDayPtp = diff < 0 ? 0
            : diff < this.state.maxDayPtp ? diff
                : (lastDay.getDate() - minDate.getDate()) < this.state.maxDayPtp ? (lastDay.getDate() - minDate.getDate())
                    : this.state.maxDayPtp;
        maxDate.setDate(minDate.getDate() + limDayPtp);
        var optionPayment = [];
        var hiddenKey = ['option_payment_1', 'option_payment_2', 'option_payment_3', 'option_payment_4', 'option_payment_5', 'option_payment_6', 'option_payment_7', 'option_payment_8', 'option_payment_9'];
        for (const key in detailCust) {
            if (hiddenKey.includes(key)) optionPayment = [...optionPayment, { 'value': detailCust[key] }]
        }
        const customer = this.props.detailCust;
        const device = this.props.device;
        const profile = this.props.profile;
        const InputVisit = [
            {
                key: 'Customer Name',
                value: customer.name || '-',
            },
            {
                key: 'Loan No.',
                value: customer.card_type == "CC" ? detailCust.card_no : detailCust.account_number || '-',
            },
            {
                key: 'Product',
                value: customer.loan_type || '-',
            },
            {
                key: 'Billing',
                value: customer.bill_amount || '-',
            },
            {
                key: 'DPD',
                value: customer.day_past_due || '-',
            },
            {
                key: 'Device Name',
                value: device.model || '-',
            },
            {
                key: 'Agent Name',
                value: profile.full_name || '-',
            },
        ];
        let phoneNumberType = [
            {
                value: 'Home Phone',
                description: 'Home Phone',
            },
            {
                value: 'HandPhone',
                description: 'HandPhone',
            },
            {
                value: 'Office Phone',
                description: 'Office Phone',
            },
            {
                value: 'Other',
                description: 'Other',
            },
        ];
        return (
            <Page noToolbar noNavbar style={{ paddingBottom: 60 }} name="AddKunjungan">
                <DefaultNavbar title={Strings.title} network={Connection()} backLink />
                <Camera
                    ref={this.cameraRef}
                    onResult={data => this._fotoResult(data)}
                    onError={err => alert(err)}
                />
                <Block style={{ margin: 0, padding: 5 }}>
                    <Col style={{ backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>INPUT VISIT</Col>
                    {
                        InputVisit.map((item, key) => (
                            <Row key={key} noGap style={{ marginTop: 5, marginBottom: 5 }}>
                                <Col width="30" style={{ height: '100% style={{marginTop : 5, marginBottom : 5}}', marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>{item.key}</Col>
                                <Col width="65" style={{ height: '100%', marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>{item.value}</Col>
                            </Row>
                        ))
                    }
                </Block>
                <CustomBlockTitle title={Strings.kunjunganTitle} />
                <List>
                    <ListInput
                        outline
                        type="select"
                        defaultValue=""
                        onChange={({ target }) => {
                            this.setState(prevState => ({
                                formData: {
                                    ...prevState.formData,
                                    call_result: target.value
                                }
                            }))
                        }}
                    >
                        <option value="" disabled>--{Strings.optionPlacholder}--</option>
                        {callResult.map((item, key) => (
                            <option key={key} value={item.value} > {item.description} </option>
                        ))}
                    </ListInput>
                </List>
                <CustomBlockTitle title={Strings.tanggalPTPLabel} />
                <List>
                    <ListInput
                        outline
                        type="datepicker"
                        defaultValue=""
                        onCalendarChange={(val) => {
                            // log("KALENDER", typeof (val[0]), JSON.stringify(val[0]).substr(1, 10))
                            // log("KALENDER", `${val.getFullYear()}-${val.getMonth+1 < 10 ? `0${val.getMonth()}` : val.getMonth()}-${val.getDate() < 10 ? `0${val.getDate()}` : val.getDate()}`)
                            this.setState(prevState => ({
                                formData: {
                                    ...prevState.formData,
                                    ptp_date: JSON.stringify(val[0]).substr(1, 10)
                                }
                            }))
                        }}
                        readonly
                        calendarParams={{ openIn: 'customModal', header: false, footer: true, dateFormat: 'yyyy-mm-dd', minDate: minDate, maxDate: maxDate }
                        }
                    />
                </List>
                <CustomBlockTitle title={Strings.ptpAmountLabel} />
                <List>
                    <ListInput
                        outline
                        disabled
                        type="text"
                        value={this._formatCurrency(this.state.formData.payment_option || this.state.detailCust.option_payment_9)}
                        info={`Min. ${this._formatCurrency(this.state.detailCust.option_payment_9)}`}
                        onBlur={(e) => {
                            log(e.target.value, this.state.detailCust.option_payment_9)
                            if (parseInt(e.target.value) < parseInt(this.state.detailCust.option_payment_9)) {
                                f7.dialog.alert("Payment Amount Kurang Dari Minimal Payment");
                                e.target.value = "";
                                return false;
                            }
                            this.setState(prevState => ({
                                formData: {
                                    ...prevState.formData,
                                    ptp_amount: e.target.value
                                }
                            }))
                        }}
                    />
                </List>
                <CustomBlockTitle title={Strings.paymentLabel} />
                <List>
                    <ListInput
                        outline
                        type="select"
                        defaultValue=""
                        onChange={({ target }) => {
                            this.setState(prevState => ({
                                formData: {
                                    ...prevState.formData,
                                    payment_option: target.value
                                }
                            }))
                        }}
                    >
                        <option value="" disabled>--{Strings.optionPlacholder}--</option>
                        {optionPayment.map((item, key) => (
                            <option key={key} value={item.value} > {this._formatCurrency(item.value)} </option>
                        ))}
                    </ListInput>
                </List>
                <CustomBlockTitle title={Strings.metodeKontakLabel} />
                <List>
                    <ListInput
                        outline
                        type="select"
                        defaultValue=""
                        onChange={({ target }) => {
                            this.setState(prevState => ({
                                formData: {
                                    ...prevState.formData,
                                    contact_mode: target.value
                                }
                            }))
                        }}
                    >
                        <option value="" disabled>--{Strings.optionPlacholder}--</option>
                        {contactMode.map((item, key) => (
                            <option key={key} value={item.value} > {item.description} </option>
                        ))}
                    </ListInput>
                </List>
                <CustomBlockTitle title={Strings.detailMetodeKontakLabel} />
                <List>
                    <ListInput
                        outline
                        type="select"
                        defaultValue=""
                        onChange={({ target }) => {
                            this.setState(prevState => ({
                                formData: {
                                    ...prevState.formData,
                                    contact_person: target.value
                                }
                            }))
                        }}
                    >
                        <option value="" disabled>--{Strings.optionPlacholder}--</option>
                        {contactPerson.map((item, key) => (
                            <option key={key} value={item.value} > {item.description} </option>
                        ))}
                    </ListInput>
                </List>
                <CustomBlockTitle title={Strings.tempatKunjunganLabel} />
                <List>
                    <ListInput
                        outline
                        type="select"
                        defaultValue=""
                        onChange={({ target }) => {
                            this.setState(prevState => ({
                                formData: {
                                    ...prevState.formData,
                                    place_contacted: target.value
                                }
                            }))
                        }}
                    >
                        <option value="" disabled>--{Strings.optionPlacholder}--</option>
                        {placeContacted.map((item, key) => (
                            <option key={key} value={item.value} > {item.description} </option>
                        ))}
                    </ListInput>
                </List>
                <CustomBlockTitle title={Strings.hasilKunjunganLabel} />
                <List>
                    <ListInput
                        outline
                        type="textarea"
                        onChange={({ target }) => {
                            this.setState(prevState => ({
                                formData: {
                                    ...prevState.formData,
                                    notepad: target.value
                                }
                            }))
                        }}
                    />
                </List>
                <CustomBlockTitle noGap title={Strings.fotoLabel} />
                <Block>
                    <Row>
                        {this.state.formData.gambar.map((item, index) => (
                            <Col width="25" key={index}>
                                {item == "" ? (
                                    <Button fill raised onClick={() => this._foto(index)} style={{ backgroundColor: '#c0392b', fontSize: 12 }}><Icon f7="camera_fill"></Icon></Button>
                                ) :
                                    (
                                        <>
                                            <img onClick={() => this._foto(index)} src={item} style={{ width: '100%', marginBottom: 8 }} />
                                            <Button fill raised onClick={() => this._hapusFoto(index)} style={{ backgroundColor: '#c0392b', fontSize: 12 }}><Icon f7="trash_fill"></Icon></Button>
                                        </>
                                    )
                                }

                            </Col>
                        ))}
                    </Row>
                </Block>
                {/* <div
                    style={{
                        width: '87%',
                        height: 30,
                        marginLeft: '5%',
                        marginRight: '5%',
                        backgroundColor: '#FFFF66',
                        borderRadius: 5,
                        paddingLeft: 10,
                        paddingTop: 6
                    }}
                    onClick={(e) => this._getGeo()}
                >Press this to take location</div> */}
                <CustomBlockTitle title={Strings.provLabel} />
                <List>
                    <ListInput
                        outline
                        type="select"
                        defaultValue=""
                        onChange={({ target }) => {
                            log(target.value)
                            log(typeof target.value)
                            log(JSON.stringify(target.value))
                            this.setState(prevState => ({
                                formData: {
                                    ...prevState.formData,
                                    province: target.value,
                                    regency: "",
                                    district: "",
                                    subDistrict: "",
                                }
                            }))
                        }}
                    >
                        <option value="">{Strings.optionPlacholder}</option>
                        {this.props.province.map((item, key) => {
                            return <option key={key} value={item.code} > {item.description} </option>
                        })}
                    </ListInput>
                </List>
                <CustomBlockTitle title={Strings.kabLabel} />
                <List>
                    <ListInput
                        outline
                        type="select"
                        defaultValue={this.state.formData.regency || ''}
                        onChange={({ target }) => {
                            this.setState(prevState => ({
                                formData: {
                                    ...prevState.formData,
                                    regency: target.value,
                                    district: "",
                                    subDistrict: "",
                                }
                            }))
                        }}
                    >
                        <option value="">--{Strings.optionPlacholder}--</option>
                        {
                            this.state.formData.province != "" ?
                                (
                                    this.props.regency
                                        .filter(item => { return item.parent_code == this.state.formData.province })
                                        .map((item, key) => {
                                            return <option key={key} value={item.code} > {item.description} </option>
                                        })
                                ) : (<></>)
                        }
                    </ListInput>
                </List>
                <CustomBlockTitle title={Strings.kecLabel} />
                <List>
                    <ListInput
                        outline
                        type="select"
                        defaultValue=""
                        onChange={({ target }) => {
                            this.setState(prevState => ({
                                formData: {
                                    ...prevState.formData,
                                    district: target.value,
                                    subDistrict: "",
                                }
                            }))
                        }}
                    >
                        <option value="">--{Strings.optionPlacholder}--</option>
                        {
                            this.state.formData.regency != "" ?
                                (
                                    this.props.district
                                        .filter(item => { return item.parent_code == this.state.formData.regency })
                                        .map((item, key) => {
                                            return <option key={key} value={item.code} > {item.description} </option>
                                        })
                                ) : (<></>)
                        }
                    </ListInput>
                </List>
                <CustomBlockTitle title={Strings.kelLabel} />
                <List>
                    <ListInput
                        outline
                        type="select"
                        defaultValue=""
                        onChange={({ target }) => {
                            this.setState(prevState => ({
                                formData: {
                                    ...prevState.formData,
                                    subDistrict: target.value
                                }
                            }))
                        }}
                    >
                        <option value="">--{Strings.optionPlacholder}--</option>
                        {
                            this.state.formData.district != "" ?
                                (
                                    this.props.subDistrict
                                        .filter(item => { return item.parent_code == this.state.formData.district })
                                        .map((item, key) => {
                                            return <option key={key} value={item.code} > {item.description} </option>
                                        })
                                ) : (<></>)
                        }
                    </ListInput>
                </List>
                <CustomBlockTitle title={Strings.addLabel} />
                <List>
                    <ListInput
                        outline
                        type="textarea"
                        onChange={({ target }) => {
                            this.setState(prevState => ({
                                formData: {
                                    ...prevState.formData,
                                    alamat: target.value
                                }
                            }))
                        }}
                    />
                </List>
                <CustomBlockTitle title={Strings.phone1TypeLabel} />
                <List>
                    <ListInput
                        outline
                        type="select"
                        defaultValue=""
                        onChange={({ target }) => {
                            this.setState(prevState => ({
                                formData: {
                                    ...prevState.formData,
                                    phone_number_1_type: target.value
                                }
                            }))
                        }}
                    >
                        <option value="" disabled>--{Strings.optionPlacholder}--</option>
                        {phoneNumberType.map((item, key) => (
                            <option key={key} value={item.value} > {item.description} </option>
                        ))}
                    </ListInput>
                </List>
                <CustomBlockTitle title={Strings.phone1Label} />
                <List>
                    <ListInput
                        outline
                        type="number"
                        disabled={this.state.formData.phone_number_1_type == ''}
                        onChange={({ target }) => {
                            this.setState(prevState => ({
                                formData: {
                                    ...prevState.formData,
                                    phone_number_1: target.value
                                }
                            }))
                        }}
                    />
                </List>
                <CustomBlockTitle title={Strings.phone2TypeLabel} />
                <List>
                    <ListInput
                        outline
                        type="select"
                        defaultValue=""
                        onChange={({ target }) => {
                            this.setState(prevState => ({
                                formData: {
                                    ...prevState.formData,
                                    phone_number_2_type: target.value
                                }
                            }))
                        }}
                    >
                        <option value="" disabled>--{Strings.optionPlacholder}--</option>
                        {phoneNumberType.map((item, key) => (
                            <option key={key} value={item.value} > {item.description} </option>
                        ))}
                    </ListInput>
                </List>
                <CustomBlockTitle title={Strings.phone2Label} />
                <List>
                    <ListInput
                        outline
                        type="number"
                        disabled={this.state.formData.phone_number_2_type == ''}
                        onChange={({ target }) => {
                            this.setState(prevState => ({
                                formData: {
                                    ...prevState.formData,
                                    phone_number_2: target.value
                                }
                            }))
                        }}
                    />
                </List>
                {Connection() != "OFFLINE" ? (
                    <>
                        <CustomBlockTitle noGap title={Strings.lokasiLabel} />
                        <Block>
                            <Row>
                                <Col width="100">
                                    <Maps />
                                </Col>
                            </Row>
                        </Block>
                    </>
                ) : null}
                <Block style={{ margin: 0, backgroundColor: '#666666', height: 80 }}>
                    <Row style={{ paddingTop: 5 }}>
                        <Col width="50">
                            {
                                this.state.sendState &&
                                (
                                    <Button fill round raised style={{ backgroundColor: '#0085FC', fontSize: 12 }}>{Strings.kirim}</Button>
                                ) || (
                                    <Button fill round raised onClick={() => this._kirim()} style={{ backgroundColor: '#0085FC', fontSize: 12 }}>{Strings.kirim}</Button>
                                )
                            }
                        </Col>
                        <Col width="50">
                            {
                                this.state.sendState &&
                                (
                                    <Button fill round raised style={{ backgroundColor: '#FF6666', fontSize: 12 }}>{Strings.batal}</Button>
                                ) || (
                                    <Button fill round raised onClick={() => this.props.back()} style={{ backgroundColor: '#FF6666', fontSize: 12 }}>{Strings.batal}</Button>
                                )
                            }
                        </Col>
                    </Row>
                </Block>
            </Page>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user.profile,
        geolocation: state.main.geolocation,
        detailCust: state.user.detailCust,
        contactMode: state.reference.contactMode,
        contactPerson: state.reference.contactPerson,
        placeContacted: state.reference.placeContacted,
        callResult: state.reference.callResult,
        device: state.main.device,
        profile: state.user.profile,
        province: state.region.province,
        regency: state.region.regency,
        district: state.region.district,
        subDistrict: state.region.subDistrict,
        bahasa: state.main.bahasa,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (nav) => dispatch(navigate(nav)),
        back: () => dispatch(back()),
        setDetailCustomer: (detailCust) => dispatch(setDetailCustomer(detailCust)),
        setGeolocation: (data) => dispatch(setGeolocation(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddKunjungan);