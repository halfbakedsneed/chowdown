const chai = require('chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const Promise = require('bluebird');

global.assert = chai.assert;
global.expect = chai.expect;
global.Promise = Promise;
global.sinon = sinon;
global.proxyquire = proxyquire;

module.exports = {};
module.exports.fixtures = {};