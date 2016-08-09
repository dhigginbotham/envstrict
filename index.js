/* plan on moving this to its own npm-able thing.. fwiw <3 */
const merge = require('lodash.merge');
const format = require('util').format;

const base = {
  key: '',
  required: false,
  val: null,
  default: null,
  transformer: null,
  delim: null,
  rename: null,
  mutate: false
};

const settings = {
  wildcard: null
};

// filter fn for finding missing required values.
const errors = (out) => out.val === null && out.required === true;

// delimit seperated value lists to arrays
const delims = function (out) {
  if (out.val !== null && out.delim !== null) out.val = out.val.split(out.delim);
  return out;
};

// apply defaults to the val
const defaults = function (out) {
  if (out.val === null && out.default !== null) out.val = out.default;
  return out;
};

// apply transformers on the value, important to always have
// happen after you apply defaults/delims
const transformers = function (out) {
  if (out.val !== null && out.transformer !== null) out.val = out.transformer(out.val);
  return out;
};

// rename the thing
const rename = function (out) {
  if (out.rename !== null && out.mutate === true) out.key = out.rename;
  return out;
};

// takes a string as a key or an obj
const normalize = function(iter) {
  if (typeof iter === 'undefined') return void 0;
  iter = typeof iter === 'string' ? { key: iter } : iter;
  iter.val = process.env.hasOwnProperty(iter.key)
    ? process.env[iter.key]
    : null;
  iter = merge({}, base, iter);
  return iter;
};

// this does all the things, yo.
const EnvStrict = function(opts, defs) {
  if (!(this instanceof EnvStrict)) return new EnvStrict(opts);
  defs = defs ? merge({}, settings, defs) : merge({}, settings);
  const vars = opts instanceof Array
    ? opts
      .map(normalize)
      .map(defaults)
      .map(delims)
      .map(rename)
      .map(transformers)
    : [];
  const e = vars.filter(errors);
  if (e.length) {
    throw new Error(format('Missing required enviroment variables: %s',
      e.map(obj => obj.key).join(', ')));
  }
  vars.forEach(v => { this[v.key] = v.val; });
  return this;
};

module.exports = EnvStrict;
