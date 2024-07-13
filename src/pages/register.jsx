import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Spinner, useToast } from '@chakra-ui/react'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { app } from '@/firebase';
import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const Register = () => {

    const router = useRouter()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [pic, setPic] = useState(null)

    const [loading, setLoading] = useState(false)
    const toast = useToast()

    const handleRegister = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (!email || !password) {
            toast({
                description: "Please fill all fields",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            setLoading(false)
            return
        } else {

            const config = {
                headers: {
                    "Content-type": "application/json"
                },
            }

            const { data } = await axios.post('/api/auth/register',
                {
                    name, email, password, pic
                }, config
            )
            if (data.success) {
                toast({
                    description: data.message,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
                setLoading(false)
                router.push('/Login')
            }
            else {
                toast({
                    description: data.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            }

            setLoading(false)
            setEmail("")
            setPassword("")
            setName("")
        }
    }

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

            console.log(userDetails)

            // Define your axios configuration here
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            };

            const { data } = await axios.post('/api/auth/registerByGoogle',
                {
                    name: user.displayName, email: user.email
                }, config
            )

            console.log(data)
            if (data.success) {
                toast({
                    description: data.message,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
                router.push('/Login')
            }
            else {
                toast({
                    description: data.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            }
            router.push('/Login')
        } catch (error) {
            console.error(error);
            alert('Something went wrong with Google sign-in. Please try again.');
        }
    };

    return (
        <div className='bg-primaryBg pt-[6rem] h-[100vh] w-full flex justify-center items-center overflow-hidden'>



            <div className={`formDiv h-[18rem] w-[50%] flex flex-col justify-center items-center `}>
                {/* form */}
                <motion.form
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}
                    className={`bg-secondaryBg w-full h-full flex flex-col justify-center items-center gap-4 pt-9 rounded-md `}>
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
                        className='border-2 border-primaryBg  mb-4 px-8 py-3 cursor-pointer bg-slate-300'
                        onClick={handleRegister}
                    >
                        {loading ? <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                        /> : "Submit"}
                    </motion.button>
                </motion.form>

                {/* auth */}
                <div className=' w-full'>
                    <motion.button
                        onClick={handleGoogleAuth}
                        type="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.7 }}
                        className='border-2 border-primaryBg w-full mt-5 mb-4 px-8 py-3 cursor-pointer bg-slate-300'
                    >
                        Continue with google
                    </motion.button>

                    <motion.div
                        type="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.8 }}
                        className=' flex justify-center'>
                        <Link href='/Login'>
                            <p className='  text-white border-b-2 border-transparent hover:border-white hover:text-slate-300 duration-150 ease-in-out cursor-pointer'>Already registered with us ?</p>
                        </Link>

                    </motion.div>
                </div>
            </div>


        </div>
    )
}

export default Register
