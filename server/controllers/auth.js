exports.getLogin = (req, res) => {
  const isLoggedIn = req.get('Cookie').split('=')[1].trim();
  res.json({ isAuthenticated: isLoggedIn });
};

exports.postLogin = (req, res) => {
  res.cookie('isLoggedIn', 'true', {
    httpOnly: true, // Prevents JavaScript access (good for security)
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: 'Lax', // Allows cookies to work across subdomains
  })
  res.json({ message: 'Logged in' });
};