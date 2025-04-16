import jwt from 'jsonwebtoken';

interface IToken {
  userId: number;
  email: string;
  name: string;
  role: string;
  exp?: number; // Expiration timestamp (optional)
}

export const validateToken = (token: string | null): IToken | null => {
  if (!token) {
    console.error('No token provided');
    return null;
  }

  try {
    // Decode the token without verifying signature
    const decoded = jwt.decode(token);

    // Ensure the decoded object is valid
    if (!decoded || typeof decoded !== 'object') {
      console.error('Failed to decode token');
      return null;
    }

    const { userId, exp } = decoded as any;
    const email = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
    const name = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (!userId || !email || !name || !role) {
      console.error('Token does not contain required fields');
      return null;
    }

    // Check token expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (exp && exp < currentTime) {
      console.error('Token has expired');
      return null;
    }

    return { userId, email, name, role, exp };
  } catch (error) {
    console.error('Error validating token:', error);
    return null;
  }
};












// import jwt from 'jsonwebtoken';
// import { useNavigate } from 'react-router-dom';

// interface IToken {
//   userId: number;
//   emailaddress: string;
//   name: string;
//   role: string;
//   exp?: number; // Token expiration timestamp
// }

// export const validateToken = (token: string | null): IToken | null => {
//   if (!token) {
//     console.error('No token provided');
//     return null;
//   }

//   try {
//     // Decode the token
//     const decoded = jwt.decode(token);

//     if (!decoded || typeof decoded !== 'object') {
//       console.error('Failed to decode token. Decoded value is null or not an object.');
//       return null;
//     }

//     // Validate structure and expiration
//     if (
//       'userId' in decoded &&
//       'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress' in decoded &&
//       'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name' in decoded &&
//       'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' in decoded
//     ) {
//       const currentTime = Math.floor(Date.now() / 1000);

//       if (decoded['exp'] && decoded['exp'] < currentTime) {
//         console.error('Token has expired');
//         return null;
//       }

//       return {
//         userId: decoded['userId'],
//         emailaddress: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
//         name: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
//         role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
//         exp: decoded['exp'], // Optional expiration for additional usage
//       };
//     } else {
//       console.error('Decoded token does not match the expected structure.');
//       return null;
//     }
//   } catch (error) {
//     console.error('Error decoding JWT:', error);
//     return null;
//   }
// };
