var Query = {
    select: (table, column, condition, operator, value, value2 = "") => {
        return new Promise((resolve, reject) => {
            if (typeof (column) != "object") reject("Parameter column belum benar");
            var sql_query = "";
            switch (condition) {
                case 'EQUAL':
                    column.forEach((item, index) => {
                        sql_query += item + ' = \'' + value + '\'' + (index != column.length - 1 ? ' ' + operator + ' ' : '');
                    });
                    break;
                case 'DOES_NOT_EQUAL':
                    column.forEach((item, index) => {
                        sql_query += item + ' != \'' + value + '\'' + (index != column.length - 1 ? ' ' + operator + ' ' : '');
                    });
                    break;
                case 'GREATHER_THAN_EQUAL_TO':
                    if (/\D/.test(value)) reject('Input harus angka');
                    column.forEach((item, index) => {
                        sql_query += item + ' >= ' + value + (index != column.length - 1 ? ' ' + operator + ' ' : '');
                    });
                    break;
                case 'LESS_THAN_EQUAL_TO':
                    if (/\D/.test(value)) reject('Input harus angka');
                    column.forEach((item, index) => {
                        sql_query += item + ' <= ' + value + (index != column.length - 1 ? ' ' + operator + ' ' : '');
                    });
                    break;
                case 'BETWEEN':
                    column.forEach((item, index) => {
                        sql_query += item + ' BETWEEN ' + value + ' AND  ' + value2 + (index != column.length - 1 ? ' ' + operator + ' ' : '');
                    });
                    break;
                case 'BEGIN_WITH':
                    column.forEach((item, index) => {
                        sql_query += item + ' LIKE \'' + value + '%\'' + (index != column.length - 1 ? ' ' + operator + ' ' : '');
                    });
                    break;
                case 'END_WITH':
                    column.forEach((item, index) => {
                        sql_query += item + ' LIKE \'%' + value + '\'' + (index != column.length - 1 ? ' ' + operator + ' ' : '');
                    });
                    break;
                case 'CONTAINS':
                    column.forEach((item, index) => {
                        sql_query += item + ' LIKE \'%' + value + '%\'' + (index != column.length - 1 ? ' ' + operator + ' ' : '');
                    });
                    break;
                case 'DOES_NOT_CONTAINS':
                    column.forEach((item, index) => {
                        sql_query += item + ' NOT LIKE \'%' + value + '%\'' + (index != column.length - 1 ? ' ' + operator + ' ' : '');
                    });
                    break;
                case 'DOES_NOT_BEGIN_WITH':
                    column.forEach((item, index) => {
                        sql_query += item + ' NOT LIKE \'' + value + '%\'' + (index != column.length - 1 ? ' ' + operator + ' ' : '');
                    });
                    break;
                case 'DOES_NOT_END_WITH':
                    column.forEach((item, index) => {
                        sql_query += item + ' NOT LIKE \'%' + value + '\'' + (index != column.length - 1 ? ' ' + operator + ' ' : '');
                    });
                    break;
                case 'GREATHER_THAN':
                    if (/\D/.test(value)) reject('Input harus angka');
                    column.forEach((item, index) => {
                        sql_query += item + ' > ' + value + (index != column.length - 1 ? ' ' + operator + ' ' : '');
                    });
                    break;
                case 'LESS_THAN':
                    if (/\D/.test(value)) reject('Input harus angka');
                    column.forEach((item, index) => {
                        sql_query += item + ' < ' + value + (index != column.length - 1 ? ' ' + operator + ' ' : '');
                    });
                    break;
                case 'NOT_BETWEEN':
                    column.forEach((item, index) => {
                        sql_query += item + ' NOT BETWEEN ' + value + ' AND ' + value2 + (index != column.length - 1 ? ' ' + operator + ' ' : '');
                    });
                    break;
                case 'ALL':
                    sql_query = "";
                    break;
                default:
                    reject('condition Tidak Valid');
            }
            sql_query = 'SELECT ' + column.join(', ') + ' FROM ' + table + (sql_query != "" ? ' WHERE ' + sql_query : "");
            resolve(sql_query);
        });
    }
}

export default Query;

/*
Contoh:
Query.select('table', ['column'], 'EQUAL', 'OR', 'value', 'value2').then((res)=>{
    alert(res);
}).catch((err)=>{
    alert(err);
});
===================================
param1: nama table (string),
param2: nama kolom (array),
param3: operator kondisi (string),
param4: operator 'AND', 'OR', 'NOT' (string),
param5: value (string),
param6: value2 dipakai untuk "BETWEEN" dan "NOT_BETWEEN"  (string:optional),
===================================
String operator (param3):
EQUAL
DOES_NOT_EQUAL
GREATHER_THAN_EQUAL_TO
LESS_THAN_EQUAL_TO
BETWEEN
BEGIN_WITH
END_WITH
CONTAINS
DOES_NOT_CONTAINS
DOES_NOT_BEGIN_WITH
GREATHER_THAN
LESS_THAN
NOT_BETWEEN
ALL
-----------------------------------
*ALL tidak pake kondisi
===================================
Response (string)
Error (string)
*/