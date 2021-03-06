// import { getDevice } from 'framework7/lite-bundle';
import { Device } from 'framework7/framework7-lite.esm.bundle.js';
import React, { Component } from 'react';
import { log, uuid } from '../../utils';
import { DB_NAME, TABLES } from './tables';
import { Encrypt, selfDecrypt } from '../Encryption';
import * as SQLiteTypes from './types';
import { f7 } from 'framework7-react';
const { PIN, LIST_ACCOUNT, DETAIL_COSTUMER, ACTIVITY_HISTORY, PAYMENT_HISTORY, DEVICE_INFO, RENCANA_KUNJUNGAN } = SQLiteTypes;
class SQLModules extends Component {
    initDB = (populateDB = true) => {
        let db;
        return new Promise((resolve, reject) => {
            //LOKASI DI MOBILE /data/user/0/io.framework7.myapp/databases/MobileCollection.db
            // db = (!Device.android && !Device.ios) ?
            //     window.openDatabase(DB_NAME, '1.0', 'Data', 2 * 1024 * 1024) :
            //     window.sqlitePlugin.openDatabase({ name: `${DB_NAME}.db`, location: 'default', androidDatabaseProvider: 'system' }); 
            // populateDB ? this.populateTable(db) : resolve(db);
            // resolve(db);

            if (!Device.android && !Device.ios) {
                log("%cPlugin integrity check ...", 'background: #FF0; color: #F00')
                db = window.openDatabase(DB_NAME, '1.0', 'Data', 2 * 1024 * 1024);
                if (populateDB) this.populateTable(db);
                resolve(db);
            } else {
                window.sqlitePlugin.openDatabase({ name: `${DB_NAME}.db`, location: 'default', androidDatabaseProvider: 'system' },
                    (db) => {
                        // alert(JSON.stringify(db));
                        log("%cPlugin integrity check ...", 'background: #FF0; color: #F00')
                        if (populateDB) this.populateTable(db);
                        resolve(db);
                    },
                    (err) => {
                        console.log('Open database ERROR: ' + JSON.stringify(error));
                        alert('Open database ERROR: ' + JSON.stringify(error));
                        reject(err)
                    });
            }

        });
    };
    populateTable = (db) => {
        db.transaction(tx => {
            // tx.executeSql(`CREATE TABLE IF NOT EXISTS ${TABLES.dcoll_user.name} (${TABLES.dcoll_user.column.join()})`);
            // tx.executeSql(`CREATE TABLE IF NOT EXISTS ${TABLES.dcoll_user.name} (${TABLES.dcoll_user.column.join()}, PRIMARY KEY (${TABLES.dcoll_user.column[0]}))`);
            tx.executeSql('CREATE TABLE IF NOT EXISTS collection(key text primary key, value text)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS img_tmp(selfId text primary key, parentId key, value text)');
            // tx.executeSql(`DROP TABLE ${TABLES.dcoll_user.name}`);
            //....
        }, err => {
            log(`%cTransaction ERROR: ${err.message}`, 'background: #F00; color: #000');
        }, () => {
            log(`%cPopulated database OK`, 'background: #0F0; color: #F00');
        })
    };
    isset = (accessor) => {
        try {
            return accessor() !== undefined && accessor() !== null
        } catch (e) {
            return false
        }
    };
    query = (sqlQuery, param = []) => {
        let [dmlCommand] = sqlQuery.split(' ')
        if (param.length > 0 && (dmlCommand === 'INSERT')) {
            //     param = [uuid(), ...param];
            param[1] = Encrypt(param[1])
        }
        return new Promise((resolve, reject) => {
            this.initDB(false)
                .then(db => {
                    db.transaction(tx => {
                        tx.executeSql(sqlQuery, param, (tx, rs) => {
                            var ress_arr = [];
                            if (!this.isset(() => rs.insertId)) {
                                for (var i = 0; i < rs.rows.length; i++) {
                                    ress_arr.push(selfDecrypt(rs.rows.item(i).value))
                                }
                            } else {
                                ress_arr = { 'insertId': rs.insertId, 'rowsAffected': rs.rowsAffected };
                            }
                            resolve(ress_arr);
                        }, (tx, error) => {
                            f7.dialog.alert(`SQL statement ERROR: ${error.message}`);
                            reject(`SQL statement ERROR: ${error.message}`);
                        });
                    });
                })
                .catch(err => reject(err))
        })
    };
    fetchAll = () => {
        return new Promise((resolve, reject) =>
            this.initDB(false)
                .then(db =>
                    db.transaction(tx =>
                        tx.executeSql('SELECT * from COLLECTION', [],
                            (tx, rs) => {
                                if (!this.isset(() => rs.insertId)) {
                                    var data = {};
                                    for (var i = 0; i < rs.rows.length; i++) {
                                        data = {
                                            ...data,
                                            ...{ [rs.rows.item(i).key]: selfDecrypt(rs.rows.item(i).value) }
                                        }
                                        //     var tmp = { key: rs.rows.item(i).key, value: selfDecrypt(rs.rows.item(i).value) }
                                        //     data.push(tmp)
                                    }
                                    // resolve(Object.values(rs.rows))
                                    // resolve([Object.values(rs.rows), selfDecrypt])
                                    // log('fetchAll : ',Object.values(rs.rows)[0].key)
                                    // resolve(Object.values(rs.rows)
                                    //     .reduce((acc, val) => {
                                    //         return [
                                    //             ...acc,
                                    //             { [val.key]: selfDecrypt(val.value) }
                                    //         ]
                                    //     }, []))
                                    // let data = {};
                                    // Object.values(rs.rows).map(item => data = { ...data, ...{ [item.key]: selfDecrypt(item.value) } });
                                    resolve(data);
                                }
                            }, (tx, error) => {
                                f7.dialog.alert(`SQL statement ERROR: ${error.message}`);
                                reject(`SQL statement ERROR: ${error.message}`)
                            })
                    )
                )
                .catch(err => reject(err))
        )
    };
    _setImage = (data) => {
        return new Promise((resolve, reject) => {
            this.initDB(false)
                .then(db => {
                    db.transaction(tx => {
                        tx.executeSql('INSERT OR REPLACE INTO img_tmp (selfId, parentId, value) VALUES(?,?,?)', [uuid(), data.parentId, data.value], (tx, rs) => {
                            var ress_arr = [];
                            if (!this.isset(() => rs.insertId)) {
                                for (var i = 0; i < rs.rows.length; i++) {
                                    ress_arr.push(selfDecrypt(rs.rows.item(i).value))
                                }
                            } else {
                                ress_arr = { 'insertId': rs.insertId, 'rowsAffected': rs.rowsAffected };
                            }
                            resolve(ress_arr);
                        }, (tx, error) => {
                            f7.dialog.alert(`SQL statement ERROR: ${error.message}`);
                            reject(`SQL statement ERROR: ${error.message}`);
                        });
                    });
                })
                .catch(err => reject(err))
        })
    };
    _getImage = (id) => {
        return new Promise((resolve, reject) =>
            this.initDB(false)
                .then(db =>
                    db.transaction(tx =>
                        tx.executeSql('SELECT parentId, value from img_tmp WHERE parentId=(?)', [id],
                            (tx, rs) => {
                                if (!this.isset(() => rs.insertId)) {
                                    var data = [];
                                    for (var i = 0; i < rs.rows.length; i++) {
                                        data.push(rs.rows.item(i).value)
                                    }
                                    let img = {
                                        id : id,
                                        data : data,
                                    }
                                    let res = [];
                                    res.push(img)
                                    resolve(res);
                                }
                            }, (tx, error) => {
                                f7.dialog.alert(`SQL statement ERROR: ${error.message}`);
                                reject(`SQL statement ERROR: ${error.message}`)
                            })
                    )
                )
                .catch(err => reject(err))
        )
    };
}
let SQLite = new SQLModules();
export {
    SQLite,
    SQLiteTypes
};

// [4:49 PM, 1/15/2021] egi: framework7 cordova plugin add cordova-sqlite-storage
// [4:49 PM, 1/15/2021] egi: https://github.com/storesafe/cordova-sqlite-storage