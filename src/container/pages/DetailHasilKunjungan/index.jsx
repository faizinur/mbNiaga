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

class DetailHasilKunjungan extends React.Component {
    constructor(props){
        super(props);
      }
  
    render() {
    return (
        <Page noToolbar noNavbar>   
        <BlockTitle>General Information</BlockTitle>
        <List noHairlinesMd style={{fontSize:1}}>
        <ListInput
            outline
            label="Customer ID"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="Nama Debitur"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="Alamat"
            type="textarea"
        >
        </ListInput>
        </List>

        <BlockTitle>Info Kontak</BlockTitle>
        <List>
        <ListInput
            outline
            label="Agreement No."
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="Deskripsi"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="Monthly Payment"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="Min. Payment"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="Last Payment Date"
            type="text"
        >
        </ListInput>
        </List>

        <List>
        <ListInput
            outline
            label="M1"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="M2"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="M3"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="M4"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="M5"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="M6"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="M7"
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
        this.props.navigate('/MonitoringDebitur/');
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

export default connect(null, mapDispatchToProps)(DetailHasilKunjungan);