import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  const token = authorization.slice(7);

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ["HS256"] }
    );

    if (
      typeof payload !== "object" ||
      typeof payload.userId !== "string"
    ) {
      return res.status(401).json({
        message: "Invalid authentication token"
      });
    }

    req.userId = payload.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}
