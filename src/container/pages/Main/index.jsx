import React, { Component } from 'react';
import {
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
import { navigate } from '../../../config/redux/actions/';
import { log } from '../../../utils';

class Main extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
        log('componentDidMount MAIN', this.props)
    }
    render() {
        return (
            <Page>
                <List noHairlinesMd>
                    <Block style={{ margin: 0, padding: 0 }}>
                        <Row noGap>
                            <Col tag="span">
                                <List style={{ margin: 0, padding: 0 }}>
                                    <ListInput
                                        outline
                                        label="Nama"
                                        type="text"
                                    >
                                    </ListInput>
                                </List>
                            </Col>
                            <Col tag="span">
                                <List style={{ margin: 0, padding: 0 }}>
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
                                <List style={{ margin: 0, padding: 0 }}>
                                    <ListInput
                                        outline
                                        label="Device ID"
                                        type="text"
                                    >
                                    </ListInput>
                                </List>
                            </Col>
                            <Col tag="span">
                                <List style={{ margin: 0, padding: 0 }}>
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
                                <List style={{ margin: 0, padding: 0 }}>
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

                <Block>
                    <CardContent padding={false}>
                        <List medial-list style={{ marginRight: 5, marginLeft: 5, fontSize: 12 }}>
                            <ListItem
                                style={{ color: 'white', backgroundColor: '#c0392b', flex: 1, flexDirection: 'row', marginBottom: 5, borderRadius: 6 }}
                                link="/ListDebitur/"
                                title="Daftar Debitur"
                            />
                            <ListItem style={{ color: 'white', backgroundColor: '#c0392b', flex: 1, flexDirection: 'row', marginBottom: 5, borderRadius: 6 }} title="Rencana Kunjungan" />
                            <ListItem style={{ color: 'white', backgroundColor: '#c0392b', flex: 1, flexDirection: 'row', marginBottom: 5, borderRadius: 6 }} title="Daftar Dikunjungi" />
                            <ListItem style={{ color: 'white', backgroundColor: '#c0392b', flex: 1, flexDirection: 'row', marginBottom: 5, borderRadius: 6 }} title="Rekap Terkirim" />
                            <ListItem style={{ color: 'white', backgroundColor: '#c0392b', flex: 1, flexDirection: 'row', marginBottom: 5, borderRadius: 6 }} title="Rekap Tertunda" />
                            <ListItem style={{ color: 'white', backgroundColor: '#c0392b', flex: 1, flexDirection: 'row', marginBottom: 5, borderRadius: 6 }} title="Device Information" />
                        </List>
                    </CardContent>
                </Block>

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
    _next = () => {
        this.props.navigate('/ListDebitur/');
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (nav) => dispatch(navigate(nav))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);