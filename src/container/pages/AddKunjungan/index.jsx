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
            detailCust: this.props.detailCust,
            contactMode: this.props.contactMode,
            contactPerson: this.props.contactPerson,
            placeContacted: this.props.placeContacted,
            callResult: this.props.callResult,
            formData: {
                card_no: this.props.detailCust.card_no,
                name: this.props.detailCust.name,
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
                gambar: [
                    // 'data:image/jpeg;base64,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', 
                    '',
                    '',
                    '',
                    ''
                ],
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
                <CustomerInfo />
                {/* <List noHairlinesMd style={{ fontSize: 1 }}>
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
                </List> */}
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
                                            ptp_amount: e.target.value
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