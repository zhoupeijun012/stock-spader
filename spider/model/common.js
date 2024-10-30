
class Common {
    constructor(tableName) {
        this.tableName = tableName;
    }
    createTable(column, indexKeys = [], uniqueKey = '') {
        const execSql = global.TOOL.getTableCreateSqlFromCloumn(column, indexKeys, uniqueKey);
        const sqlStr = `
          CREATE TABLE IF NOT EXISTS ${this.tableName} (
          ${execSql}
          )
         `;
        return global.SQL.query(sqlStr);
    }

    dropTable() {
        return global.SQL.query(`DROP TABLE IF EXISTS ${this.tableName}`);
    }

    insert(columns) {
        const { keySql, valSql } = global.TOOL.getTablInsertSqlFromCloumn(columns);
        const execSql = `INSERT INTO ${this.tableName} (${keySql}) VALUES ${valSql}`;
        return global.SQL.query(execSql);
    }

    async pageTable(params) {
        const pageSize = params.pageSize || 10;
        const pageNum = params.pageNum || 1;
        const ORDERBY = params.ORDERBY || "";
        const WHERE = params.WHERE || "";

        const pageSql = `SELECT * FROM ${this.tableName} ${WHERE} ${ORDERBY} LIMIT ${pageSize} OFFSET ${(pageNum - 1) * pageSize}`;
        const countSql = `SELECT COUNT(*) count FROM ${this.tableName}${WHERE}${ORDERBY}`;
        const keyMapSql = `SELECT COLUMN_NAME, COLUMN_COMMENT
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = '${global.CONFIG.DB_NAME}'
        AND TABLE_NAME = '${this.tableName}' `;
        // 获取请求体中的数据
        const list = await global.SQL.query(pageSql);
        const count = (await global.SQL.query(countSql))[0].count;
        const keyMap = await global.SQL.query(keyMapSql);
        return {
            total: count,
            pages: Math.ceil(count / pageSize),
            pageNum,
            pageSize,
            list,
            keyMap,
        };
    }

    async queryTable(params) {
        const QUERY_SQL = params.QUERY_SQL || "";

        const keyMapSql = `SELECT COLUMN_NAME, COLUMN_COMMENT
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = '${global.CONFIG.DB_NAME}'
        AND TABLE_NAME = '${this.tableName}' `;
        // 获取请求体中的数据
        const list = await global.SQL.query(QUERY_SQL);
        const keyMap = await global.SQL.query(keyMapSql);
        return {
            keyMap,
            list
        };
    }
}
module.exports = Common