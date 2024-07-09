import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (err) {
        console.log(err);
        return res.status(401).json({ error: "Unauthorized" });
      } else {
        req.user = { _id: decodedToken.userId };
        next();
      }
    });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

export default userAuth;