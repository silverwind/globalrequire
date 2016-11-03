"use strict";

var fs = require("fs");
var join = require("path").join;
var resolve = require("path").resolve;
var rc = require("rc");
var validate = require("validate-npm-package-name");

module.exports = function requireglobal(request) {
  if (!isValidRequest(request)) throw new Error("Invalid request: " + request);

  try {
    return req(join(yarnGlobalFolder(), request));
  } catch (err) {}

  try {
    return req(join(npmGlobalFolder(), request));
  } catch (err) {}

  throw new Error("Cannot find module: '" + request + "'");
};

module.exports.resolve = function resolve(request) {
  if (!isValidRequest(request)) throw new Error("Invalid request: " + request);
  var modulePath;

  try {
    modulePath = join(yarnGlobalFolder(), request);
    req(modulePath);
    return modulePath;
  } catch (err) {}

  try {
    modulePath = join(npmGlobalFolder(), request);
    req(modulePath);
    return modulePath;
  } catch (err) {}

  throw new Error("Cannot find module: '" + request + "'");
};

function req(dir) {
  if (!isReadableFolder(dir)) throw new Error();
  return require(dir);
}

// for npm, we extract the global folder from its config files
function npmGlobalFolder() {
  var prefix = rc("npm").prefix;
  if (process.platform === "win32") {
    prefix = prefix || join(process.env.APPDATA, "npm");
  }
  return join(prefix, "lib", "node_modules");
}

// yarn pretty much hardcodes the global module folder, we mostly replicate the
// checks from https://github.com/yarnpkg/yarn/blob/master/src/constants.js to
// resolve the global folder in a similar fashion like they do
function yarnGlobalFolder() {
  var userHome = require("user-home");
  if (process.platform === "linux" && process.env.USER === "root") {
    userHome = resolve("/usr/local/share");
  }
  if (process.platform === "win32" && process.env.LOCALAPPDATA) {
    return join(process.env.LOCALAPPDATA, "Yarn", "global", "node_modules");
  }
  return join(userHome, ".yarn-config", "global", "node_modules");
}

function isReadableFolder(path) {
  try {
    fs.accessSync(path, fs.constants.R_OK);
  } catch (err) { return false; }
  try {
    if (fs.statSync(path).isDirectory()) {
      return true;
    }
  } catch (err) { return false; }
  return false;
}

function isValidRequest(request) {
  var result = validate(request);
  return result.validForNewPackages || result.validForOldPackages;
}
