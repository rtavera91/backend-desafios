export const authMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized" });
    }
    next();
  };
};

// permisos por rol

export const isAdmin = (req, res, next) => {
  if (req.user && (user.role === "admin" || user.role === "premium")) {
    return next();
  } else {
    return res.status(403).json({ message: "Not authorized" });
  }
};

export const isAdminOrPremium = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  } else {
    return res.status(403).json({ message: "Not authorized" });
  }
};

export const isUser = (req, res, next) => {
  if (req.user && req.user.role === "user") {
    console.log("req.user", req.user); // test
    next();
  } else {
    return res.status(403).json({ message: "Not authorized" });
  }
};
