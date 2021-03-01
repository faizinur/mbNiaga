import React, { Component, useEffect, useState } from 'react';
import {
    Page,
    Navbar,
    List,
    ListInput,
    Block,
    Row,
    Col,
    Button,
    f7,
} from 'framework7-react';
import { useDispatch, useSelector } from "react-redux";
import { navigate, back } from '../../../config/redux/actions/';
import { log, Connection, SQLiteTypes, SQLite, Filter } from '../../../utils';
import { DefaultNavbar } from '../../../components/atoms/';
const { RENCANA_KUNJUNGAN } = SQLiteTypes;
const DetailDebitur = (props) => {
    useEffect(() => {
        log('MOUNT OR UPDATE DetailDebitur', detailCust);
        return () => {
            log('UNMOUNT DetailDebitur');
        }
    }, [])
    const detailCust = useSelector(state => state.user.detailCust);
    let [Y, M, D] = detailCust.date_of_birth.split("-");
    let today = new Date();
    const dispatch = useDispatch();
    const CustomerInfo = [
        {
            key: 'Customer Name',
            value: detailCust.name || '-',
        },
        {
            key: 'Loan No.',
            value: detailCust.card_type == "CC" ? detailCust.card_no : detailCust.account_number || '-',
        },
        {
            key: 'Sex',
            value: detailCust.sex || '-',
        },
        {
            key: 'DOB',
            value: `${Math.abs(today.getFullYear() - Y)} thn ${Math.abs((today.getMonth() + 1) - M)} Bln ${Math.abs((today.getDate() + 1) - D)} Hr` || '-',
        },
        {
            key: 'Product',
            value: detailCust.loan_type || '-',
        },
        {
            key: 'Home Address',
            value: detailCust.home_address_1 || '-',
        },
        {
            key: 'Phone No.',
            value: detailCust.handphone || '-',
        },
        {
            key: 'DPD',
            value: detailCust.day_past_due || '-',
        },
        {
            key: 'Billing',
            value: detailCust.bill_amount || '-',
        },
    ];
    const _rencanaKunjungan = () => {
        f7.dialog.confirm("Apakah akan dimasukkan ke rencana kunjungan?", () => {
            SQLite.query('SELECT * FROM collection where key = ?', [RENCANA_KUNJUNGAN])
                .then(res => {
                    Filter.select(res, [{ 'column': 'account_number', 'operator': 'EQUAL', 'value': detailCust.account_number }]).then((resFilter) => {
                        if (resFilter.length == 0) {
                            var data = res.length != 0 ? res[0] : res;
                            data.push((detailCust))
                            SQLite.query(`INSERT OR REPLACE INTO collection (key, value) VALUES(?,?)`, [RENCANA_KUNJUNGAN, data])
                                .then(insert => {
                                    dispatch(navigate('/ListDebitur/'));
                                }).catch(err => log(err))
                        } else {
                            dispatch(navigate('/ListDebitur/'));
                        }
                    }).catch(err => log(err))
                })
                .catch(err => log(err))
        }, () => log("cancel"))
    }
    return (
        <Page noToolbar noNavbar name="DetailDebitur">
            <DefaultNavbar title="MOBILE APPLICATION INTERACTION" network={Connection()} />
            <Block style={{ margin: 0, padding: 5 }}>
                <Col style={{ backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>CUSTOMER INFORMATION</Col>
                {
                    CustomerInfo.map((item, key) => (
                        <Row key={key} noGap style={{ marginTop: 5, marginBottom: 5 }}>
                            <Col width="30" style={{ height: '100% style={{marginTop : 5, marginBottom : 5}}', marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>{item.key}</Col>
                            <Col width="65" style={{ height: '100%', marginBottom: 3, fontSize: 11, backgroundColor: '#666666', borderRadius: 5, padding: 7, color: 'white', fontWeight: 300, wordWrap: 'break-word' }}>{item.value}</Col>
                        </Row>
                    ))
                }
            </Block>
            <div style={{ display: 'flex', flex: 1, position: 'absolute', width: '100%', left: 0, bottom: 58, backgroundColor: '#666666' }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                        <List noHairlinesMd style={{ margin: 0 }}>
                            <Block style={{ margin: 0, padding: 5 }}>
                                <Row>
                                    <Col width="100">
                                        <Button
                                            onClick={() => dispatch(navigate('/AddKunjungan/'))}
                                            round
                                            style={{ backgroundColor: '#0085FC', color: 'white', textTransform: 'capitalize' }}
                                            text="Input Visit"
                                        />
                                    </Col>
                                </Row>
                            </Block>
                            <Block style={{ margin: 0, padding: 5 }}>
                                <Row>
                                    <Col width="100">
                                        <Button
                                            onClick={() => dispatch(back())}
                                            round
                                            style={{ backgroundColor: '#FF6666', color: 'white', textTransform: 'capitalize' }}
                                            text="Back"
                                        />
                                    </Col>
                                </Row>
                            </Block>
                        </List>
                    </div>
                </div>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                        <List noHairlinesMd style={{ margin: 0 }}>
                            <Block style={{ margin: 0, padding: 5 }}>
                                <Row>
                                    <Col width="100">
                                        <Button
                                            onClick={() => _rencanaKunjungan()}
                                            round
                                            style={{ backgroundColor: '#000000', color: 'white', textTransform: 'capitalize' }}
                                            text="Visit Plan"
                                        />
                                    </Col>
                                </Row>
                            </Block>
                        </List>
                    </div>
                </div>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                        <List noHairlinesMd style={{ margin: 0 }}>
                            <Block style={{ margin: 0, padding: 5 }}>
                                <Row>
                                    <Col width="100">
                                        <Button
                                            onClick={() => log('hehe')}
                                            round
                                            style={{ backgroundColor: '#60A917', color: 'white', textTransform: 'capitalize' }}
                                            text="Address Update"
                                        />
                                    </Col>
                                </Row>
                            </Block>
                            <Block style={{ margin: 0, padding: 5 }}>
                                <Row>
                                    <Col width="100">
                                        <Button
                                            onClick={() => dispatch(navigate('/InfoDebitur/'))}
                                            round
                                            style={{ backgroundColor: '#CC6600', color: 'white', textTransform: 'capitalize' }}
                                            text="Show Data"
                                        />
                                    </Col>
                                </Row>
                            </Block>
                        </List>
                    </div>
                </div>
            </div>
        </Page>
    );
}


export default DetailDebitur;