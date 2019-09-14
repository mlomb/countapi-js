var uuidv4 = require('uuid/v4');
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var expect = chai.expect;

const countapi = require('../index');

const INVALID_KEY = 'aa';
const INVALID_NAMESPACE = 'aa';

///
/// The test assumes that the key 'test' exists in the default AND 'test' namespaces
///

function expectMissingKey(actual) {
    return expect(actual).to.eventually.rejectedWith("Missing key");
}
function expectMissingKeyOrValue(actual) {
    return expect(actual).to.eventually.rejectedWith("Missing key or value");
}
function expectInvalidKeyPath(actual) {
    return expect(actual).to.eventually.rejectedWith("Key must match");
}
function expectInvalidNamespacePath(actual) {
    return expect(actual).to.eventually.rejectedWith("Namespace must match");
}
function expectNaN(actual) {
    return expect(actual).to.eventually.rejectedWith("is NaN");
}
function expectPath(namespace, key, actual) {
    return expect(actual).to.eventually.have.property('path').to.be.equals(typeof namespace === "undefined" ? key : `${namespace}/${key}`);
}
function expectExistingKey(actual) {
    return expect(actual).to.eventually.have.property('value').not.null;
}
function expectStatusCode(code, actual) {
    return expect(actual).to.eventually.have.property('status').equal(code);
}

describe('CountAPI', function() {
    this.timeout(10000);

    describe('validate path', function() {
        it('undefined undefined', () => expectMissingKey(countapi.validatePath()));
        it('empty key', () => expectInvalidKeyPath(countapi.validatePath('')));
        it('empty key, namespace', () => expectInvalidKeyPath(countapi.validatePath('', '')));
        it('invalid key', () => expectInvalidKeyPath(countapi.validatePath(INVALID_KEY)));
        it('invalid namespace', () => expectInvalidNamespacePath(countapi.validatePath(INVALID_NAMESPACE, 'test')));
        it('undefined namespace', () => expectPath(undefined, 'test', countapi.validatePath(undefined, 'test')));
        it('undefined key', () => expectPath(undefined, 'test', countapi.validatePath('test', undefined)));
    });

    describe('get', function() {
        it('key in default namespace', () => expectStatusCode(200, countapi.get('test')));
        it('key in test namespace', () => expectStatusCode(200, countapi.get('test', 'test')));
        it('non existing', () => expectStatusCode(404, countapi.get(uuidv4())));
    });

    describe('set', function() {
        it('non existing', () => expectStatusCode(404, countapi.set('test', uuidv4(), 3)));
        it('without enable_reset', () => expectStatusCode(403, countapi.set('d7b97e5f-69a4-4933-8928-b9ee92f6b6ca', 3)));
        it('in default namespace', () => expectStatusCode(200, countapi.set('default', 'c23ce4fa-4b78-4cbb-b53a-da3c2c38bb18', 3)));
    });
    
    describe('update', function() {
        it('non existing', () => expectStatusCode(404, countapi.set('test', uuidv4(), 3)));
        // TODO
    });
});