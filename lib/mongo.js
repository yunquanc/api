"use strict";
let mongodb = require('mongodb');

const MongoClient = require('mongodb').MongoClient;


class Mongo {
    constructor(opts) {
        this._opts = opts;
    }

    connect() {
        return new Promise((resolve, reject) => {
            const url = this._opts.url;
            MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
                console.log(url, ' started.')
                if (err) {
                    console.log(err);
                    return reject(err);
                }

                const db = client.db(this._opts.database);
                this.collection = (name) => {
                    return db.collection(name);
                };
                this.db = (dbname) => {
                    return client.db(dbname)
                }

                return resolve(true);
            });
        })
    }

}

module.exports = Mongo;
