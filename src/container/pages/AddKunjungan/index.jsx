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
        let dvc = (!Device.android && !Device.ios) ? false : true;
        if (!dvc) {
            let tmpGambarFormData = Object.assign({}, this.state.formData);
            tmpGambarFormData.gambar = [
                'data:image/png;base64,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',
                '',
                '',
                '',
            ]
            this.setState({ formData: tmpGambarFormData });
        }
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
                <DefaultNavbar title="INPUT HASIL KUNJUNGAN" network={Connection()} backLink />
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