const isNode = typeof window === 'undefined'
const parse = isNode ? require('url').parse : browserParse

const SCHEME_REGEX = /[a-z]+:\/\//i
//                   1          2      3        4
const VERSION_REGEX = /^(dat:\/\/)?([^/]+)(\+[^/]+)(.*)$/i

module.exports = function parseDatURL (str, parseQS) {
  // prepend the scheme if it's missing
  if (!SCHEME_REGEX.test(str)) {
    str = 'dat://' + str
  }

  var parsed, version = null, match = VERSION_REGEX.exec(str)
  if (match) {
    // run typical parse with version segment removed
    parsed = parse((match[1] || '') + (match[2] || '') + (match[4] || ''), parseQS)
    version = match[3].slice(1)
  } else {
    parsed = parse(str, parseQS)
  }
  if (isNode) parsed.href = str // overwrite href to include actual original
  parsed.version = version // add version segment
  return parsed
}

function browserParse (str) {
  return new URL(str)
}