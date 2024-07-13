import { useRouter } from 'next/navigation'
import React from 'react'

const DummyPage = () => {
    const router = useRouter()
    return (
        <div className=' bg-primaryBg  text-primaryText h-[100vh]  flex items-center flex-col py-4'>
            <p>Use Dummy account given below to log in</p>

            <div className=' bg-slate-900 mt-[4rem] p-4'>
                <p>Leader of project email : <span className=' text-red-200 font-bold'>leader1@gmail.com</span></p>
                <p>Leader of project password : <span className=' text-red-200 font-bold'>leader1</span></p>
                <br />
                <p>member1 of project email : <span className=' text-red-200 font-bold'>member1@gmail.com</span></p>
                <p>member1 of project password : <span className=' text-red-200 font-bold'>member1</span></p>
            </div>

            <button
                onClick={() => router.push('/Login')}
                className=' bg-primaryText text-primaryBg mt-8 px-3 py-3 rounded-md hover:bg-slate-100 duration-200'>Continue</button>

        </div>
    )
}

export default DummyPage
