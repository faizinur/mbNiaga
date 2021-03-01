import React, { useEffect } from 'react';
import {
    Block,
    Col,
    Row,
    Button,
    Icon,
    ListInput,
    List,
} from 'framework7-react';

import { log, } from '../../../utils';

const KunjunganItem = (props) => {
    useEffect(() => {
        log('MOUNT OR UPDATE KunjunganItem', props);
        return () => {
            log('UNMOUNT KunjunganItem');
        }
    }, []);
    return (
        <List style={{ margin: 0, padding: 0 }}>
            {
                props.item.map((item, key) => (
                    <div
                        key={key}
                        onClick={(e) => props.onItemClick(item.data)}
                        style={styles.container}>
                        {
                            'icon' in props ? (
                                <div
                                    style={styles.imgContainer}>
                                    <img width="50" height="50" src={require(`../../../assets/img/person-at-home.png`).default} />
                                </div>
                            ) : (<></>)
                        }
                        <div
                            style={styles.itemContainer}>
                            <p style={{ ...styles.itemText, ...{ fontWeight: 'bold', fontSize: 18 } }}>{item.namaDebitur}</p>
                            <p style={{ ...styles.itemText, ...{ fontSize: 18 } }}>{item.nomorKartu}</p>
                            <p style={styles.itemText}>{item.alamat}</p>
                            <p style={styles.itemText}>{item.tagihan}</p>
                        </div>
                    </div>
                ))
            }
        </List>
    )
}

const styles = {
    container: {
        display: 'flex',
        flex: 1,
        height: 'fit-content',
        flexDirection: 'row',
        padding: 10,
        backgroundColor : 'white', 
    },
    imgContainer: {
        display: 'flex',
        flex: 1,
        backgroundColor: '#c0392b',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemContainer: {
        display: 'flex',
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 5,
        backgroundColor: '#c0392b',
        borderBottomColor: '#b5b5b5',
        borderBottomWidth: 2,
        borderBottomStyle: 'groove'
    },
    itemText: {
        margin: 0,
        wordBreak: 'break-all',
        color: 'white'
    },
}

export default KunjunganItem;


/*
<Block key={key} style={{ margin: 0 }}>
    <Row>
        <Col width="80" tag="span">
            <List style={{ margin: 0, padding: 0 }}>
                <ListInput
                    outline
                    label="NAMA DEBITUR"
                    type="text"
                    disabled={true}
                    value={item.namaDebitur}
                />
                <ListInput
                    outline
                    label="NOMOR KARTU"
                    type="text"
                    disabled={true}
                    value={item.nomorKartu}
                />
                <ListInput
                    outline
                    label="ALAMAT"
                    type="text"
                    disabled={true}
                    value={item.alamat}
                />
                <ListInput
                    outline
                    label="PRODUK ( CC, PL, AL, MORTGAGE )"
                    type="text"
                    disabled={true}
                    value={item.produk}
                />
                <ListInput
                    outline
                    label="TAGIHAN"
                    type="text"
                    disabled={true}
                    value={item.tagihan}
                />
                <ListInput
                    outline
                    label="BUCKET"
                    type="text"
                    disabled={true}
                    value={item.bucket}
                />
                <ListInput
                    outline
                    label="DPD"
                    type="text"
                    disabled={true}
                    value={item.dpd}
                />
            </List>
        </Col>
        <Col width="20">
            <div style={{ backgroundColor: 'red', position: 'absolute', right: '5%', top: '45%' }}>
                <Button fill raised onClick={() => props.onItemClick(item.data)} style={{ backgroundColor: '#c0392b' }}>
                    <Icon ios="f7:arrow_right" aurora="f7:arrow_right" md="material:keyboard_arrow_right"></Icon>
                </Button>
            </div>
        </Col>
    </Row>
</Block>
*/