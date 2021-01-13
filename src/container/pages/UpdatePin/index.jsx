import React, { Component } from 'react';
import{
    Page,
    Navbar,
    List,
    ListInput,
    Block,
    BlockTitle,
    Row,
    Col,
    Button
} from 'framework7-react';

import { connect } from 'react-redux';
import { navigate } from '../../../config/redux/actions/routerActions';
//import { log } from '../../../utils/consoles';

class UpdatePin extends React.Component {
    constructor(props){
        super(props);
      }
  
    render() {
    return (
        <Page noToolbar noNavbar>
        <BlockTitle>Ubah PIN</BlockTitle>
        <List noHairlinesMd>
        <ListInput
            outline
            label="Masukan PIN Lama"
            type="password"
        >
        </ListInput>
        <ListInput
            outline
            label="Masukan PIN Baru"
            type="password"
        >
        </ListInput>
        <ListInput
            outline
            label="Konfirmasi PIN Baru"
            type="password"
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
        this.props.navigate('/DetailHasilKunjungan/');
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

export default connect(null, mapDispatchToProps)(UpdatePin);