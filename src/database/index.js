import React, { Component } from 'react';
import { f7 } from 'framework7-react';
import Datastore from 'nedb';
import { log } from '../utils/consoles/';
import uuid from '../utils/uuid/';

class Datastores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableList: ['collections', 'user'],
        }
    }

    init = () => {
        const db = {
            collections: new Datastore({
                filename: './storage/t_collections.db', //'../../src/database/storage/t_collections.db',
                autoload: true
            }),
            user: new Datastore({
                filename: './storage/t_user.db', //'../../src/database/storage/t_user.db',
                autoload: true
            })
        };
        db['collections'].loadDatabase(); // err => log('DB LOAD collections : ',err));
        db['user'].loadDatabase(); //err => log('DB LOAD user : ',err));
        return db;
    }

    insert = (tableName, query) => {
        f7.preloader.show();
        return new Promise(resolve => {
            const { tableList } = this.state;
            if (!tableList.includes(tableName)) resolve(null);
            //     //BUAT MODELNYA, BENTUK QUERYNYA.
            query['_id'] = uuid();
            this.init()[tableName].count({ _id: query._id }, (err, dbCount) =>
                (dbCount == 0) ? this.init()[tableName].insert(query, (dbInsert) => resolve(dbInsert)) : resolve(dbCount)
            )
            f7.preloader.hide();
        })
    }

    count = (tableName, clause = {}) => {
        f7.preloader.show();
        return new Promise(resolve => {
            const { tableList } = this.state;
            if (!tableList.includes(tableName)) resolve(null);
            this.init()[tableName].count(clause, (err, db) => resolve(db));
            f7.preloader.hide();
        })
    }

    delete = (tableName, clause = {}, multiple = false) => {
        f7.preloader.show();
        return new Promise(resolve => {
            const { tableList } = this.state;
            if (!tableList.includes(tableName)) resolve(null);

            this.init()[tableName].remove(clause, { multi: multiple }, (err, db) => resolve(db));
            f7.preloader.hide();
        })
    }

    update = (tableName, query = {}, clause = {}, multiple = false) => {
        f7.preloader.show();
        return new Promise(resolve => {
            const { tableList } = this.state;
            if (!tableList.includes(tableName)) resolve(null);

            this.init()[tableName].update(query, clause, { multi: multiple }, (err, db) =>
                (db > 0) ? this.init()[tableName].find(clause, (err, db) => resolve(db)) : resolve(db)
            );
            f7.preloader.hide();
        })
    }

    select = (tableName, query = {}) => {
        f7.preloader.show();
        return new Promise(resolve => {
            const { tableList } = this.state;
            if (!tableList.includes(tableName)) resolve(null);

            this.init()[tableName].find(query, (err, db) => resolve(db));
            f7.preloader.hide();
        })
    }

    exportData = async () => {
        const { tableList } = this.state;
        var date = new Date();
        var exportedTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '' + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
        const promiseList = [];
        tableList.map(item =>
            promiseList.push(
                new Promise(resolve =>
                    this.init()[item].find({}, (err, db) =>
                        resolve({
                            tablename: item,
                            data: JSON.stringify(db),
                            exportedTime: exportedTime
                        })
                    )
                )
            )
        )
        return await Promise.all(promiseList);
    }
}

export default new Datastores();


//PENGGUNAAN
/*
import Datastores from '../database/';

    try {
        const insertResult = await Datastores.insert('collections', { name: 'neptunus', size: 'massive' });
        log('INSERT RESULT : ', insertResult == null ? 'udah ada': 'OKE!');
        const countResult = await Datastores.count('collections');
        log('COUNT RESULT : ', countResult)
        const updateResult = await Datastores.update('collections', { name: 'saturnus'}, { name: 'neptunus'});
        log('UPDATE RESULT : ', updateResult);
        const selectResult = await Datastores.select('collections');
        log('SELECT RESULT : ', selectResult);
        const deleteResult = await Datastores.delete('collections', { name: 'neptunus'});
        log('DELETE RESULT : ', deleteResult);
    } catch (e) {
        log(e);
    }
*/