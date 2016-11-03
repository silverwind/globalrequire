"require strict";

var assert = require("assert");
var globalrequire = require(".");

assert.doesNotThrow(globalrequire("npm").deref);
assert.ok(globalrequire.resolve("npm"));
