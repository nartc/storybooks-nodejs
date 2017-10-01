module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  },
  ensureGuest: (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect('/dashboard');
    }
    return next();
  }
}