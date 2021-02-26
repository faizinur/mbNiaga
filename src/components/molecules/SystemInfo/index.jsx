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

import { log } from '../../../utils';

const SystemInfo = (props) => {
    useEffect(() => {
        log('MOUNT OR UPDATE SystemInfo');
        return () => {
            log('UNMOUNT SystemInfo');
        }
    }, [])
    const dispatch = useDispatch();
    const systemInfo = useSelector(state => state.user.profile);
    const device = useSelector(state => state.main.device);

    return (
        <Block style={{ margin: 0, padding: 0 }}>
            <Row noGap>
                <Col width="30" style={{ height: '100%', marginLeft: 5, marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>Agent Name</Col>
                <Col width="65" style={{ height: '100%', marginRight: 5, marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>{systemInfo.full_name}</Col>
            </Row>
            <Row noGap>
                <Col width="30" style={{ height: '100%', marginLeft: 5, marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>Device ID</Col>
                <Col width="65" style={{ height: '100%', marginRight: 5, marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>{device.uuid}</Col>
            </Row>
            <Row noGap>
                <Col width="30" style={{ height: '100%', marginLeft: 5, marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>ICCID</Col>
                <Col width="65" style={{ height: '100%', marginRight: 5, marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>{device.serial}</Col>
            </Row>
            <Row noGap>
                <Col width="30" style={{ height: '100%', marginLeft: 5, marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>Waktu Server</Col>
                <Col width="65" style={{ height: '100%', marginRight: 5, marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>{systemInfo.jam_server}</Col>
            </Row>
            <Row noGap>
                <Col width="30" style={{ height: '100%', marginLeft: 5, marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>Waktu HP</Col>
                <Col width="65" style={{ height: '100%', marginRight: 5, marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>{systemInfo.mobileTime}</Col>
            </Row>
        </Block>
    )
    // return (
    //     <Block style={{ margin: 0, padding: 0 }}>
    //         <Row noGap>
    //             <Col tag="span">
    //                 <List style={{ margin: 0, padding: 0 }}>
    //                     <ListInput
    //                         outline
    //                         label="Nama"
    //                         type="text"
    //                         inputStyle={{ fontSize: 13 }}
    //                         value={systemInfo.full_name}
    //                         disabled={true}
    //                     />
    //                 </List>
    //             </Col>
    //             <Col tag="span">
    //                 <List style={{ margin: 0, padding: 0 }}>
    //                     <ListInput
    //                         outline
    //                         label="Waktu Server"
    //                         type="text"
    //                         inputStyle={{ fontSize: 13 }}
    //                         value={systemInfo.jam_server}
    //                         disabled={true}
    //                     />
    //                 </List>
    //             </Col>
    //         </Row>
    //         <Row noGap>
    //             <Col tag="span">
    //                 <List style={{ margin: 0, padding: 0 }}>
    //                     <ListInput
    //                         outline
    //                         label="Device ID"
    //                         type="text"
    //                         inputStyle={{ fontSize: 13 }}
    //                         value={device.uuid}
    //                         disabled={true}
    //                     />
    //                 </List>
    //             </Col>
    //             <Col tag="span">
    //                 <List style={{ margin: 0, padding: 0 }}>
    //                     <ListInput
    //                         outline
    //                         label="Waktu HP"
    //                         type="text"
    //                         inputStyle={{ fontSize: 13 }}
    //                         value={systemInfo.mobileTime}
    //                         disabled={true}
    //                     />
    //                 </List>
    //             </Col>
    //         </Row>
    //         <Row noGap>
    //             <Col width="50" tag="span">
    //                 <List style={{ margin: 0, padding: 0 }}>
    //                     <ListInput
    //                         outline
    //                         label="ICCID"
    //                         type="text"
    //                         inputStyle={{ fontSize: 13 }}
    //                         value={device.serial}
    //                         disabled={true}
    //                     />
    //                 </List>
    //             </Col>
    //         </Row>
    //     </Block>
    // )
}


export default SystemInfo;

