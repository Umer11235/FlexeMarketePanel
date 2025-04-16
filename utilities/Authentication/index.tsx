// hooks/useAuthRedirect.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateToken } from '../decoder/decode';

export const useAuthRedirect = () => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

 
   useEffect(() => {
     const token = localStorage.getItem('token'); // Or fetch from cookies
 
    var decod= validateToken(token)
    console.log(decod)
     if (!token) {
       router.push('/login'); // Redirect to login if no token
    }
    else{
        setIsChecking(false);

    }
   }, []);
   
   return isChecking;

};
