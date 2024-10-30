const Common = require('./common');
class StockHistory extends Common {
    static tableName = global.CONFIG.TABLE_PREFIX + 'STOCK_HISTORY';
    constructor(tableName) {
        super(tableName)
    }
}
module.exports = StockHistory;