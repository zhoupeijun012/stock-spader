
class Info {
    constructor(tableName) {
        this.tableName = tableName;
        this.model = {
            '表名': '',
            '状态': '',
            '更新时间': '',
            '总数': '',
            '成功': '',
            '失败': ''
        }
    }
    createTable() {
        const execSql = global.TOOL.getTableCreateSqlFromCloumn(this.model, [], '表名');
        const sqlStr = `
        CREATE TABLE IF NOT EXISTS ${this.tableName} (
        ${execSql}
        )
       `;
        return global.SQL.query(sqlStr);
    }
    async startUpdate(tableName) {
        const model = {
            '表名': tableName,
            '状态': '1'
        }
        await this._update(model);
    }
    async resetStatus() {
        const execSql = `UPDATE ${Info.tableName} SET ${global.TOOL.getPinYin('表名')} = '0'`;
        await global.SQL.query(execSql);
    }
    async getStatus(tableName) {
        const status = await global.SQL.query(`SELECT * FROM ${this.tableName} WHERE ${global.TOOL.getPinYin('表名')} = '${tableName}' `);
        return status.length > 0 ? status[0] : null
    }
    async inUpdate(tableName, total, success, fail) {
        const model = {
            '表名': tableName,
            '状态': '1',
            '总数': total + '',
            '成功': success + '',
            '失败': fail + ''
        }
        await this._update(model);
    }

    async updated(tableName, total, success, fail) {
        const model = {
            '表名': tableName,
            '状态': '2',
            '更新时间': global.DAYJS().format('YYYY-MM-DD HH:mm:ss'),
            '总数': total + '',
            '成功': success + '',
            '失败': fail + ''
        }
        await this._update(model);
    }

    async updateError(tableName, total, success, fail) {
        const model = {
            '表名': tableName,
            '状态': '0',
            '更新时间': global.DAYJS().format('YYYY-MM-DD HH:mm:ss'),
            '总数': total + '',
            '成功': success + '',
            '失败': fail + ''
        }
        await this._update(model);
    }
    async _update(model) {
        const { keySql, valSql } = global.TOOL.getTablInsertSqlFromCloumn(model);
        const execSql = `REPLACE INTO ${this.tableName} (${keySql}) VALUES ${valSql}`;
        await global.SQL.query(execSql);
    }
}

const tableName = global.CONFIG.TABLE_PREFIX + 'INFO';
const info = new Info(tableName);
module.exports = info