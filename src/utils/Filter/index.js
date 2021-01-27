const Filter = {
    select: (data, condition = []) => {
        return new Promise((resolve, reject) => {
            if (typeof (condition) != "object") reject("Parameter column belum benar");
            if(data.length == 0) resolve([]);
            var ress_data = data[0];
            condition.forEach((item, index) => {
                if (!Filter.isset(() => item.operator) || !Filter.isset(() => item.column) || !Filter.isset(() => item.value))
                    reject('Data Tidak Valid');
                switch (item.operator) {
                    case 'EQUAL':
                        ress_data = ress_data.filter(obj => obj[item.column] == item.value);
                        break;
                    case 'DOES_NOT_EQUAL':
                        ress_data = ress_data.filter(obj => obj[item.column] != item.value);
                        break;
                    case 'GREATHER_THAN_EQUAL_TO':
                        if (/\D/.test(item.value)) reject('Input harus angka');
                        ress_data = ress_data.filter(obj => obj[item.column] >= item.value);
                        break;
                    case 'LESS_THAN_EQUAL_TO':
                        if (/\D/.test(item.value)) reject('Input harus angka');
                        ress_data = ress_data.filter(obj => obj[item.column] <= item.value);
                        break;
                    case 'BETWEEN':
                        if(!Filter.isset(() => item.value2)) reject('Data Tidak Valid');
                        ress_data = ress_data.filter(obj => obj[item.column] >= item.value && obj[item.column] <= item.value2);
                        break;
                    case 'BEGIN_WITH':
                        ress_data = ress_data.filter(obj => obj[item.column].substring(0, (item.value).length) == item.value);
                        break;
                    case 'END_WITH':
                        ress_data = ress_data.filter(obj => obj[item.column].substring((obj[item.column].length - (item.value).length)) == item.value);
                        break;
                    case 'CONTAINS':
                        ress_data = ress_data.filter(obj => obj[item.column].includes(item.value));
                        break;
                    case 'DOES_NOT_CONTAINS':
                        ress_data = ress_data.filter(obj => !obj[item.column].includes(item.value));
                        break;
                    case 'DOES_NOT_BEGIN_WITH':
                        ress_data = ress_data.filter(obj => !obj[item.column].substring(0, (item.value).length) == item.value);
                        break;
                    case 'DOES_NOT_END_WITH':
                        ress_data = ress_data.filter(obj => !obj[item.column].substring((obj[item.column].length - (item.value).length)) == item.value);
                        break;
                    case 'GREATHER_THAN':
                        if (/\D/.test(item.value)) reject('Input harus angka');
                        ress_data = ress_data.filter(obj => obj[item.column] > item.value);
                        break;
                    case 'LESS_THAN':
                        if (/\D/.test(item.value)) reject('Input harus angka');
                        ress_data = ress_data.filter(obj => obj[item.column] < item.value);
                        break;
                    case 'NOT_BETWEEN':
                        if(!Filter.isset(() => item.value2)) reject('Data Tidak Valid');
                        ress_data = ress_data.filter(obj => obj[item.column] < item.value && obj[item.column] > item.value2);
                        break;
                    default:
                        reject('operator Tidak Valid');
                }

            });
            resolve(ress_data);
        });
    },
    isset: (accessor) => {
        try {
            return accessor() !== undefined && accessor() !== null
        } catch (e) {
            return false
        }
    }
}

export default Filter;