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
const DetailDebitur = (props) => {
    useEffect(() => {
        log('MOUNT OR UPDATE DeviceInfo');
        return () => {
            log('UNMOUNT DeviceInfo');
        }
    }, [])
    const device = useSelector(state => state.main.device);
    const dispatch = useDispatch();
    return (
        <Page noToolbar noNavbar name="DetailDebitur">
            <p>ini detail debitur</p>
        </Page>
    );
}


export default DetailDebitur;