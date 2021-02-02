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
    BlockTitle
} from 'framework7-react';

import { connect } from 'react-redux';
import { navigate } from '../../../config/redux/actions/routerActions';
import { DefaultNavbar, CustomBlockTitle } from '../../../components/atoms';
import { log, Connection } from '../../../utils/';

class UpdateDebitur extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detailCust : this.props.detailCust,
            tipeAlamat : '',
            provinsi : '',
            kokab : '',
            kecamatan : '',
            kelurahan : '',
            zipCode : '',
            noTelp : '',
        }
    }
    _kirim() {
        
        // this.props.navigate('/RekapTerkirim/');
        this.props.navigate('/DetailHasilKunjungan/');
    }
    render() {
        var {detailCust} = this.props;
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
                        onChange={({ target }) => {this.setState({tipeAlamat : target.value})}}
                    >
                        <option value="" disabled>--pilih--</option>
                        <option value="">-----</option>
                    </ListInput>   
                    <ListInput
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
                    />                    
                    <ListInput
                        outline
                        label="ZIP Code"
                        type="text"
                        onChange={({ target }) => {this.setState({zipCode : target.value})}}
                    />                    
                    <ListInput
                        outline
                        label="No. Telephone"
                        type="tel"
                        onChange={({ target }) => {this.setState({noTelp : target.value})}}
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