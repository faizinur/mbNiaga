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

class SetupParameterCollection extends React.Component {
    constructor(props){
        super(props);
      }
  
    render() {
    return (
        <Page noToolbar noNavbar>
        <BlockTitle>Setup Parameter Collection</BlockTitle>   
        <List noHairlinesMd>
            <List style={{marginBottom:-75}}>
            <Block strong>
                <Row>
                    <Col width="50">
                    <List noHairlinesMd style={{marginTop:-25}}>
                    <ListInput
                    outline
                    label="GPS Lock Time"
                    type="number"
                    >
                    </ListInput>
                    </List>
                    </Col>
                    <Col width="20">
                    <Button fill raised onClick={() => this._next()} style={{backgroundColor: '#c0392b', fontSize:12}}>V</Button>
                    </Col>
                    <Col width="20">
                    <Button fill raised onClick={() => this._next()} style={{backgroundColor: '#c0392b', fontSize:12}}>X</Button>
                    </Col>
                    <Col width="20">
                    <p style={{marginTop:5, marginLeft:5}}>Detik</p>
                    </Col>
                </Row>
            </Block>
            </List>
            <List style={{marginBottom:-75}}>
            <Block strong>
                <Row>
                    <Col width="50">
                    <List noHairlinesMd style={{marginTop:-25}}>
                    <ListInput
                    outline
                    label="Interval Send Location"
                    type="number"
                    >
                    </ListInput>
                    </List>
                    </Col>
                    <Col width="20">
                    <Button fill raised onClick={() => this._next()} style={{backgroundColor: '#c0392b', fontSize:12}}>V</Button>
                    </Col>
                    <Col width="20">
                    <Button fill raised onClick={() => this._next()} style={{backgroundColor: '#c0392b', fontSize:12}}>X</Button>
                    </Col>
                    <Col width="20">
                    <p style={{marginTop:5, marginLeft:5}}>Detik</p>
                    </Col>
                </Row>
            </Block>
            </List>
            <List style={{marginBottom:-75}}>
            <Block strong>
                <Row>
                    <Col width="50">
                    <List noHairlinesMd style={{marginTop:-25}}>
                    <ListInput
                    outline
                    label="Idle Time"
                    type="number"
                    >
                    </ListInput>
                    </List>
                    </Col>
                    <Col width="20">
                    <Button fill raised onClick={() => this._next()} style={{backgroundColor: '#c0392b', fontSize:12}}>V</Button>
                    </Col>
                    <Col width="20">
                    <Button fill raised onClick={() => this._next()} style={{backgroundColor: '#c0392b', fontSize:12}}>X</Button>
                    </Col>
                    <Col width="20">
                    <p style={{marginTop:5, marginLeft:5}}>Detik</p>
                    </Col>
                </Row>
            </Block>
            </List>
            <List style={{marginBottom:-35}}>
            <Block strong>
                <Row>
                    <Col width="30">
                    <List noHairlinesMd style={{margin:-25, marginLeft:0}}>
                    <ListInput
                    outline
                    label="Login Time"
                    type="number"
                    >
                    </ListInput>
                    </List>
                    </Col>
                    <Col width="30">
                    <List noHairlinesMd style={{margin:-10, marginLeft:-5, marginRight:-15}}>
                    <ListInput
                    outline
                    type="number"
                    >
                    </ListInput>
                    </List>
                    </Col>
                    <Col width="20">
                    <Button fill raised onClick={() => this._next()} style={{backgroundColor: '#c0392b', fontSize:12}}>V</Button>
                    </Col>
                    <Col width="20">
                    <Button fill raised onClick={() => this._next()} style={{backgroundColor: '#c0392b', fontSize:12}}>X</Button>
                    </Col>
                </Row>
            </Block>
            </List>
            <List>
            <Block strong>
                <Row>
                    <Col width="30">
                    <List noHairlinesMd style={{margin:-25, marginLeft:0}}>
                    <ListInput
                    outline
                    label="Logout Time"
                    type="number"
                    >
                    </ListInput>
                    </List>
                    </Col>
                    <Col width="30">
                    <List noHairlinesMd style={{margin:-10, marginLeft:-5, marginRight:-15}}>
                    <ListInput
                    outline
                    type="number"
                    >
                    </ListInput>
                    </List>
                    </Col>
                    <Col width="20">
                    <Button fill raised onClick={() => this._next()} style={{backgroundColor: '#c0392b', fontSize:12}}>V</Button>
                    </Col>
                    <Col width="20">
                    <Button fill raised onClick={() => this._next()} style={{backgroundColor: '#c0392b', fontSize:12}}>X</Button>
                    </Col>
                </Row>
            </Block>
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
        this.props.navigate('/ApprovalSetupParamCol/');
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

export default connect(null, mapDispatchToProps)(SetupParameterCollection);