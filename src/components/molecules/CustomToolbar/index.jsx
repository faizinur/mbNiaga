import React, { useEffect, useState } from 'react';
import {
    Toolbar,
    Link,
    f7,
    Popup,
    Page,
    List,
    ListInput,
    Block,
    Col,
    Row,
    Button,
    LoginScreenTitle,
} from 'framework7-react';
import { useDispatch, useSelector } from "react-redux";
import { setUser, navigate, setPin } from '../../../config/redux/actions/';
import { log, POST, SQLite, SQLiteTypes } from '../../../utils';
const { LIST_ACCOUNT, PIN } = SQLiteTypes;
import { CustomToolbar as Strings } from '../../../utils/Localization';

const CustomToolbar = (props) => {
    useEffect(() => {
        log('MOUNT OR UPDATE CustomToolbar shown', JSON.stringify(props.shown));
        Strings.setLanguage(bahasa);
        return () => {
            setUsername('')
            log('UNMOUNT CustomToolbar');
        }
    }, []);
    const dispatch = useDispatch();
    const bahasa = useSelector(state => state.main.bahasa);
    let [popupStateLogout, setPopupStateLogout] = useState(false);
    let [username, setUsername] = useState("");
    const [tablinkActive, setTablinkActive] = useState(1);
    const [prevTablink, setPrevTablink] = useState(1);
    let user = useSelector(state => state.user.profile);
    let pin = useSelector(state => state.user.pin);

    const _setTablink = (index) => {
        if (!props.shown) return false;
        log('clicked index', index, JSON.stringify(props.shown))
        let currentRoute = f7.views.main.router.history[f7.views.main.router.history.length - 1];
        if (currentRoute == '/DeviceInfo/' && index == 0) return false;
        if (currentRoute == '/Main/' && index == 1) return false;
        if (currentRoute == '/UpdatePin/' && index == 2) return false;
        if (pin == "" && user.is_login == false) return false;

        setPrevTablink(tablinkActive);
        setTablinkActive(index);
        switch (index) {
            case 0: dispatch(navigate('/DeviceInfo/'));
                break;
            case 1: dispatch(navigate('/Main/'));
                break;
            case 2: dispatch(navigate('/UpdatePin/'));
                break;
            case 3: setPopupStateLogout(true);
                break;
            default:
        }
    }
    const _validate = () => {
        if (username == '') { f7.dialog.alert(Strings.emptyUsername); return false; }
        if (username.toUpperCase() != user.user_id.toUpperCase()) { f7.dialog.alert(Strings.errorUsername); return false; }
        POST(`Logout`, { username: username })
            .then(res => {
                if (res.status == 'success') {
                    let updatedUser = {
                        ...user,
                        ...{
                            is_login: false,
                        }
                    };
                    let updatedPIN = "";
                    Promise.all(
                        [SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [LIST_ACCOUNT, updatedUser])],
                        [SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [PIN, updatedPIN])]
                    ).then(res => {
                        dispatch(setUser(updatedUser));
                        dispatch(setPin(updatedPIN));
                        dispatch(navigate('/', true));
                        setTablinkActive(1);
                        setPopupStateLogout(false);
                    }).catch(err => log(err));
                } else {
                    _setTablink(prevTablink);
                }
            })
            .catch(err => log("LOGOUT", err) && _setTablink(prevTablink))
    }
    const _cancel = () => {
        setTablinkActive(prevTablink)
        setPopupStateLogout(false);
    }
    return (
        <div
            style={{
                width: '100%',
                height: 56,
                position: 'absolute',
                bottom: 0,
                left: 0,
                zIndex: 'shown' in props ? 9999 : 0,
                display: props.shown == false ? 'none' : 'block',
            }}>
            <Toolbar tabbar bottom labels>
                <Link
                    onClick={(e) => _setTablink(0)}
                    tabLink={true}
                    text={Strings.linkDevice}
                    iconIos="f7:error_outline"
                    iconAurora="f7:error_outline"
                    iconMd="material:error_outline"
                    tabLinkActive={tablinkActive == 0} />
                <Link
                    onClick={(e) => _setTablink(1)}
                    tabLink={true}
                    text={Strings.linkMenu}
                    iconIos="f7:menu"
                    iconAurora="f7:menu"
                    iconMd="material:menu"
                    tabLinkActive={tablinkActive == 1} />
                <Link
                    onClick={(e) => _setTablink(2)}
                    tabLink={true}
                    text={Strings.linkPIN}
                    iconIos="f7:lock"
                    iconAurora="f7:lock"
                    iconMd="material:lock"
                    tabLinkActive={tablinkActive == 2} />
                <Link
                    onClick={(e) => _setTablink(3)}
                    tabLink={true}
                    text={Strings.linkExit}
                    iconIos="f7:arrow_right_to_line_alt"
                    iconAurora="f7:arrow_right_to_line_alt"
                    iconMd="material:exit_to_app"
                    tabLinkActive={tablinkActive == 3} />
            </Toolbar>
            <Popup
                className="logout-popup"
                opened={popupStateLogout}
                onPopupClosed={() => setUsername('')}
            >
                <Page noToolbar noNavbar noSwipeback loginScreen name="Logout">
                    <LoginScreenTitle style={{ color: 'red' }}>Mobile Application Interaction</LoginScreenTitle>
                    <List inlineLabels noHairlinesMd>
                        <ListInput
                            outline
                            label={Strings.usernameLabel}
                            type="text"
                            value={username}
                            onChange={({ target }) => setUsername(target.value)}
                        />
                    </List>
                </Page>
                <div style={{ position: 'absolute', left: 0, bottom: 0, height: 58, width: '100%', backgroundColor: '#666666', zIndex: 99 }}>
                    <Block style={{ margin: 0, padding: 0 }}>
                        <Row>
                            <Col width="50">
                                <Block style={{ margin: 12 }}>
                                    <Row>
                                        <Col width="100">
                                            <Button
                                                onClick={() => _validate()}
                                                round
                                                style={{ backgroundColor: '#0085FC', color: '#ffffff' }}
                                                text={Strings.logout}
                                            />
                                        </Col>
                                    </Row>
                                </Block>
                            </Col>
                            <Col width="50">
                                <Block style={{ margin: 12 }}>
                                    <Row>
                                        <Col width="100">
                                            <Button
                                                onClick={() => _cancel()}
                                                round
                                                style={{ backgroundColor: '#FF6666', color: '#ffffff' }}
                                                text={Strings.cancel}
                                            />
                                        </Col>
                                    </Row>
                                </Block>
                            </Col>
                        </Row>
                    </Block>
                </div>
            </Popup>
        </div>
    )
}

export default CustomToolbar;
