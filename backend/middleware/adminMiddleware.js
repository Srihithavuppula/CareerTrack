const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Access denied. No user found.",
    });
  }

  console.log("ADMIN CHECK USER:", {
    id: req.user._id,
    email: req.user.email,
    role: req.user.role,
  });

  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "Access denied. Admins only.",
    });
  }

  next();
};

module.exports = adminMiddleware;