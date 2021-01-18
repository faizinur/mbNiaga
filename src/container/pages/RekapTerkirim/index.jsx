import React, { Component } from 'react';
import{
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
//import { log } from '../../../utils/consoles';

class RekapTerkirim extends React.Component {
    constructor(props){
        super(props);
      }
  
    render() {
    return (
        <Page noToolbar noNavbar>   
        <BlockTitle>Rekap Terkirim</BlockTitle>
        <List noHairlinesMd style={{fontSize:1}}>
        <ListInput
            outline
            label="Nomor Kartu"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="Nama"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="Metode Kontak"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="Kontak"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="Tempat Kunjungan"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="Hasil Kunjungan"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="Detail Hasil Kunjungan"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="Waktu Visit"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="Petugas"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="Tanggal PTP"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="Jumlah PTP"
            type="text"
        >
        </ListInput>
        </List>

        <List>
        <Block strong>
          <Row>
            <Col width="100">
              <Button fill raised onClick={() => this._next()} style={{backgroundColor: '#c0392b', fontSize:12}}>Next</Button>
            </Col>
          </Row>
        </Block>
        </List>
        </Page>                
    );
  }
     _next() {
        this.props.navigate('/UpdatePin/');
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.main.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        //onUpdateUser: (data) => dispatch(updateUser(data)),
        //onLogin: () => dispatch(login()),
        navigate: (nav) => dispatch(navigate(nav))
    };
};

export default connect(null, mapDispatchToProps)(RekapTerkirim);