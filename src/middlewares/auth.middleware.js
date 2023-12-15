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
  if (req.user & (req.user.role === "admin")) {
    next();
  } else {
    return res.status(403).json({ message: "Not authorized" });
  }
};

export const isUser = (req, res, next) => {
  if (req.user & (req.user.role === "user")) {
    next();
  } else {
    return res.status(403).json({ message: "Not authorized" });
  }
};
