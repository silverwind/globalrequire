# globalrequire [![NPM version](https://img.shields.io/npm/v/globalrequire.svg?style=flat)](https://www.npmjs.org/package/globalrequire) [![Dependency Status](http://img.shields.io/david/silverwind/globalrequire.svg?style=flat)](https://david-dm.org/silverwind/globalrequire)
> require() globally installed modules

`globalrequire` replicates `require` behaviour but for global modules. Supports both [yarn](https://github.com/yarnpkg/yarn) and [npm](https://github.com/npm/npm)'s global locations, with a preference for yarn. Will not attempt to do any fallback to local modules or `NODE_PATH`.

## Installation
```console
$ npm i --save globalrequire
```
## Example
```js
const globalrequire = require("globalrequire");

console.log(globalrequire("npm").version);
// => '3.10.9'
console.log(globalrequire.resolve("npm"));
// => '/Users/silverwind/.npm-global/lib/node_modules/npm'
```

## API
### globalrequire(module);
### globalrequire.resolve(module);
- `module` {String}: The module name. Will throw on invalid module names or relative requests.

© [silverwind](https://github.com/silverwind), distributed under BSD licence
