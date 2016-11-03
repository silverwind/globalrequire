"require strict";

// `oui`should be installed globall through yarn

var assert = require("assert");
var globalrequire = require(".");

assert.ok(globalrequire("npm").version);
assert.ok(globalrequire("oui"));
assert.ok(globalrequire.resolve("npm"));
