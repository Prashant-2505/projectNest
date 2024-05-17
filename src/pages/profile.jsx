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
    console.log(userAuth?.user)


    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [pic, setPic] = useState(null)

    const [editDetails, setEditDetails] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // If user is not authenticated, redirect to login page
                // if (!userAuth?.user) {
                //     router.push('/Login');
                //     return; // Exit early to prevent further execution
                // }

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
            router.push('/Login')
        }
    }



    return (
        <div className='bg-primaryBg text-primaryText px-2  min-h-[100vh] w-full pb-8'>
              <p onClick={()=>router.push('/')}
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
                            <p onClick={() => setEditDetails(!editDetails)}
                                className='border-b-2 border-transparent hover:border-b-2 hover:border-primaryBg duration-200 ease-in-out cursor-pointer'>Edit</p>
                        </div>
                        <div className={`py-4 ${editDetails ? 'hidden' : ''}`}>
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

                        <motion.form
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}
                            className={` w-full h-full flex flex-col justify-center items-center gap-4 pt-9 rounded-md ${editDetails ? "flex" : 'hidden'}`}>
                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                className='bg-primaryBg w-[80%] h-[10%] rounded-md text-primaryText px-2 py-6 outline-none'
                                type="text"
                                placeholder='Enter you name'
                            />
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className='bg-primaryBg w-[80%] h-[10%] rounded-md text-primaryText px-2 py-6 outline-none'
                                type="email"
                                placeholder='Enter you email'
                            />
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                className=' bg-primaryBg w-[80%] h-[10%] rounded-md text-primaryText px-2 py-6 outline-none'
                                type="password"
                                placeholder='Enter you password'
                            />
                            <motion.button
                                type="submit"
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.3 }}
                                className='border-2 border-primaryBg  mb-4 px-4 py-2 cursor-pointer bg-slate-300'

                            >
                                Submit
                            </motion.button>
                        </motion.form>
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
