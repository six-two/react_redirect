const MAGIC_URL_MARKER = "LNK"; //Short for LiNK
const VALID_URL_REGEX = /^https?:\/\//; // check for "http(s)://" at beginning

// Search order:
// first try the complete hash
// then try parameters from back to front

export function followRedirect(url?: URL) {
  let redirect = findRedirect(url);
  if (redirect) {
    window.location.replace(redirect);
  }
}

export function findRedirect(uri?: URL) {
  uri = uri || new URL(window.location.href);
  let hash = uri.hash;
  let result;
  let paramValues = [...uri.searchParams.values()];
  if (hash) {
    hash = hash.substr(1); // remove leading #
    //check if hash itself contains a redirect link
    result = testString(hash);
    if (result) {
      return result;
    }
    paramValues = [...paramValues, ...new URLSearchParams(hash).values()];
  }
  // check params in reversed order
  for (let v of paramValues.reverse()) {
    result = testString(v);
    if (result) {
      return result;
    }
  }
}

function testString(str: string) {
  // console.log("testing '" + str + "'");
  try {
    if (str.startsWith(MAGIC_URL_MARKER)) {
      str = str.substr(MAGIC_URL_MARKER.length);
      let decoded = decode(str);
      if (decoded.match(VALID_URL_REGEX)) {
        return decoded;
      }
    }
  } catch (e) {
    console.error("Error while decoding possible redirect link:", e);
  }
}

// custom base64 decode with url safe chars and without padding
function decode(base64: string) {
  base64 = base64
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  // add padding again
  let lastBlockSize = base64.length % 4;
  if (lastBlockSize !== 0) {
    base64 += ('===').slice(0, 4 - lastBlockSize);
  }
  return atob(base64);
}
