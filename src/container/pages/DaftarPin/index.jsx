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

const DaftarPin = (props) => {
    useEffect(() => {
        console.log('MOUNT OR UPDATE DaftarPin');
        return () => {
            console.log('UNMOUNT DaftarPin');
        }
    }, []);
    const dispatch = useDispatch();
    const [newPIN, setNewPIN] = useState('');
    const [confirmPIN, setConfirmPIN] = useState('');
    const _next = () => dispatch(navigate('/Main/'))
    const _submitPIN = () => {
        if (newPIN == '' || confirmPIN == '') {  f7.dialog.alert('PIN tidak boleh kosong'); return false; }
        if (newPIN != confirmPIN) {  f7.dialog.alert('PIN beda'); return false; }
        props.onSubmitPin(newPIN)
    }
    return (
        <Page noToolbar noNavbar style={{ fontSize: 10, paddingBottom: 60 }}>
            <List noHairlinesMd>
                <ListItem
                    title="Daftar PIN" style={{ alignItems: 'center' }}
                />
                <ListInput
                    outline
                    label="Masukan PIN Baru"
                    type="number"
                    onChange={({ target }) => setNewPIN(target.value)}
                    maxlength={6}
                    minlength={4}
                />
                <ListInput
                    outline
                    label="Konfirmasi PIN Baru"
                    type="number"
                    onChange={({ target }) => setConfirmPIN(target.value)}
                    maxlength={6}
                    minlength={4}
                />
            </List>
            <List>
                <Block strong>
                    <Row>
                        <Col width="100">
                            <Button fill raised onClick={() => 'onSubmitPin' in props ? _submitPIN() : _next()} style={{ backgroundColor: '#c0392b' }}>Next</Button>
                        </Col>
                    </Row>
                </Block>
            </List>
        </Page>
    )
}

export default DaftarPin;


