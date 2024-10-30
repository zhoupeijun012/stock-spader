const Common = require('./common');
class Fund extends Common {
    constructor(tableName) {
        super(tableName)
    }
    async queryNo() {
        const countSql = `SELECT ( ${global.TOOL.getPinYin('基金代码')} ) FROM ${this.tableName}`;
        const list = (await global.SQL.query(countSql)).map((item)=>item.JIJINDAIMA);
        return list;
    }
}
const tableName = 'FUND';
const fund = new Fund(tableName)
module.exports = fund;