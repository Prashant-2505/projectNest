import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Link from 'next/link'


const Navbar = () => {

    const router = useRouter()

    return (
        <div className=' bg-primaryBg h-[6rem]  w-full flex justify-center items-center fixed'>
            <div className='bg-secondaryBg  w-[70%] h-[80%] rounded-md shadow-md shadow-slate-950 flex justify-between items-center px-4'>

                <div className="mobileBtn hidden">
                    <p>X</p>
                </div>

                <div className="logo">
                    <Link href='/'>
                        <h1
                            className="logo  font-bold text-2xl bg-primaryBg p-4 rounded-md text-primaryText hover:bg-secondaryBg hover:text-primaryBg duration-200 ease-in-out cursor-pointer">ProjectNest</h1>
                    </Link>
                </div>

                <div className="navItem w-[40%]">
                    <ul className=' flex w-full justify-between items-center bg-secondaryBg'>
                        <motion.li
                            initial={{ y:-10}}
                            animate={{ y:0}}
                            transition={{ duration: 0.3}}

                            className='border-b-2 border-transparent capitalize cursor-pointer bg-secondaryBg duration-150 ease-in-out hover:border-primaryBg'>
                            Project
                        </motion.li>

                        <motion.li
                            initial={{ y:-10}}
                            animate={{ y:0}}
                            transition={{ duration: 0.3, delay: 0.3 }}
                            className=' border-b-2 border-transparent capitalize cursor-pointer bg-secondaryBg  duration-150 ease-in-out hover:border-primaryBg'>Team</motion.li>
                        <motion.li
                          initial={{ y:-10}}
                          animate={{ y:0}}
                            transition={{ duration: 0.3, delay: 0.5}}
                            className=' border-b-2 border-transparent capitalize cursor-pointer bg-secondaryBg  duration-150 ease-in-out hover:border-primaryBg'>About</motion.li>
                    </ul>
                </div>

                <Link href='/Login'>
                    <div onClick={() => router.push('/Login')} className="loginBtn h-[5rem]  bg-primaryBg px-5 py-2 text-primaryText rounded-200  flex justify-center items-center hover:bg-slate-300 hover:text-primaryBg border-2 border-transparent hover:border-primaryBg cursor-pointer">
                        <button>Login</button>
                    </div>
                </Link>

            </div>
        </div>
    )
}

export default Navbar
