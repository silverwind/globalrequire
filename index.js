"use strict";

var exec = require("execa").shellSync;
var resolve = require("path").resolve;
var join = require("path").join;
var validate = require("validate-npm-package-name");
var fs = require("fs");

module.exports = function requireglobal(request) {
  if (!isValidRequest(request)) throw new Error("Invalid request: " + request);

  try {
    return req(join(yarnGlobalFolder(), request));
  } catch (err) {}

  try {
    return req(join(npmGlobalFolder(), request));
  } catch (err) {}

  throw new Error("Cannot find global module: '" + request + "'");
};

module.exports.resolve = function resolve(request) {
  if (!isValidRequest(request)) throw new Error("Invalid request: " + request);
  var modulePath;

  modulePath = join(yarnGlobalFolder(), request);
  try {
    req(modulePath);
    return modulePath;
  } catch (err) {}

  modulePath = join(npmGlobalFolder(), request);
  try {
    req(modulePath);
    return modulePath;
  } catch (err) {}

  throw new Error("Cannot find global module: '" + request + "'");
};

function req(dir) {
  if (!isReadableDirectory(dir)) throw new Error();
  return require(dir);
}

function isReadableDirectory(path) {
  try {
    fs.accessSync(path, fs.constants.R_OK);
  } catch (err) {
    return false;
  }
  try {
    var stat = fs.statSync(path);
    if (stat.isDirectory()) {
      return true;
    }
  } catch (err) {
    return false;
  }
  return false;
}

function isValidRequest(request) {
  var result = validate(request);
  return result.validForNewPackages || result.validForOldPackages;
}

// for npm, we can simply parse the global module folder from its help message
function npmGlobalFolder() {
  var result = exec("npm");
  if (result && result.stdout && result.stdout.length) {
    var path = (/npm@[^ ]+ (.+)/i.exec(result.stdout) || [])[1];
    if (path) return join(path, "..");
  }
  return null;
}

// yarn pretty much hardcodes the global module folder, we mostly replicate the
// checks from https://github.com/yarnpkg/yarn/blob/master/src/constants.js to
// resolve the global path in a similar fashion like they do
function yarnGlobalFolder() {
  var result = exec("yarn --version");
  if (/^v?\d+\.\d+\.\d+/gm.test(result.stdout.trim())) {
    var userHome = require("user-home");
    if (process.platform === "linux" && process.env.USER === "root") {
      userHome = resolve("/usr/local/share");
    }
    if (process.platform === "win32" && process.env.LOCALAPPDATA) {
      return join(process.env.LOCALAPPDATA, "Yarn", "global", "node_modules");
    }
    return join(userHome, ".yarn-config", "global", "node_modules");
  }
}
