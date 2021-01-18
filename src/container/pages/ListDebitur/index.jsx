import React, { Component } from 'react';
import {
    Page,
    List,
    ListInput,
    ListItem,
    Block,
    Row,
    Col,
    Button,
    Card,
    CardContent,
    F7ListItemContent,
    Icon,
} from 'framework7-react';

import { connect } from 'react-redux';
import { navigate } from '../../../config/redux/actions/routerActions';
import { log, QueryBuilder as QB } from '../../../utils/';
import { SystemInfo } from '../../../components/molecules';

class ListDebitur extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parameter: [
                { code: 1, description: 'Nama' },
                { code: 2, description: 'Alamat' },
                { code: 3, description: 'OS Balance' },
                { code: 4, description: 'Bucket' },
                { code: 5, description: 'DPD' },
                { code: 6, description: 'Product' },
                { code: 7, description: 'Area' },
                { code: 8, description: 'Zipcode' },
                { code: 9, description: 'Branch Code' },
                { code: 10, description: ' Branch Name' },
            ],
            kondisi: [
                { code: 'EQUAL', description: 'Equal' },
                { code: 'DOES_NOT_EQUAL', description: 'Does Not Equal' },
                { code: 'GREATHER_THAN_EQUAL_TO', description: 'Greather Than Equal To' },
                { code: 'LESS_THAN_EQUAL_TO', description: 'Less Than Equal To' },
                { code: 'BETWEEN', description: 'Between' },
                { code: 'BEGIN_WITH', description: 'Begin With' },
                { code: 'END_WITH', description: 'End With' },
                { code: 'CONTAINS', description: 'Contains' },
                { code: 'DOES_NOT_CONTAINS', description: 'Does Not Contain' },
                { code: 'DOES_NOT_BEGIN_WITH', description: 'Does Not Begin With' },
                { code: 'DOES_NOT_END_WITH', description: 'Does Not End With' },
                { code: 'GREATHER_THAN', description: 'Greather Than' },
                { code: 'LESS_THAN', description: 'Less Than' },
                { code: 'NOT_BETWEEN', description: 'Not Between' },
            ],
            selectedParameter: '',
            selectedKondisi: '',
            searchValue: '',
            searchResult: [],
        }
    }

    _next() {
        this.props.navigate('/InfoDebitur/');
    }

    _search = async () => {
        const { selectedParameter, selectedKondisi, searchValue } = this.state;
        if (selectedParameter == "" || selectedKondisi == "" || searchValue == "") return false;
        log(`CARI: ${selectedParameter} ${selectedKondisi} ${searchValue}`);
        // try {
        //     let resultQuery = await QB.select('table', ['column'], selectedKondisi.toString(), 'OR', searchValue.toString());
            // log(resultQuery);
            this.setState({
                searchResult: [{
                    namaDebitur: 'Nama Debitur',
                    nomorKartu: '0000000',
                    alamat: 'alamat',
                    produk: '12314',
                    tagihan: '1231412312',
                    bucket: 'bucket',
                    dpd: 'DPD',
                }]
            })
        // } catch (err) {
        // }
    }

    render() {
        return (
            <Page noToolbar noNavbar style={{ paddingBottom: 60 }}>
                <List noHairlinesMd style={{ marginBottom: 0, padding: 0 }}>
                    <SystemInfo />
                    <Block style={{ margin: 0, padding: 0 }}>
                        <Row noGap>
                            <Col width="40" tag="span" style={{ margin: 0, padding: 0 }}>
                                <List noHairlinesMd>
                                    <ListInput
                                        outline
                                        label="Hasil Kunjungan"
                                        type="select"
                                        defaultValue=""
                                        onChange={({ target }) => this.setState({ selectedParameter: this.state.parameter.filter(item => { return item.code == target.value })[0].description })}
                                    >
                                        <option value="" disabled>--pilih--</option>
                                        {
                                            this.state.parameter.map((item, key) => (
                                                <option key={key} value={item.code}>{item.description}</option>
                                            ))
                                        }

                                    </ListInput>
                                </List>
                            </Col>
                            <Col width="30" tag="span" style={{ margin: 0, padding: 0 }}>
                                <List>
                                    <ListInput
                                        outline
                                        label="kondisi"
                                        type="select"
                                        defaultValue=""
                                        onChange={({ target }) => this.setState({ selectedKondisi: target.value })}
                                    >
                                        <option value="" disabled>--pilih--</option>
                                        {
                                            this.state.kondisi.map((item, key) => (
                                                <option key={key} value={item.code}>{item.description}</option>
                                            ))
                                        }

                                    </ListInput>
                                </List>
                            </Col>
                            <Col width="30" tag="span" style={{ margin: 0, padding: 0 }}>
                                <List>
                                    <ListInput
                                        outline
                                        label="Value"
                                        type="text"
                                        onChange={({ target }) => this.setState({ searchValue: target.value })}
                                    >
                                    </ListInput>
                                </List>
                            </Col>
                        </Row>
                        <Block strong style={{ marginTop: -30 }}>
                            <Row noGap>
                                <Col width="100">
                                    <Button fill raised onClick={() => this._search()} style={{ backgroundColor: '#c0392b', fontSize: 12 }}>Search</Button>
                                </Col>
                            </Row>
                        </Block>
                    </Block>
                </List>
                <List style={{ margin: 0, padding: 0 }}>
                    <Block style={{ margin: 0 }}>
                        {this.state.searchResult.map((item, key) => (
                            <Row key={key}>
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
                                        <Button fill raised onClick={() => this._next()} style={{ backgroundColor: '#c0392b' }}>
                                            <Icon ios="f7:arrow_right" aurora="f7:arrow_right" md="material:keyboard_arrow_right"></Icon>
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        ))}
                    </Block>
                </List>
            </Page>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (nav) => dispatch(navigate(nav))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListDebitur);