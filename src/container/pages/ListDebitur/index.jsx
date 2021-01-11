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
import { log } from '../../../utils/';

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
            </Block>
        </List>

        <List noHairlinesMd>
        <Block>
            <Row noGap>
                <Col tag="span">
                    <ListItem title="Parameter" smartSelect noHairlinesMd style={{margin: 0, padding:0}}>
                    <select name="superhero" defaultValue={['Batman']}>
                        <option value="Batman">Batman</option>
                        <option value="Superman">Superman</option>
                    </select>
                    </ListItem>
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
            </Block>
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
        this.props.navigate('/');
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

export default connect(null, mapDispatchToProps)(ListDebitur);