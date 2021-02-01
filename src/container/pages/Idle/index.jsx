import React, { useEffect, useState } from 'react';
import {
    Block,
    Col,
    Page,
    LoginScreenTitle,
    List,
    ListItem,
    CardContent,
    Icon,
    Button,
    ListInput,
    Row,
    f7,
    Popup
} from 'framework7-react';
import { useDispatch, useSelector } from "react-redux";
import { log, Connection, SQLite, SQLiteTypes, POST } from '../../../utils/';
import { Device } from 'framework7/framework7-lite.esm.bundle.js';
import PropTypes from 'prop-types';
import stylesheet from './stylesheet';
import { DefaultNavbar } from '../../../components/atoms';

const Idle = (props) => {
    useEffect(() => {
        log('MOUNT OR UPDATE Idle', props.Connection);
        return () => {
            setPIN('');
            setPassword('');
            log('UNMOUNT Idle');
        }
    }, [])
    const [password, setPassword] = useState('');
    const [PIN, setPIN] = useState('');
    const user = useSelector(state => state.user.profile);
    const device = useSelector(state => state.main.device);
    let [loginResult, setLoginResult] = useState([]);
    const _validate = async () => {
        if (props.Connection == 'OFFLINE') {
            //LOGIN ONLINE
            let dvc = (!Device.android && !Device.ios) ? false : true;
            if (dvc) {
                let deviceInfo = await Device.getInformation();
                if (deviceInfo.serial != device.serial) {
                    setLoginResult([...loginResult, 'ICCIDAuth']);
                    return false;
                }
            }
            SQLite.query("SELECT value from COLLECTION where key=?", [SQLiteTypes.PIN])
                .then(res => {
                    if (PIN == res[0]) {
                        setPIN('');
                        setLoginResult([]);
                        props.onFinish({ result: true });
                    } else {
                        setPIN('');
                        setLoginResult([...loginResult, 'UserAuth']);
                    }
                })
                .catch(err => log(err));
        } else {
            //LOGIN ONLINE
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hours = date.getHours();
            var minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
            var seconds = date.getSeconds();
            const { uuid, serial } = device;

            var data = {
                username: user.user_id,
                password: password,
                imei: JSON.stringify(uuid),
                iccd: JSON.stringify(serial),
                jam_mobile: `${year}-${month < 9 ? '0' + month : month}-${day} ${hours}:${minutes}:${seconds}`,
            }
            POST(`Login`, data)
                .then(res => {
                    props.onFinish({ result: true });
                    setPassword('');
                })
                .catch(err => {
                    setPassword('');
                    switch (err) {
                        case 'Username/Password tidak valid': setLoginResult([...loginResult, 'UserAuth']);
                            break;
                        default: log(err)
                    }
                });
        }
    }
    const _exit = () => {
        // props.onFinish({ result: 'exit' });
        f7.dialog.alert('EXIT')
    }
    return (
        <Page noToolbar noNavbar noSwipeback loginScreen name="Idle">
            <LoginScreenTitle style={stylesheet.LoginScreenTitle}>Mobile Application Interaction</LoginScreenTitle>
            <List inlineLabels noHairlinesMd>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <p>STANDBY MODE <br />HI <b>{'full_name' in user ? user.full_name.toUpperCase() : '~'}</b>, PLEASE RELOGIN</p>
                </div>
            </List>
            {
                props.Connection == "OFFLINE" ?
                    (
                        <List inlineLabels noHairlinesMd>
                            <ListInput
                                outline
                                label="PIN"
                                type={"password"}
                                inputmode={"tel"}
                                pattern="[0-9]*"
                                onChange={({ target }) => setPIN(target.value)}
                                maxlength={6}
                                minlength={4}
                                value={PIN}
                            />
                        </List>
                    ) : (
                        <List inlineLabels noHairlinesMd>
                            <ListInput
                                outline
                                label="Password :"
                                type="password"
                                value={password}
                                onChange={({ target }) => setPassword(target.value)}
                            />
                        </List>
                    )
            }
            <List noHairlinesMd>
                <Block>
                    <Row>
                        <Col width="50">
                            <Button
                                onClick={() => _validate()}
                                round
                                style={{ backgroundColor: '#c0392b', color: 'white' }}
                                text="Login"
                            />
                        </Col>
                        <Col width="50">
                            <Button
                                onClick={() => _exit()}
                                round
                                style={{ backgroundColor: '#c0392b', color: 'white' }}
                                text="Exit"
                            />
                        </Col>
                    </Row>
                </Block>
            </List>
            <Popup
                className="failedIdle-popup"
                opened={loginResult.length > 0 ? true : false}
                onPopupClosed={() => log('pop up Closed')}
            >
                <Page noToolbar noNavbar>
                    <DefaultNavbar
                        mode="info"
                        backLink={(e) => setLoginResult([])}
                        title={'Gagal Login'}
                    />
                    <CardContent padding={false}>
                        <List medial-list style={{ marginRight: 20, marginLeft: 20, fontSize: 12 }}>
                            <ListItem style={{ color: 'white', backgroundColor: '#c0392b', flex: 1, flexDirection: 'row', marginBottom: 5 }} title="User ID dan Password anda belum sesuai">
                                <Icon f7={loginResult.includes('UserAuth') ? "xmark_rectangle_fiil" : "checkmark_rectangle"}></Icon>
                            </ListItem>
                            <ListItem style={{ color: 'white', backgroundColor: '#c0392b', flex: 1, flexDirection: 'row', marginBottom: 5 }} title="Device id anda sesuai">
                                <Icon f7={loginResult.includes('ICCIDAuth') ? "xmark_rectangle_fiil" : "checkmark_rectangle"}></Icon>
                            </ListItem>
                        </List>
                    </CardContent>
                </Page>
            </Popup>
        </Page>
    )
}

Idle.propTypes = {
    onFinish: PropTypes.func,
};


export default Idle;
