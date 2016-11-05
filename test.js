"require strict";

// eslint must be installed globally for this test to pass

const assert = require("assert");
const m = require(".");

assert.ok(m("npm").version);
assert.ok(m("eslint"));
assert.ok(m.resolve("npm"));

assert.throws(() => { m("."); });
assert.throws(() => { m("/"); });
assert.throws(() => { m("./relative"); });
assert.throws(() => { m("./relative.js"); });
