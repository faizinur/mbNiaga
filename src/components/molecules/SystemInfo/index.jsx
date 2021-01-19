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

let INTERVAL_LENGTH = 60000;
let INTERVAL_ID = 0;
const SystemInfo = (props) => {
    useEffect(() => {
        log('MOUNT OR UPDATE SystemInfo');
        //server Time
        let serverTime = systemInfo.serverTime;
        setServerTime(serverTime);
        //device Time
        let date = new Date();
        let localTime = `${date.getHours()}:${date.getMinutes()}`; 
        setLocalTime(localTime);

        INTERVAL_ID = setInterval(
            () => {
                serverTime = clockTick(serverTime)
                localTime = clockTick(localTime)
                setServerTime(serverTime);
                setLocalTime(localTime);
                dispatch(
                    setUser({
                        ...systemInfo,
                        ...{
                            serverTime: serverTime,
                            localTime  : localTime,
                        }
                    })
                );
            },
            INTERVAL_LENGTH
        );

        return () => {
            log('UNMOUNT SystemInfo');
            clearInterval(INTERVAL_ID);
        }
    }, [])
    const dispatch = useDispatch();
    const systemInfo = useSelector(state => state.user.profile);
    const device = useSelector(state => state.main.device);

    const [serverTime, setServerTime] = useState('00:00');
    const [localTime, setLocalTime] = useState('00:00');

    return (
        <Block style={{ margin: 0, padding: 0 }}>
            <Row noGap>
                <Col tag="span">
                    <List style={{ margin: 0, padding: 0 }}>
                        <ListInput
                            outline
                            label="Nama"
                            type="text"
                            inputStyle={{ fontSize: 13 }}
                            value={systemInfo.name}
                            disabled={true}
                        />
                    </List>
                </Col>
                <Col tag="span">
                    <List style={{ margin: 0, padding: 0 }}>
                        <ListInput
                            outline
                            label="Waktu Server"
                            type="text"
                            inputStyle={{ fontSize: 13 }}
                            value={serverTime}
                            disabled={true}
                        />
                    </List>
                </Col>
            </Row>
            <Row noGap>
                <Col tag="span">
                    <List style={{ margin: 0, padding: 0 }}>
                        <ListInput
                            outline
                            label="Device ID"
                            type="text"
                            inputStyle={{ fontSize: 13 }}
                            value={device.uuid}
                            disabled={true}
                        />
                    </List>
                </Col>
                <Col tag="span">
                    <List style={{ margin: 0, padding: 0 }}>
                        <ListInput
                            outline
                            label="Waktu HP"
                            type="text"
                            inputStyle={{ fontSize: 13 }}
                            value={localTime}
                            disabled={true}
                        />
                    </List>
                </Col>
            </Row>
            <Row noGap>
                <Col width="50" tag="span">
                    <List style={{ margin: 0, padding: 0 }}>
                        <ListInput
                            outline
                            label="ICCID"
                            type="text"
                            inputStyle={{ fontSize: 13 }}
                            value={device.serial}
                            disabled={true}
                        />
                    </List>
                </Col>
            </Row>
        </Block>
    )
}

let clockTick = (props) => {
    let [hour, min] = props.split(':');
    hour = parseInt(hour);
    min = parseInt(min);
    if (min < 59) {
        min = min + 1;
    } else {
        min = 0;
        hour = (hour < 23) ? hour + 1 : 0;
    }

    return (hour < 10 ? '0' + hour : hour) + ':' + (min < 10 ? '0' + min : min)
}

export default SystemInfo;

