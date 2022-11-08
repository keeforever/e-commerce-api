const { isValidJWT } = require("../utils");
const CustomError = require("../errors");

const usersAuthentication = (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new CustomError.UnauthorizedRequestError("Unauthorized request !!!");
  }
  try {
    const payload = isValidJWT(token);
    req.user = payload;
    next();
  } catch (error) {
    throw new CustomError.UnauthorizedRequestError("Unauthorized request !!!");
  }
};


module.exports = usersAuthentication;
