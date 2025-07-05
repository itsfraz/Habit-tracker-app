const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');
  console.log('Auth Middleware: Received Token:', token ? token.substring(0, 10) + '...' : 'No Token'); // Log first 10 chars of token

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('Auth Middleware: JWT_SECRET is not defined!');
      return res.status(500).json({ msg: 'Server configuration error: JWT secret missing.' });
    }
    console.log('Auth Middleware: Using JWT_SECRET (first 5 chars):', secret.substring(0, 5) + '...');

    const decoded = jwt.verify(token, secret);
    req.user = decoded.user;
    console.log('Auth Middleware: Decoded User ID:', req.user.id);
    next();
  } catch (err) {
    console.error('Auth Middleware: Token verification failed:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
