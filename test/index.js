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
function expectExistingKey(actual) {
    return expect(actual).to.eventually.have.property('value').not.null;
}
function expectStatusCode(code, actual) {
    return expect(actual).to.eventually.have.property('status').equal(code);
}

describe('CountAPI', function() {
    this.timeout(10000);

    describe('get', function() {
        it('undefined key', () => expectMissingKey(countapi.get()));
        it('empty key', () => expectInvalidKeyPath(countapi.get('')));
        it('invalid key', () => expectInvalidKeyPath(countapi.get(INVALID_KEY)));
        it('undefined namespace', () => expectExistingKey(countapi.get(undefined, 'test')));
        it('invalid namespace', () => expectInvalidNamespacePath(countapi.get(INVALID_NAMESPACE, 'test')));
        it('key in default namespace', () => expectExistingKey(countapi.get('test')));
        it('key in test namespace', () => expectExistingKey(countapi.get('test', 'test')));
        it('non existing key', () => expectStatusCode(404, countapi.get(uuidv4())));
    });

    describe('set', function() {
        it('key, value undefined', () => expectMissingKey(countapi.set()));
        it('empty key', () => expectMissingKey(countapi.set()));
        it('value undefined', () => expectMissingKeyOrValue(countapi.set('test')));
        it('NaN value', () => expectNaN(countapi.set('test', '3.14')));
        it('key undefined with NaN value', () => expectNaN(countapi.set(undefined, '3.14')));
        it('key undefined', () => expectMissingKey(countapi.set(undefined, 3)));
        it('invalid key', () => expectInvalidKeyPath(countapi.set(INVALID_KEY, 3)));
        it('invalid namespace', () => expectInvalidNamespacePath(countapi.set(INVALID_NAMESPACE, 'test', 3)));
        it('key, namespace undefined', () => expectMissingKey(countapi.set(undefined, undefined, 3)));
        it('set non existing', () => expectStatusCode(404, countapi.set('test', uuidv4(), 3)));
        it('set without enable_reset', () => expectStatusCode(403, countapi.set('d7b97e5f-69a4-4933-8928-b9ee92f6b6ca', 3)));
        it('set in default namespace', () => expectStatusCode(200, countapi.set('default', 'c23ce4fa-4b78-4cbb-b53a-da3c2c38bb18', 3)));
    });
});