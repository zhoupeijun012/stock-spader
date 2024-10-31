const PINYIN = require('pinyin-pro');
const PATH = require('path');

function getPinYin(chineseName) {
    // 获取拼音
    const pinyinName = PINYIN.pinyin(chineseName, { toneType: "none", type: "array" });
    return pinyinName.join('').toLocaleUpperCase();
}
function resolvePath(path = '') {
    return PATH.resolve(__dirname,'../', path);
}
function getTableCreateSqlFromCloumn(column, indexKeys = [], uniqueKey = '') {
    if (Array.isArray(column) && column.length > 0) {
        column = column[0];
    }
    const keys = Object.keys(column);
    const pinKeys = keys.map((item) =>
        getPinYin(item).replace(/[^0-9A-Za-z]/g, "")
    );
    const sqlArr = keys.map(
        (key, index) => {
            if (uniqueKey == key) {
                return `${pinKeys[index]} VARCHAR(20) PRIMARY KEY COMMENT '${key}'`
            } else if (indexKeys.includes(key)) {
                return `${pinKeys[index]} TEXT COMMENT '${key}',INDEX ${pinKeys[index]}_INDEX (${pinKeys[index]})`
            } else {
                return `${pinKeys[index]} TEXT COMMENT '${key}'`
            }
        }
    );
    return sqlArr.join(",");
}
function getTablInsertSqlFromCloumn(columns) {
    if (!Array.isArray(columns)) {
        columns = [columns];
    }
    let column = columns[0];;

    const keys = Object.keys(column);
    const pinKeys = keys.map((item) =>
        global.TOOL.getPinYin(item).replace(/[^0-9A-Za-z]/g, "")
    );

    const keySql = pinKeys.join(",");
    const valArr = columns.map((column) => {
        const valItemArr = keys.map((key) => column[key] ? '"' + (column[key] + '') + '"' : "''");
        return `(${valItemArr.join(",")})`;
    });
    const valSql = valArr.join(",");
    return {
        keySql,
        valSql
    }
}


module.exports = {
    getPinYin, resolvePath, getTableCreateSqlFromCloumn, getTablInsertSqlFromCloumn
};