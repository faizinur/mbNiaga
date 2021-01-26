// import { getDevice } from 'framework7/lite-bundle';
import { Device } from 'framework7/framework7-lite.esm.bundle.js';
import React, { Component } from 'react';
import { log, uuid } from '../../utils';
import { DB_NAME, TABLES } from './tables';
import { Encrypt, selfDecrypt } from '../Encryption';
import * as SQLiteTypes from './types';
class SQLModules extends Component {
    initDB = (populateDB = true) => {
        let db;
        return new Promise(resolve => {
            populateDB ? log("%cPlugin integrity check ...", 'background: #FF0; color: #F00') : log('');
            db = (!Device.android && !Device.ios) ?
                window.openDatabase(DB_NAME, '1.0', 'Data', 2 * 1024 * 1024) :
                window.sqlitePlugin.openDatabase({ name: `${DB_NAME}.db`, location: 'default' });
            populateDB ? this.populateTable(db) : resolve(db);
            resolve(db);
        });
    };
    populateTable = (db) => {
        db.transaction(tx => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS ${TABLES.dcoll_user.name} (${TABLES.dcoll_user.column.join()})`);
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
        if (param.length > 0 && dmlCommand === 'INSERT') {
            param = [uuid(), ...param];
            param[2] = Encrypt(param[2])
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
                            reject(`SQL statement ERROR: ${error.message}`);
                        });
                    });
                })
                .catch(err => reject(err))
        })
    };
    fetchAll = (sqlQuery) => {
        return new Promise((resolve, reject) => {
            this.initDB(false)
                .then(db => {
                    db.transaction(tx => {
                        tx.executeSql(sqlQuery, [], (tx, rs) => {
                            var ress_arr = [];
                            if (!this.isset(() => rs.insertId)) {
                                for (var i = 0; i < rs.rows.length; i++) {
                                    ress_arr.push({
                                            id : rs.rows.item(i).id,
                                            key : rs.rows.item(i).key,
                                            value : selfDecrypt(rs.rows.item(i).value)
                                        })
                                }
                            } else {
                                ress_arr = { 'insertId': rs.insertId, 'rowsAffected': rs.rowsAffected };
                            }
                            resolve(ress_arr);
                        }, (tx, error) => {
                            reject(`SQL statement ERROR: ${error.message}`);
                        });
                    });
                })
                .catch(err => reject(err))
        })
    }
}
let SQLite = new SQLModules();
export {
    SQLite,
    SQLiteTypes
};

// [4:49 PM, 1/15/2021] egi: framework7 cordova plugin add cordova-sqlite-storage
// [4:49 PM, 1/15/2021] egi: https://github.com/storesafe/cordova-sqlite-storage

                   // SQLite.query('INSERT INTO collection(id,key,value) VALUES(?,?,?)', ['login', res.data])
                    //     .then(res => log(res))
                    //     .catch(err => log(err))

                    // SQLite.query('SELECT * FROM collection')
                    //     .then(res => log(res))
                    //     .catch(err => log(err))

                    // SQLite.query('SELECT * FROM collection WHERE key=?', ['login'])
                    //     .then(res => log(res))
                    //     .catch(err => log(err))

                    // SQLite.query('DELETE FROM collection')
                    //     .then(res => log(res))
                    //     .catch(err => log(err))