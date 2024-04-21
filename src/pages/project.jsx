import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SideBar from '@/components/SideBar';
import { Spinner, useToast } from '@chakra-ui/react';
;
import ProjectHeader from '@/components/ProjectHeader';
import { useProject } from '../../context/ProjectContext';

const Project = () => {

    const [projectContext, setProjectContext] = useProject()
    console.log(projectContext?.task)
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
            }
            else {
                
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };



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
    return (
        <>
            <div className='pt-[6rem] pl-[10rem] min-h-[100vh] w-full bg-primaryBg pr-6 '>

                {/* project header */}
                {loading
                    ?
                    <div className=' h-[60vh] w-full flex justify-center items-center'>
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

                        <div className=' w-full min-h-[50vh] h-full bg-primaryText mt-4 rounded-md p-4'>
                            <h1 className=' font-semibold text-lg'>Project Description :</h1>
                            <p>{project?.description}</p>

                            <h1 className=' font-semibold text-lg mt-4'>Project Technology :</h1>
                            <div className=" flex gap-4">
                                {project?.tech?.map((tech, index) => (
                                    <p className=' bg-green-300 p-[5px] rounded-md mt-2'
                                        key={index}>{tech}</p>
                                ))}
                            </div>

                            <h1 className=' font-semibold text-lg mt-4'>Project Starting date :</h1>
                            <p>{formatDate(project?.createdAt)}</p>

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
