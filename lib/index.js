'use strict';

var debug = require('debug')('think-resource');
var resolve = require('path').resolve;
var assert = require('assert');
var helper = require('think-helper');
var send = require('./send');

/**
 * defaultOptions
 * @type {{root: string, index: string, hidden: boolean, format: boolean, gzip: boolean, extensions: boolean, maxage: number, setHeaders: boolean}}
 */
var defaultOptions = {
  root: '',
  index: 'index.html',
  hidden: false,
  format: false,
  gzip: false,
  extensions: false,
  maxage: 0,
  setHeaders: false
};

/**
 * serve wrapper by koa-send
 * @param options
 * @returns {serve}
 */
module.exports = function (options) {
  options = helper.extend({}, defaultOptions, options || {});

  var root = options.root;
  assert(root, 'root directory is required to serve files');
  debug('static "%s" %j', root, options);
  options.root = resolve(root);

  /**
   * serve
   */
  return function serve(ctx, next) {
    if (ctx.method === 'HEAD' || ctx.method === 'GET') {
      return send(ctx, ctx.path, options).then(function (done) {
        if (!done) {
          return next();
        }
      });
    }
    return next();
  };
};