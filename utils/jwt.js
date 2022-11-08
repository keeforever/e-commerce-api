const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

const isValidJWT = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const attachedCookiesResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

const createJWTPayload = (user) => {
  return { name: user.name, userID: user._id, role: user.role };
};
module.exports = {
  createJWT,
  isValidJWT,
  attachedCookiesResponse,
  createJWTPayload
};
