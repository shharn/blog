'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveRoot = relativePath => path.resolve(appDirectory, relativePath);
const resolveApp = relativePath => path.resolve(appDirectory, 'front', relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(path, needsSlash) {
  const hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${path}/`;
  } else {
    return path;
  }
}

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

function getApiServerDomain(appPackageJson) {
  return require(appPackageJson).apiServer[process.env.NODE_ENV].domain;
}

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveRoot('.env'),
  appBuild: resolveRoot('public/app'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveApp('src/index.js'),
  appPackageJson: resolveRoot('package.json'),
  appSrc: resolveApp('src'),
  yarnLockFile: resolveRoot('yarn.lock'),
  testsSetup: resolveApp('src/setupTests.js'),
  appNodeModules: resolveRoot('node_modules'),
  publicUrl: getPublicUrl(resolveRoot('package.json')),
  servedPath: getServedPath(resolveRoot('package.json')),
  apiServerDomain: getApiServerDomain(resolveRoot('package.json'))
};
