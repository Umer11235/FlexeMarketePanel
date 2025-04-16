// import { NextResponse } from 'next/server';
// import { validateToken } from './decode';

// export function middleware(request: Request) {
//   const token = request.headers.get('Authorization')?.split(' ')[1]; // Extract token from header
//   const decodedToken = validateToken(token);

//   if (!decodedToken) {
//     // If token is invalid or expired, redirect to login
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   const { role } = decodedToken;

//   // Role-based access
//   const adminRoutes = ['/admin', '/dashboard'];
//   const userRoutes = ['/profile', '/settings'];

//   const currentPath = new URL(request.url).pathname;

//   if (adminRoutes.includes(currentPath) && role !== 'Admin') {
//     return NextResponse.redirect(new URL('/unauthorized', request.url));
//   }

//   if (userRoutes.includes(currentPath) && role !== 'User') {
//     return NextResponse.redirect(new URL('/unauthorized', request.url));
//   }

//   return NextResponse.next(); // Allow access
// }
