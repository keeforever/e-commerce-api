const Users = require("../model/Users.js");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachedCookiesResponse, createJWTPayload } = require("../utils");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // check already registered user
  const isRegisteredUser = await Users.findOne({ email });
  if (isRegisteredUser) {
    throw new CustomError.BadRequestError("User already exist. Try to login !");
  }

  // set first user as admin
  const isFirstUser = (await Users.countDocuments({})) === 0;
  const role = isFirstUser ? "admin" : "user";
  const user = await Users.create({ name, email, password, role });
  const JWTPayload = createJWTPayload(user);
  attachedCookiesResponse({ res, user: JWTPayload });
  res.status(StatusCodes.CREATED).json({ user: JWTPayload });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // check field values
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide the value");
  }

  // check user existence
  const user = await Users.findOne({ email });
  
  if (!user) {
    throw new CustomError.BadRequestError("Email is not registered !!!");
  }

  // compare password

  const grantAccess = await user.comparePassword(password);
  if (!grantAccess) {
    throw new CustomError.UnauthorizedRequestError(
      "Password does not match !!!"
    );
  }

  const JWTPayload = createJWTPayload(user);
  attachedCookiesResponse({ res, user: JWTPayload });
  res.status(StatusCodes.CREATED).json({ user: JWTPayload });
};

const logout = (req, res) => {
  res.cookie("token", "logged out", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 6),
  });
  res.send("user logged put");
};

module.exports = {
  register,
  login,
  logout,
};

/* my programming story
2020 -  april -3 - python
        may - python
        june - python
        july - python
        august - html
        september - css
        november - js
        december - nothing
2021    january -2021 - small -project
        february - sass,sql,some dsa
        march - one job attempt fail
        april - planned to learn react, english, dsa, algorithms, and bla bla with veera
        may - nothing
        june 15-exam
        july -exam end love
        august - love
        september - love proposal failure
        october - got one small and largest js project
        november - mid that i finished
        december - learned react, finished 15 projects
2022    january - 4 extras
        february - spotify clone
        march - spotify clone
        april - spotify clone
        may - spotify clone
        june - finished spotify clone front end.
        july - started node js and completed 9 project.


        





*/
