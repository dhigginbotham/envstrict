/* plan on moving this to its own npm-able thing.. fwiw <3 */
const merge = require('lodash.merge');
const format = require('util').format;

const base = {
  key: '',
  required: false,
  val: null,
  default: null,
  filter: null,
  delim: null,
  destinationKey: null,
  mutateKey: false
};

const defaults = {
  wildcard: null
};

const filterErrors = (out) => out.val === null && out.required === true;
const wildcardFind = (str, key) => key.indexOf(str) !== -1;

const applyDefaults = (out) => {
  if (out.val === null && out.default !== null) out.val = out.default;
  return out;
};

const applyDelims = (out) => {
  if (out.delim !== null) out.val = out.val.split(out.delim);
  return out;
};

const applyFilters = (out) => {
  if (out.filter !== null) out.val = out.filter(out.val);
  return out;
};

const initializer = function(iter) {
  if (typeof iter === 'undefined') return void 0;
  iter = typeof iter === 'string' ? { key: iter } : iter;
  iter.val = process.env.hasOwnProperty(iter.key)
    ? process.env[iter.key]
    : null;
  return merge({}, base, iter);
};

const EnvStrict = function(opts, defs) {
  if (!(this instanceof EnvStrict)) return new EnvStrict(opts);
  defs = defs ? merge({}, defaults, defs) : merge({}, defaults);
  const wildcards = defs.wildcard !== null
    ? Object.keys(process.env)
      .filter(wildcardFind.bind(null, defs.wildcard))
      .map(initializer)
    : [];
  const vars = opts instanceof Array
    ? opts
      .map(initializer)
      .map(applyDefaults)
      .map(applyDelims)
      .map(applyFilters)
    : [];
  const errors = vars.filter(filterErrors);
  if (errors.length) {
    throw new Error(format('Missing required enviroment variables: %s',
      errors.map(obj => obj.key).join(', ')));
  }
  wildcards.forEach(v => { this[v.key] = v.val; });
  vars.forEach(v => { this[v.key] = v.val; });
  return this;
};

module.exports = EnvStrict;
