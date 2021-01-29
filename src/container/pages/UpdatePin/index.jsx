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
const { PIN } = SQLiteTypes;

const UpdatePin = () => {
    useEffect(() => {
        console.log('MOUNT OR UPDATE UpdatePin');
        return () => {
            console.log('UNMOUNT UpdatePin');
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
                        SQLite.query('INSERT OR REPLACE INTO COLLECTION (id, key, value) VALUES(?,?,?)', [PIN, newPIN])
                        .then(res => {
                            setOldPIN('');
                            setNewPIN('');
                            setConfirmPIN('');
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
    return (
        <Page noToolbar noNavbar>
            <BlockTitle>Ubah PIN</BlockTitle>
            <List noHairlinesMd>
                <ListInput
                    outline
                    label="Masukan PIN Lama"
                    type={"password"}
                    inputmode={"tel"}
                    pattern="[0-9]*"
                    value={oldPIN}
                    onChange={({ target }) => setOldPIN(target.value)}
                    maxlength={6}
                    minlength={4}
                >
                </ListInput>
                <ListInput
                    outline
                    label="Masukan PIN Baru"
                    type={"password"}
                    inputmode={"tel"}
                    pattern="[0-9]*"
                    value={newPIN}
                    onChange={({ target }) => setNewPIN(target.value)}
                    maxlength={6}
                    minlength={4}
                >
                </ListInput>
                <ListInput
                    outline
                    label="Konfirmasi PIN Baru"
                    type={"password"}
                    inputmode={"tel"}
                    pattern="[0-9]*"
                    value={confirmPIN}
                    onChange={({ target }) => setConfirmPIN(target.value)}
                    maxlength={6}
                    minlength={4}
                >
                </ListInput>
            </List>
            <List>
                <Block strong>
                    <Row>
                        <Col width="100">
                            <Button fill raised onClick={() => _onChangePIN()} style={{ backgroundColor: '#c0392b' }}>Next</Button>
                        </Col>
                    </Row>
                </Block>
            </List>
        </Page>
    )
}

export default UpdatePin;
