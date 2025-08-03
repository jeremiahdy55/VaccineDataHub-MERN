import pkg from "jsonwebtoken";
const { sign, verify, decode } = pkg;

export const generateToken = (user) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRES_IN = "15m";
  return sign({ id: user._id, username: user.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const isAuthorized = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const GRACE_PERIOD_SEC = 60 * 5; // 5 minutes
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid Authorization format" });
  }
  const token = parts[1]; // Expecting "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }
  try {
    const decoded = verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    // Handle expired tokens
    if (err.name === "TokenExpiredError") {
      try {
        const decoded = decode(token); // get payload without verification
        const now = Math.floor(Date.now() / 1000);

        // Still within grace window — re-issue token
        if (now - decoded.exp <= GRACE_PERIOD_SEC) {
          const newToken = generateToken({
            id: decoded.id,
            username: decoded.username,
          });
          res.setHeader("x-access-token", newToken); // send it back in header
          req.user = decoded;
          return next();
        } else {
          return res
            .status(403)
            .json({ message: "Token expired too long ago" });
        }
      } catch (decodeErr) {
        return res.status(403).json({ message: "Invalid token structure" });
      }
    }

    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
