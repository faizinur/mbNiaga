import React, { Component } from 'react';
import {
    Page,
    List,
    ListInput,
    Block,
    Row,
    Col,
    Button,
    Icon,
} from 'framework7-react';

import { connect } from 'react-redux';
import { navigate, setDetailCustomer } from '../../../config/redux/actions/';
import { log, Filter, SQLite, SQLiteTypes, Connection } from '../../../utils/';
import { SystemInfo, KunjunganItem } from '../../../components/molecules';
import { DefaultNavbar } from '../../../components/atoms'

class RencanaKunjungan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parameter: [
                { code: 'name', description: 'Nama' },
                { code: 'home_address_1', description: 'Alamat' },
                { code: 'outstanding_balance', description: 'OS Balance' },
                { code: 'current_bucket', description: 'Bucket' },
                { code: 'day_past_due', description: 'DPD' },
                { code: 'loan_type', description: 'Product' },
                { code: '', description: 'Area' },
                { code: 'home_post_code', description: 'Zipcode' },
                { code: 'branch_code', description: 'Branch Code' },
                { code: '', description: 'Branch Name' },
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
            searchParameter: [],
        }
    }
    componentDidMount() {
        this._tambahParameter()
        SQLite.query('SELECT * FROM collection where key = ?', [SQLiteTypes.RENCANA_KUNJUNGAN])
            .then(res => {
                log(res);
                var arr_result = [];
                var data = res.length != 0 ? res[0] : res;
                data.map((item, index) => arr_result.push({
                    namaDebitur: item.name,
                    nomorKartu: item.card_no,
                    alamat: item.home_address_1,
                    produk: item.loan_type,
                    tagihan: item.dpd_cur_days,
                    bucket: item.current_bucket,
                    dpd: item.day_past_due,
                    data: item
                }));
                this.setState({ searchResult: arr_result });
            })
            .catch(err => log(err))
    }
    _next(data) {
        this.props.setDetailCustomer(data);
        this.props.navigate('/AddKunjungan/');
    }
    _search = async () => {
        var param = this.state.searchParameter.filter(obj => obj.column != "" && obj.operator != "");
        if (param.length == 0) return false;
        SQLite.query('SELECT * FROM collection where key = ?', [SQLiteTypes.RENCANA_KUNJUNGAN])
            .then(res => {
                Filter.select(res, param).then((resFilter) => {
                    var arr_result = [];
                    resFilter.map((item, index) => arr_result.push({
                        namaDebitur: item.name,
                        nomorKartu: item.card_no,
                        alamat: item.home_address_1,
                        produk: item.loan_type,
                        tagihan: item.dpd_cur_days,
                        bucket: item.current_bucket,
                        dpd: item.day_past_due,
                        data: item
                    }));
                    this.setState({ searchResult: arr_result });
                }).catch(err => log(err))
            })
            .catch(err => log(err))
    }

    _tambahParameter() {
        var searchParam = this.state.searchParameter;
        if (searchParam.length == this.state.parameter.length) return false;
        searchParam.push({ 'column': '', 'operator': '', 'value': '' })
        this.setState({ searchParameter: searchParam });
    }
    _kurangiParameter() {
        var searchParam = this.state.searchParameter;
        if (searchParam.length == 1) return false;
        searchParam = searchParam.slice(0, -1);
        this.setState({ searchParameter: searchParam });
    }

    render() {
        return (
            <Page noToolbar noNavbar style={{ paddingBottom: 60 }}>
                <DefaultNavbar title="RENCANA KUNJUNGAN" network={Connection()} />
                <List noHairlinesMd style={{ marginBottom: 0, padding: 0 }}>
                    <SystemInfo />
                    <Block style={{ margin: 0, padding: 0 }}>
                        {this.state.searchParameter.map((item, key) => (
                            <Row key={key} noGap>
                                <Col width="40" tag="span" style={{ margin: 0, padding: 0 }}>
                                    <List style={{ marginBottom: 8, marginTop: 8, padding: 0 }}>
                                        <ListInput
                                            outline
                                            label="Parameter"
                                            type="select"
                                            defaultValue=""
                                            onChange={({ target }) => {
                                                this.setState(prevState => ({
                                                    searchParameter: prevState.searchParameter.map((item, index) => index == key ? Object.assign(item, { column: target.value }) : item)
                                                }))
                                            }}
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
                                    <List style={{ marginBottom: 8, marginTop: 8, padding: 0 }}>
                                        <ListInput
                                            outline
                                            label="kondisi"
                                            type="select"
                                            defaultValue=""
                                            onChange={({ target }) => {
                                                this.setState(prevState => ({
                                                    searchParameter: prevState.searchParameter.map((item, index) => index == key ? Object.assign(item, { operator: target.value }) : item)
                                                }))
                                            }}
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
                                    <List style={{ marginBottom: 8, marginTop: 8, padding: 0 }}>
                                        <ListInput
                                            outline
                                            label="Value"
                                            type="text"
                                            onChange={({ target }) => {
                                                this.setState(prevState => ({
                                                    searchParameter: prevState.searchParameter.map((item, index) => index == key ? Object.assign(item, { value: target.value }) : item)
                                                }))
                                            }}
                                        >
                                        </ListInput>
                                    </List>
                                </Col>
                            </Row>
                        ))}
                        <Block strong style={{ margin: 0 }}>
                            <Row>
                                <Col width="50">
                                    <Button fill raised onClick={() => this._tambahParameter()} style={{ backgroundColor: '#c0392b', fontSize: 12 }}>Tambah</Button>
                                </Col>
                                <Col width="50">
                                    <Button fill raised onClick={() => this._kurangiParameter()} style={{ backgroundColor: '#c0392b', fontSize: 12 }}>Kurang</Button>
                                </Col>
                            </Row>
                        </Block>
                        <Block strong style={{ margin: 0 }}>
                            <Row noGap>
                                <Col width="100">
                                    <Button fill raised onClick={() => this._search()} style={{ backgroundColor: '#c0392b', fontSize: 12 }}>Search</Button>
                                </Col>
                            </Row>
                        </Block>
                    </Block>
                </List>
                <KunjunganItem
                    item={this.state.searchResult}
                    onItemClick={(e) => this._next(e)}
                />
            </Page>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        detailCust: state.user.detailCust,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (nav) => dispatch(navigate(nav)),
        setDetailCustomer: (detailCust) => dispatch(setDetailCustomer(detailCust))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(RencanaKunjungan);