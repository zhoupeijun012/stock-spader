const Common = require('./common');
class Stock extends Common {
    constructor(tableName) {
        super(tableName)
    }
}
const tableName = global.CONFIG.TABLE_PREFIX + 'STOCK';
const stock = new Stock(tableName)
module.exports = stock;