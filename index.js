require('./utils/index');
const Info = require(global.TOOL.resolvePath('spider/model/info.js'));
const Stock = require(global.TOOL.resolvePath('spider/model/stock'))
const stockSpider = require("./spider/stock");
 (async()=>{
    await Info.createTable();
    await Info.startUpdate(Stock.tableName);
    // const info = await Info.getStatus(Stock.tableName);
    // console.log(res)
    await Info.inUpdate(Stock.tableName,500,10,20);
    await Info.inUpdate(Stock.tableName,800,10,20);
    await Info.inUpdate(Stock.tableName,1000,50,20);
// stock.upateStockList();
})()
