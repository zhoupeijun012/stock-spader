
class Info {
    static tableName = global.CONFIG.TABLE_PREFIX + 'INFO';
    static model = {
        '表名': '',
        '状态': '',
        '更新时间': '',
        '总数': '',
        '成功': '',
        '失败': ''
    }

    static createTable() {
        const execSql = global.TOOL.getTableCreateSqlFromCloumn(Info.model, [], '表名');
        const sqlStr = `
        CREATE TABLE IF NOT EXISTS ${Info.tableName} (
        ${execSql}
        )
       `;
        return global.SQL.query(sqlStr);
    }
    static async startUpdate(tableName) {
        const model = {
            '表名': tableName,
            '状态': '1'
        }
        await Info._update(model);
    }
    static async getStatus(tableName) {
        const status = await global.SQL.query(`SELECT * FROM ${Info.tableName} WHERE ${global.TOOL.getPinYin('表名')} = '${tableName}' `);
        return status.length > 0 ? status[0]: null
    }    
    static async inUpdate(tableName, total, success, fail) {
        const model = {
            '表名': tableName,
            '状态': '1',
            '总数': total + '',
            '成功': success + '',
            '失败': fail + ''
        }
        await Info._update(model);
    }

    static async updated(tableName, total, success, fail) {
        const model = {
            '表名': tableName,
            '状态': '2',
            '更新时间': global.DAYJS.format('YYYY-MM-DD HH:mm:ss'),
            '总数': total + '',
            '成功': success + '',
            '失败': fail + ''
        }
        await Info._update(model);
    }
    static async _update(model) {
        const { keySql, valSql } = global.TOOL.getTablInsertSqlFromCloumn(model);
        const execSql = `REPLACE INTO ${Info.tableName} (${keySql}) VALUES ${valSql}`;
        await global.SQL.query(execSql);
    }
}

module.exports = Info