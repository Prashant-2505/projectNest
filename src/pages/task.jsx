import SideBar from '@/components/SideBar';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import axios from 'axios';
import { useProject } from '../../context/ProjectContext';
import { Checkbox, useToast } from '@chakra-ui/react'
import { useAuth } from '../../context/Auth';
import moment from 'moment';
import Select from 'react-select';


const Task = () => {

    const toast = useToast()
    const [projectContext, setProjectContext] = useProject();
    const [userAuth] = useAuth()
    console.log(projectContext)
    const route = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [createTask, setCreateTask] = useState(false);

    // Sidebar states
    const [showProject, setShowProject] = useState(false);
    const [showTeam, setShowTeam] = useState(false);
    const [showTasks, setShowTasks] = useState(false);
    const [showTickets, setShowTickets] = useState(false);
    const [showMeetRoom, setShowMeetRoom] = useState(false);

    //  user search states
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false); // State to control visibility of search results

    // task states
    const [taskName, setTaskName] = useState("")
    const [taskDescription, setTaskDescription] = useState("")
    const [assignedMembers, setAssignedMembers] = useState({})
    const [deadLine, setDeadLine] = useState("")
    const [priority, setPriority] = useState("")

    const [underReview, setUnderReview] = useState(false)

    const [taskCompleted, setTaskCompleted] = useState(projectContext?.task?.finishedDate ? true : false)

    const handleTaskUpdate = async (id) => {
        try {
            const { data } = await axios.post(
                '/api/task/updateTaskCompleted',
                { finishedDate: moment().format('MMMM D, YYYY'), taskId: id },
                {
                    headers: {
                        "Content-type": "application/json"
                    },
                }
            );
            if (data.success) {
                toast({
                    title: 'Task finished',
                    description: "Task is under review.",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                });

                setProjectContext(prevState => ({
                    ...prevState,
                    task: prevState.task.map(taskItem => {
                        if (taskItem._id === id) {
                            return {
                                ...taskItem,
                                finishedDate: moment().format('MMMM D, YYYY')
                            };
                        }
                        return taskItem;
                    })
                }));


                setUnderReview(true);
            }
        } catch (error) {
            console.error("Error updating task:", error);
            // Handle error if necessary
        }
    }




    const [fetchTaskFlag, setFetchTaskFlag] = useState(false)
    // member search feature
    useEffect(() => {
        if (!projectContext?.member) return;
        const filteredMembers = projectContext.member.filter((member) =>
            member.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredMembers);
        setShowSearchResults(!!searchQuery && !!filteredMembers.length);
    }, [searchQuery, projectContext?.member]);

    // side bar feature
    useEffect(() => {
        if (showProject) {
            route.push(`/project?id=${id}`);
        }
        if (showTasks) {
            route.push(`/task?id=${id}`);
        }
        if (showTeam) {
            route.push(`/team?id=${id}`);
        }
        if (showTickets) {
            route.push(`/ticket?id=${id}`);
        }
        if (showMeetRoom) {
            route.push(`/meetRoom?id=${id}`);
        }
    }, [showProject, showTasks, showTeam, showTickets, showMeetRoom]);


    const addTask = async () => {
        const { data } = await axios.post('/api/task/addTask', { taskName, taskDescription, assignedMembers, deadLine, priority, projectId: id }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (data.success) {
            toast({
                title: 'Task Created.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })

            setFetchTaskFlag(!fetchTaskFlag)
        }
    }

    const fetchTask = async () => {
        try {
            const { data } = await axios.get(`/api/task/fetchTask?id=${id}`);
            if (data.success) {
                const fetchedTasks = data.tasks;
                setProjectContext({ ...projectContext, task: fetchedTasks });
            }
        } catch (error) {
            console.error("Error:", error);
            toast({
                title: 'An error occurred.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    useEffect(() => {
        fetchTask()
    }, [fetchTaskFlag, id])


    // fetching task for member
    const [tasksForMember, setTasksForMember] = useState([]);
    useEffect(() => {
        if (userAuth?.user?.leader === false) {
            const filteredTasks = projectContext?.task?.filter(task => task.assignedMember._id === userAuth?.user?.id);
            setTasksForMember(filteredTasks);
        }
    }, [userAuth?.user?.id, projectContext?.task]);


    const options = [
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' }
    ];

    return (
        <div className="pt-[10rem] pl-[10rem] min-h-[100vh] bg-primaryBg pr-4">


            <div className=" min-h-[50vh] wfull bg-primaryText p-4 rounded-md">
                {userAuth?.user?.leader && <button onClick={() => setCreateTask(!createTask)} className=" bg-blue-300 p-2 rounded-sm">
                    Create a task
                </button>}




                {
                    userAuth?.user?.leader
                        ?
                        createTask
                            ?
                            (          // task creation by leader
                                <div className=" min-h-[16rem] w-full bg-slate-300 mt-2 p-2 text-center">
                                    <input
                                        value={taskName}
                                        onChange={(e) => setTaskName(e.target.value)}
                                        className=" p-2 rounded-sm w-full outline-none"
                                        placeholder="enter name"
                                        type="text"
                                    />

                                    <textarea
                                        value={taskDescription}
                                        onChange={(e) => setTaskDescription(e.target.value)}
                                        className=" p-2 rounded-sm w-full outline-none mt-2"
                                        placeholder="enter description"
                                        type="text"
                                    />

                                    <div className=' w-full flex items-center gap-2 mt-2'>
                                        <label >Priority </label>
                                        <Select className='w-full outline-none'
                                            onChange={(selectedOption) => setPriority(selectedOption.value)}
                                            options={options}
                                            placeholder='Select option'
                                        />

                                    </div>

                                    <div className=' w-full flex items-center gap-2 mt-2'>
                                        <label for="birthday">DeadLine </label>
                                        <input
                                            className=" p-2 rounded-sm w-[100%] outline-none"
                                            value={deadLine}
                                            onChange={(e) => setDeadLine(e.target.value)}
                                            type="date"
                                        />
                                    </div>

                                    <div className=" flex items-center w-full gap-2 mt-2">
                                        <p className="">Assigned</p>
                                        <div className=" w-full flex justify-center items-center bg-primaryText px-2">
                                            <input
                                                className=" p-2 rounded-sm w-[100%] outline-none"
                                                placeholder="Search member"
                                                type="search"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                            <Search />
                                        </div>
                                    </div>

                                    {/* Display search results */}
                                    {showSearchResults && (
                                        <ul  >
                                            {searchResults.map((member) => (
                                                <li
                                                    onClick={() => setAssignedMembers(member._id)}
                                                    className=' bg-red-300 mt-2 py-2 rounded-sm hover:bg-red-400 duration-150 ease-in-out cursor-pointer'
                                                    key={member._id}>{member.name}</li>
                                            ))}
                                        </ul>
                                    )}

                                    <button
                                        onClick={addTask}
                                        className=" bg-primaryBg text-primaryText px-8 py-2 rounded mt-4">Enter</button>
                                </div>
                            )
                            :
                            (
                                // all task div
                                <div className=' h-[50vh] overflow-auto mt-4'>
                                    {projectContext?.task.map((i) => (
                                        <div className=' bg-slate-200 rounded-md shadow-md shadow:slate-300  py-4 px-2 mb-4'>
                                            <div className=' flex justify-between'>
                                                <p className=' font-semibold text-lg'>{i?.name}</p>
                                                <p>Dead line: <span className=' font-semibold text-md bg-red-500 p-2 rounded-md text-secondaryBg'>{i?.deadLine}</span>
                                                </p>
                                            </div>
                                            <p>Description:</p>
                                            <p className=' bg-slate-100 p-2 my-2'>{i?.description}</p>
                                            <p>Assigned to : <span className=' font-semibold'>{i?.assignedMember?.name}</span></p>
                                            <p>Status : <span className=' font-semibold'>{i?.finishedDate ? i?.finishedDate : 'working...'}</span></p>
                                        </div>
                                    ))}
                                </div>

                            )
                        :
                        (
                            // task for member
                            <div className=' h-[50vh] overflow-auto mt-4'>
                                {
                                    tasksForMember?.length > 0
                                        ?
                                        tasksForMember?.map((task) => (
                                            <div className=' mb-4  gap-4'>
                                                <div className=' flex items-center justify-between mb-4'>
                                                    <p className=' '>Task: <span>{task?.name}</span></p>
                                                    <Checkbox
                                                        defaultChecked
                                                        colorScheme='green'
                                                        isChecked={task?.finishedDate}
                                                        onChange={(e) => {
                                                            setTaskCompleted(e.target.checked);
                                                            if (e.target.checked) {
                                                                handleTaskUpdate(task?._id);
                                                            }
                                                        }}
                                                    >
                                                        {underReview ? "Under Review" : projectContext?.task?.complete ? "Task Completed" : " submit for review"}
                                                    </Checkbox>


                                                </div>
                                                <p className=' bg-slate-200 min-h-[5rem] mb-4'>Description: <span className=' font-semibold'>{task?.description}</span></p>
                                                <div className=' flex items-center gap-4'>
                                                    <p>Dead line: <span className=' bg-red-500 inline-block  text-secondaryBg p-2 rounded-md text-sm'>{task?.deadLine}</span>
                                                    </p>
                                                    <p>
                                                        Priority: 
                                                        <span className={`${task?.priority === 'high' ? 'bg-red-500' :
                                                                task?.priority === 'medium' ? 'bg-yellow-600' :
                                                                    'bg-green-400'
                                                            } inline-block text-secondaryBg p-2 rounded-md text-sm`}>
                                                             { task?.priority}
                                                        </span>
                                                    </p>
                                                </div>

                                            </div>
                                        ))
                                        :
                                        <div className=' flex min-h-[8rem] w-full items-center justify-center'>
                                            <p className=' font-semibold capitalize text-2xl'>No task assigned</p>
                                        </div>
                                }
                            </div>
                        )
                }
            </div>



            <SideBar
                setShowProject={setShowProject}
                setShowTeam={setShowTeam}
                setShowTasks={setShowTasks}
                setShowTickets={setShowTickets}
                setShowMeetRoom={setShowMeetRoom}
            />
        </div>
    );
};

export default Task;
