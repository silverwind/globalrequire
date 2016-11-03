"require strict";

var assert = require("assert");
var globalrequire = require(".");

assert.ok(globalrequire("npm").version);
assert.ok(globalrequire.resolve("npm"));
