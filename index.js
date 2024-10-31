require('./utils/index');
// const Info = require(global.TOOL.resolvePath('spider/model/info.js'));
// const stockSpider = require(global.TOOL.resolvePath("spider/stock-spider"));

const schedule = require('node-schedule');

async function exec() {
    // const date = global.DAYJS().format('YYYY-MM-DD');
    // if(!(global.CHINESEDAY.isWorkday(date) && !global.CHINESEDAY.isInLieu(date))){
    //     return
    // }
    // try {
    //     await Info.createTable();
    //     await Info.resetStatus();
    //     // 首先更新股票列表
    //     await stockSpider.updateStockList();
    //     // 更新股票K线
    //     await stockSpider.updateStockHistory();

    //     // 更新基金列表

    //     // 更新基金历史

    // } catch(error){

    // }
} 
// 当前时间的秒值为 下午3点时执行任务，如：2018-7-8 13:25:10
schedule.scheduleJob('0 0 15 * * *', exec);
