// import { getDevice } from 'framework7/lite-bundle';
import { Device } from 'framework7/framework7-lite.esm.bundle.js';
var SQLite = {
    executeSql: (sqlQuery, param = []) => {
        return new Promise((resolve, reject) => {
            // var device = getDevice();
            var db = (!Device.android && !Device.ios) ? window.openDatabase('MyDatabase', '1.0', 'Data', 2 * 1024 * 1024) : window.sqlitePlugin.openDatabase({ name: 'my.db', location: 'default' });
            db.transaction(function (tx) {
                tx.executeSql(sqlQuery, param, (tx, rs) => {
                    var ress_arr = [];
                    if(!Sqlite.isset(() => rs.insertId)){
                        for (var i = 0; i < rs.rows.length; i++) {
                            ress_arr.push(rs.rows.item(i));
                        }
                    }else{
                        ress_arr = {'insertId': rs.insertId, 'rowsAffected' : rs.rowsAffected};
                    }
                    resolve(ress_arr);
                }, (tx, error) => {
                    reject('SQL statement ERROR: ' + error.message);
                });
            });

        });
    },
    isset: (accessor) =>  {
        try {
          return accessor() !== undefined && accessor() !== null
        } catch (e) {
          return false
        }
      }
}

export default SQLite;

// [4:49 PM, 1/15/2021] egi: framework7 cordova plugin add cordova-sqlite-storage
// [4:49 PM, 1/15/2021] egi: https://github.com/storesafe/cordova-sqlite-storage