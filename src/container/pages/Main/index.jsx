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
import { Main as Strings } from '../../../utils/Localization';
class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            language: props.bahasa,
        }
        Strings.setLanguage(this.state.language);
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
                    title={Strings.title}
                    network={Connection()}
                />
                <SystemInfo />
                <ListMenu
                    item={[
                        {
                            onClick: (e) => this.props.navigate('/ListDebitur/'),
                            label: Strings.CustomerMenu,
                            image: "list_debitur.png",
                        },
                        {
                            onClick: (e) => this.props.navigate('/RencanaKunjungan/'),
                            label: Strings.VisitMenu,
                            image: "rencana_kunjungan.png",
                        },
                        {
                            onClick: (e) => this.props.navigate('/RekapTertunda/'),
                            label: Strings.PostphonedMenu,
                            image: "rekap_tertunda.png",
                        },
                        {
                            onClick: (e) => this.props.navigate('/RekapTerkirim/'),
                            label: Strings.SentMenu,
                            image: "rekap_terkirim.png",
                        },
                        {
                            onClick: (e) => this.props.navigate('/VisitedList/'),
                            label: Strings.VisitedMenu,
                            image: "list_kunjungan.png",
                        },
                        // {
                        //     onClick: (e) => this.props.navigate('/PaidList/'),
                        //     label: "Paid List",
                        //     image: "Information.png",
                        // },
                    ]}
                />
            </Page>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        profile: state.user.profile,
        bahasa: state.main.bahasa,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (nav) => dispatch(navigate(nav))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);