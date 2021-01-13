import React, { Component } from 'react';
import{
    Page,
    Navbar,
    List,
    ListInput,
    Block,
    Row,
    Col,
    Button
} from 'framework7-react';

import { connect } from 'react-redux';
import { navigate } from '../../../config/redux/actions/routerActions';
//import { log } from '../../../utils/consoles';

class DeviceInfo extends React.Component {
    constructor(props){
        super(props);
      }
  
    render() {
    return (
        <Page noToolbar noNavbar>   
        <List noHairlinesMd style={{fontSize:1}}>
        <ListInput
            outline
            label="Manufacture"
            type="text"
            placeholder="SAMSUNG A21"
        >
        </ListInput>
        <ListInput
            outline
            label="Operating System"
            type="text"
            placeholder="ANDROID 10.1"
        >
        </ListInput>
        <ListInput
            outline
            label="Device ID"
            type="text"
            placeholder="asksjdk201k.com"
        >
        </ListInput>
        <ListInput
            outline
            label="ICCID"
            type="text"
            placeholder="123562782910229"
        >
        </ListInput>
        <ListInput
            outline
            label="Version"
            type="text"
            placeholder="1.10"
        >
        </ListInput>
        </List>
        <List>
        <Block strong>
          <Row>
            <Col width="100">
              <Button fill raised onClick={() => this._next()} style={{backgroundColor: '#c0392b'}}>Next</Button>
            </Col>
          </Row>
        </Block>
        </List>
        </Page>                
    );
  }
     _next() {
        this.props.navigate('/DaftarPin/');
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

export default connect(null, mapDispatchToProps)(DeviceInfo);