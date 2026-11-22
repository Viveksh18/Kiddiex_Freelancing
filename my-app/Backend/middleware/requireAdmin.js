const requireAdmin = (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";

  if (
    !process.env.ADMIN_API_KEY ||
    token !== process.env.ADMIN_API_KEY
  ) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Admin access required.",
    });
  }

  next();
};

module.exports = requireAdmin;