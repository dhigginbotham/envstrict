const envs = require('../');
const expect = require('expect.js');

const defaults = [{
  key: 'NODE_ENV',
  required: false,
  default: 'development',
  transformer: (val) => val.toUpperCase(),
  rename: 'environment',
  mutate: true
}, {
  key: 'FILE_PATHS',
  delim: /,\s?/,
  default: '/app/dir1,/app/dir2,/app/dir3'
}];

describe('runs through basic tests for EnvStrict', () => {
  it('should have transformed the key for NODE_ENV to environment', (done) => {
    const env = envs(defaults);
    expect(env.hasOwnProperty('NODE_ENV')).to.equal(false);
    expect(env.hasOwnProperty('environment')).to.equal(true);
    return done();
  });
  it('should be able to transform environment value to `DEVELOPMENT`', (done) => {
    const env = envs(defaults);
    expect(env.environment).to.equal('DEVELOPMENT');
    return done();
  });
  it('should be able to delimit FILE_PATHS to an array', (done) => {
    const env = envs(defaults);
    expect(env.FILE_PATHS instanceof Array).to.equal(true);
    return done();
  });
});