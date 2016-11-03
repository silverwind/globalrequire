"use strict";

var fs = require("fs");
var join = require("path").join;
var resolve = require("path").resolve;
var rc = require("rc");
var validate = require("validate-npm-package-name");

module.exports = function requireglobal(request) {
  if (!isValidRequest(request)) throw new Error("Invalid request: " + request);
  var modulePath;

  modulePath = join(yarnGlobalFolder(), request);
  try {
    return require(modulePath);
  } catch (err) {}

  modulePath = join(npmGlobalFolder(), request);
  try {
    return require(modulePath);
  } catch (err) {}

  throw new Error("Cannot find module: '" + request + "'");
};

module.exports.resolve = function resolve(request) {
  if (!isValidRequest(request)) throw new Error("Invalid request: " + request);
  var modulePath;

  modulePath = join(yarnGlobalFolder(), request);
  if (isReadableFolder(modulePath)) return modulePath;

  modulePath = join(npmGlobalFolder(), request);
  if (isReadableFolder(modulePath)) return modulePath;

  throw new Error("Cannot find module: '" + request + "'");
};

// for yarn we replicate the checks from
// https://github.com/yarnpkg/yarn/blob/master/src/constants.js
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

// for npm, we extract the global folder from its config files
function npmGlobalFolder() {
  var prefix = rc("npm").prefix;
  if (process.platform === "win32") {
    prefix = prefix || join(process.env.APPDATA, "npm");
  }
  return join(prefix, "lib", "node_modules");
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
