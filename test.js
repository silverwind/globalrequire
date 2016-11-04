"require strict";

// `oui`should be installed globall through yarn

const assert = require("assert");
const m = require(".");

assert.ok(m("npm").version);
assert.ok(m("oui"));
assert.ok(m.resolve("npm"));

assert.throws(() => { m("."); });
assert.throws(() => { m("/"); });
assert.throws(() => { m("./relative"); });
assert.throws(() => { m("./relative.js"); });
