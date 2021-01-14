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

class AddParameterMetodeKontak extends React.Component {
    constructor(props){
        super(props);
      }
  
    render() {
    return (
        <Page noToolbar noNavbar>   
        <BlockTitle>Parameter Metode Kontak</BlockTitle>
        <List>
        <Block>
        <Row noGap>
            <Col width="20">
                <Button fill raised onClick={() => this._nextx()} style={{backgroundColor: '#c0392b', fontSize:8}}>Parameter</Button>
            </Col>
            <Col width="40" style={{marginTop:-25}}>
            <List style={{margin: 0, padding:0}}>
                <ListInput
                    outline
                    label="Metode Kontak"
                    type="text"
                >
                </ListInput>
            </List>
            </Col>
            <Col width="20">
                <Button fill raised onClick={() => this._nextx()} style={{backgroundColor: '#c0392b', fontSize:10}}>Add</Button>
            </Col>
            <Col width="20">
                <Button fill raised onClick={() => this._nextx()} style={{backgroundColor: '#c0392b', fontSize:10}}>Edit</Button>
            </Col>
        </Row>
        </Block>
        </List>

        <List>
            <BlockTitle style={{paddingLeft:15}}>Add Parameter Metode Kontak</BlockTitle>
            <List style={{margin: 0, padding:0}}>
                <ListInput
                    outline
                    label="Kode Parameter"
                    type="text"
                >
                </ListInput>
            </List>
            <List style={{margin: 0, padding:0}}>
                <ListInput
                    outline
                    label="Deskripsi"
                    type="text"
                >
                </ListInput>
            </List>
            <List style={{marginLeft:20}}>
            <BlockTitle>Status</BlockTitle>
            <List>
                <ListItem checkbox title="Group A" name="demo-checkbox" />
                <ListItem checkbox title="Group B" name="demo-checkbox" />
                <ListItem checkbox title="Group C" name="demo-checkbox" />
            </List>
        </List>
        </List>

        <List>
        <Block strong>
          <Row>
            <Col width="40">
              <Button fill raised onClick={() => this._next()} style={{backgroundColor: '#c0392b', fontSize:12}}>Save</Button>
            </Col>
            <Col width="40">
              <Button fill raised onClick={() => this._next()} style={{backgroundColor: '#c0392b', fontSize:12}}>Close</Button>
            </Col>
          </Row>
        </Block>
        </List>
        </Page>                
    );
  }
     _next() {
        this.props.navigate('/ApprovalSetupParameter/');
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

export default connect(null, mapDispatchToProps)(AddParameterMetodeKontak);