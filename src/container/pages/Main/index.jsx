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
    Link,
} from 'framework7-react';

import { connect } from 'react-redux';
import { navigate } from '../../../config/redux/actions/';
import { log, Camera, Geolocation, Connection } from '../../../utils';
import { DefaultNavbar, ListMenu } from '../../../components/atoms'
import { SystemInfo } from '../../../components/molecules'
class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        log('componentDidMount MAIN');
    }
    _openCamera = async () => {
        try {
            let cameraResult = await Camera.start()
            alert(JSON.stringify(cameraResult))
        } catch (e) {
            if (err != "") alert("Error: " + err);
        }
        // .then(res => {
        //     //res = string jpeg base64
        //     alert(res);
        // }
        // ).catch(err => {
        //     if (err != "") alert("Error: " + err);
        // });
    }
    _openMaps = async() => {
        let elem = document.getElementById("map_canvas");
        Geolocation.getMapLocation(document.getElementById("map_canvas"))
            .then(res => {
                //res = string
                elem.style.position = null;
                elem.style.overflow = null;

                log(res);
            }
            ).catch(err => {
                if (err != "") alert('error : ' + err);
            })

    }
    render() {
        return (
            <Page style={{ paddingBottom: 60 }}>
                <DefaultNavbar title="MOBILE APPLICATION INTERACTION" network={Connection()} />
                <SystemInfo />
                <Block style={{ marginTop: 0 }}>
                    <div id="map_canvas"></div>
                    <CardContent padding={false}>
                        <List medial-list style={{ marginRight: 5, marginLeft: 5, fontSize: 12 }}>
                            <ListMenu
                                onClick={(e) => this.props.navigate('/ListDebitur/')}
                                label="Daftar Debitur"
                            />
                            <ListMenu
                                label="Rencana Kunjungan"
                            />
                            <ListMenu
                                label="Daftar Dikunjungi"
                            />
                            <ListMenu
                                onClick={(e) => this.props.navigate('/RekapTerkirim/')}
                                label="Rekap Terkirim"
                            />
                            <ListMenu
                                label="Rekap Tertunda"
                            />
                            <ListMenu
                                onClick={(e) => this.props.navigate('/DeviceInfo/')}
                                label="Device Information"
                            />
                        </List>
                    </CardContent>
                </Block>
            </Page>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        profile: state.user.profile,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (nav) => dispatch(navigate(nav))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);