const jwt = require("jsonwebtoken");

const verifyToken = (request, response, next) => {
  const accessToken =  request.cookies.accessToken;
//   const authHeader = request.headers.token;
  if (accessToken) {
    // const token = authHeader.split(" ")[1];
    jwt.verify(accessToken, process.env.JWT_SEC, (err, user) => {
      if (err) {
        return response.status(403).json("Token is not valid!");
      } else {
        request.user = user;
        next();
      }
    });
  } else {
    return response.status(403).json("You are not authenticated!");
  }
};

const verifyTokenAndAuthorization = (request, response, next) => {
  verifyToken(request, response, () => {
    if (request.user.id === request.params.id || request.user.isAdmin) {
      next();
    } else {
      response.status(403).json("You are not allowed to do that!!");
    }
  });
};

const verifyTokenAndAdmin = (request, response, next) => {
  verifyToken(request, response, () => {
    if (request.user && request.user.isAdmin) {
      next();
    } else {
      response.status(403).json("You are not allowed to do that!");
    }
  });
};

// const verifyTokenAndAdmin = (request, response, next) => {
//   verifyToken(request, response, () => {
//     if ( request.user && request.user.isAdmin) {
//       next();
//     } else {
//       response.status(403).json("You are not allowed to do that!!");
//     }
//   });
// };

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};