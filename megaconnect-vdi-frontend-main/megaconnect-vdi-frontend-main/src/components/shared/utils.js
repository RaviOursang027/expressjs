const isAlphanumeric = function (str) {
  //   return /^[a-zA-Z0-9]+$/.test(str);
  return /^[0-9\!\@\#\$\%\^\&\*\)\(+\=\._-]+$/.test(str);
};

const containsUppercase = function (str) {
  return /[A-Z]/.test(str);
};

const containsSpecialCharacters = function (str) {
  return /[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g.test(
    str
  );


};
  const isValidFirstName = function (firstName) {
  
  return /^[a-zA-Z\s'-]+$/.test(firstName);
  }

const isValidLastName = function (lastName) {

   return /^[a-zA-Z\s'-]+$/.test(lastName);
};
const isValidMobileNumber = function (mobileNumber) {
  // Mobile number should be a 10-digit number.
  return /^[0-9]{10}$/.test(mobileNumber);
};

//   console.log(isAlphanumeric("abc123"));  // true
//   console.log(isAlphanumeric("abc!@#"));  // false
//   console.log(isAlphanumeric("123456"));  // true
//   console.log(isAlphanumeric(""));  // false

export { isAlphanumeric, containsUppercase, containsSpecialCharacters,isValidFirstName,isValidLastName,
isValidMobileNumber  };