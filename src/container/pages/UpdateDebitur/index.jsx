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

class UpdateDebitur extends React.Component {
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
        <BlockTitle>Type Alamat</BlockTitle>
        <List>
            <ListItem checkbox title="Books" name="demo-checkbox" defaultChecked />
            <ListItem checkbox title="Movies" name="demo-checkbox" />
            <ListItem checkbox title="Food" name="demo-checkbox" />
            <ListItem checkbox title="Drinks" name="demo-checkbox" />
        </List>
        <ListInput
            outline
            label="Provinsi"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="Kota/Kabupaten"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="Kecamatan"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="Kelurahan"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="ZIP Code"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="No. Telephone"
            label="ZIP Code"
            type="tel"
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
        this.props.navigate('/RekapTerkirim/');
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

export default connect(null, mapDispatchToProps)(UpdateDebitur);