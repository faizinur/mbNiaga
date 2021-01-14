import React, { Component } from 'react';
import{
    Page,
    Navbar,
    List,
    ListInput,
    ListItem,
    Block,
    BlockTitle,
    Row,
    Col,
    Button,
} from 'framework7-react';

import { connect } from 'react-redux';
import { navigate } from '../../../config/redux/actions/routerActions';
//import { log } from '../../../utils/consoles';

class AddUser extends React.Component {
    constructor(props){
        super(props);
      }
  
    render() {
    return (
        <Page noToolbar noNavbar>   
        <List noHairlinesMd>
        <List>
        <ListInput
            outline
            label="User ID"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="Nama"
            type="text"
        >
        </ListInput>
        </List>
        <List style={{marginLeft:20}}>
            <BlockTitle>Level</BlockTitle>
            <List>
                <ListItem checkbox title="1" name="demo-checkbox" defaultChecked />
                <ListItem checkbox title="2" name="demo-checkbox" />
                <ListItem checkbox title="3" name="demo-checkbox" />
                <ListItem checkbox title="4" name="demo-checkbox" />
            </List>
        </List>
        <List style={{marginLeft:20}}>
            <BlockTitle>Regional</BlockTitle>
            <List>
                <ListItem checkbox title="Jawa Barat" name="demo-checkbox" />
                <ListItem checkbox title="Jawa Timur" name="demo-checkbox" />
                <ListItem checkbox title="Jawa Tengah" name="demo-checkbox" />
                <ListItem checkbox title="Bali" name="demo-checkbox" />
            </List>
        </List>
        <List style={{marginLeft:20}}>
            <BlockTitle>Cluster</BlockTitle>
            <List>
                <ListItem checkbox title="A" name="demo-checkbox" />
                <ListItem checkbox title="B" name="demo-checkbox" />
                <ListItem checkbox title="C" name="demo-checkbox" />
                <ListItem checkbox title="D" name="demo-checkbox" />
            </List>
        </List>
        <List style={{marginLeft:20}}>
            <BlockTitle>Area</BlockTitle>
            <List>
                <ListItem checkbox title="Area 1" name="demo-checkbox" />
                <ListItem checkbox title="Area 2" name="demo-checkbox" />
                <ListItem checkbox title="Area 3" name="demo-checkbox" />
            </List>
        </List>
        <List style={{marginLeft:20}}>
            <BlockTitle>Branch Code</BlockTitle>
            <List>
                <ListItem checkbox title="129288229" name="demo-checkbox" />
                <ListItem checkbox title="222343444" name="demo-checkbox" />
                <ListItem checkbox title="324566666" name="demo-checkbox" />
                <ListItem checkbox title="434343433" name="demo-checkbox" />
            </List>
        </List>
        <List style={{marginLeft:20}}>
            <BlockTitle>Atasan</BlockTitle>
            <List>
                <ListItem checkbox title="Solahudin" name="demo-checkbox" />
                <ListItem checkbox title="Mukti" name="demo-checkbox" />
                <ListItem checkbox title="Anas" name="demo-checkbox" />
                <ListItem checkbox title="Coip" name="demo-checkbox" />
            </List>
        </List>
        <List style={{marginLeft:20}}>
            <BlockTitle>Collection Type</BlockTitle>
            <List>
                <ListItem checkbox title="Type 1" name="demo-checkbox" />
                <ListItem checkbox title="Type 2" name="demo-checkbox" />
                <ListItem checkbox title="Type 3" name="demo-checkbox" />
                <ListItem checkbox title="Type 4" name="demo-checkbox" />
            </List>
        </List>
        <List style={{marginLeft:20}}>
            <BlockTitle>Collection Group</BlockTitle>
            <List>
                <ListItem checkbox title="Group A" name="demo-checkbox" />
                <ListItem checkbox title="Group B" name="demo-checkbox" />
                <ListItem checkbox title="Group C" name="demo-checkbox" />
            </List>
        </List>
        <List>
        <ListInput
            outline
            label="Device ID"
            type="text"
        >
        </ListInput>
        <ListInput
            outline
            label="ICCID"
            type="text"
        >
        </ListInput>
        </List>
        <List style={{marginLeft:20}}>
            <BlockTitle>Flag Aktif</BlockTitle>
            <List>
                <ListItem checkbox title="Ya" name="demo-checkbox" />
                <ListItem checkbox title="Tidak" name="demo-checkbox" />
            </List>
        </List>
        </List>
        
        <List>
        <Block strong>
          <Row>
            <Col width="50">
              <Button fill raised onClick={() => this._next()} style={{backgroundColor: '#c0392b', fontSize:12}}>Save</Button>
            </Col>
            <Col width="50">
              <Button fill raised onClick={() => this._next()} style={{backgroundColor: '#c0392b', fontSize:12}}>Cancel</Button>
            </Col>
          </Row>
        </Block>
        </List>
        </Page>                
    );
  }
     _next() {
        this.props.navigate('/ApprovalSetupArea/');
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

export default connect(null, mapDispatchToProps)(AddUser);