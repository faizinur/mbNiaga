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
        log('MOUNT OR UPDATE KunjunganItem');
        return () => {
            log('UNMOUNT KunjunganItem');
        }
    }, []);
    return (
        <List style={{ margin: 0, padding: 0 }}>
            {
                props.item.map((item, key) => (
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
                ))
            }
        </List>
    )
}

export default KunjunganItem;
