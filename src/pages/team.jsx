import SideBar from '@/components/SideBar';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Text,
    Badge
} from '@chakra-ui/react'
import { Bell, Trash2 } from 'lucide-react';
import CustomModal from '@/components/CustomModal';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/Auth';


const Team = () => {

    // const dummy = [
    //     {
    //         name: "monu",
    //         tasks: [
    //             { name: "ac", assignedDate: "2024-04-10", finished: false, finishedDate: null },
    //             { name: "ad", assignedDate: "2024-04-08", finished: true, finishedDate: "2024-04-15" }
    //         ]
    //     },
    //     {
    //         name: "tinku",
    //         tasks: [
    //             { name: "acddfc", assignedDate: "2024-04-10", finished: false, finishedDate: null },
    //             { name: "ad", assignedDate: "2024-04-08", finished: true, finishedDate: "2024-04-15" }
    //         ]
    //     },
    //     {
    //         name: "tony",
    //         tasks: [
    //         ]
    //     },

    // ];
    const [projectContext, setProjectContext] = useProject();
    console.log(projectContext)
    const [userAuth] = useAuth()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const route = useRouter()
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [newUserNotification, setNewUserNotification] = useState(false)
    const [isOpen1, setIsOpen1] = useState(false);
    const [userReq, setUserReq] = useState([])


    const openModal = () => setIsOpen1(true);
    const closeModal = () => setIsOpen1(false);


    const [team, setTeam] = useState([])
    const [loading, setLoading] = useState(false)

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

        const getJoinUserReq = async () => {
            const { data } = await axios.get(`/api/auth/confirmUserJoin?id=${id}`)
            if (data.success) {
                setNewUserNotification(true)
                setUserReq(data?.userRequests)
            }

        }
        getJoinUserReq()
    }, [id])

    const getTeam = async () => {
        const { data } = await axios.get(`/api/member/getMember?id=${id}`);
        if (data.success) {
            setProjectContext({ ...projectContext, member: data.members });
        }
    };

    useEffect(() => {
        getTeam()
    }, [id])

    const updateModalData = (newData) => {
        setNewUserNotification(false)
        setUserReq(newData);
        getTeam()
    };





    return (
        <div className='pt-[10rem] pl-[10rem] min-h-[100vh] bg-primaryBg pr-4'>


            <div className=' min-h-[50vh] w-full bg-primaryText p-4 rounded-md'>
                {/* add user modal btn and header */}
                {userAuth?.user?.leader &&
                    <div className=' flex justify-between items-center'>
                        <button onClick={onOpen}
                            className='bg-blue-300 p-2 rounded-sm hover:bg-blue-400 duration-200 ease-in-out cursor-pointer'>Add Team Member
                        </button>
                        <Text onClick={openModal} className=' flex cursor-pointer'
                            fontSize='xl' fontWeight='bold'>
                            <Bell />
                            {newUserNotification && <Badge ml='1' fontSize='0.8em' colorScheme='green'>
                                New
                            </Badge>}
                        </Text>

                    </div>
                }

                {/* all memeber of project and its assigned atask */}
                <div>
                    {projectContext?.member.map((person) => (
                        <div className=' mt-4 bg-red-300 flex justify-between items-center rounded-md hover:bg-red-400 duration-150 ease-in-out  px-2'
                            key={person.name}>

                            <div className="flex">
                                <div className=' flex  gap-4 p-2'>
                                    <p>Name: <span className=' bg-primaryText px-2 rounded-sm'>{person.name}</span></p>
                                    <p>Email: <span className=' bg-primaryText px-2 rounded-sm'>{person.email}</span></p>
                                </div>
                            </div>
                            {userAuth?.user?.leader && <Trash2 className=' cursor-pointer' />}
                        </div>
                    ))}
                </div>

            </div>


            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add team member</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <p>copy project id <span className=' bg-green-300 p-2 rounded-md'>{id}</span> and share to those member you wanna add</p>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
            <CustomModal
                isOpen={isOpen1}
                onClose={closeModal}
                modalTitle="new user joining request"
                modalData={userReq}
                updateModalData={updateModalData} // Pass updateModalData function
            />
            <SideBar
                setShowProject={setShowProject}
                setShowTeam={setShowTeam}
                setShowTasks={setShowTasks}
                setShowTickets={setShowTickets}
                setShowMeetRoom={setShowMeetRoom}
            /></div>
    )
}

export default Team
