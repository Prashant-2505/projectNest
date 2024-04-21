import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useAuth } from '../../context/Auth'


const Navbar = () => {

    const router = useRouter()

    const [userAuth] = useAuth()




    return (
        <div className=' bg-primaryBg h-[6rem]  w-full flex justify-center items-center fixed z-50'>
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
                        <Link href='/'>
                            <li
                                className='border-b-2 border-transparent capitalize cursor-pointer bg-secondaryBg duration-150 ease-in-out hover:border-primaryBg'>
                                All Project
                            </li>
                        </Link>

                        <li
                            className=' border-b-2 border-transparent capitalize cursor-pointer bg-secondaryBg  duration-150 ease-in-out hover:border-primaryBg'>About us</li>
                    </ul>
                </div>

                <Link href={`${userAuth ? '/profile' : 'Login'}`}>

                    <div onClick={() => router.push('/')} className="loginBtn h-[5rem]  bg-primaryBg px-5 py-2 text-primaryText rounded-200  flex justify-center items-center hover:bg-slate-300 hover:text-primaryBg border-2 border-transparent hover:border-primaryBg cursor-pointer">
                        <button>{`${userAuth ? 'Profile' : 'Login'}`}</button>
                    </div>

                </Link>

            </div>
        </div>
    )
}

export default Navbar
