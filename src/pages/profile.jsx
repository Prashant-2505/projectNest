import React, { useEffect } from 'react'
import { useAuth } from '../../context/Auth'
import { useRouter } from 'next/router'
import verifyAuth from '../../middleware/verifyAuth';
import axios from 'axios';
import { useToast } from '@chakra-ui/react'


const Profile = () => {
    const [userAuth, setUserAuth] = useAuth()
    const router = useRouter()

    const toast = useToast()

    useEffect(() => {
        const fetchData = async () => {
            try {
                // If user is not authenticated, redirect to login page
                if (!userAuth?.user) {
                    router.push('/Login');
                    return; // Exit early to prevent further execution
                }
                
                // Verify authentication
                const isValid = await verifyAuth(userAuth?.user);
    
                if (!isValid) {
                    router.push('/Login');
                    return;
                }
    
            } catch (error) {
                console.error('Error verifying authentication:', error);
                router.push('/Login'); // Redirect to login page on error
            }
        };
    
        fetchData();
    }, []);
    


    const handleLogout = async () => {
        const { data } = await axios.get('api/auth/logout');
        console.log(data)
        if (data.success) {
            toast({
                description: "Logout successfully",
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
            localStorage.removeItem('auth')
            setUserAuth(null)
            router.push('/Login')
        }
    }



    return (
        <div className='bg-primaryBg text-primaryText pt-[6rem] min-h-[100vh] w-full'>
            Profile
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Profile
