const Router = require("@koa/router");
// const TABLE = require("../../utils/table");
// const STOCK = require('../../spider/stock');
// const CONFIG = require('../../utils/config');
const router = new Router({
  prefix: "/api",
});
// 定义一个POST请求的路由
router.post("/getPage", async (ctx) => {
  const params = ctx.request.body;

 
  ctx.body = {
    success: true,
    message: "成功",
    code: 200,
    data: {
      total: count,
      pages: Math.ceil(count / pageSize),
      pageNum,
      pageSize,
      list: res,
      keyMap,
    },
  };
});

router.post("/queryTable", async (ctx) => {
  const params = ctx.request.body;

  ctx.body = {
    success: true,
    message: "成功",
    code: 200,
    data: {
      list: res,
      keyMap,
    },
  };
});

let inStockUpdate = false;
router.get("/updateStockList", async (ctx) => {
  if(inStockUpdate) {
    ctx.body = {
      success: false,
      message: "更新中...",
      code: 200
    };
    return 
  }
  inStockUpdate = true;
  try {
    const stockList = (await STOCK.getStockList()).data || [];
    await TABLE.dropTable(CONFIG.DB_NAME);
    await TABLE.createTable(CONFIG.DB_NAME,stockList[0]);
    await TABLE.insertTable(CONFIG.DB_NAME,stockList)
    ctx.body = {
      success: true,
      message: "成功",
      code: 200
    };
    inStockUpdate = false
  } catch(error){
    ctx.body = {
      code: 200,
      success: false,
      message: '更新失败！'
    }
    inStockUpdate = false
  }  
});

module.exports = router;
