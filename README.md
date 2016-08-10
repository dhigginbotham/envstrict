# envstrict
schema like definitions for environment variables, throws an exception when missing required variables.  Has a few helper methods exposed for filtering, merging an objects keys, and a few other things.

## Usage
```js
const envstrict = require('envstrict');
const envs = envstrict([{
  key: 'NODE_ENV',
  required: false,
  default: 'development',
  transformer: (val) => val.toUpperCase(),
  rename: 'environment',
  mutate: true
}, {
  key: 'PORT',
  required: true
}, {
  key: 'FILE_PATHS',
  delim: /,\s?/,
  default: '~/app/dir1,~/app/dir2,~/app/dir3'
}]);
```

## API

`.add`, `.and`, `.get` - Aliased method to add after initial object creation.
```js
  const envstrict = require('envstrict');
  const envs = envstrict([ /* objects go here */ ]);
  envs.add({ key: 'SOME_ENV_VAR' });
```

## Tests
```sh
> mocha test/ -R spec

  runs through basic tests for EnvStrict
    ✓ should have transformed the key for `NODE_ENV` to `environment`
    ✓ should be able to transform `environment` value to `DEVELOPMENT`
    ✓ should be able to delimit `FILE_PATHS` to an array
    ✓ throws an error when a required key is not found
    ✓ should be able to add variables after initial object creation.
    ✓ throws an error if passed an undefined
    ✓ should be able to handle undefined keys when mutate is `true`
    ✓ should be able to transform a `String` as an object key
    ✓ should be able to transform a `Number` as an object key
    ✓ should be able to transform a `Boolean` as an object key


  10 passing (23ms)
```
