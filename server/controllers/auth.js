exports.getLogin = (req, res) => {
  console.log(req.session.isAuthenticated);
  res.json({ isAuthenticated: false });
};

exports.postLogin = (req, res) => {
  req.session.isAuthenticated = true;
  res.json({ message: 'Logged in' });
};