import React, { Component } from 'react';
import {
    Page,
    f7,
} from 'framework7-react';

import { connect } from 'react-redux';
import { navigate } from '../../../config/redux/actions/';
import { log, Camera, Connection } from '../../../utils';
import { DefaultNavbar, ListMenu } from '../../../components/atoms';
import { SystemInfo } from '../../../components/molecules';
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
    }
    render() {
        return (
            <Page style={{ paddingBottom: 60 }} name="Main">
                <DefaultNavbar
                    title="MOBILE APPLICATION INTERACTION"
                    network={Connection()}
                />
                <SystemInfo />
                <ListMenu
                    item={[
                        {
                            onClick: (e) => this.props.navigate('/ListDebitur/'),
                            label: "Daftar Debitur",
                            image: "list_debitur.png",
                        },
                        {
                            onClick: (e) => this.props.navigate('/RencanaKunjungan/'),
                            label: "Rencana Kunjungan",
                            image: "rencana_kunjungan.png",
                        },
                        {
                            onClick: (e) => this.props.navigate('/RekapTertunda/'),
                            label: "Rekap Tertunda",
                            image: "rekap_tertunda.png",
                        },
                        {
                            onClick: (e) => this.props.navigate('/RekapTerkirim/'),
                            label: "Rekap Terkirim",
                            image: "rekap_terkirim.png",
                        },
                        {
                            onClick: (e) => this.props.navigate('/VisitedList/'),
                            label: "Daftar Dikunjungi",
                            image: "list_kunjungan.png",
                        },
                        {
                            onClick: (e) => this.props.navigate('/DeviceInfo/'),
                            label: "Device Information",
                            image: "Information.png",
                        },
                    ]}
                />
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