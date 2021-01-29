import React, { Component } from 'react';
import {
    Page,
    List,
    ListInput,
    Block,
    Row,
    Col,
    Button,
} from 'framework7-react';

import { connect } from 'react-redux';
import { navigate } from '../../../config/redux/actions/routerActions';
import { DefaultNavbar, CustomBlockTitle } from '../../../components/atoms';
import { Connection, log, SQLite, SQLiteTypes, Filter } from '../../../utils';
const { REKAP_TERTUNDA, RENCANA_KUNJUNGAN } = SQLiteTypes;

class AddKunjungan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detailCust: this.props.detailCust,
            contactMode : this.props.contactMode,
            contactPerson : this.props.contactPerson,
            placeContacted : this.props.placeContacted,
            callResult : this.props.callResult,
            formData : {
                account_number : this.props.detailCust.account_number,
                overdue_days : '',//GATAU DARIMANA
                phone_number : this.props.detailCust.handphone,
                dial_result : 'MT1',
                call_result : '',
                contact_person : '',
                notepad : '',
                user_id : this.props.user.user_id,
                contact_mode : '',
                place_contacted : '',
                gambar :['', '', '', ''],
                longitude : '',
                latitude : '',
            }
        }
    }
    _kirim() {
        SQLite.query('SELECT value from Collection where key=?', [REKAP_TERTUNDA])
        .then(select => {
            var data = select.length != 0 ? select[0] : []; 
            data.push(this.state.formData);
            SQLite.query('INSERT OR REPLACE INTO Collection (id, key, value) VALUES(?,?,?)', [REKAP_TERTUNDA, data])
            .then(insert => {
                SQLite.query('SELECT value from Collection where key=?', [RENCANA_KUNJUNGAN])
                .then(select => {
                    Filter.select(select, [{'column':'account_number', 'operator':'DOES_NOT_EQUAL', 'value':this.state.formData.account_number}])
                    .then((resFilter) => {
                        SQLite.query('INSERT OR REPLACE INTO Collection (id, key, value) VALUES(?,?,?)', [RENCANA_KUNJUNGAN, resFilter])
                        .then(replace => this.props.navigate('/Main/'))
                        .catch(err => log(err));
                    }).catch(err => log(err))
                }).catch(err => log(err))
            }).catch(err => log(err));
        }).catch(err => log(err));
    }
    _foto(index) {
        log("foto")
    }

    render() {
        var {detailCust, contactMode, contactPerson, placeContacted, callResult} = this.state;
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
                        onChange={({ target }) => {this.setState(prevState => ({
                            formData: {                 
                                ...prevState.formData,    
                                contact_mode: target.value       
                            }
                        }))}}
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
                        onChange={({ target }) => {this.setState(prevState => ({
                            formData: {                 
                                ...prevState.formData,    
                                contact_person: target.value       
                            }
                        }))}}
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
                        onChange={({ target }) => {this.setState(prevState => ({
                            formData: {                 
                                ...prevState.formData,    
                                place_contacted: target.value       
                            }
                        }))}}
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
                        onChange={({ target }) => {this.setState(prevState => ({
                            formData: {                 
                                ...prevState.formData,    
                                call_result: target.value       
                            }
                        }))}}
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
                        onChange={({ target }) => {this.setState(prevState => ({
                            formData: {                 
                                ...prevState.formData,    
                                notepad: target.value       
                            }
                        }))}}
                    />
                </List>
                <CustomBlockTitle noGap title="Foto Dokumendasi" />
                <Block>
                    <Row>
                        {this.state.formData.gambar.map((item, index) => (                            
                            <Col width="25" key={index}>
                                <Button fill raised onClick={() => this._foto(index)} style={{ backgroundColor: '#c0392b', fontSize: 12 }}>GAMBAR {index+1}</Button>
                                <img src={item} style={{width:'100%'}} />
                            </Col>
                        ))}
                    </Row>
                </Block>
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
        detailCust: state.user.detailCust,
        contactMode : state.reference.contactMode,
        contactPerson : state.reference.contactPerson,
        placeContacted : state.reference.placeContacted,
        callResult : state.reference.callResult,
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