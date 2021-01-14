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

class SetupParameter extends React.Component {
    constructor(props){
        super(props);
      }
  
    render() {
    return (
        <Page noToolbar noNavbar>   
        <BlockTitle>Setup Parameter</BlockTitle>
        <List>
        <List style={{marginLeft:20}}>
                <BlockTitle>Parameter</BlockTitle>
                <List>
                    <ListItem checkbox title="Parameter 1" name="demo-checkbox" />
                    <ListItem checkbox title="Parameter 2" name="demo-checkbox" />
                    <ListItem checkbox title="Parameter 3" name="demo-checkbox" />
                    <ListItem checkbox title="Parameter 4" name="demo-checkbox" />
                </List>
            </List>
        <Block>
        <Row noGap>
            <Col width="40">
                <Button fill raised onClick={() => this._nextx()} style={{backgroundColor: '#c0392b', fontSize:12}}>Add</Button>
            </Col>
            <Col width="40">
                <Button fill raised onClick={() => this._nextx()} style={{backgroundColor: '#c0392b', fontSize:12}}>Edit</Button>
            </Col>
        </Row>
        </Block>
        </List>

        <div className="card data-table" style={{height:200}}>
                <table>
                    <thead>
                        <tr>
                            <th className="input-cell">
                                <span className="table-head-label">Kode</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Deskripsi</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Parent</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Status</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Created by</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Created Time</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Updated by</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Updated Time</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>

        <List>
        <Block strong>
          <Row>
            <Col width="100">
              <Button fill raised onClick={() => this._next()} style={{backgroundColor: '#c0392b', fontSize:12}}>Next</Button>
            </Col>
          </Row>
        </Block>
        </List>
        </Page>                
    );
  }
     _next() {
        this.props.navigate('/AddParameterMetodeKontak/');
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

export default connect(null, mapDispatchToProps)(SetupParameter);