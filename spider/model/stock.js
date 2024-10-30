const Common = require('./common');
class Stock extends Common {
    constructor(tableName) {
        super(tableName)
    }
    async queryNo() {
        const countSql = `SELECT ( ${global.TOOL.getPinYin('代码')} ) FROM ${this.tableName}`;
        const list = (await global.SQL.query(countSql)).map((item)=>item.DAIMA);
        return list;
    }
}
const tableName = 'STOCK';
const stock = new Stock(tableName)
module.exports = stock;