"use strict";

let models = ["root"];
models.forEach(function (name) {
  module.exports[name] = require("./" + name);
});
