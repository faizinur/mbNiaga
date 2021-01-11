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
    ListItem
} from 'framework7-react';

import { connect } from 'react-redux';
import { navigate } from '../../../config/redux/actions/routerActions';
import { log } from '../../../utils/';

class DaftarPin extends React.Component {
    constructor(props){
        super(props);
      }
  
    render() {
    return (
        <Page noToolbar noNavbar style={{fontSize: 10}}>
        <List noHairlinesMd>
        <ListItem
            title="Daftar PIN" style={{alignItems:'center'}}
        />
        <ListInput
            label="Masukan PIN Baru"
            type="text"
            placeholder="Masukan PIN Baru"
        >
        </ListInput>
        <ListInput
            label="Konfirmasi PIN Baru"
            type="text"
            placeholder="Ketik Ulang PIN Baru"
        >
        </ListInput>
        </List>
        <List>
        <Block strong>
          <Row>
            <Col width="100">
              <Button fill raised onClick={() => this._next()} round style={{backgroundColor: '#c0392b'}}>Simpan</Button>
            </Col>
          </Row>
        </Block>
        </List>
        </Page>                
    );
  }
     _next() {
        this.props.navigate('/Main/');
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

export default connect(null, mapDispatchToProps)(DaftarPin);