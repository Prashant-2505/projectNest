import SideBar from '@/components/SideBar';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import verifyAuth from '../../middleware/verifyAuth';
import { useAuth } from '../../context/Auth';


const MeetRoom = () => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
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
    return (
        <div className=' min-h-[100vh] bg-primaryBg flex justify-center items-center '>
            <div className=' text-4xl text-white '>
              <p> coming soon...</p>
            </div>

            <SideBar
                setShowProject={setShowProject}
                setShowTeam={setShowTeam}
                setShowTasks={setShowTasks}
                setShowTickets={setShowTickets}
                setShowMeetRoom={setShowMeetRoom}
            /></div>
    )
}

export default MeetRoom
