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
                    profile={"hehehehehee"}
                    title="MOBILE APPLICATION INTERACTION"
                    network={Connection()}
                />
                <SystemInfo />
                <ListMenu
                    item={[
                        {
                            onClick: (e) => this.props.navigate('/ListDebitur/'),
                            label: "Customer List",
                            image: "list_debitur.png",
                        },
                        {
                            onClick: (e) => this.props.navigate('/RencanaKunjungan/'),
                            label: "Visit Plan",
                            image: "rencana_kunjungan.png",
                        },
                        {
                            onClick: (e) => this.props.navigate('/RekapTertunda/'),
                            label: "Postphoned List",
                            image: "rekap_tertunda.png",
                        },
                        {
                            onClick: (e) => this.props.navigate('/RekapTerkirim/'),
                            label: "Sent List",
                            image: "rekap_terkirim.png",
                        },
                        {
                            onClick: (e) => this.props.navigate('/VisitedList/'),
                            label: "Visited List",
                            image: "list_kunjungan.png",
                        },
                        {
                            onClick: (e) => this.props.navigate('/PaidList/'),
                            label: "Paid List",
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