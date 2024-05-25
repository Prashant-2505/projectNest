import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useToast } from '@chakra-ui/react'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/Auth'
import { app } from '@/firebase';
import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";


const Login = () => {

    const route = useRouter()
    const [userAuth, setUserAuth] = useAuth()

    // form visiblity state acordinfg to role
    const [form, setForm] = useState(false)

    const [leader, setLeader] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const toast = useToast()


    const handleGoogleAuth = async () => {
        try {
            const auth = getAuth(app);
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userDetails = {
                name: user.displayName,
                email: user.email
            };

            const config = {
                headers: {
                    "Content-type": "application/json"
                },
            }

            const { data } = await axios.post('/api/auth/loginByGoogle', {
                email: user.email, leader
            }, config)
            console.log(data.user)
            console.log(data)
            if (data.success) {
                toast({
                    description: data.message,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
                localStorage.setItem('auth', JSON.stringify(data.user))
                setUserAuth({ user: data.user })
                route.push('/')
            }
            else {
                toast({
                    description: data.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            }

        } catch (error) {
            console.error(error);
            alert('Something went wrong with Google sign-in. Please try again.');
        }
    };


    const handleLogin = async (e) => {
        e.preventDefault()
        if (!email || !password) {
            toast({
                description: "Please fill all fields",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return
        } else {

            const config = {
                headers: {
                    "Content-type": "application/json"
                },
            }

            const { data } = await axios.post('/api/auth/login', {
                email, password, leader
            }, config)
            console.log(data.user)
            if (data.success) {
                toast({
                    description: data.message,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
                localStorage.setItem('auth', JSON.stringify(data.user))
                setUserAuth({ user: data.user })
                route.push('/')
            }
            else {
                toast({
                    description: data.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            }
            setEmail("")
            setPassword("")
        }
    }



    return (
        <div className='bg-primaryBg pt-[6rem] h-[100vh] w-full flex justify-center items-center overflow-hidden'>

            {/* login choice */}
            <div className={` bg-secondaryBg w-[30rem] min-h-[12rem] flex flex-col  justify-center items-center ${form ? 'hidden' : ''}`}>
                <p className='bg-secondaryBg py-4'>Login as</p>
                <div className='flex justify-evenly items-center bg-secondaryBg gap-8 mt-4'>
                    <button onClick={() => { setForm(true), setLeader(true) }} className=' bg-slate-300 hover:bg-slate-400 duration-150 ease-in-out hover:rounded-lg px-8 py-10 text-xl'>Team Leader</button>

                    <button onClick={() => { setForm(true) }} className=' bg-slate-300 hover:bg-slate-400 duration-150 ease-in-out hover:rounded-lg px-8 py-10 text-xl'>Team Member</button>
                </div>
                <Link href='/register'>
                    <p className='  text-primaryBg  border-b-2 border-transparent hover:border-primaryBg  duration-150 ease-in-out cursor-pointer my-5'>Not registered with us ?</p>
                </Link>
            </div>


            <div className={`formDiv h-[15rem] w-[50%] flex flex-col justify-center items-center ${form ? "" : 'hidden'}`}>
                {/* form */}
                <motion.form
                    initial={{ opacity: 0, y: 50 }}
                    animate={form ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.5 }}
                    className={`bg-secondaryBg w-full h-full flex flex-col justify-center items-center gap-4 pt-9 rounded-md ${form ? '' : 'hidden'}`}>
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
                        className='border-2 border-primaryBg mt-5 mb-4 px-8 py-3 cursor-pointer bg-slate-300'
                        onClick={handleLogin}
                    >
                        Submit
                    </motion.button>
                </motion.form>

                <div className=' w-full'>
                    <motion.button
                        onClick={handleGoogleAuth}
                        initial={{ opacity: 0 }}
                        animate={form ? { opacity: 1 } : {}} transition={{ duration: 0.4, delay: 0.7 }}
                        className='border-2 border-primaryBg w-full mt-5 mb-4 px-8 py-3 cursor-pointer bg-slate-300'
                    >
                        Continue with google
                    </motion.button>

                    <motion.div
                        type="submit"
                        initial={{ opacity: 0 }}
                        animate={form ? { opacity: 1 } : {}} transition={{ duration: 0.4, delay: 0.8 }}
                        className=' flex justify-between'>
                        <Link href='/register'>
                            <p className='  text-white border-b-2 border-transparent hover:border-white hover:text-slate-300 duration-150 ease-in-out cursor-pointer'>Not registered with us ?</p>
                        </Link>
                        <p className=' text-red-400 e border-b-2 border-transparent hover:border-red-600  hover:text-red-600 duration-150 ease-in-out cursor-pointer'>Forgot password</p>
                    </motion.div>
                </div>
            </div>


        </div>
    )
}

export default Login
