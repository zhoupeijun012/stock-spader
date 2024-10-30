
const Stock = require(global.TOOL.resolvePath('spider/model/stock'));
const Info = require(global.TOOL.resolvePath('spider/model/info.js'));
const StockHistory = require(global.TOOL.resolvePath('spider/model/stock-history'))
async function getStockList() {
  const info = (await Info.getStatus(Stock.tableName)) || {};
  if (info.ZHUANGTAI == '1' || (info.ZHUANGTAI == '2' && global.DAYJS(info.GENGXINSHIJIAN).format("YYYY-MM-DD") == global.DAYJS().format("YYYY-MM-DD"))) {
    return
  }
  try {
    await Info.startUpdate(Stock.tableName);
    const stockList = (await global.HTTP.get('/api/public/stock_zh_a_spot_em')).data || [];
    await Stock.dropTable();
    await Stock.createTable(stockList[0], [], '代码');
    await Stock.insert(stockList);
    await Info.updated(Stock.tableName, 1, 1, 0);
  } catch (error) {
    await Info.updateError(Stock.tableName, 1, 0, 1);
    return Promise.reject(error);
  }
}

async function getStockHistory(symbol, startDate, endDate) {
  const info = (await Info.getStatus(Stock.tableName)) || {};
  if (info.ZHUANGTAI == '1' || (info.ZHUANGTAI == '2' && global.DAYJS(info.GENGXINSHIJIAN).format("YYYY-MM-DD") == global.DAYJS().format("YYYY-MM-DD"))) {
    return
  }
  // endDate = DAYJS().format('YYYYMMDD');
  // startDate = '20150516'
  // return global.HTTP.get(`/api/public/stock_zh_a_hist?period=daily&symbol=${symbol}&start_date=${startDate}&end_date=${endDate}&adjust=hfq`)
}
module.exports = {
  getStockList,
  getStockHistory
};
