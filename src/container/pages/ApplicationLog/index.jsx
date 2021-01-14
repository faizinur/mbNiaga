import React, { Component } from 'react';
import {
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

class ApplicationLog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Page noToolbar noNavbar>
                <BlockTitle>Application Log</BlockTitle>
                <List>
                    <Block>
                        <Row noGap>
                            <Col width="20" style={{alignItems:'center', justifyContent:'center'}}>
                                <Button fill raised onClick={() => this._nextx()} style={{ backgroundColor: '#c0392b', fontSize: 12 }}>Data</Button>
                            </Col>
                            <Col width="30">
                                <List style={{ margin: 0, padding: 0 }}>
                                    <ListInput
                                        outline
                                        label="Nama"
                                        type="text"
                                    />
                                </List>
                            </Col>
                            <Col width="30">
                                <List style={{ margin: 0, padding: 0 }}>
                                    <ListInput
                                        outline
                                        label="Waktu Server"
                                        type="text"
                                    />
                                </List>
                            </Col>
                            <Col width="20">
                                <Button fill raised onClick={() => this._nextx()} style={{ backgroundColor: '#c0392b', fontSize: 12 }}>Search</Button>
                            </Col>
                        </Row>
                    </Block>
                </List>

                <List>
                    <Block strong>
                        <Row>
                            <Col width="100">
                                <Button fill raised onClick={() => this._next()} style={{ backgroundColor: '#c0392b', fontSize: 12 }}>Export to CSV</Button>
                            </Col>
                        </Row>
                    </Block>
                </List>

                <div className="card data-table" style={{ height: 200 }}>
                    <table>
                        <thead>
                            <tr>
                                <th className="input-cell">
                                    <span className="table-head-label">Date & Time</span>
                                </th>
                                <th className="input-cell">
                                    <span className="table-head-label">IP Address</span>
                                </th>
                                <th className="input-cell">
                                    <span className="table-head-label">User ID</span>
                                </th>
                                <th className="input-cell">
                                    <span className="table-head-label">Module Name</span>
                                </th>
                                <th className="input-cell">
                                    <span className="table-head-label">Action</span>
                                </th>
                                <th className="input-cell">
                                    <span className="table-head-label">Result</span>
                                </th>
                                <th className="input-cell">
                                    <span className="table-head-label">Description</span>
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
                            </tr>
                        </tbody>
                    </table>
                </div>

                <List>
                    <Block strong>
                        <Row>
                            <Col width="100">
                                <Button fill raised onClick={() => this._next()} style={{ backgroundColor: '#c0392b', fontSize: 12 }}>Next</Button>
                            </Col>
                        </Row>
                    </Block>
                </List>
            </Page>
        );
    }
    _next() {
        this.props.navigate('/UserManagement/');
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

export default connect(null, mapDispatchToProps)(ApplicationLog);