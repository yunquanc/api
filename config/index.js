"use strict";

let models = ["system", "mongo"];
models.forEach(function (name) {
  module.exports[name] = require("./" + name);
});
