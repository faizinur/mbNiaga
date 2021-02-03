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
import { log, Connection } from '../../../utils/';
import { DefaultNavbar } from '../../../components/atoms';

class RekapTerkirim extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        log('componentDidMount RekapTerikirim')
    }
    _onPTPclick = () => {
        log('_onPTPclick');
    }

    render() {
        return (
            <Page noToolbar noNavbar>
                <DefaultNavbar
                    title="Rekap Terkirim"
                    network={Connection()}
                />
                <List noHairlinesMd style={{ fontSize: 1, paddingBottom: 80 }}>
                    <div style={{
                        display: 'flex',
                        height: 58,
                        backgroundColor: "#c0392b",
                        paddingLeft: '5%',
                        paddingRight: '5%',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                    // onClick={()=> this._onPTPclick()}
                    >
                        <p style={{
                            fontSize: 14,
                            fontWeight: 'initial',
                            color: '#fcf5f4',
                            lineHeight: 16
                        }}>123456xxxx12</p>
                        <div
                            style={{
                                height: 40,
                                width: 60,
                                backgroundColor: 'red',
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: 'blue',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',

                            }}
                        >
                            <p style={{
                                fontSize: 14,
                                fontWeight: 'initial',
                                color: '#fcf5f4',
                                margin: 0,
                            }}>PTP</p>
                        </div>
                    </div>
                    <ListInput
                        outline
                        label="Nomor Kartu"
                        type="text"
                        disabled={true}
                    />
                    <ListInput
                        outline
                        label="Nama"
                        type="text"
                        disabled={true}
                    />
                    <ListInput
                        outline
                        label="Metode Kontak"
                        type="text"
                        disabled={true}
                    />
                    <ListInput
                        outline
                        label="Kontak"
                        type="text"
                        disabled={true}
                    />
                    <ListInput
                        outline
                        label="Tempat Kunjungan"
                        type="text"
                        disabled={true}
                    />
                    <ListInput
                        outline
                        label="Hasil Kunjungan"
                        type="text"
                        disabled={true}
                    />
                    <ListInput
                        outline
                        label="Detail Hasil Kunjungan"
                        type="text"
                        disabled={true}
                    />
                    <ListInput
                        outline
                        label="Waktu Visit"
                        type="text"
                        disabled={true}
                    />
                    <ListInput
                        outline
                        label="Petugas"
                        type="text"
                        disabled={true}
                    />
                    <ListInput
                        outline
                        label="Tanggal PTP"
                        type="text"
                        disabled={true}
                    />
                    <ListInput
                        outline
                        label="Jumlah PTP"
                        type="text"
                        disabled={true}
                    />
                </List>

                {/* <List>
                    <Block strong>
                        <Row>
                            <Col width="100">
                                <Button fill raised onClick={() => this._next()} style={{ backgroundColor: '#c0392b', fontSize: 12 }}>Next</Button>
                            </Col>
                        </Row>
                    </Block>
                </List> */}
            </Page>
        );
    }
    _next() {
        this.props.navigate('/DetailHasilKunjungan/');
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

export default connect(mapStateToProps, mapDispatchToProps)(RekapTerkirim);