import React, { Component } from 'react';
import {
    Page,
    Navbar,
    List,
    ListInput,
    Block,
    Row,
    Col,
    Button,
    BlockTitle
} from 'framework7-react';

import { connect } from 'react-redux';
import { navigate } from '../../../config/redux/actions/routerActions';
import { DefaultNavbar, CustomBlockTitle } from '../../../components/atoms'
import { Connection, log } from '../../../utils'

class AddKunjungan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detailCust: this.props.detailCust,
            gambar :['', '', '', ''],
        }
    }
    _kirim() {
        this.props.navigate('/Main/');
    }
    _foto(index) {
        log("foto")
    }

    render() {
        var {detailCust} = this.state;
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
                    >
                        <option value="" disabled>--pilih--</option>
                        <option value="">-----</option>
                    </ListInput>
                </List>
                <CustomBlockTitle title="Detail Metode Kontak" />
                <List>
                    <ListInput
                        outline
                        type="select"
                        defaultValue=""
                    >
                        <option value="" disabled>--pilih--</option>
                        <option value="">-----</option>
                    </ListInput>
                </List>
                <CustomBlockTitle title="Tempat Kunjungan" />
                <List>
                    <ListInput
                        outline
                        type="select"
                        defaultValue=""
                    >
                        <option value="" disabled>--pilih--</option>
                        <option value="">-----</option>
                    </ListInput>
                </List>
                <CustomBlockTitle title="Hasil Kunjungan" />
                <List>
                    <ListInput
                        outline
                        type="select"
                        defaultValue=""
                    >
                        <option value="" disabled>--pilih--</option>
                        <option value="">-----</option>
                    </ListInput>
                </List>
                <CustomBlockTitle title="Detail Hasil Kunjungan (Remarks)" />
                <List>
                    <ListInput
                        outline
                        type="textarea"
                    />
                </List>
                <CustomBlockTitle noGap title="Foto Dokumendasi" />
                <Block>
                    <Row>
                        {this.state.gambar.map((item, index) => (                            
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
        user: state.main.user,
        detailCust: state.user.detailCust,
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