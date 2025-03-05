module.exports = (req, res, next) => {
  if (!req.session?.isAuthenticated) {
    return res.redirect(301, '/login');
  }
  next();
};