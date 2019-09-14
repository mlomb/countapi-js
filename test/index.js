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
function expectInvalidKeyPath(actual) {
    return expect(actual).to.eventually.rejectedWith("Key must match");
}
function expectInvalidNamespacePath(actual) {
    return expect(actual).to.eventually.rejectedWith("Namespace must match");
}
function expectPath(namespace, key, actual) {
    return expect(actual).to.eventually.have.property('path').to.be.equals(typeof namespace === "undefined" ? key : `${namespace}/${key}`);
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
        it('non existing', () => expectStatusCode(404, countapi.set(uuidv4(), 3)));
        it('without enable_reset', () => expectStatusCode(403, countapi.set('d7b97e5f-69a4-4933-8928-b9ee92f6b6ca', 3)));
        it('in default namespace', () => expectStatusCode(200, countapi.set('default', 'c23ce4fa-4b78-4cbb-b53a-da3c2c38bb18', 3)));
    });
    
    describe('update', function() {
        it('non existing', () => expectStatusCode(404, countapi.update(uuidv4(), 3)));
        it('update out of bounds', () => expectStatusCode(403, countapi.update('test', 100)));
        it('in default namespace', () => expectStatusCode(200, countapi.update('ce420ebf-369c-4a19-92b1-8b02fb6e72ba', 100)));
    });
    
    describe('hit', function() {
        it('random key', () => expectStatusCode(200, countapi.hit(uuidv4())));
        it('in default namespace', () => expectStatusCode(200, countapi.hit('test')));
    });

    describe('create', function() {
        it('random', () => expectStatusCode(200, countapi.create()));
        it('random in namespace', () => expectStatusCode(200, countapi.create({ namespace: 'test' })));
        it('key', () => expectStatusCode(200, countapi.create({ key: uuidv4() })));
        it('invalid key', () => expect(countapi.create({ key: INVALID_KEY })).to.eventually.rejectedWith("Malformed Namespace/Key"));
        it('invalid namespace', () => expect(countapi.create({ namespace: INVALID_NAMESPACE })).to.eventually.rejectedWith("Malformed Namespace/Key"));
        it('invalid upper bound', () => expect(countapi.create({ update_upperbound: -1 })).to.eventually.rejectedWith("update_upperbound must be positive"));
        it('invalid lower bound', () => expect(countapi.create({ update_lowerbound:  1 })).to.eventually.rejectedWith("update_lowerbound must be negative"));
    });
    
    describe('info', function() {
        it('non existing', () => expectStatusCode(404, countapi.info(uuidv4())));
        it('in default namespace', () => expectStatusCode(200, countapi.info('test')));
    });
    
    describe('stats', function() {
        it('normal', () => expectStatusCode(200, countapi.stats()));
    });
    
    describe('visits', function() {
        it('auto', () => expectStatusCode(200, countapi.visits()));
        it('page', () => expectStatusCode(200, countapi.visits('page')));
    });
});