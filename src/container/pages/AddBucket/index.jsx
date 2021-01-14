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

class AddBucket extends React.Component {
    constructor(props){
        super(props);
      }
  
    render() {
    return (
        <Page noToolbar noNavbar>   
        <List noHairlinesMd>
            <List style={{marginLeft:20}}>
                <BlockTitle>Produk</BlockTitle>
                <List>
                    <ListItem checkbox title="Niaga CC 1" name="demo-checkbox" />
                    <ListItem checkbox title="Niaga CC 2" name="demo-checkbox" />
                    <ListItem checkbox title="Tabungan Niaga 1" name="demo-checkbox" />
                    <ListItem checkbox title="Tabungan Niaga 2" name="demo-checkbox" />
                </List>
            </List>
            <List style={{marginLeft:20}}>
                <BlockTitle>Bucket</BlockTitle>
                <List>
                    <ListItem checkbox title="Bucket A" name="demo-checkbox" />
                    <ListItem checkbox title="Bucket B" name="demo-checkbox" />
                    <ListItem checkbox title="Bucket C" name="demo-checkbox" />
                </List>
            </List>
            <List>
            <ListInput
                outline
                label="Min Acceptable Promised Amount"
                type="text"
            >
            </ListInput>
            <ListInput
                outline
                label="Max Allowable Days For Promise From Today"
                type="text"
            >
            </ListInput>
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
        this.props.navigate('/ApprovalSetupBucket/');
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

export default connect(null, mapDispatchToProps)(AddBucket);