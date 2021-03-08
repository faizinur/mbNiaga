import React, { Component, useEffect, useState } from 'react';
import {
    Page,
    Navbar,
    List,
    ListInput,
    Block,
    Row,
    Col,
    Button
} from 'framework7-react';
import { useDispatch, useSelector } from "react-redux";
import { navigate } from '../../../config/redux/actions/';
import { log } from '../../../utils';
import { DefaultNavbar } from '../../../components/atoms/';
const DeviceInfo = (props) => {
    useEffect(() => {
        log('MOUNT OR UPDATE DeviceInfo');
        return () => {
            log('UNMOUNT DeviceInfo');
        }
    }, [])
    const device = useSelector(state => state.main.device);
    const dispatch = useDispatch();
    const _capitalize = (sentence = '') => {
        if (sentence == '') return null;
        const words = sentence.toLowerCase().replaceAll('_', ' ').split(' ');
        words.map((item, index) => words[index] = item[0].toUpperCase() + item.slice(1, item.length))
        return words.join(" ");
    }
    return (
        <Page noToolbar noNavbar name="DeviceInfo">
            {
                'onClick' in props ?
                    (
                        <DefaultNavbar
                            backLink
                            onClick={() => props.onClick()}
                            title={'DEVICE INFORMATION'}
                        />
                    ) :
                    (
                        <DefaultNavbar
                            title={'DEVICE INFORMATION'}
                        />
                    )
            }
            {
                Object.keys(device).map((key) => (
                    ['manufacturer', 'platform', 'uuid', 'serial', 'version'].includes(key) &&
                    (<Row key={key} noGap style={{ margin: 5, margin: 5 }}>
                        <Col width="30" style={{ height: '100% style={{marginTop : 5, marginBottom : 5}}', marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 400, wordWrap: 'break-word' }}>{_capitalize(key)}</Col>
                        <Col width="65" style={{ height: '100%', marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 400, wordWrap: 'break-word' }}>{device[key]}</Col>
                    </Row>)
                ))
            }
        </Page>
    );
}
export default DeviceInfo;