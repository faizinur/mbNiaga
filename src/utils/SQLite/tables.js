let DB_NAME = 'MobileCollection';
let TABLES = {
    dcoll_user: {
        column: ['id', 'key', 'value'],
        name: 'collection',
        pk : 'key'
    }
}

export {
    DB_NAME,
    TABLES,
}