const HTTP = require('./http');
const CONFIG = require('./config');
const SQL = require('./sql');
const TOOL = require('./tool');
const DAYJS = require('dayjs');
const CHINESEDAY = require('chinese-days');

const index = {
    TOOL,
    HTTP,
    CONFIG,
    SQL,
    DAYJS,
    CHINESEDAY
}

Object.assign(global,index);