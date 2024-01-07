// authenticationMiddleware.js
const jwt = require('jsonwebtoken');

// Function to verify the token
const verifyToken = async (token) => {
  try {
    const secretKey = process.env.SECRET_KEY;
    console.log('Attempting to verify token:', token);
    console.log('Using secret key:', secretKey);

    // Decode the token to see its structure
    const decoded = jwt.decode(token, { complete: true });
    console.log('Decoded token:', decoded);

    if (!decoded) {
      console.error('Failed to decode token.');
      return null;
    }

    // Verify the token
    const verified = jwt.verify(token, secretKey);
    console.log('Token verified successfully. Decoded payload:', verified);

    return verified.user;
  } catch (error) {
    console.error('Token Verification Error:', error.message);
    return null;
  }
};

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  // Get the token from the request headers
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized - Missing or Invalid Token' });
  }

  // Extract the token from the Authorization header
  const token = authorizationHeader.split(' ')[1];

  // Verify the token
  const user = await verifyToken(token);

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized - Invalid Token' });
  }

  // Set the user and token in the request for further use
  req.user = user;
  req.token = token;

  // Proceed to the next middleware or route handler
  next();
};

module.exports = authenticateUser;
