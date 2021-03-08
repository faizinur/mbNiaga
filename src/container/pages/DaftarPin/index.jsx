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
import { DaftarPin as Strings } from '../../../utils/Localization';

const DaftarPin = (props) => {
    useEffect(() => {
        log('MOUNT OR UPDATE DaftarPin' );
        Strings.setLanguage(bahasa);
        return () => {
            log('UNMOUNT DaftarPin');
        }
    }, [bahasa]);
    const dispatch = useDispatch();
    const bahasa = useSelector(state => state.main.bahasa);
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
        <div>
            <Page noToolbar noNavbar style={{ fontSize: 10, paddingBottom: 60 }}>
                <List noHairlinesMd>
                    {
                        'onValidatePIN' in props ?
                            <List noHairlinesMd>
                                <ListItem
                                    title={Strings.loginTitle} style={{ alignItems: 'center' }}
                                />
                                <ListInput
                                    outline
                                    label={Strings.loginPinLabel}
                                    type={"password"}
                                    inputmode={"numeric"}
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
                                    title={Strings.registerTitle} style={{ alignItems: 'center' }}
                                />
                                <ListInput
                                    outline
                                    label={Strings.pinLabel}
                                    type={"password"}
                                    inputmode={"numeric"}
                                    pattern="[0-9]*"
                                    onChange={({ target }) => setNewPIN(target.value)}
                                    maxlength={6}
                                    minlength={4}
                                    value={newPIN}
                                />
                                <ListInput
                                    outline
                                    label={Strings.konfirmasiLabel}
                                    type={"password"}
                                    inputmode={"numeric"}
                                    pattern="[0-9]*"
                                    onChange={({ target }) => setConfirmPIN(target.value)}
                                    maxlength={6}
                                    minlength={4}
                                    value={confirmPIN}
                                />
                            </List>
                    }
                </List>
            </Page>
            <div style={{ position: 'absolute', left: 0, bottom: 0, height: 58, width: '100%', backgroundColor: '#666666', zIndex: 99 }}>
                <Block style={{ margin: 0, padding: 0 }}>
                    <Row>
                        <Col width="100">
                            <Block style={{ margin: 12 }}>
                                <Row>
                                    <Col width="100">
                                        <Button
                                            onClick={() =>
                                                'onSubmitPIN' in props ?
                                                    _submitPIN() :
                                                    ('onValidatePIN' in props ?
                                                        _validatePIN() :
                                                        _next())
                                            }
                                            round
                                            style={{ backgroundColor: '#0085FC', color: '#ffffff' }}
                                            text={Strings.next}
                                        />
                                    </Col>
                                </Row>
                            </Block>
                        </Col>
                    </Row>
                </Block>
            </div>
        </div>
    )
}

export default DaftarPin;


