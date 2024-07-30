import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SideBar from '@/components/SideBar';
import { Spinner, useToast } from '@chakra-ui/react';
;
import ProjectHeader from '@/components/ProjectHeader';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/Auth';
import Link from 'next/link';
import axios from 'axios';

const Project = () => {

    const [projectContext, setProjectContext] = useProject()
    const [userAuth] = useAuth()
    console.log(userAuth)
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const route = useRouter()

    const toast = useToast();

    const [project, setProject] = useState({})
    const [loading, setLoading] = useState(false)
    // sidebar states
    const [showProject, setShowProject] = useState(false);
    const [showTeam, setShowTeam] = useState(false);
    const [showTasks, setShowTasks] = useState(false);
    const [showTickets, setShowTickets] = useState(false);
    const [showMeetRoom, setShowMeetRoom] = useState(false);



    const handleProject = async () => {
        try {
            setLoading(true);

            const response = await fetch('/api/project/verifyProject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ projectId: id }),

            });

            const data = await response.json();
            if (data.success) {
                setProject(data?.existingProject);
                localStorage.setItem('project', JSON.stringify(data?.existingProject));

                setProjectContext(data?.existingProject)
                setLoading(false);
                console.log(projectContext?.member)
            }
            else {

                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const deleteProject = async () => {
        const { data } = await axios.delete(`/api/project/deleteProject?projectId=${id}`)
        if (data.success) {
            toast({
                title: 'Project deleted successfully',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
        }
    }



    useEffect(() => {
        handleProject()
    }, [id]);

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


    // Function to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // // check auth
    // useEffect(() => {
    //     if (!userAuth?.user) {
    //         route.push('/Login')
    //     }
    // })
    return (
        <>
            <div className='py-1 pl-[6rem] w-full bg-primaryBg pr-6 overflow-x:hidden no-scrollbar'>

                {/* project header */}
                {loading
                    ?
                    <div className=' h-[100vh] w-full flex justify-center items-center'>
                        <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='xl'
                        />
                    </div>
                    :
                    <>
                        <ProjectHeader projectId={id} projectName={project?.name} projectLeaderName={project?.leader?.name} />

                        <div className=' w-full min-h-[80vh] max-h-[100vh] overflow-scroll hide-scrollbar h-full bg-primaryText mt-4 rounded-md p-4 relative '>
                            <h1 className=' font-semibold text-lg'>Project Description :</h1>
                            <p>{project?.description}</p>

                            <h1 className=' font-semibold text-lg'>Project Link :</h1>
                            <Link href={`${project?.link}`}>{project?.link}</Link>

                            <h1 className=' font-semibold text-lg mt-4'>Project Technology :</h1>
                            <div className=" flex gap-4">
                                {project?.tech?.map((tech, index) => (
                                    <p className=' bg-green-300 p-[5px] rounded-md mt-2'
                                        key={index}>{tech}</p>
                                ))}
                            </div>

                            <h1 className=' font-semibold text-lg mt-4'>Project Starting date :</h1>
                            <p>{formatDate(project?.createdAt)}</p>

                            {userAuth?.user?.leader && <button
                                onClick={deleteProject}
                                className=' bg-red-400 text-white w-full py-3 rounded-md absolute bottom-10 left-0'>Delete Project</button>

                            }
                        </div>

                    </>
                }

            </div>

            <SideBar
                setShowProject={setShowProject}
                setShowTeam={setShowTeam}
                setShowTasks={setShowTasks}
                setShowTickets={setShowTickets}
                setShowMeetRoom={setShowMeetRoom}
            />

        </>
    );
};

export default Project;
