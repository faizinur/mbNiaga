// import { getDevice } from 'framework7/lite-bundle';
import { Device } from 'framework7/framework7-lite.esm.bundle.js';
import React, { Component } from 'react';
import { log } from '../Consoles';
import { DB_NAME, TABLES } from './tables'; 

class SQLite extends Component {
    initDB = (populateDB = true) => {
        let db;
        return new Promise(resolve => {
            console.log("%cPlugin integrity check ...",'background: #FF0; color: #F00');
            db = (!Device.android && !Device.ios) ? window.openDatabase(DB_NAME, '1.0', 'Data', 2 * 1024 * 1024) : window.sqlitePlugin.openDatabase({ name: `${DB_NAME}.db`, location: 'default' });
            populateDB ? this.populateTable(db) : resolve(db);
            resolve(db);
        });
    };
    populateTable = (db) => {
        db.transaction(tx => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS ${TABLES.dcoll_user.name} (${TABLES.dcoll_user.column.join()})`);
            //....
        }, err => {
            log(`%cTransaction ERROR: ${error.message}`,'background: #F00; color: #000');
        }, () => {
            log(`%cPopulated database OK`,'background: #0F0; color: #F00');
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
        return new Promise((resolve, reject) => {
            this.initDB(false)
                .then(db => {
                    db.transaction(tx => {
                        tx.executeSql(sqlQuery, param, (tx, rs) => {
                            var ress_arr = [];
                            if (!this.isset(() => rs.insertId)) {
                                for (var i = 0; i < rs.rows.length; i++) {
                                    ress_arr.push(rs.rows.item(i));
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

}
export default SQLite;

// [4:49 PM, 1/15/2021] egi: framework7 cordova plugin add cordova-sqlite-storage
// [4:49 PM, 1/15/2021] egi: https://github.com/storesafe/cordova-sqlite-storage