export function checkIfContainsNumber(param) {
  return /\d/.test(param);
}
export function checkIfContainsSpecialChar(param) {
  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (format.test(param)) {
    return true;
  } else {
    return false;
  }
}
