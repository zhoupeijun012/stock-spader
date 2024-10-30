const Stock = require(global.TOOL.resolvePath("spider/model/stock"));
const Info = require(global.TOOL.resolvePath("spider/model/info.js"));
const StockHistory = require(global.TOOL.resolvePath(
  "spider/model/stock-history"
));

async function updateMainList(Model,requestFunc) {
  const info = (await Info.getStatus(Model.tableName)) || {};
  if (
    info.ZHUANGTAI == "1" ||
    (info.ZHUANGTAI == "2" &&
      global.DAYJS(info.GENGXINSHIJIAN).format("YYYY-MM-DD") ==
        global.DAYJS().format("YYYY-MM-DD"))
  ) {
    return;
  }
  try {
    await Info.startUpdate(Model.tableName);
    const stockList = (await requestFunc()).data || [];
    await Model.dropTable();
    await Model.createTable(stockList[0], [], "代码");
    await Model.insert(stockList);
    await Info.updated(Model.tableName, 1, 1, 0);
  } catch (error) {
    await Info.updateError(Model.tableName, 1, 0, 1);
    return Promise.reject(error);
  }
}

async function updateHistory(Model,requestFunc) {
  const info = (await Info.getStatus(StockHistory.tableName)) || {};
  if (
    info.ZHUANGTAI == "1" ||
    (info.ZHUANGTAI == "2" &&
      global.DAYJS(info.GENGXINSHIJIAN).format("YYYY-MM-DD") ==
        global.DAYJS().format("YYYY-MM-DD"))
  ) {
    return;
  }
  try {
    await Info.startUpdate(StockHistory.tableName);
    const list = await Model.queryNo();
    const total = list.length;
    const pageSize = 5;
    const pages = Math.ceil(total / pageSize);
    let success = 0;
    let fail = 0;
    for (let pageNum = 0; pageNum < pages; pageNum++) {
      let stockNoList = [];
      if (pageNum + 1 >= pages) {
        stockNoList = list.slice(pageNum * pageSize);
      } else {
        stockNoList = list.slice(pageNum * pageSize, (pageNum+1) * pageSize);
      }
      const resultCount = await getGroupHistory(stockNoList,requestFunc);
      success += resultCount;
      fail += pageSize - resultCount;
      await Info.updated(StockHistory.tableName, total, success, fail);
      await timePause();
    }
  } catch (error) {
    await Info.updateError(StockHistory.tableName, total, success, fail);
    return Promise.reject(error);
  }
}

async function getGroupHistory(list,requestFunc) {
  console.log("请求分组", list);
  const promiseArr = [];
  for (const stockNo of list) {
    promiseArr.push(getSingleUpdate(stockNo,requestFunc));
  }
  const resultArr = await Promise.all(promiseArr);
  console.log("本轮请求结果", resultArr);
  const success = resultArr.reduce((cur, next) => cur + next, 0);
  return success;
}

async function getSingleUpdate(stockNo, requestFunc) {
  const endDate = global.DAYJS().format("YYYYMMDD");
  let startDate = "20000101";

  try {
    const stockHistory = new StockHistory(stockNo);
    // 首先判断表是否存在
    // const hasTable = await stockHistory.hasTable();
    // if (hasTable) {
    //   const QUERY_SQL = `SELECT ${global.TOOL.getPinYin("日期")} FROM ${
    //     stockHistory.tableName
    //   } ORDER BY ${global.TOOL.getPinYin("日期")} DESC LIMIT 1`;
    //   // 获取到最新日期
    //   const list = (await stockHistory.queryTable({ QUERY_SQL })).list || [];
    //   if (list.length > 0) {
    //     startDate = list[0];
    //   }
    // }
    // 获取历史清单
    const historyList = (await requestFunc(stockNo, startDate, endDate)).data || [];

    if (historyList.length < 0) {
      return 1;
    }
    // 删除表格
    await stockHistory.dropTable();
    // 创建表格
    await stockHistory.createTable(historyList[0]);
    // 插入数据
    await stockHistory.insert(historyList);
    return 1;
  } catch (error) {
    return 0;
  }
}

function timePause() {
  return new Promise((resolve) => {
    setTimeout(resolve, global.CONFIG.SPIDER_GAP);
  });
}

function getStockList() {
  return global.HTTP.get("/api/public/stock_zh_a_spot_em");
}

function getSingleStock(stockNo, startDate, endDate) {
  return global.HTTP.get(
    `/api/public/stock_zh_a_hist?period=daily&symbol=${stockNo}&start_date=${startDate}&end_date=${endDate}&adjust=hfq`
  );
}

// 更新股票列表
async function updateStockList(){
  return updateMainList(Stock,getStockList);
}
// 更新股票历史
async function updateStockHistory(){
  return updateHistory(Stock,getSingleStock);
}
module.exports = {
  updateStockList,
  updateStockHistory,
};
