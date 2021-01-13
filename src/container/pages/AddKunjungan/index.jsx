import React, { Component } from 'react';
import{
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
//import { log } from '../../../utils/consoles';

class AddKunjungan extends React.Component {
    constructor(props){
        super(props);
      }
  
    render() {
    return (
        <Page noToolbar noNavbar>   
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
            label="Alamat"
            type="text"
        >
        </ListInput>
        </List>
        <List>
        <ListInput
            outline
            label="Metode Kontak"
            type="select"
            defaultValue=""
        >
            <option value="" disabled>--pilih--</option>
            <option value="">-----</option>
        </ListInput>
        <ListInput
            outline
            label="Detail Metode Kontak"
            type="select"
            defaultValue=""
        >
            <option value="" disabled>--pilih--</option>
            <option value="">-----</option>
        </ListInput>
        <ListInput
            outline
            label="Tempat Kunjungan"
            type="select"
            defaultValue=""
        >
            <option value="" disabled>--pilih--</option>
            <option value="">-----</option>
        </ListInput>
        <ListInput
            outline
            label="Hasil Kunjungan"
            type="select"
            defaultValue=""
        >
            <option value="" disabled>--pilih--</option>
            <option value="">-----</option>
        </ListInput>
        <ListInput
            outline
            label="Detail Hasil Kunjungan (Remarks)"
            type="textarea"
        >
        </ListInput>
        </List>
        <BlockTitle>Foto Dokumendasi</BlockTitle>
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
        this.props.navigate('/UpdateDebitur/');
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
        navigate: (fs) => dispatch(navigate(fs))
    };
};

export default connect(null, mapDispatchToProps)(AddKunjungan);