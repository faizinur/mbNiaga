import React, { Component } from 'react';
import{
    Page,
    List,
    ListInput,
    ListItem,
    Block,
    Row,
    Col,
    Button,
    Card,
    CardContent,
} from 'framework7-react';

import { connect } from 'react-redux';
import { navigate } from '../../../config/redux/actions/routerActions';
//import { log } from '../../../utils/consoles';

class ListDebitur extends React.Component {
    constructor(props){
        super(props);
      }
  
    render() {
    return (
        <Page noToolbar noNavbar>
        <List noHairlinesMd>
            <Block style={{margin: 0, padding:0}}>
            <Row noGap>
                <Col tag="span">
                <List style={{margin: 0, padding:0}}>
                    <ListInput
                        outline
                        label="Nama"
                        type="text"
                    >
                    </ListInput>
                </List>
                </Col>
                <Col tag="span">
                <List style={{margin: 0, padding:0}}>    
                    <ListInput
                        outline
                        label="Waktu Server"
                        type="text"
                    >
                    </ListInput>
                </List>
                </Col>
            </Row>
            <Row noGap>
                <Col tag="span">
                <List style={{margin: 0, padding:0}}>    
                    <ListInput
                        outline
                        label="Device ID"
                        type="text"
                    >
                    </ListInput>
                </List>
                </Col>
                <Col tag="span">
                <List style={{margin: 0, padding:0}}>    
                    <ListInput
                        outline
                        label="Waktu HP"
                        type="text"
                    >
                    </ListInput>
                </List>
                </Col>
            </Row>
            <Row noGap>
                <Col width="50" tag="span">
                <List style={{margin: 0, padding:0}}>    
                    <ListInput
                        outline
                        label="ICCID"
                        type="text"
                    >
                    </ListInput>
                </List>
                </Col>
            </Row>
            <Row noGap>
                <Col width="40" tag="span" style={{margin: 0, padding:0}}>
                    <List noHairlinesMd>
                    <ListInput
                        outline
                        label="Hasil Kunjungan"
                        type="select"
                        defaultValue=""
                    >
                        <option value="" disabled>--pilih--</option>
                        <option value="">-----</option>
                    </ListInput>
                    </List>
                </Col>
                <Col width="30" tag="span" style={{margin: 0, padding:0}}>
                <List>    
                    <ListInput
                        outline
                        label="Kondisi"
                        type="text"
                    >
                    </ListInput>
                </List>
                </Col>
                <Col width="30" tag="span" style={{margin: 0, padding:0}}>
                <List>    
                    <ListInput
                        outline
                        label="Value"
                        type="text"
                    >
                    </ListInput>
                </List>
                </Col>
            </Row>
                <Block strong style={{marginTop:-30}}>
                    <Row noGap>
                        <Col width="100">
                        <Button fill raised onClick={() => this._next()} style={{backgroundColor: '#c0392b', fontSize:12}}>Search</Button>
                        </Col>
                    </Row>
                </Block>
        </Block>
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
        this.props.navigate('/InfoDebitur/');
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

export default connect(null, mapDispatchToProps)(ListDebitur);