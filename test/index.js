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
    return expect(actual).to.eventually.rejectedWith("Missing Key");
}
function expectInvalidKeyPath(actual) {
    return expect(actual).to.eventually.rejectedWith("Key must match");
}
function expectInvalidNamespacePath(actual) {
    return expect(actual).to.eventually.rejectedWith("Namespace must match");
}
function expectExistingKey(actual) {
    return expect(actual).to.eventually.have.property('value').not.null;
}
function expectNonExistingKey(actual) {
    return expect(actual).to.eventually.have.property('value').null;
}

describe('CountAPI', function() {
    describe('get', function() {
        it('undefined key', () => expectMissingKey(countapi.get()));
        it('empty key', () => expectInvalidKeyPath(countapi.get('')));
        it('invalid key', () => expectInvalidKeyPath(countapi.get(INVALID_KEY)));
        it('undefined namespace', () => expectExistingKey(countapi.get(undefined, 'test')));
        it('invalid namespace', () => expectInvalidNamespacePath(countapi.get(INVALID_NAMESPACE, 'test')));
        it('key in default namespace', () => expectExistingKey(countapi.get('test')));
        it('key in test namespace', () => expectExistingKey(countapi.get('test', 'test')));
        it('non existing key', () => expectNonExistingKey(countapi.get(uuidv4())));
    });
});