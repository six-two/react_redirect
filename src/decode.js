const MAGIC_URL_MARKER = "LNK"; //Short for LiNK
const VALID_URL_REGEX = /^(http|https):\/\/.*/; // check for "http(s)://" at beginning

// Search order:
// first try the complete hash
// then try parameters from back to front

export function followRedirect(url) {
  let redirect = findRedirect(handleUndefined(url));
  if (redirect) {
    window.location.replace(redirect);
  }
}

export function findRedirect(uri) {
  uri = handleUndefined(uri);
  let hash = uri.hash;
  let result = null;
  if (hash) {
    hash = hash.substr(1); // remove leading #
    //check if hash itself contains a redirect link
    result = findInString(hash);
    if (result === null) {
      // search in hash params
      result = findInParams(new URLSearchParams(hash));
    }
  }
  if (result === null) {
    // search in normal url params
    result = findInParams(uri.searchParams);
  }
  return result;
}

function handleUndefined(url) {
  return url || new URL(window.location.href);
}

function findInParams(params) {
  let entries = [...params.entries()];
  entries = entries.reverse();// check last ones first

  for (const [key, value] of entries) {
    let res = findInString(value);
    // console.log(key, "->", value, "decoded:", res);
    if (res !== null) {
      return res;
    }
  }
  return null;
}

function findInString(str) {
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
  return null;
}

// custom base64 decode with url safe chars and without padding
function decode(base64) {
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
