import React, { Component } from 'react';
import{
    Page,
    Navbar,
    List,
    ListItem,
    CardContent,
    Block,
    Row,
    Col,
    Button,
    Icon
} from 'framework7-react';

import { connect } from 'react-redux';
import stylesheet from './stylesheet';
import { navigate } from '../../../config/redux/actions/routerActions';
import { log } from '../../../utils/';

class Check extends React.Component {
    constructor(props){
        super(props);
      }
  
    render() {
    return (
        <Page noToolbar noNavbar>
        <CardContent padding={false}>
            <List medial-list style={{marginRight: 20, marginLeft: 20, fontSize: 12}}>
            <ListItem style={{color:'white',backgroundColor: '#c0392b',flex: 1, flexDirection: 'row', marginBottom: 5}} title="Mobile Data On">
            <Icon f7="checkmark_rectangle"></Icon>
            </ListItem>
            <ListItem style={{color:'white',backgroundColor: '#c0392b',flex: 1, flexDirection: 'row', marginBottom: 5}} title="Airplane Mode On">
            <Icon f7="checkmark_rectangle"></Icon>
            </ListItem>
            <ListItem style={{color:'white',backgroundColor: '#c0392b',flex: 1, flexDirection: 'row', marginBottom: 5}} title="Login Jam 8 Pagi">
            <Icon f7="checkmark_rectangle"></Icon>
            </ListItem>
            <ListItem style={{color:'white',backgroundColor: '#c0392b',flex: 1, flexDirection: 'row', marginBottom: 5}} title="Jam Pada Perangkat Sesuai">
            <Icon f7="checkmark_rectangle"></Icon>
            </ListItem>
            <ListItem style={{color:'white',backgroundColor: '#c0392b',flex: 1, flexDirection: 'row', marginBottom: 5}} title="User ID dan Password Anda Sesuai">
            <Icon f7="checkmark_rectangle"></Icon>
            </ListItem>
            <ListItem style={{color:'white',backgroundColor: '#c0392b',flex: 1, flexDirection: 'row', marginBottom: 5}} title="Device ID Anda Sesuai">
            <Icon f7="checkmark_rectangle"></Icon>
            </ListItem>
            <ListItem style={{color:'white',backgroundColor: '#c0392b',flex: 1, flexDirection: 'row'}} title="ICCID Anda Sesuai">
            <Icon f7="checkmark_rectangle"></Icon>
            </ListItem>
            </List>
        </CardContent>
        <List>
        <Block strong>
          <Row>
            <Col width="100">
              <Button fill raised onClick={() => this._deviceInfo()} round style={{backgroundColor: '#c0392b'}}>Next</Button>
            </Col>
          </Row>
        </Block>
        </List>
        </Page>                
    );
  }
     _deviceInfo() {
        this.props.navigate('/DeviceInfo/');
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

export default connect(null, mapDispatchToProps)(Check);