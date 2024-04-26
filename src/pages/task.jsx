import SideBar from '@/components/SideBar';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import axios from 'axios';
import { useProject } from '../../context/ProjectContext';
import { Button, Checkbox, useDisclosure, useToast } from '@chakra-ui/react'
import { useAuth } from '../../context/Auth';
import moment from 'moment';
import Select from 'react-select';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { CircleCheckBig } from 'lucide-react';

const Task = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const toast = useToast()
    const [projectContext, setProjectContext] = useProject();
    console.log(projectContext?.task)
    const [userAuth] = useAuth()
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
    const [taskId, setTaskId] = useState({})
    const [taskName, setTaskName] = useState("")
    const [taskDescription, setTaskDescription] = useState("")
    const [assignedMembers, setAssignedMembers] = useState({})
    const [deadLine, setDeadLine] = useState("")
    const [priority, setPriority] = useState("")
    const [taskComment, setTaskComment] = useState("")

    const [underReview, setUnderReview] = useState(false)

    const [taskCompleted, setTaskCompleted] = useState(projectContext?.task?.finishedDate ? true : false)


    const [showDetails, setShowDetails] = useState()

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


    //  leader function
    const addCommentToTask = async () => {
        const { data } = await axios.post('/api/task/addComment/',
            { taskId, taskComment },
            { headers: { 'Content-Type': 'application/json' } }
        );
        if (data.success) {
            toast({
                title: 'Comment added.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })

        }
        else {
            toast({
                title: 'SOmething went wrong while adding comment',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    // removing rask submit request or finished date after getting reviewd by leader
    const removeSubmitRequest = async (id) => {
        try {
            const { data } = await axios.post(
                '/api/task/updateTaskCompleted',
                { finishedDate: " ", taskId: id, removeSubmitRequest: true },
                {
                    headers: {
                        "Content-type": "application/json"
                    },
                }
            );
            if (data.success) {

                setProjectContext(prevState => ({
                    ...prevState,
                    task: prevState.task.map(taskItem => {
                        if (taskItem._id === id) {
                            return {
                                ...taskItem,
                                finishedDate: " ",
                                comment: null
                            };
                        }
                        return taskItem;
                    })
                }));

                setUnderReview(false);
            }
        } catch (error) {
            console.error("Error updating task:", error);
            // Handle error if necessary
        }
    }

    // handle task completeion by leader
    const handleTaskCompletion = async (id) => {
        const { data } = await axios.post('/api/task/updateTaskCompleted', {
            taskId: id,
            completion_Date: moment().format('MMMM D, YYYY'),

        },
            {
                headers: {
                    "Content-type": "application/json"
                },
            })
        if (data.success) {
            toast({
                title: 'Task completed',
                description: "Task is finished by Leader.",
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
                            complete: moment().format('MMMM D, YYYY')
                        };
                    }
                    return taskItem;
                })
            }));
        }
        else
        {
            toast({
                description: "Something went wrong.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    }

    const options = [
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' }
    ];

    return (
        <div className="py-2 pl-[6rem] h-[100vh] bg-primaryBg pr-4 overflow-scroll no-scrollbar">


            <div className=" min-h-[100vh] wfull bg-primaryText p-4 rounded-md">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
                    {userAuth?.user?.leader && <button onClick={() => setCreateTask(!createTask)} className=" bg-blue-300 p-2 rounded-sm mb-4">
                        Create a task
                    </button>}
                </div>

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
                                // all task assigned by leader
                                <div className="w-full mx-auto p-4 md:p-6 overflow-scroll h-full">
                                    {projectContext?.task.map((task, index) => (
                                        <div key={index} className="space-y-4 w-full">
                                            {/* task list */}
                                            <div className="bg-white rounded-lg shadow-sm p-4 flex items-start justify-between border-2">
                                                <div>
                                                    <h3 className="font-medium text-lg">{task?.name}</h3>
                                                    <p className=" text-gray-400 text-sm">{task?.description}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Button onClick={() => setShowDetails(index)} size="sm" variant="outline">
                                                        View
                                                    </Button>
                                                    <Button className="text-red-500 hover:bg-red-500 hover:text-white" size="sm" variant="outline">
                                                        Delete
                                                    </Button>
                                                    <Button className="text-yellow-500 hover:bg-yellow-500 hover:text-white" size="sm" variant="outline">
                                                        Update
                                                    </Button>
                                                </div>
                                            </div>
                                            {/* task detsils */}
                                            {showDetails === index && (
                                                <div className=" w-full bg-gray-50  py-12 px-4 sm:px-6 lg:px-8">
                                                    <div className=" mx-auto space-y-8">
                                                        <div className="text-center flex items-center justify-center relative">
                                                            <h1 className="text-4xl font-bold text-gray-900 ">{projectContext?.task[index].name}</h1>
                                                            <p onClick={() => setShowDetails(null)}
                                                                className=' absolute right-0 font-semibold bg-slate-200 px-4 py-2 rounded-full hover:bg-slate-300 duration-150 cursor-default'>X</p>
                                                        </div>
                                                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                                                            <div className="grid grid-cols-1 sm:grid-cols-2">
                                                                <div className="bg-gray-100 dark:bg-gray-700 p-6 sm:p-8">
                                                                    <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">Details</h2>
                                                                    <ul className="mt-4 space-y-4">
                                                                        <li className="flex items-center justify-between">
                                                                            <span className="text-gray-600 dark:text-gray-400">Deadline</span>
                                                                            <span className="font-medium text-gray-900 dark:text-gray-100">{projectContext?.task[index].deadLine}</span>
                                                                        </li>
                                                                        <li className="flex items-center justify-between">
                                                                            <span className="text-gray-600 dark:text-gray-400">Assigned to</span>
                                                                            <span className="font-medium text-gray-900 dark:text-gray-100">{projectContext?.task[index]?.assignedMember?.name}</span>
                                                                        </li>
                                                                        <li className="flex items-center justify-between">
                                                                            <span className="text-gray-600 dark:text-gray-400">Status</span>
                                                                            <span className="font-medium text-green-500">
                                                                                {projectContext?.task[index]?.finishedDate.trim() === "" ? 'Working' : 'Ready for review'}
                                                                            </span>
                                                                        </li>
                                                                        <li className="flex items-center justify-between">
                                                                            <span className="text-gray-600 dark:text-gray-400">Completed on</span>
                                                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                                                {projectContext?.task[index]?.complete !== "" ? projectContext?.task[index]?.complete : null}
                                                                            </span>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                                <div className="p-6 sm:p-8">
                                                                    <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">Description</h2>
                                                                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                                                                        {projectContext?.task[index].description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="bg-gray-100 dark:bg-gray-700 px-6 py-4 sm:px-8 sm:py-6 flex justify-between items-center">
                                                                <button
                                                                    onClick={() => handleTaskCompletion(projectContext?.task[index]._id)}
                                                                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md">
                                                                    Mark as Completed
                                                                </button>
                                                                <button onClick={() => { onOpen(); setTaskId(task?._id); }}
                                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 font-medium py-2 px-4 rounded-md">
                                                                    Add Comment
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                            )
                        :
                        (
                            // task for member
                            <div className=' h-[100vh] overflow-auto no-scrollbar mt-4'>
                                {
                                    tasksForMember?.length > 0
                                        ?
                                        tasksForMember?.map((task) => (
                                            <div key={task?._id} className=' mb-4  gap-4'>
                                                <div className=' flex items-center justify-between mb-4'>
                                                    <p className=' '>Task: <span>{task?.name}</span></p>
                                                    <Checkbox
                                                        defaultChecked
                                                        colorScheme='green'
                                                        isChecked={task?.finishedDate !== " "}
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
                                                            {task?.priority}
                                                        </span>
                                                    </p>
                                                </div>

                                                {task?.comment && task?.finishedDate !== " " && (
                                                    <div className='mt-2 bg-green-400 py-4'>
                                                        <p className='bg-green-400 flex items-center gap-4 p-2'>
                                                            <span><CircleCheckBig /></span> Review has been completed and feedback has been received from the team leader:
                                                        </p>
                                                        <p className='text-primaryText p-2 pl-12 font-semibold'>{task?.comment}</p>
                                                        {task._id && (
                                                            <button onClick={() => removeSubmitRequest(task._id)}
                                                                className='text-black p-2 font-semibold bg-slate-200 ml-10 rounded-md'>
                                                                Remove Submit Request
                                                            </button>
                                                        )}
                                                    </div>
                                                )}

                                                <p>{task?.complete}</p>


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


            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody>
                        <textarea className=' w-full mt-9 border-2 border-primaryBg outline-none p-2'
                            value={taskComment}
                            onChange={(e) => setTaskComment(e.target.value)}
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={() => { onClose(); addCommentToTask(); }}>
                            add
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>

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

{/* <div className=' h-[50vh] overflow-auto mt-4'>
{projectContext?.task.map((i) => (
    <div key={i?._id} className=' bg-slate-200 rounded-md shadow-md shadow:slate-300  py-4 px-2 mb-4'>
        <div className=' flex justify-between'>
            <p className=' font-semibold text-lg'>{i?.name}</p>
            <p>Dead line: <span className=' font-semibold text-md bg-red-500 p-2 rounded-md text-secondaryBg'>{i?.deadLine}</span>
            </p>
        </div>

        <div className="flex items-center justify-between mt-2">
            <p>Assigned to : <span className=' font-semibold'>{i?.assignedMember?.name}</span></p>
            <p>
                Priority:
                <span className={`${i?.priority === 'high' ? 'bg-red-500' :
                    i?.priority === 'medium' ? 'bg-yellow-600' :
                        'bg-green-400'
                    } inline-block text-secondaryBg p-2 rounded-md text-sm`}>
                    {i?.priority}
                </span>
            </p>
        </div>
        <p>Description:</p>
        <p className=' bg-slate-100 p-2 my-2'>{i?.description}</p>
        <p>Status : <span className=' font-semibold'>{i?.finishedDate !== " " ? `finished on ${i?.finishedDate}` : 'working...'}</span></p>
        <p className=' mt-2'>{i?.finishedDate !== " " && 'Task is Ready for review '}</p>

        {i?.finishedDate !== " " &&
            <div className="flex items-center justify-between">
                <p>{'Add comment to task for Assigned member after reviewing'}</p>
                <button onClick={() => { onOpen(); setTaskId(i._id); }} className='bg-slate-300 rounded-md text-sm p-2 lg:p-2'>Add comment</button>
            </div>
        }


    </div>
))}
</div> */}
