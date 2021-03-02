import React, { useEffect, useState } from 'react';
import {
    Page,
    f7,
    List,
    ListInput,
    Block,
    BlockTitle,
    Row,
    Col,
    Button
} from 'framework7-react';

import { useDispatch, useSelector } from "react-redux";
import { navigate, setPin } from '../../../config/redux/actions/';
import { log, SQLite, SQLiteTypes } from '../../../utils';
import { CustomBlockTitle } from '../../../components/atoms'
const { PIN } = SQLiteTypes;

const UpdatePin = () => {
    useEffect(() => {
        log('MOUNT OR UPDATE UpdatePin');
        return () => {
            log('UNMOUNT UpdatePin');
        }
    }, []);
    const dispatch = useDispatch();
    const [oldPIN, setOldPIN] = useState('');
    const [newPIN, setNewPIN] = useState('');
    const [confirmPIN, setConfirmPIN] = useState('');

    const _onChangePIN = () => {
        if (oldPIN == '' || newPIN == '' || confirmPIN == '') { f7.dialog.alert('PIN tidak boleh kosong'); return false; }
        SQLite.query('SELECT value FROM COLLECTION WHERE key=?', [PIN])
            .then(res => {
                log(res[0])
                if (res[0] == oldPIN) {
                    if (newPIN === confirmPIN) {
                        SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [PIN, newPIN])
                            .then(res => {
                                setOldPIN('');
                                setNewPIN('');
                                setConfirmPIN('');
                                dispatch(setPin(newPIN));
                                f7.dialog.alert('PIN BERHASIL DIUBAH');
                            })
                            .catch(err => log(err))
                    } else {
                        f7.dialog.alert('PIN baru tidak sama');
                        return false;
                    }
                } else {
                    f7.dialog.alert('PIN lama belum benar');
                    return false;
                }
            })
            .then(err => log(err))
    }
    const _onCancel = () => {
        setOldPIN('');
        setNewPIN('');
        setConfirmPIN('');
    }
    return (
        <Page noToolbar noNavbar>
            <BlockTitle>Ubah PIN</BlockTitle>
            <CustomBlockTitle title="Insert Previous PIN" />
            <List noHairlinesMd>
                <ListInput
                    outline
                    // label="Masukan PIN Lama"
                    type={"password"}
                    inputmode={"numeric"}
                    pattern="[0-9]*"
                    value={oldPIN}
                    onChange={({ target }) => setOldPIN(target.value)}
                    maxlength={6}
                    minlength={4}
                />
            </List>
            <CustomBlockTitle title="Insert New PIN" />
            <List noHairlines>
                <ListInput
                    outline
                    // label="Masukan PIN Baru"
                    type={"password"}
                    inputmode={"numeric"}
                    pattern="[0-9]*"
                    value={newPIN}
                    onChange={({ target }) => setNewPIN(target.value)}
                    maxlength={6}
                    minlength={4}
                />
            </List>
            <CustomBlockTitle title="Confirmation New PIN" />
            <List noHairlines>
                <ListInput
                    outline
                    // label="Konfirmasi PIN Baru"
                    type={"password"}
                    inputmode={"numeric"}
                    pattern="[0-9]*"
                    value={confirmPIN}
                    onChange={({ target }) => setConfirmPIN(target.value)}
                    maxlength={6}
                    minlength={4}
                />
            </List>
            <div style={{ position: 'absolute', left: 0, bottom: 56, height: 58, width: '100%', backgroundColor: '#666666', zIndex: 99, display: (oldPIN != '' || newPIN != '' || confirmPIN != '') ? 'block' : 'none' }}>
                <Block style={{ margin: 0, padding: 0 }}>
                    <Row>
                        <Col width="50">
                            <Block style={{ margin: 12 }}>
                                <Row>
                                    <Col width="100">
                                        <Button
                                            onClick={() => _onChangePIN()}
                                            round
                                            style={{ backgroundColor: '#0085FC', color: '#ffffff' }}
                                            text="Save"
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
                                            onClick={() => _onCancel()}
                                            round
                                            style={{ backgroundColor: '#FF6666', color: '#ffffff' }}
                                            text="Cancel"
                                        />
                                    </Col>
                                </Row>
                            </Block>
                        </Col>
                    </Row>
                </Block>
            </div>
        </Page>
    )
}

export default UpdatePin;
