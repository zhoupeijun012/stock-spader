require('./utils/index');
const Info = require(global.TOOL.resolvePath('spider/model/info.js'));
const Stock = require(global.TOOL.resolvePath('spider/model/stock'))
const stockSpider = require("./spider/stock-spider");
(async () => {
    
    // await Info.createTable();
    // await Info.resetStatus();
    // // 首先更新股票列表
    // await stockSpider.getStockList();
    // 更新股票K线
    await stockSpider.getStockHistory();

    // 接下来从数据库查询出股票/ 10票每轮，首先判断是否更新过，更新后则往下走，使用plimit限制每次并发5条
    // 更新基金列表？
    // 更新基金信息？
})()
