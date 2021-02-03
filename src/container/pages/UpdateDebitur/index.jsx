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
                noTelp : '',
                transaction_type: 'UPDATE_DATA'
            },
            
        }
        log(this.props.region)
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
        // return;
        if (Connection() != "OFFLINE") {
            POST('save_update_data', formData)
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
                    .then(insert => this.props.navigate('/Main/')).catch(err => log(err));
            }).catch(err => log(err));
    }
    _saveRekapTertunda() {
        SQLite.query('SELECT value from Collection where key=?', [REKAP_TERTUNDA])
            .then(select => {
                var data = select.length != 0 ? select[0] : [];
                data.push(this.state.formData);
                SQLite.query('INSERT OR REPLACE INTO Collection (key, value) VALUES(?,?)', [REKAP_TERTUNDA, data])
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
            <Page noToolbar noNavbar style={{ paddingBottom: 60 }}>
                <DefaultNavbar title="UPDATE DATA" network={Connection()} />
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
                            <option key={key} value={item.value} > {item.description} </option>
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
        user: state.main.user,
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