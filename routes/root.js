const router = require("koa-router")();
const { mongo } = require("../lib/index");
const moment = require("moment");
var ObjectId = require("mongodb").ObjectId;

router.all("/*", async (cyx, next) => {
  console.log("all");
  await next();
});

router.post("/insert", async (ctx, next) => {
  try {
    const param = ctx.request.body;
    let all = param.timeList.reduce((i, n) => {
      let start = moment(n[0]);
      let end = moment(n[1]);
      let duration = moment.duration(end.diff(start));
      let hours = duration.asHours();
      console.log(hours);
      return i + hours;
    }, 0);
    const collection = mongo.collection("timelist");
    const insertResult = await collection.insertMany([
      {
        date: param.date,
        all: all,
        timeList: param.timeList,
      },
    ]);
    const timetemp = mongo.collection("timetemp");
    timetemp.deleteMany({});

    ctx.end(all);
  } catch (e) {
    ctx.end(e, 500);
  }
  await next();
});

router.post("/list", async (ctx, next) => {
  try {
    const collection = mongo.collection("timelist");
    const findResult = await collection.find({}).sort({ date: -1 }).toArray();
    ctx.end({
      list: findResult,
    });
  } catch (e) {
    ctx.end(e, 500);
  }
  await next();
});

router.post("/detail", async (ctx, next) => {
  try {
    const id = ctx.request.body.id;
    if (!id) throw Error("请提供ID");
    const collection = mongo.collection("timelist");
    const findResult = await collection
      .find({ _id: new ObjectId(id) })
      .toArray();
    ctx.end(findResult);
  } catch (e) {
    ctx.end(e.message, 4);
  }
  await next();
});

router.post("/save", async (ctx, next) => {
  try {
    const param = ctx.request.body;
    const str = JSON.stringify(param);
    const timetemp = mongo.collection("timetemp");
    await timetemp.deleteMany({});
    const res = await timetemp.insertOne({ str });
    ctx.end(res);
  } catch (e) {
    ctx.end(e, 500);
  }
  await next();
});

router.post("/gettemp", async (ctx, next) => {
  try {
    const timetemp = mongo.collection("timetemp");
    const res = await timetemp.find({}).toArray();
    console.log(res);

    ctx.end(res.length ? { ...JSON.parse(res[0].str) } : {});
  } catch (e) {
    ctx.end(e, 500);
  }
  await next();
});

module.exports = router;
