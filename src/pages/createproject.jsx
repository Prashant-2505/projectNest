import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/Auth';
import { useToast } from '@chakra-ui/react';
import verifyAuth from '../../middleware/verifyAuth';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const CreateProject = () => {
    const [userAuth, setUserAuth] = useAuth();
    console.log(userAuth)
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectTech, setProjectTech] = useState([]);
    const [tech, setTech] = useState("");

    const projectLeader = userAuth?.user?._id;

    const toast = useToast();
    const router = useRouter();

    const handleCreateProject = async () => {
        try {
            if (!projectName || !projectDescription) {
                toast({
                    description: "Fill all required fields",
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                });
            } else {
                const { data } = await axios.post('/api/project/createproject', { projectName, projectDescription, projectTech, projectLeader },
                    {
                        headers: { 'Content-Type': 'application/json' }
                    });
                if (data.success) {
                    toast({
                        position: 'top',
                        title: data.message,
                        description: "Project id is " + data.newProject._id,
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                        containerStyle: {
                            width: '800px',
                            maxWidth: '100%',
                        },
                    });
                    const updatedUser = { ...userAuth.user, projects: [...userAuth.user.projects, data?.newProject?._id] };
                    setUserAuth({ user: updatedUser });
                    localStorage.setItem('auth', JSON.stringify(updatedUser) )

                    router.push('/');
                } else {
                    toast({
                        description: data.message,
                        status: 'error',
                        duration: 2000,
                        isClosable: true,
                    });
                }
            }
        } catch (error) {
            toast({
                description: "Something went wrong",
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
        }
    };

    const handleAddTech = (e) => {
        e.preventDefault()

        if (tech.trim() !== "") {
            setProjectTech([...projectTech, tech]);
            setTech("");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // If user is not authenticated, redirect to login page
                if (!userAuth?.user) {
                    router.push('/Login');
                    return;
                }

                if (!userAuth?.user?.leader) {
                    router.push('/');
                    return;
                }

                // Verify authentication
                const isValid = await verifyAuth(userAuth?.user);

                if (!isValid) {
                    router.push('/Login');
                    return;
                }

            } catch (error) {
                console.error('Error verifying authentication:', error);
                router.push('/Login'); // Redirect to login page on error
            }
        };

        fetchData();
    }, []);

    return (
        <div className='pt-16 min-h-screen w-full bg-primaryBg text-primaryText'>
            <div className="h-full flex flex-col gap-8 justify-center items-center">
                <form className='w-1/2 mt-20'>

                    <input
                        className='border border-primaryText w-full  outline-none px-4 bg-primaryBg text-primaryText h-12'
                        type="text"
                        placeholder="Project Name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                    />

                    <input
                        className='border border-primaryText w-full  outline-none px-4 bg-primaryBg text-primaryText h-12'
                        type="text"
                        placeholder="Project Leader"
                        value={userAuth?.user?.name}
                        readOnly
                    />

                    <div className='flex border border-primaryText'>
                        <input
                            className='border border-primaryText w-full  outline-none px-4 bg-primaryBg text-primaryText h-12'
                            type="text"
                            placeholder="Project Technology"
                            value={tech}
                            onChange={(e) => setTech(e.target.value)}
                        />
                        <button
                            onClick={handleAddTech}
                            className='px-2 bg-slate-300 text-primaryBg hover:bg-slate-400'>Add</button>
                    </div>
                    <div className=' pb-4'>
                        {projectTech.map((tech, index) => (
                            <div key={index} className="border border-primaryText inline-block p-2 m-1 bg-primaryText text-primaryBg rounded-md">
                                {tech}
                            </div>
                        ))}
                    </div>

                    <textarea
                        className='border border-primaryText w-full  outline-none px-4 bg-primaryBg text-primaryText h-12 '
                        type="text"
                        placeholder="Project Description"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                    />

                </form>
                <button onClick={handleCreateProject}
                    className=' bg-primaryText text-primaryBg px-6 py-4 rounded-md hover:bg-slate-300 duration-200 ease-in-out'>Submit</button>
            </div>
        </div>
    );
};

export default CreateProject;
