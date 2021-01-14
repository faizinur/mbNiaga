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

class SetupBucket extends React.Component {
    constructor(props){
        super(props);
      }
  
    render() {
    return (
        <Page noToolbar noNavbar>   
        <BlockTitle>Setup Bucket</BlockTitle>
        <List>
        <Block>
        <Row noGap>
            <Col width="30">
                <Button fill raised onClick={() => this._next()} style={{backgroundColor: '#c0392b', fontSize:12}}>Add</Button>
            </Col>
            <Col width="30">
                <Button fill raised onClick={() => this._next()} style={{backgroundColor: '#c0392b', fontSize:12}}>Edit</Button>
            </Col>
            <Col width="30">
                <Button fill raised onClick={() => this._next()} style={{backgroundColor: '#c0392b', fontSize:12}}>Delete</Button>
            </Col>
        </Row>
        </Block>
        </List>

        <div className="card data-table" style={{height:200}}>
                <table>
                    <thead>
                        <tr>
                            <th className="input-cell">
                                <span className="table-head-label">Bucket</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Product</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Max PTP Days</span>
                            </th>
                            <th className="input-cell">
                                <span className="table-head-label">Min PTP Amount</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
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
        this.props.navigate('/AddBucket/');
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

export default connect(null, mapDispatchToProps)(SetupBucket);