# envstrict
schema like definitions for environment variables, throws an exception when missing required variables.  Has a few helper methods exposed for filtering, merging an objects keys, and a few other things.

## Usage
```js
const envstrict = require('envstrict');
const envs = envstrict([
{
  key: 'NODE_ENV',
  required: false,
  default: 'development',
  filter: (val) => val.toUpperCase(),
  rename: 'environment'
},
{
  key: 'PORT',
  required: true
},
{
  key: 'FILE_PATHS',
  delim: /,\?/,
  default: '~/app/dir1,~/app/dir2,~/app/dir3'
}
]);
```
