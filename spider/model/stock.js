const Common = require('./common');
class Stock extends Common {
    static tableName = global.CONFIG.TABLE_PREFIX + 'STOCK';
    constructor() {
        super()
    }
}

module.exports = Stock;