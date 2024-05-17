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
import { useNotification } from "../../context/NotificationContext";
import { useSocket } from "../../context/socket";




const Team = () => {
    const socket = useSocket();

    const [projectContext, setProjectContext] = useProject();
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
            try {
                const { data } = await axios.get(`/api/auth/confirmUserJoin?id=${id}`);
                if (data.success) {
                    setNewUserNotification(true);
                    setUserReq(data?.userRequests);
                }
            } catch (error) {
                console.error('Error fetching user join requests:', error);
            }
        };
        getJoinUserReq();
    }, [id, newUserNotification]);


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


    // real time new user joining notification
    useEffect(() => {
        if (socket) {
            socket.emit('join room', userAuth?.user?.id);
            socket.on('new member joined', (member) => {
                try {
                    if (member.data) {
                        setNewUserNotification(true)
                    } else {
                        console.error('Invalid member data:', member);
                    }
                } catch (error) {
                    console.log("opop")
                    console.error('Error setting notification data:', error);
                }
            });
        }
        else {
            console.log("no socket")
        }
    }, [socket]);


    const createChat = async (receiverId) => {
        try {
            const { data } = await axios.post('/api/chatRoom/chat', {
                chatName: userAuth?.user?.id,
                isGroupChat: false,
                users: [userAuth?.user?.id, receiverId]
            });
            console.log(data)
            if (data.success) {
                route.push(`/chat?chatId=${data?.isChat?._id || data?.fullChat?._id}&receiverId=${receiverId}&id=${id}`);
            }
        } catch (error) {
            console.error("Error creating chat:", error);
        }
    };

  // check auth
//   useEffect(() => {
//     if (!userAuth?.user) {
//         route.push('/Login')
//     }
// })



    return (
        <div className='py-2 pl-[6rem] h-[100vh] bg-primaryBg pr-4'>


            <div className=' min-h-[100vh] w-full bg-primaryText p-4 rounded-md overflow-scroll no-scrollbar'>
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

                {/* all memeber of project*/}
                <div>

                    {/* <div className='mt-4 bg-gray-300 flex justify-between items-center rounded-md hover:bg-gray-200 duration-150 ease-in-out px-2' >
                        <div onClick={() => createChat(projectContext?.leader?._id)} className="flex cursor-pointer">
                            <div className='gap-4 p-2'>
                                <p className='font-semibold px-2 rounded-sm'>{projectContext?.leader?.name}</p>
                                <p className='px-2 rounded-sm'>{projectContext?.leader?.email}</p>
                            </div>
                        </div>
                    </div> */}

                    {projectContext?.member.map((person) => {
                        // Check if the current member is not the same as the current user
                        if (person._id !== userAuth?.user?.id) {
                            return (
                                <div className='mt-4 bg-gray-100 flex justify-between items-center rounded-md hover:bg-gray-200 duration-150 ease-in-out px-2' key={person.name}>
                                    <div onClick={() => createChat(person?._id)} className="flex cursor-pointer">
                                        <div className='gap-4 p-2'>
                                            <p className='font-semibold px-2 rounded-sm'>{person.name}</p>
                                            <p className='px-2 rounded-sm'>{person.email}</p>
                                        </div>
                                    </div>
                                    {userAuth?.user?.leader && <Trash2 className='cursor-pointer' />}
                                </div>
                            );
                        } else {
                            // Render nothing if the current member is the same as the current user
                            return null;
                        }
                    })}

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
