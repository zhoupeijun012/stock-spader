const HTTP = require('./http');
const CONFIG = require('./config');
const SQL = require('./sql');
const TOOL = require('./tool');
const DAYJS = require('dayjs');

const index = {
    TOOL,
    HTTP,
    CONFIG,
    SQL,
    DAYJS
}

Object.assign(global,index);