import React, { Component } from 'react';
import {
    Page,
    f7,
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
import { log, Connection, POST, SQLite, SQLiteTypes } from '../../../utils/';
var {REKAP_TERKIRIM, REKAP_TERTUNDA} = SQLiteTypes;

class UpdateDebitur extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            region: this.props.region,
            detailCust : this.props.detailCust,
            tipeAlamat: [
                { code: 'ALAMAT_RUMAH', description: 'ALAMAT RUMAH' },
                { code: 'ALAMAT_KANTOR', description: 'ALAMAT KANTOR' },
                { code: 'ALAMAT_EMERGENCY', description: 'ALAMAT EMERGENCY' },
            ],
            province: this.props.region.province,
            regency: [],
            district: [],
            subDistrict: [],
            formData : {
                tipeAlamat : '',
                provinsi : '',
                kokab : '',
                kecamatan : '',
                kelurahan : '',
                zipCode : '',
                noTelp : ''
            },
            
        }
        log(this.props.user)
    }
    _kirim() {
        var { formData } = this.state;
        log("formData", formData)
        var mandatoryField = ['tipeAlamat','provinsi','kokab','kecamatan','kelurahan','zipCode','noTelp'];
        for (var item in formData) {
            if (mandatoryField.includes(item)) {
                if (formData[item].toString() == "") {
                    f7.dialog.alert("Harap Isi Semua Input.");
                    return false;
                }
            }
        }
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
        var day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        var hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
        var minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
        var dateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        var updateData = {
            'account_number': this.state.detailCust.account_number,
            'home_address_1': '',
            'home_city': '',
            'home_post_code': '',
            'home_phone': '',
            'office_address_1': '',
            'office_city': '',
            'office_post_code': '',
            'office_phone': '',
            'refferal_address_1': '',
            'refferal_city': '',
            'refferal_post_code': '',
            'refferal_home_phone': '',
            'update_time': dateTime,
            'updated_by': this.state.user.user_id,
            'transaction_type': 'UPDATE_DATA'
        }
        switch(formData.tipeAlamat){
            case 'ALAMAT_RUMAH':
                updateData = {...updateData, 
                    home_address_1: `${formData.provinsi}, ${formData.kokab}, KECAMATAN ${formData.kecamatan}, KELURAHAN ${formData.kelurahan}, ${formData.zipCode}`,
                    home_city: formData.kokab,
                    home_post_code: formData.zipCode,
                    home_phone: formData.noTelp
                }
            break;
            case 'ALAMAT_KANTOR':
                updateData = {...updateData,
                    office_address_1: `${formData.provinsi}, ${formData.kokab}, KECAMATAN ${formData.kecamatan}, KELURAHAN ${formData.kelurahan}, ${formData.zipCode}`,
                    office_city: formData.kokab,
                    office_post_code: formData.zipCode,
                    office_phone: formData.noTelp
                }
            break;
            case 'ALAMAT_EMERGENCY':
                updateData = {...updateData,
                    refferal_address_1: `${formData.provinsi}, ${formData.kokab}, KECAMATAN ${formData.kecamatan}, KELURAHAN ${formData.kelurahan}, ${formData.zipCode}`,
                    refferal_city: formData.kokab,
                    refferal_post_code: formData.zipCode,
                    refferal_home_phone: formData.noTelp
                }
            break;
        }
        if (Connection() != "OFFLINE") {
            POST('save_update_data', updateData)
                .then(res => res.status != 'success' ? this._saveRekapData(updateData, false) : this._saveRekapData(updateData)
                ).catch(err => log(err));
        } else {
            this._saveRekapData(updateData, false);
        }
    }    
    _saveRekapData(updateData, kirim = true) {
        SQLite.query('SELECT value from Collection where key=?', [kirim ? REKAP_TERKIRIM : REKAP_TERTUNDA])
            .then(select => {
                SQLite.query('INSERT OR REPLACE INTO Collection (key, value) VALUES(?,?)', [kirim ? REKAP_TERKIRIM : REKAP_TERTUNDA, [...(select.length != 0 ? select[0] : []), updateData]])
                    .then(insert => this.props.navigate('/Main/')).catch(err => log(err));
            }).catch(err => log(err));
    }
    _dropdownRegion(level, value){
        var {regency, district, subDistrict} = this.state.region;
        switch(level){
            case 0:
                this.setState(prevState => ({
                    regency: regency.filter((obj) => obj.parent_code == value),
                    district: [],
                    subDistrict: [],
                    formData: {
                        ...prevState.formData,
                        kokab: "",
                        kecamatan: "",
                        kelurahan: "",
                        zipCode: ""
                    }
                }))
            break;
            case 1:                
                this.setState(prevState => ({
                    district: district.filter((obj) => obj.parent_code == value),
                    subDistrict: [],
                    formData: {
                        ...prevState.formData,
                        kecamatan: "",
                        kelurahan: "",
                        zipCode: ""
                    }
                }))
            break;
            case 2:             
                this.setState(prevState => ({
                    subDistrict: subDistrict.filter((obj) => obj.parent_code == value),
                    formData: {
                        ...prevState.formData,
                        kelurahan: "",
                        zipCode: ""
                    }
                }))
            break;
            case 3:
                this.setState(prevState => ({
                    formData: {
                        ...prevState.formData,
                        zipCode: subDistrict.filter((obj) => obj.code == value)[0].post_code
                    }
                }))
            break;
        }
    }
    render() {
        var {detailCust, tipeAlamat, province, regency, district, subDistrict} = this.state;
        return (
            <Page noToolbar noNavbar style={{ paddingBottom: 60 }} name="UpdateDebitur">
                <DefaultNavbar title="UPDATE DATA" network={Connection()} backLink/>
                <CustomBlockTitle center title="INFO DEBITUR" />
                <List noHairlinesMd style={{ fontSize: 1 }}>
                    <ListInput
                        outline
                        label="Nomor Kartu"
                        type="text"
                        disabled={true}
                        value={detailCust.card_no}
                    >
                    </ListInput>
                    <ListInput
                        outline
                        label="Nama"
                        type="text"
                        disabled={true}
                        value={detailCust.name}
                    >
                    </ListInput>
                    <ListInput
                        outline
                        label="Alamat"
                        type="text"
                        disabled={true}
                        value={detailCust.home_address_1}
                    >
                    </ListInput>
                </List>
                <List>
                    <ListInput
                        outline
                        label="Type Alamat"
                        type="select"
                        defaultValue=""
                        onChange={({ target }) => {
                            this.setState(prevState => ({
                                formData: {
                                    ...prevState.formData,
                                    tipeAlamat: target.value
                                }
                            }))
                        }}
                    >
                        <option value="" disabled>--pilih--</option>
                        {tipeAlamat.map((item, key) => (
                            <option key={key} value={item.code} > {item.description} </option>
                        ))}
                    </ListInput>   
                    
                    <ListInput
                        outline
                        label="Provinsi"
                        type="select"
                        defaultValue=""
                        onChange={({target}) => {
                            this.setState(prevState => ({
                                formData: {
                                    ...prevState.formData,
                                    provinsi: target.options[target.selectedIndex].text
                                }
                            }))
                            this._dropdownRegion(0, target.value);
                        }}
                    >
                        <option value="" disabled>--pilih--</option>
                        {province.map((item, key) => (
                            <option key={key} value={item.code} > {item.description} </option>
                        ))}
                    </ListInput>  
                    <ListInput
                        outline
                        label="Kota/Kabupaten"
                        type="select"
                        defaultValue=""
                        onChange={({ target }) => {
                            this.setState(prevState => ({
                                formData: {
                                    ...prevState.formData,
                                    kokab: target.options[target.selectedIndex].text
                                }
                            }))
                            this._dropdownRegion(1, target.value);
                        }}
                    >
                        <option value="" disabled>--pilih--</option>
                        {regency.map((item, key) => (
                            <option key={key} value={item.code} > {item.description} </option>
                        ))}
                    </ListInput>  
                    <ListInput
                        outline
                        label="Kecamatan"
                        type="select"
                        defaultValue=""
                        onChange={({ target }) => {
                            this.setState(prevState => ({
                                formData: {
                                    ...prevState.formData,
                                    kecamatan: target.options[target.selectedIndex].text
                                }
                            }))
                            this._dropdownRegion(2, target.value);
                        }}
                    >
                        <option value="" disabled>--pilih--</option>
                        {district.map((item, key) => (
                            <option key={key} value={item.code} > {item.description} </option>
                        ))}
                    </ListInput> 
                    <ListInput
                        outline
                        label="Kelurahan"
                        type="select"
                        defaultValue=""
                        onChange={({ target }) => {
                            this.setState(prevState => ({
                                formData: {
                                    ...prevState.formData,
                                    kelurahan: target.options[target.selectedIndex].text
                                }
                            }))
                            this._dropdownRegion(3, target.value);
                        }}
                    >
                        <option value="" disabled>--pilih--</option>
                        {subDistrict.map((item, key) => (
                            <option key={key} value={item.code} > {item.description} </option>
                        ))}
                    </ListInput>   
                    {/* <ListInput
                        outline
                        label="Provinsi"
                        type="text"
                        onChange={({ target }) => {this.setState({provinsi : target.value})}}
                    /> 
                    <ListInput
                        outline
                        label="Kota/Kabupaten"
                        type="text"
                        onChange={({ target }) => {this.setState({kokab : target.value})}}
                    />                    
                    <ListInput
                        outline
                        label="Kecamatan"
                        type="text"
                        onChange={({ target }) => {this.setState({kecamatan : target.value})}}
                    />                    
                    <ListInput
                        outline
                        label="Kelurahan"
                        type="text"
                        onChange={({ target }) => {this.setState({kelurahan : target.value})}}
                    />                     */}
                    <ListInput
                        outline
                        label="ZIP Code"
                        type="text"
                        value={this.state.formData.zipCode}
                        onChange={({target}) => {
                            this.setState(prevState => ({
                                formData: {
                                    ...prevState.formData,
                                    zipCode: target.value
                                }
                            }))}
                        }
                    />                    
                    <ListInput
                        outline
                        label="No. Telephone"
                        type="tel"
                        onChange={({ target }) => {
                            this.setState(prevState => ({
                                formData: {
                                    ...prevState.formData,
                                    noTelp: target.value
                                }
                            }))}
                        }
                    />                    
                </List>
                <List>
                    <Block strong>
                        <Row>
                            <Col width="100">
                                <Button fill raised onClick={() => this._kirim()} style={{ backgroundColor: '#c0392b', fontSize: 12 }}>KIRIM</Button>
                            </Col>
                        </Row>
                    </Block>
                </List>
            </Page>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user.profile,
        detailCust: state.user.detailCust,
        region: state.region,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        //onUpdateUser: (data) => dispatch(updateUser(data)),
        //onLogin: () => dispatch(login()),
        navigate: (nav) => dispatch(navigate(nav)),
        setDetailCustomer: (detailCust) => dispatch(setDetailCustomer(detailCust))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateDebitur);