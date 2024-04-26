import React from 'react';
import { ClipboardList, FolderGit, UserRoundSearch, TicketX, Presentation } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const SideBar = ({ setShowProject, setShowTeam, setShowTasks, setShowTickets, setShowMeetRoom }) => {

    const route = useRouter()

    const handleItemClick = (showProject, showTeam, showTasks, showTickets, showMeetRoom) => {
        setShowProject(showProject);
        setShowTeam(showTeam);
        setShowTasks(showTasks);
        setShowTickets(showTickets);
        setShowMeetRoom(showMeetRoom);
    };




    return (

        <div className="fixed top-1/2 left-[3rem] -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4">
            <div
                onClick={() => route.push('/')}
                className="group relative cursor-pointer">
                <div
                    className="flex flex-col items-center gap-2 transition-all duration-300 group-hover:translate-x-4">
                    <ProjectorIcon className="h-8 w-8 text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50" />
                    <span className="text-xs font-medium text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50">
                        All Projects
                    </span>
                </div>
            </div>

            <div
                onClick={() => handleItemClick(true, false, false, false, false)}
                className="group relative cursor-pointer">
                <div
                    onClick={() => handleItemClick(true, false, false, false, false)}
                    className="flex flex-col items-center gap-2 transition-all duration-300 group-hover:translate-x-4">
                    <ProjectorIcon className="h-8 w-8 text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50" />
                    <span className="text-xs font-medium text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50">
                        Project
                    </span>
                </div>
            </div>

            <div
                onClick={() => handleItemClick(false, true, false, false, false)}
                className="group relative cursor-pointer">
                <div
                    className="flex flex-col items-center gap-2 transition-all duration-300 group-hover:translate-x-4">
                    <GroupIcon className="h-8 w-8 text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50" />
                    <span className="text-xs font-medium text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50">
                        Team
                    </span>
                </div>
            </div>

            <div
                onClick={() => handleItemClick(false, false, true, false, false)}
                className="group relative cursor-pointer">
                <div
                    className="flex flex-col items-center gap-2 transition-all duration-300 group-hover:translate-x-4">
                    <ActivityIcon className="h-8 w-8 text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50" />
                    <span className="text-xs font-medium text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50">
                        Task
                    </span>
                </div>
            </div>

            <div
                onClick={() => handleItemClick(false, false, false, true, false)}
                className="group relative cursor-pointer">
                <div
                    className="flex flex-col items-center gap-2 transition-all duration-300 group-hover:translate-x-4">
                    <TicketIcon className="h-8 w-8 text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50" />
                    <span className="text-xs font-medium text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50">
                        Ticket
                    </span>
                </div>
            </div>

            <div
                onClick={() => handleItemClick(false, false, false, false, true)}
                className="group relative cursor-pointer">
                <div
                    className="flex flex-col items-center gap-2 transition-all duration-300 group-hover:translate-x-4">
                    <HotelIcon className="h-8 w-8 text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50" />
                    <span className="text-xs font-medium text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50">
                        Meeting Room
                    </span>
                </div>
            </div>

            <div
                onClick={() => route.push('/profile')}
                className="group relative cursor-pointer">
                <div
                    className="flex flex-col items-center gap-2 transition-all duration-300 group-hover:translate-x-4">
                    <UserIcon className="h-8 w-8 text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50" />
                    <span className="text-xs font-medium text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50">
                        Profile
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
function ActivityIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    )
}


function GroupIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 7V5c0-1.1.9-2 2-2h2" />
            <path d="M17 3h2c1.1 0 2 .9 2 2v2" />
            <path d="M21 17v2c0 1.1-.9 2-2 2h-2" />
            <path d="M7 21H5c-1.1 0-2-.9-2-2v-2" />
            <rect width="7" height="5" x="7" y="7" rx="1" />
            <rect width="7" height="5" x="10" y="12" rx="1" />
        </svg>
    )
}


function HotelIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
            <path d="m9 16 .348-.24c1.465-1.013 3.84-1.013 5.304 0L15 16" />
            <path d="M8 7h.01" />
            <path d="M16 7h.01" />
            <path d="M12 7h.01" />
            <path d="M12 11h.01" />
            <path d="M16 11h.01" />
            <path d="M8 11h.01" />
            <path d="M10 22v-6.5m4 0V22" />
        </svg>
    )
}


function ProjectorIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 7 3 5" />
            <path d="M9 6V3" />
            <path d="m13 7 2-2" />
            <circle cx="9" cy="13" r="3" />
            <path d="M11.83 12H20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2.17" />
            <path d="M16 16h2" />
        </svg>
    )
}


function TicketIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
            <path d="M13 5v2" />
            <path d="M13 17v2" />
            <path d="M13 11v2" />
        </svg>
    )
}


function UserIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}