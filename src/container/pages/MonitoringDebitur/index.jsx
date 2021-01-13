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

class MonitoringDebitur extends React.Component {
    constructor(props){
        super(props);
      }
  
    render() {
    return (
        <Page noToolbar noNavbar>   
        <BlockTitle>Monitoring Debitur</BlockTitle>
        <div className="card data-table" style={{height:200}}>
                <table>
                    <thead>
                        <tr>
                            <th className="input-cell">
                                <span className="table-head-label">User ID</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Nama Collector</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Waktu Kunjungan</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Nomor Tagihan</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Customer ID</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Nama</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Alamat</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Metode Kontak</span>
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

            <div className="card data-table" style={{height:200}}>
                <table>
                    <thead>
                        <tr>
                            <th className="input-cell">
                                <span className="table-head-label">Detail Metode Kontak</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Tempat Kunjungan</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Hasil Kunjungan</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Detail Hasil Kunjungan</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Tanggal PTP</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Nominal PTP</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Tanggal Bayar</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Jumlah Bayar</span>
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
        this.props.navigate('/MonitoringPetugas/');
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

export default connect(null, mapDispatchToProps)(MonitoringDebitur);