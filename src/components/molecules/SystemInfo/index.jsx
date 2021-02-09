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
            <Row noGap style={{padding:5, backgroundColor:'#e4e4e4'}}>
                <Col width="50"><p style={{margin:0, fontSize:11}}>Nama : {systemInfo.full_name}</p></Col>
                <Col width="50"><p style={{margin:0, fontSize:11}}>Waktu Server : {systemInfo.jam_server}</p></Col>
                <Col width="50"><p style={{margin:0, fontSize:11}}>Device ID : {device.uuid}</p></Col>
                <Col width="50"><p style={{margin:0, fontSize:11}}>Waktu HP : {systemInfo.mobileTime}</p></Col>
                <Col width="50"><p style={{margin:0, fontSize:11}}>ICCID : {device.serial}</p></Col>
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

