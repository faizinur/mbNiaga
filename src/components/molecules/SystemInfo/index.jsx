import React, { useEffect, useState } from 'react'
import {
    List,
    ListInput,
    Block,
    Row,
    Col,
} from 'framework7-react';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from '../../../config/redux/actions/';
import { SystemInfo as Strings } from '../../../utils/Localization';

import { log } from '../../../utils';

const SystemInfo = (props) => {
    useEffect(() => {
        log('MOUNT OR UPDATE SystemInfo');
        Strings.setLanguage(bahasa);
        return () => {
            log('UNMOUNT SystemInfo');
        }
    }, [])
    const dispatch = useDispatch();
    const bahasa = useSelector(state => state.main.bahasa);
    const systemInfo = useSelector(state => state.user.profile);
    const device = useSelector(state => state.main.device);

    return (
        <Block style={{ margin: 0, padding: 0 }}>
            <Row noGap>
                <Col width="30" style={{ height: '100%', marginLeft: 5, marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>{Strings.agentName}</Col>
                <Col width="65" style={{ height: '100%', marginRight: 5, marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>{systemInfo.full_name}</Col>
            </Row>
            <Row noGap>
                <Col width="30" style={{ height: '100%', marginLeft: 5, marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>{Strings.deviceId}</Col>
                <Col width="65" style={{ height: '100%', marginRight: 5, marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>{device.uuid}</Col>
            </Row>
            <Row noGap>
                <Col width="30" style={{ height: '100%', marginLeft: 5, marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>{Strings.iccid}</Col>
                <Col width="65" style={{ height: '100%', marginRight: 5, marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>{device.serial}</Col>
            </Row>
            <Row noGap>
                <Col width="30" style={{ height: '100%', marginLeft: 5, marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>{Strings.serverTime}</Col>
                <Col width="65" style={{ height: '100%', marginRight: 5, marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>{systemInfo.jam_server}</Col>
            </Row>
            <Row noGap>
                <Col width="30" style={{ height: '100%', marginLeft: 5, marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>{Strings.deviceTime}</Col>
                <Col width="65" style={{ height: '100%', marginRight: 5, marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>{systemInfo.mobileTime}</Col>
            </Row>
        </Block>
    )
}

export default SystemInfo;