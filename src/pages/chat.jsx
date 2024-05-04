import ChatSection from '@/components/ChatSection';
import SideBar from '@/components/SideBar'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/Auth';

const Chat = () => {

    const route = useRouter()
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const chatId = searchParams.get('chatId');
    const receiverId = searchParams.get('receiverId');
    console.log(receiverId)
    console.log(chatId)

    const [userAuth] = useAuth()




    // sidebar states
    const [showProject, setShowProject] = useState(false);
    const [showTeam, setShowTeam] = useState(false);
    const [showTasks, setShowTasks] = useState(false);
    const [showTickets, setShowTickets] = useState(false);
    const [showMeetRoom, setShowMeetRoom] = useState(false);


    useEffect(() => {
        if (showProject) {
            route.push(`/project?id=${id}`)
        }
        if (showTasks) {
            route.push(`/task?id=${id}`)
        }
        if (showTeam) {
            route.push(`/team?id=${id}`)
        }
        if (showTickets) {
            route.push(`/ticket?id=${id}`)
        }
        if (showMeetRoom) {
            route.push(`/meetRoom?id=${id}`)
        }
    }, [showProject, showTasks, showTeam, showTickets, showMeetRoom])

    return (
        <>
            <div className='py-2 pl-[6rem] h-[100vh] bg-primaryBg pr-4'>
                <div className=" bg-primaryText h-full w-full  rounded-md ">

                    <div className="header text-center font-semibold capitalize text-2xl border-2 py-4 h-[10%]">Chat or Discuss idea here
                    </div>

                    <div className=' h-[90%]'>
                        <ChatSection mainUserId={userAuth?.user?.id} otherUserId={receiverId} chatId={chatId} />
                    </div>
                </div>
            </div>

            <SideBar
                setShowProject={setShowProject}
                setShowTeam={setShowTeam}
                setShowTasks={setShowTasks}
                setShowTickets={setShowTickets}
                setShowMeetRoom={setShowMeetRoom}
            />
        </>
    )
}

export default Chat
