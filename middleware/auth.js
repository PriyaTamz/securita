import jwt from "jsonwebtoken";

const JWT_SECRET = "apple";

export const isAuthenticated = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;  // contains id and role
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export const authorizeRoles = (roles) => {
    return (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied: insufficient privileges' });
      }
      next();
    };
  };  

export const isSuperadminOrAdmin = (req, res, next) => {
    if (req.user.role === 'superadmin' || req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Access denied: Admin or Superadmin only' });
};

export const isSuperadmin = (req, res, next) => {
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Access denied: Super Admin only' });
    }
    next();
};

export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admin only' });
    }
    next();
};

export const isUser = (req, res, next) => {
    if (req.user.role !== 'user') {
        return res.status(403).json({ message: 'Access denied: User only' });
    }
    next();
};