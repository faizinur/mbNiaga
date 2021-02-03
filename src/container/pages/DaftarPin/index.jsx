import React, { useEffect, useState } from 'react';
import {
    Page,
    f7,
    List,
    ListInput,
    Block,
    Row,
    Col,
    Button,
    ListItem
} from 'framework7-react';

import { navigate } from '../../../config/redux/actions/routerActions';
import { log } from '../../../utils/';
import { useDispatch, useSelector } from "react-redux";
import Login from '../Login';

const DaftarPin = (props) => {
    useEffect(() => {
        log('MOUNT OR UPDATE DaftarPin');
        return () => {
            log('UNMOUNT DaftarPin');
        }
    }, []);
    const dispatch = useDispatch();
    const [newPIN, setNewPIN] = useState('');
    const [confirmPIN, setConfirmPIN] = useState('');
    const _next = () => log('DaftarPin : Nothing...');//dispatch(navigate('/Main/'))
    const _submitPIN = () => {
        if (newPIN == '' || confirmPIN == '') { f7.dialog.alert('PIN tidak boleh kosong'); return false; }
        if (newPIN != confirmPIN) { f7.dialog.alert('PIN beda'); return false; }
        let pin = newPIN;
        setNewPIN('');
        setConfirmPIN('');
        props.onSubmitPIN(pin);
    }
    const _validatePIN = () => {
        if (newPIN == '') { f7.dialog.alert('PIN tidak boleh kosong'); return false; }
        let pin = newPIN;
        setNewPIN('');
        props.onValidatePIN(pin);
    }
    return (
        <Page noToolbar noNavbar style={{ fontSize: 10, paddingBottom: 60 }}>
            <List noHairlinesMd>
                {
                    'onValidatePIN' in props ?
                        <List noHairlinesMd>
                            <ListItem
                                title="Masukkan PIN anda" style={{ alignItems: 'center' }}
                            />
                            <ListInput
                                outline
                                label="Masukan PIN"
                                type={"password"}
                                inputmode={"tel"}
                                pattern="[0-9]*"
                                onChange={({ target }) => setNewPIN(target.value)}
                                maxlength={6}
                                minlength={4}
                                value={newPIN}
                            />
                        </List>
                        :
                        <List noHairlinesMd>
                            <ListItem
                                title="Daftar PIN" style={{ alignItems: 'center' }}
                            />

                            <ListInput
                                outline
                                label="Masukan PIN Baru"
                                type={"password"}
                                inputmode={"tel"}
                                pattern="[0-9]*"
                                onChange={({ target }) => setNewPIN(target.value)}
                                maxlength={6}
                                minlength={4}
                                value={newPIN}
                            />
                            <ListInput
                                outline
                                label="Konfirmasi PIN Baru"
                                type={"password"}
                                inputmode={"tel"}
                                pattern="[0-9]*"
                                onChange={({ target }) => setConfirmPIN(target.value)}
                                maxlength={6}
                                minlength={4}
                                value={confirmPIN}
                            />
                        </List>
                }
            </List>
            <List>
                <Block strong>
                    <Row>
                        <Col width="100">
                            <Button
                                fill
                                raised
                                onClick={() =>
                                    'onSubmitPIN' in props ?
                                        _submitPIN() :
                                        ('onValidatePIN' in props ?
                                            _validatePIN() :
                                            _next())
                                }
                                style={{ backgroundColor: '#c0392b' }}
                            >Next</Button>
                        </Col>
                    </Row>
                </Block>
            </List>
        </Page>
    )
}

export default DaftarPin;


