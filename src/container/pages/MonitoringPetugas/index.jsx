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

class MonitoringPetugas extends React.Component {
    constructor(props){
        super(props);
      }
  
    render() {
    return (
        <Page noToolbar noNavbar>   
        <BlockTitle>Monitoring Petugas</BlockTitle>
        <div className="card data-table" style={{height:200}}>
                <table>
                    <thead>
                        <tr>
                            <th className="input-cell">
                                <span className="table-head-label">Nama Petugas</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Leader</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Tracking</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Jumlah Assignment</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Jumlah Janji Bayar</span>
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
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="card data-table" style={{height:200}}>
                <table>
                    <thead>
                        <tr>
                            <th className="input-cell">
                                <span className="table-head-label">Nominal Janji Bayar</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Jumlah Pembayaran</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Nominal Pembayaran</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">First Login</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Logout</span>
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
        this.props.navigate('/ApplicationLog/');
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

export default connect(null, mapDispatchToProps)(MonitoringPetugas);