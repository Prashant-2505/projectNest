import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/Auth'
import { useRouter } from 'next/router'
import verifyAuth from '../../middleware/verifyAuth';
import axios from 'axios';
import { motion } from 'framer-motion'
import { useToast } from '@chakra-ui/react'


const Profile = () => {
    const [userAuth, setUserAuth] = useAuth()
    const router = useRouter()

    const toast = useToast()




    useEffect(() => {
        const fetchData = async () => {

            try {
                const isValid = await verifyAuth(userAuth?.user);
                if (isValid && !isValid) {
                    router.push('/Login');
                }
            } catch (error) {
                router.push('/Login');
            }


        };

        fetchData();
    }, [userAuth]);



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
            router.push('/')
        }
    }


 



    return (
        <div className='bg-primaryBg text-primaryText px-2  min-h-[100vh] w-full pb-8'>
            <p onClick={() => router.push('/')}
                className=' bg-slate-400 inline-block px-4 py-3 rounded-full mt-2 cursor-pointer hover:bg-slate-300 duration-150 hover:text-black'>{"<-"}</p>
            <div className="  w-[100%] h-full flex p-4  gap-4 ">
                <div className='w-[100%] h-full flex flex-col gap-4'>
                    {/* image div */}
                    <div className=" h-[15rem] w-[100%] bg-secondaryBg rounded-md flex justify-center items-center ">
                        <div className=' h-[90%] w-[39%] rounded-full  flex justify-center items-center'>
                            <img className='h-[100%] w-[100%]  rounded-full'
                                src={userAuth?.user?.pic} alt="" />
                        </div>
                    </div>
                    {/* achivement tags */}
                    <div className=" h-[15rem] w-[100%] bg-secondaryBg text-primaryBg rounded-md ">
                        {userAuth?.user?.achivement
                            ?
                            null
                            :
                            <div className='flex justify-center items-center'>
                                <p className=' text-primaryBg pt-4 pb-2 text-xl'>No achivements </p>
                            </div>
                        }
                    </div>

                </div>


                <div className='w-[100%] h-full flex flex-col gap-4'>
                    {/* contact info div */}
                    <div className=" h-[20rem] w-[100%] bg-secondaryBg rounded-md  text-primaryBg px-4 py-2">
                        <div className=' flex justify-between items-center'>
                            <p className='font-semibold text-xl border-b-[1px] border-primaryBg'>Contact Infromation</p>
                        </div>
                        <div className={`py-4 `}>
                            <p className=' opacity-50'>Name</p>
                            <p className='mb-4'>{userAuth?.user?.name}</p>

                            <p className=' opacity-50'>Contact email</p>
                            <p className='mb-4'>{userAuth?.user?.email}</p>

                            <p className=' opacity-50'>Designation</p>
                            <p className='mb-4'>{userAuth?.user?.leader ? 'Team leader' : 'Team member'}</p>

                            <button onClick={handleLogout}
                                className=' bg-primaryBg text-primaryText px-4 py-4 rounded-md border-2 hover:border-2 hover:border-primaryBg duration-200 ease-in-out hover:bg-primaryText hover:text-primaryBg'>
                                Logout
                            </button>

                        </div>

                  
                    </div>
                    {/* about me */}
                    <div className=" h-[20rem] w-[100%] bg-secondaryBg text-primaryBg rounded-md ">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
