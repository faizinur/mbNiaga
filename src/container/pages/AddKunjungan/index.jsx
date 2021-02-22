import React, { Component } from 'react';
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
import { navigate } from '../../../config/redux/actions/routerActions';
import { DefaultNavbar, CustomBlockTitle, Maps } from '../../../components/atoms';
import { CustomerInfo } from '../../../components/molecules/';
import { Connection, log, SQLite, SQLiteTypes, Filter, Camera, POST } from '../../../utils';
const { REKAP_TERTUNDA, REKAP_TERKIRIM, DAFTAR_DIKUNJUNGI } = SQLiteTypes;

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
                    '',
                    '',
                    '',
                    ''
                ],
                longitude: props.geolocation.longitude,
                latitude: props.geolocation.latitude,
                created_time: props.user.mobileTime,
                ptp_date: '',
                ptp_amount: '',
                transaction_type: 'KUNJUNGAN'
            }
        }
    }
    _kirim() {
        f7.dialog.confirm('Apakah anda akan menyimpan hasil kunjungan ?.',
            () => {
                var { formData, ptp } = this.state;
                log(formData)
                var mandatoryField = ['contact_mode', 'contact_person', 'place_contacted', 'call_result', 'notepad', 'gambar'];
                if (formData.call_result == ptp) mandatoryField = [...mandatoryField, 'ptp_date', 'ptp_amount'];
                for (var item in formData) {
                    if (mandatoryField.includes(item)) {
                        if (typeof (formData[item]) == 'string') {
                            if (formData[item].toString() == "") {
                                f7.dialog.alert("Harap Isi Semua Input. 0");
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
                    POST('save_visit_history', formData)
                        .then(res => res.status != 'success' ? this._saveRekapTertunda() : this._saveRekapTerkirim()
                        ).catch(err => log(err));
                } else {
                    this._saveRekapTertunda();
                }
            }
        );
    }
    _saveRekapTerkirim() {
        SQLite.query('SELECT value from Collection where key=?', [REKAP_TERKIRIM])
            .then(select => {
                var data = select.length != 0 ? select[0] : [];
                data.push(this.state.formData);
                SQLite.query('INSERT OR REPLACE INTO Collection (key, value) VALUES(?,?)', [REKAP_TERKIRIM, data])
                    .then(insert => this._saveDaftarDikunjungi()).catch(err => log(err));
            }).catch(err => log(err));
    }
    _saveRekapTertunda() {
        SQLite.query('SELECT value from Collection where key=?', [REKAP_TERTUNDA])
            .then(select => {
                var data = select.length != 0 ? select[0] : [];
                data.push(this.state.formData);
                SQLite.query('INSERT OR REPLACE INTO Collection (key, value) VALUES(?,?)', [REKAP_TERTUNDA, data])
                    .then(insert => this._saveDaftarDikunjungi()).catch(err => log(err));
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
    _foto(index) {
        Camera.start().then(res => {
            this.setState(prevState => ({
                formData: {
                    ...prevState.formData,
                    gambar: prevState.formData.gambar.map((item, key) => index == key ? res : item)
                }
            }))
        }
        ).catch(err => {
            if (err != "") f7.dialog.alert("Error: " + err);
        });
    }
    _hapusFoto(index) {
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                gambar: prevState.formData.gambar.map((item, key) => index == key ? "" : item)
            }
        }))
    }
    _formatCurrency = (number) => { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(parseFloat(number)) }
    render() {
        var { detailCust, contactMode, contactPerson, placeContacted, callResult } = this.state;
        var [year, month, day] = this.state.detailCust.due_date.split("-")
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
        return (
            <Page noToolbar noNavbar style={{ paddingBottom: 60 }} name="AddKunjungan">
                <DefaultNavbar title="INPUT HASIL KUNJUNGAN" network={Connection()} backLink/>
                <CustomerInfo />
                <CustomBlockTitle title="Metode Kontak" />
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
                        <option value="" disabled>--PILIH--</option>
                        {contactMode.map((item, key) => (
                            <option key={key} value={item.value} > {item.description} </option>
                        ))}
                    </ListInput>
                </List>
                <CustomBlockTitle title="Detail Metode Kontak" />
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
                        <option value="" disabled>--PILIH--</option>
                        {contactPerson.map((item, key) => (
                            <option key={key} value={item.value} > {item.description} </option>
                        ))}
                    </ListInput>
                </List>
                <CustomBlockTitle title="Tempat Kunjungan" />
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
                        <option value="" disabled>--PILIH--</option>
                        {placeContacted.map((item, key) => (
                            <option key={key} value={item.value} > {item.description} </option>
                        ))}
                    </ListInput>
                </List>
                <CustomBlockTitle title="Hasil Kunjungan" />
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
                        <option value="" disabled>--PILIH--</option>
                        {callResult.map((item, key) => (
                            <option key={key} value={item.value} > {item.description} </option>
                        ))}
                    </ListInput>
                </List>
                <CustomBlockTitle title="Detail Hasil Kunjungan (Remarks)" />
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
                {/* {this.state.formData.call_result == this.state.ptp && ( */}
                <>
                    <CustomBlockTitle title="Tanggal PTP" />
                    <List>
                        <ListInput
                            outline
                            type="datepicker"
                            defaultValue=""
                            onCalendarChange={(val) => {
                                log("KALENDER", typeof (val[0]), JSON.stringify(val[0]).substr(1, 10))
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
                    <CustomBlockTitle title='Payment Option' />
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
                            <option value="" disabled>--PILIH--</option>
                            {optionPayment.map((item, key) => (
                                <option key={key} value={item.value} > {this._formatCurrency(item.value)} </option>
                            ))}
                        </ListInput>
                    </List>
                    <CustomBlockTitle title="PTP Amount" />
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
                </>
                {/* )} */}
                <CustomBlockTitle noGap title="Foto Dokumendasi" />
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
                {Connection() != "OFFLINE" ? (
                    <>
                        <CustomBlockTitle noGap title="Lokasi" />
                        <Block>
                            <Row>
                                <Col width="100">
                                    <Maps />
                                </Col>
                            </Row>
                        </Block>
                    </>
                ) : null}

                <Block>
                    <Row>
                        <Col width="100">
                            <Button fill raised onClick={() => this._kirim()} style={{ backgroundColor: '#c0392b', fontSize: 12 }}>KIRIM</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddKunjungan);