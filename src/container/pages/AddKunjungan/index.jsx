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
import { Connection, log, SQLite, SQLiteTypes, Filter, Camera, POST } from '../../../utils';
const { REKAP_TERTUNDA, REKAP_TERKIRIM, DAFTAR_DIKUNJUNGI } = SQLiteTypes;

class AddKunjungan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ptp: 'PTP',
            maxDayPtp: 3,
            online: true,
            detailCust: this.props.detailCust,
            contactMode: this.props.contactMode,
            contactPerson: this.props.contactPerson,
            placeContacted: this.props.placeContacted,
            callResult: this.props.callResult,
            formData: {
                account_number: this.props.detailCust.account_number,
                overdue_days: '',//GATAU DARIMANA
                phone_number: this.props.detailCust.handphone,
                dial_result: 'MT1',
                call_result: '',
                contact_person: '',
                notepad: '',
                user_id: this.props.user.user_id,
                contact_mode: '',
                place_contacted: '',
                gambar: ['', '', '', ''],
                longitude: this.props.geolocation.longitude,
                latitude: this.props.geolocation.latitude,
                created_time: this.props.user.mobileTime,
                ptp_date: '',
                ptp_amount: '',
                transaction_type: 'KUNJUNGAN'
            }
        }
    }
    _kirim() {
        var { formData, ptp } = this.state;
        var mandatoryField = ['contact_mode', 'contact_person', 'place_contacted', 'call_result', 'notepad', 'gambar'];
        if (formData.call_result == ptp) mandatoryField = [...mandatoryField, 'ptp_date', 'ptp_amount'];
        for (var item in formData) {
            if (mandatoryField.includes(item)) {
                if (typeof (formData[item]) == 'string') {
                    if (formData[item].toString() == "") {
                        f7.dialog.alert("Harap Isi Semua Input.");
                        return false;
                    }
                } else {
                    var gambar = formData[item].filter(item => item != '');
                    if (gambar.length == 0) {
                        f7.dialog.alert("Harap Isi Semua Input.");
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
                data.push(this.state.formData);
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
        return (
            <Page noToolbar noNavbar style={{ paddingBottom: 60 }}>
                <DefaultNavbar title="INPUT HASIL KUNJUNGAN" network={Connection()} />
                <List noHairlinesMd style={{ fontSize: 1 }}>
                    <ListInput
                        outline
                        label="Nomor Kartu"
                        type="text"
                        disabled={true}
                        value={detailCust.card_no}
                    />
                    <ListInput
                        outline
                        label="Nama"
                        type="text"
                        disabled={true}
                        value={detailCust.name}
                    />
                    <ListInput
                        outline
                        label="Alamat"
                        type="text"
                        disabled={true}
                        value={detailCust.home_address_1}
                    />
                </List>
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
                {this.state.formData.call_result == this.state.ptp ? (
                    <>
                        <CustomBlockTitle title="Tanggal PTP" />
                        <List>
                            <ListInput
                                outline
                                type="datepicker"
                                defaultValue=""
                                onChange={({ target }) => {
                                    this.setState(prevState => ({
                                        formData: {
                                            ...prevState.formData,
                                            ptp_date: target.value
                                        }
                                    }))
                                }}
                                readonly
                                calendarParams={{ openIn: 'customModal', header: false, footer: true, dateFormat: 'yyyy-mm-dd', minDate: minDate, maxDate: maxDate }
                                }
                            />
                        </List>
                        <CustomBlockTitle title="PTP Amount" />
                        <List>
                            <ListInput
                                outline
                                type="number"
                                defaultValue=""
                                info={`Min. ${this.state.detailCust.option_payment_9}`}
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
                                            ptp_date: e.target.value
                                        }
                                    }))
                                }}
                        />
                    </List>
                    </>
                ) : null}
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