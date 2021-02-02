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
const CustomToolbar = (props) => {
    useEffect(() => {
        log('MOUNT OR UPDATE CustomToolbar shown', JSON.stringify(props.shown));
        return () => {
            setUsername('')
            log('UNMOUNT CustomToolbar');
        }
    }, []);
    const dispatch = useDispatch();
    let [popupStateLogout, setPopupStateLogout] = useState(false);
    let [username, setUsername] = useState("");
    const [tablinkActive, setTablinkActive] = useState(0);
    const [prevTablink, setPrevTablink] = useState(0);
    let user = useSelector(state => state.user.profile);

    const _setTablink = (index) => {
        if (!props.shown) return false;
        log('clicked index', index, JSON.stringify(props.shown))
        setPrevTablink(tablinkActive);
        setTablinkActive(index);
        let currentRoute = f7.views.main.router.history[f7.views.main.router.history.length - 1];
        if (currentRoute == '/Main/' && index == 0) return false;
        if (currentRoute == '/UpdatePin/' && index == 1) return false;
        switch (index) {
            case 0: dispatch(navigate('/Main/'));
                break;
            case 1: dispatch(navigate('/UpdatePin/'));
                break;
            case 2: setPopupStateLogout(true);
                break;
            default:
        }
    }
    const _validate = () => {
        if (username == '') { f7.dialog.alert('USERNAME tidak boleh kosong'); return false; }
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
                        setTablinkActive(0);
                        setPopupStateLogout(false);
                    }).catch(err => log(err));
                } else {
                    _setTablink(prevTablink);
                }
            })
            .catch(err => log("LOGOUT", err) && _setTablink(prevTablink))
    }
    const _cancel = () => {
        _setTablink(prevTablink);
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
                    text="MENU"
                    iconIos="f7:menu"
                    iconAurora="f7:menu"
                    iconMd="material:menu"
                    tabLinkActive={tablinkActive == 0} />
                <Link
                    onClick={(e) => _setTablink(1)}
                    tabLink={true}
                    text="UBAH PIN"
                    iconIos="f7:lock"
                    iconAurora="f7:lock"
                    iconMd="material:lock"
                    tabLinkActive={tablinkActive == 1} />
                <Link
                    onClick={(e) => _setTablink(2)}
                    tabLink={true}
                    text="KELUAR"
                    iconIos="f7:arrow_right_to_line_alt"
                    iconAurora="f7:arrow_right_to_line_alt"
                    iconMd="material:exit_to_app"
                    tabLinkActive={tablinkActive == 2} />
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
                            label="username :"
                            type="text"
                            value={username}
                            onChange={({ target }) => setUsername(target.value)}
                        />
                    </List>
                    <List noHairlinesMd>
                        <Block>
                            <Row>
                                <Col width="50">
                                    <Button
                                        onClick={() => _validate()}
                                        round
                                        style={{ backgroundColor: '#c0392b', color: 'white' }}
                                        text="Log Out"
                                    />
                                </Col>
                                <Col width="50">
                                    <Button
                                        onClick={() => _cancel()}
                                        round
                                        style={{ backgroundColor: '#c0392b', color: 'white' }}
                                        text="Batal"
                                    />
                                </Col>
                            </Row>
                        </Block>
                    </List>
                </Page>
            </Popup>
        </div>
    )
}

export default CustomToolbar;
