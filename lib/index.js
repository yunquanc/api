"use strict";
const system = require('../config/mongo');
const headers = require('../config/headers');
const codeMessage = require('./codeMessage')
// let models = [
//     'router',
// ];
// models.forEach(function (name) {
//     module.exports[name] = require('./' + name);
// });

const Mongo = require('./mongo');
let mongo = new Mongo(system);
mongo.connect();

module.exports.mongo = mongo;

module.exports.codeMessage = codeMessage;

module.exports.head = function () {
    return async (ctx, next) => {
        if (!headers || typeof headers !== 'object') return next();
        for (let key in headers) {
            ctx.res.setHeader(key, headers[key]);
        }
        return next();
    }
}

class Lib {
    context() {
        return async (ctx, next) => {
            ctx.end = (data, status) => {
                if (ctx.body) throw new Error('The ctx.body cannot repeat set value!')
                let body = {};
                if (!status || status == 200) {
                    body = {
                        data: data || '',
                        status: status || 200
                    }
                } else {
                    body = {
                        data: data || '',
                        status: status,
                        msg: codeMessage[status]
                    }
                }
                ctx.body = body;
                // ctx.body = '123123'
            }
            ctx.err = (status) => {
                if (ctx.body) throw new Error('The ctx.body cannot repeat set value!')
                let body = {
                    status: status,
                    msg: codeMessage[status]
                }
                ctx.status = status;
                ctx.body = body;
                // ctx.body = '123123'
            }
            return next()
        }
    }
}

module.exports.Lib = new Lib()
