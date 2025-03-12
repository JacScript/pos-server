const jwt = require("jsonwebtoken");
const createHttpError = require('http-errors');
const User = require('../models/userModel')

const isVerifiedUser = async (request, response, next) => {
  try {

    const { accessToken } = request.cookies;

    if (!accessToken) {
      const error = createHttpError(401, 'Please Provide Token');
      return next(error);
    }

    const decodeToken = jwt.verify(accessToken, process.env.JWT_SEC);

    const user = await User.findById(decodeToken.id);

    if (!user) {
      const error = createHttpError(401, 'User not Exist1');
      return next(error);
    }

    request.user = user;
    next();


  } catch (error) {
    const err = createHttpError(401, 'Invalid Token!')
    return next(error);
  }
};




module.exports = {
  isVerifiedUser
};