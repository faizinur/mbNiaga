import React, { useEffect, useState } from 'react';
import { Page } from 'framework7-react';
import { useDispatch, useSelector } from "react-redux";
import { navigate } from '../../../config/redux/actions/routerActions';
import { log, Connection, SQLite, SQLiteTypes, Filter } from '../../../utils/';
import { DefaultNavbar } from '../../../components/atoms';
const { REKAP_TERKIRIM } = SQLiteTypes;

const RekapTerkirim = (props) => {
    useEffect(() => {
        log('MOUNT OR UPDATE RekapTerkirim');
        _getRekapTerkirim();
        return () => {
            log('UNMOUNT RekapTerkirim');
        }
    }, [])
    let [listTerkirim, setListTerkirim] = useState([]);
    const _getRekapTerkirim = () => {
        SQLite.query('SELECT * FROM collection where key = ?', [REKAP_TERKIRIM])
            .then(res => {
                log("REKAP TERKIRIM", res)
                if (res.length == 0) return false;
                Filter.select(res, [{ 'column': 'transaction_type', 'operator': 'EQUAL', 'value': 'KUNJUNGAN' }])
                    .then((resFilter) => setListTerkirim(resFilter))
                    .catch(err => log(err))
            }).catch(err => log(err))
    }
    return (
        <Page noToolbar noNavbar>
            <DefaultNavbar
                title="Rekap Terkirim"
                network={Connection()}
            />
            {listTerkirim.map((item, key) => (
                <Card key={key} style={{ border: '2px solid #c0392b' }}>
                    <CardHeader style={{ backgroundColor: "#c0392b", }}>
                        <div style={{
                            display: 'flex',
                            flex: 1,
                            height: 58,
                            backgroundColor: "#c0392b",
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                        >
                            <p style={{
                                fontSize: 14,
                                fontWeight: 'initial',
                                color: '#fcf5f4',
                                lineHeight: 16
                            }}>{item.account_number}</p>
                            <div
                                style={{
                                    height: 40,
                                    paddingLeft: 16,
                                    paddingRight: 16,
                                    backgroundColor: 'red',
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    borderColor: 'blue',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                }}
                            >
                                <p style={{
                                    fontSize: 14,
                                    fontWeight: 'initial',
                                    color: '#fcf5f4',
                                    margin: 0,
                                }}>{item.call_result}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Nomor Kartu</td>
                                    <td>:</td>
                                    <td>{item.card_no}</td>
                                </tr>
                                <tr>
                                    <td>Nama</td>
                                    <td>:</td>
                                    <td>{item.name}</td>
                                </tr>
                                <tr>
                                    <td>Metode Kontak</td>
                                    <td>:</td>
                                    <td>{item.contact_mode}</td>
                                </tr>
                                <tr>
                                    <td>Kontak</td>
                                    <td>:</td>
                                    <td>{item.contact_person}</td>
                                </tr>
                                <tr>
                                    <td>Tempat Kunjungan</td>
                                    <td>:</td>
                                    <td>{item.place_contacted}</td>
                                </tr>
                                <tr>
                                    <td>Hasil Kunjungan</td>
                                    <td>:</td>
                                    <td>{item.call_result}</td>
                                </tr>
                                <tr>
                                    <td>Detail Hasil Kunjungan</td>
                                    <td>:</td>
                                    <td>{item.notepad}</td>
                                </tr>
                                <tr>
                                    <td>Waktu Visit</td>
                                    <td>:</td>
                                    <td>{item.created_time}</td>
                                </tr>
                                <tr>
                                    <td>Petugas</td>
                                    <td>:</td>
                                    <td>{item.user_id}</td>
                                </tr>
                                <tr>
                                    <td>Tanggal PTP</td>
                                    <td>:</td>
                                    <td>{item.ptp_date}</td>
                                </tr>
                                <tr>
                                    <td>Jumlah PTP</td>
                                    <td>:</td>
                                    <td>{item.ptp_amount}</td>
                                </tr>
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            ))}
        </Page>
    )
}
export default RekapTerkirim;