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

class UserManagement extends React.Component {
    constructor(props){
        super(props);
      }
  
    render() {
    return (
        <Page noToolbar noNavbar>   
        <BlockTitle>User Management</BlockTitle>
        <List>
        <Block>
        <Row noGap>
            <Col width="20">
                <Button fill raised onClick={() => this._nextx()} style={{backgroundColor: '#c0392b', fontSize:12}}>Add</Button>
            </Col>
            <Col width="20">
                <Button fill raised onClick={() => this._nextx()} style={{backgroundColor: '#c0392b', fontSize:12}}>Edit</Button>
            </Col>
            <Col width="20">
                <Button fill raised onClick={() => this._nextx()} style={{backgroundColor: '#c0392b', fontSize:12}}>Delete</Button>
            </Col>
            <Col width="20">
                <Button fill raised onClick={() => this._nextx()} style={{backgroundColor: '#c0392b', fontSize:12}}>Force Logout</Button>
            </Col>
            <Col width="20">
                <Button fill raised onClick={() => this._nextx()} style={{backgroundColor: '#c0392b', fontSize:12}}>Export</Button>
            </Col>
        </Row>
        </Block>
        </List>


        <div className="card data-table" style={{height:200}}>
                <table>
                    <thead>
                        <tr>
                            <th className="input-cell">
                                <span className="table-head-label">User ID</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Nama</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Jabatan</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Regional</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Cluster</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Area</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Branch Code</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Atasan</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Collection Type</span>
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
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="card data-table" style={{height:200}}>
                <table>
                    <thead>
                        <tr>
                            <th className="input-cell">
                                <span className="table-head-label">Collection Group</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Device ID</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">ICCID</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Tgl Input</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Tgl Update</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Status Aktif</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Status Login</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Gagal Login</span>
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
        // this.props.navigate('/');
        this.props.navigate('/AddUser/');
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

export default connect(null, mapDispatchToProps)(UserManagement);