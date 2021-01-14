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

class UploadMasterProvinsi extends React.Component {
    constructor(props){
        super(props);
      }
  
    render() {
    return (
        <Page noToolbar noNavbar>   
        <BlockTitle>Upload Master Provinsi</BlockTitle>
        <List>
        <Block>
        <Row noGap>
            <Col width="100">
                <Button fill raised onClick={() => this._next()} style={{backgroundColor: '#c0392b', fontSize:12}}>Upload</Button>
            </Col>
        </Row>
        </Block>
        </List>

        <div className="card data-table" style={{height:200}}>
                <table>
                    <thead>
                        <tr>
                            <th className="input-cell">
                                <span className="table-head-label">Nama File</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Provinsi</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Kabupaten/Kota</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Kecamatan</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Kelurahan</span>
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

export default connect(null, mapDispatchToProps)(UploadMasterProvinsi);