import { Jwt } from "jsonwebtoken";

export default function verifyAdminToken(req, res, next) {
  if (!req.header("Authorization"))
    return res
      .status(401)
      .json({ success: false, message: "Access denied. No token provided." });
  if (req.header("Authorization") === undefined)
    return res
      .status(401)
      .json({ success: false, message: "Access denied. No token provided." });

  const token = req.header("Authorization").split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied. No token provided." });
  }
  try {
    const decoded = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.id = decoded.id;
    req.role = decoded.role;

    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid token." });
  }
}
