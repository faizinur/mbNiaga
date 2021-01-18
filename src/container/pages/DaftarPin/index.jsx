import React, { Component } from 'react';
import {
    Page,
    Navbar,
    List,
    ListInput,
    Block,
    Row,
    Col,
    Button,
    ListItem
} from 'framework7-react';

import { connect } from 'react-redux';
import { navigate } from '../../../config/redux/actions/routerActions';
//import { log } from '../../../utils/consoles';

class DaftarPin extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Page noToolbar noNavbar style={{ fontSize: 10, paddingBottom: 60 }}>
                <List noHairlinesMd>
                    <ListItem
                        title="Daftar PIN" style={{ alignItems: 'center' }}
                    />
                    <ListInput
                        outline
                        label="Masukan PIN Baru"
                        type="text"
                    >
                    </ListInput>
                    <ListInput
                        outline
                        label="Konfirmasi PIN Baru"
                        type="text"
                    >
                    </ListInput>
                </List>
                <List>
                    <Block strong>
                        <Row>
                            <Col width="100">
                                <Button fill raised onClick={() => this._next()} style={{ backgroundColor: '#c0392b' }}>Next</Button>
                            </Col>
                        </Row>
                    </Block>
                </List>
            </Page>
        );
    }
    _next() {
        this.props.navigate('/Main/');
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.main.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (nav) => dispatch(navigate(nav))
    };
};

export default connect(null, mapDispatchToProps)(DaftarPin);