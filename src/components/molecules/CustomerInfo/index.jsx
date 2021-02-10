import React, { useEffect } from 'react'
import {
    Block,
    Row,
    Col,
} from 'framework7-react';
import { useSelector } from "react-redux";
import { log } from '../../../utils/';

const CustomerInfo = (props) => {
    useEffect(() => {
        log('MOUNT OR UPDATE CustomerInfo');
        return () => {
            log('UNMOUNT CustomerInfo');
        }
    }, [])
    const detailCustomer = useSelector(state => state.user.detailCust);
    const device = useSelector(state => state.main.device);

    return (
        <Block style={{ margin: 0, padding: 0 }}>
            <Row noGap style={{ padding: 5, backgroundColor: '#e4e4e4' }}>
                <Col width="100"><p style={{ margin: 0, fontSize: 11 }}>Nama : {detailCustomer.name}</p></Col>
                <Col width="100"><p style={{ margin: 0, fontSize: 11 }}>Customer ID : {detailCustomer.account_number}</p></Col>
                <Col width="100"><p style={{ margin: 0, fontSize: 11 }}>Alamat : {detailCustomer.home_address_1}</p></Col>
                <Col width="100"><p style={{ margin: 0, fontSize: 11 }}>Deskripsi : {`${device.manufacturer} ${device.model}`}</p></Col>
                <Col width="100"><p style={{ margin: 0, fontSize: 11 }}>Need Payment : {detailCustomer.total_due}</p></Col>
            </Row>
        </Block>
    )
}

export default CustomerInfo;