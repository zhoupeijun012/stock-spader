
function getStockList() {
  return global.HTTP.get('/api/public/stock_zh_a_spot_em');
}

function getStockHistory(symbol,startDate,endDate) {
  endDate = DAYJS().format('YYYYMMDD');
  startDate = '20150516'
  return global.HTTP.get(`/api/public/stock_zh_a_hist?period=daily&symbol=${symbol}&start_date=${startDate}&end_date=${endDate}&adjust=hfq`)
}
module.exports = {
  getStockList,
  getStockHistory
};
