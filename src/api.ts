export function checkUrlForErrors(value: string): string {
  if (!value.match(/^https?:\/\/.*/)) {
    return "The URL has to start with 'http://' or 'https://' (without the quotes)"
  }
  let invalidChars = value.match(/[ "<>{}^|]/g);
  console.log(invalidChars);
  if (invalidChars) {
    //TODO make set / remove dups
    let invalidCharString = invalidChars.join("");
    return "The URL contains some illegal characters that have not been properly escaped: '"
      + invalidCharString + "'";
  }
  try {
    let url = new URL(value);
    if (!url.host) {
      return "The URL has to contain a host (like example.com or 127.0.0.1)";
    }
    return "";
  } catch (e) {
    return "Not a valid URL";
  }
}

export function checkTemplateForErrors(value: string): string {
  let parts = value.split("%s");
  if (parts.length !== 2) {
    return "Template must contain exactly one '%s' (without the quotes) to signal where to embed the encoded URL";
  }
  return "";
}

export function createRedirectUrl(templateUrl: string, redirectToUrl: string): Result {
  let errors = [];
  let error = checkUrlForErrors(redirectToUrl);
  if (error) {
    errors.push("Error with 'redirectToUrl': " + error);
  }

  error = checkUrlForErrors(templateUrl);
  if (error) {
    errors.push("Error with 'templateUrl': " + error);
  }

  error = checkTemplateForErrors(templateUrl);
  if (error) {
    errors.push("Error with 'templateUrl': " + error);
  }

  const encoded = "LNK" + uriSafeEncode(redirectToUrl);
  const url = templateUrl.replace("%s", encoded);
  return { errors: errors, url: url };
}

function uriSafeEncode(data: string): string {
  const base64 = btoa(data);
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

interface Result {
  errors: string[],
  url: string,
}
