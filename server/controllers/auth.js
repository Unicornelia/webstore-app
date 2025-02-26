exports.getLogin = (req, res) => {
  console.log(req.get('Cookie'), 'getLogin /auth');
  res.json({ isAuthenticated: req.isLoggedIn === 'true' });
};

exports.postLogin = (req, res) => {
  res.setHeader('Set-Cookie', 'isLoggedIn=true');
  res.json({ message: 'Logged in', isAuthenticated: true });
};