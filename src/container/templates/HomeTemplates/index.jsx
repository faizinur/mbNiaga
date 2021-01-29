import React, { Component } from 'react';
import {
    Views,
    View,
    Toolbar,
    Link,
    f7,
    Page,
} from 'framework7-react';
import { connect } from 'react-redux';
import { log } from '../../../utils/';
import { updateUser, setUser, navigate } from '../../../config/redux/actions';
import { POST } from '../../../utils/';

class HomeTemplates extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tablinkActive : 0,
        };
    }

    _setTabLink = (index) => {
        let currentRoute = f7.views.main.router.history[f7.views.main.router.history.length - 1];
        if (currentRoute == '/Main/' && index == 0) return false;
        if (currentRoute == '/UpdatePin/' && index == 1) return false;
        switch (index) {
            case 0:
                this.props.navigate('/Main/');
                this.setState({ tablinkActive: index });
                break;
            case 1:
                this.props.navigate('/UpdatePin/');
                this.setState({ tablinkActive: index });
                break;
            case 2:
                let prevState = this.state.tablinkActive;
                this.setState({ tablinkActive: index });
                f7.dialog.confirm(
                    'Apakah anda yakin ingin keluar?',
                    () => {
                        f7.dialog.prompt(
                            'Harap masukkan username anda.',
                            (data) =>
                                POST(`Logout`, { username: data })
                                    .then(res => {
                                        log(res.status);
                                        if (res.status == 'success') {
                                            this.props.setUser({});
                                            this.props.navigate('/');
                                            this.setState({ tablinkActive: 0 });
                                        } else {
                                            this.setState({ tablinkActive: prevState });
                                        }
                                    })
                                    .catch(err => log("LOGOUT", err) && this.setState({ tablinkActive: prevState }))
                            ,
                            () =>
                                this.setState({ tablinkActive: prevState }))
                    },
                    () =>
                        this.setState({ tablinkActive: prevState })
                )
                break;
            default: this.setState({ tablinkActive: 0 })
        }
    }

    render() {
        const { tablinkActive } = this.state;
        return (
            <Page pageName="HomeTemplates">
                {
                    Object.keys(this.props.profile).length > 1 ?
                        (
                            <div
                                style={{
                                    width: '100%',
                                    height: 56,
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    zIndex: 9999,
                                }}>
                                <Toolbar tabbar bottom labels>
                                    <Link
                                        onClick={(e) => this._setTabLink(0)}
                                        tabLink={true}
                                        text="MENU"
                                        iconIos="f7:menu"
                                        iconAurora="f7:menu"
                                        iconMd="material:menu"
                                        tabLinkActive={tablinkActive == 0} />
                                    <Link
                                        onClick={(e) => this._setTabLink(1)}
                                        tabLink={true}
                                        text="UBAH PIN"
                                        iconIos="f7:lock"
                                        iconAurora="f7:lock"
                                        iconMd="material:lock"
                                        tabLinkActive={tablinkActive == 1} />
                                    <Link
                                        onClick={(e) => this._setTabLink(2)}
                                        tabLink={true}
                                        text="KELUAR"
                                        iconIos="f7:arrow_right_to_line_alt"
                                        iconAurora="f7:arrow_right_to_line_alt"
                                        iconMd="material:exit_to_app"
                                        tabLinkActive={tablinkActive == 2} />
                                </Toolbar>
                            </div>
                        ) :
                        (<></>)
                }
                <Views className="safe-areas">
                    <View main url="/Main/" />
                </Views>
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
		navigate: (nav) => dispatch(navigate(nav)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeTemplates);;
