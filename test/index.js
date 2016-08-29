const envs = require('../');
const expect = require('expect.js');

const single = {
  key: 'FILE_PATHS',
  delim: /,\s?/,
  default: '/app/dir1,/app/dir2,/app/dir3'
};

const defaults = [{
  key: 'NODE_ENV',
  required: false,
  default: 'development',
  transformer: (val) => val.toUpperCase(),
  rename: 'environment',
  mutate: true
}];

defaults.push(single);

describe('Tests for EnvStrict', () => {
  it('should have transformed the key for `NODE_ENV` to `environment`', (done) => {
    const env = envs(defaults);
    expect(env.hasOwnProperty('NODE_ENV')).to.equal(false);
    expect(env.hasOwnProperty('environment')).to.equal(true);
    return done();
  });
  it('should be able to transform `environment` value to `DEVELOPMENT`', (done) => {
    const env = envs(defaults);
    expect(env.environment).to.equal('DEVELOPMENT');
    return done();
  });
  it('should be able to delimit `FILE_PATHS` to an array', (done) => {
    const env = envs(defaults);
    expect(env.FILE_PATHS instanceof Array).to.equal(true);
    return done();
  });
  it('throws an error when a required key is not found', (done) => {
    const def = Array.prototype.slice.call(defaults);
    def.push({
      key: 'PORT',
      required: true
    });
    try {
      const env = envs(def);
    } catch (ex) {
      expect(ex).to.not.be(null);
      expect(ex.message).to.equal('Missing required enviroment variables: PORT');
      return done();
    }
  });
  it('should accept an object instead of an array', (done) => {
    const env = envs(single);
    expect(env.FILE_PATHS instanceof Array).to.equal(true);
    return done();
  });
  it('should be able to add variables after initial object creation', (done) => {
    const env = envs(defaults);
    env.add({
      key: 'TEST_ENV_VAR',
      rename: 'testVar',
      mutate: true,
      default: '1'
    }).and({
      key: 'TEST_ENV_VAR_2',
      rename: 'testVar2',
      mutate: true,
      default: '2'
    });
    expect(env.testVar).to.equal('1');
    expect(env.testVar2).to.equal('2');
    expect(Object.keys(env).length).to.equal(4);
    return done();
  });
  it('throws an error if passed an undefined', (done) => {
    const env = envs(defaults);
    try {
      env.add(void 0);
    } catch (ex) {
      expect(ex).to.not.be(null);
      expect(ex.message).to.equal('Undefined value, function expects an object, not undefined.');
    }
    return done();
  });
  it('should be able to handle undefined keys when mutate is `true`', (done) => {
    const env = envs(defaults);
    env.add({
      key: void 0,
      rename: 'undefinedKey',
      mutate: true,
      default: '1'
    })
    expect(env.hasOwnProperty('undefinedKey')).to.equal(true);
    return done();
  });
  it('should be able to transform a `String` as an object key', (done) => {
    const env = envs(defaults);
    env.add('stringKey');
    expect(env.stringKey).to.be(null);
    return done();
  });
  it('should be able to transform a `Number` as an object key', (done) => {
    const env = envs(defaults);
    env.add(1);
    expect(env['1']).to.be(null);
    return done();
  });
  it('should be able to transform a `Boolean` as an object key', (done) => {
    const env = envs(defaults);
    env.add(true);
    expect(env['true']).to.be(null);
    return done();
  });
  it('should be able to link one var from another', (done) => {
    defaults.push({
      key: 'LINK_VAR_SAMPLE',
      rename: 'sampleLinkVar',
      mutate: true,
      link: '{{NODE_ENV}}'
    });
    defaults.push({
      key: 'LINK_VAR_SAMPLE',
      rename: 'anotherLinkVar',
      mutate: true,
      default: 1000,
      link: '{{SOME_OTHER_VAR}}'
    });
    const env = envs(defaults);
    expect(env.sampleLinkVar).to.not.be(null);
    expect(env.anotherLinkVar).to.equal(1000);
    return done();
  });
});