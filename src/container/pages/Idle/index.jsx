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
// import { errorMonitor } from 'nedb';
import { setUser, navigate, setPin } from '../../../config/redux/actions/';
const { LIST_ACCOUNT, PIN, REKAP_TERTUNDA } = SQLiteTypes;


const Idle = (props) => {
    useEffect(() => {
        log('MOUNT OR UPDATE Idle', Connection());
        return () => {
            setUserPIN('');
            setPassword('');
            log('UNMOUNT Idle');
        }
    }, [])
    const dispatch = useDispatch();
    const [password, setPassword] = useState('');
    const [userPIN, setUserPIN] = useState('');
    const user = useSelector(state => state.user.profile);
    const device = useSelector(state => state.main.device);
    let [loginResult, setLoginResult] = useState([]);
    const _validate = async () => {
        if (Connection() == 'OFFLINE') {
            //LOGIN OFFLINE
            if (PIN == '') return false;
            let dvc = (!Device.android && !Device.ios) ? false : true;
            if (dvc) {
                let deviceInfo = await Device.getInformation();
                if (deviceInfo.serial != device.serial) {
                    setLoginResult([...loginResult, 'ICCIDAuth']);
                    return false;
                }
            }
            SQLite.query("SELECT value from COLLECTION where key=?", [PIN])
                .then(res => {
                    if (userPIN == res[0]) {
                        setUserPIN('');
                        setLoginResult([]);
                        props.onFinish({ result: true });
                    } else {
                        setUserPIN('');
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
                password: '12345678',
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
        f7.dialog.confirm('Keluar dan hapus data ?',
            () => {
                f7.dialog.confirm('Unggah data tertunda?',
                    () => {
                        if (Connection() != "OFFLINE") {
                            _getDelayedList()
                                .then(e => {
                                    // f7.preloader.hide();
                                    POST(`Logout`, { username: user.user_id })
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
                                                    f7.preloader.hide();
                                                    dispatch(setUser(updatedUser));
                                                    dispatch(setPin(updatedPIN));
                                                    props.onFinish({ result: true });
                                                    dispatch(navigate('/', true));
                                                }).catch(err => log(err));
                                            }
                                            f7.preloader.hide();
                                        })
                                        .catch(err => log("LOGOUT", err))
                                })
                                .catch(e => {
                                    f7.preloader.hide();
                                });
                            log('MASIH BELUM TAU HARUS DIAPAIN.')
                            // props.onFinish({ result: true });
                        }
                        // else{
                        //     f7.dialog.alert('Pastikan Perangkat terhubung dengan internet.');
                        // }
                    });
            });
        //
    }
    const _getDelayedList = () => {
        f7.preloader.show();
        return new Promise((resolve, reject) => {
            SQLite.query('SELECT value from Collection where key=?', [REKAP_TERTUNDA])
                .then(select => {
                    if (select.length == 0) {
                        resolve(true);
                        return;
                    }
                    if (select[0].length == 0) {
                        resolve(true);
                        return;
                    };
                    var params = [];
                    select[0].map((item) => {
                        params = [...params, [item.transaction_type == 'KUNJUNGAN' ? 'save_visit_history' : 'save_update_data', item]]
                    })
                    _kirimDataTertunda(params)
                        .then(res => {
                            log("HASIL KIRIM: ", res)
                            var gagalKirim = [];
                            res.map((item, index) => {
                                if (item == "GAGAL")
                                    gagalKirim = [...gagalKirim, select[0][index]]
                            })
                            SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [REKAP_TERTUNDA, gagalKirim])
                                .then(insert => gagalKirim.length != 0 ? reject("GAGAL KIRIM REKAP TERTUNDA") : resolve(true))
                                .catch(err => reject(err));
                        }).catch(err => reject(err))
                }).catch(err => reject(err));
        })
    }
    const _kirimDataTertunda = (params) => {
        let reqList = [];
        params.map(item =>
            reqList.push(
                new Promise((resolve, reject) => {
                    POST(...item)
                        .then(res => resolve(res.status != 'success' ? "GAGAL" : "BERHASIL")
                        ).catch(err => reject(err));
                })
            ));
        return Promise.all(reqList);
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
                Connection() == "OFFLINE" ?
                    (
                        <List inlineLabels noHairlinesMd>
                            <ListInput
                                outline
                                label="PIN"
                                type={"password"}
                                inputmode={"numeric"}
                                pattern="[0-9]*"
                                onChange={({ target }) => setUserPIN(target.value)}
                                maxlength={6}
                                minlength={4}
                                value={userPIN}
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
