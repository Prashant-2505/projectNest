import React from 'react';
import { ClipboardList, FolderGit, UserRoundSearch, TicketX, Presentation } from 'lucide-react';
import { motion } from 'framer-motion';

const SideBar = ({ setShowProject, setShowTeam, setShowTasks, setShowTickets, setShowMeetRoom }) => {

    const handleItemClick = (showProject, showTeam, showTasks, showTickets, showMeetRoom) => {
        setShowProject(showProject);
        setShowTeam(showTeam);
        setShowTasks(showTasks);
        setShowTickets(showTickets);
        setShowMeetRoom(showMeetRoom);
    };

    const listItemVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const liStyle = 'bg-primaryText flex justify-center items-center min-w-[8rem]  px-4 h-[3rem] group cursor-pointer hover:border-2 border-primaryBg my-2';

    return (
        <div className="absolute left-2 h-[auto] text-primaryBg overflow-hidden top-[30%] duration-200 ease-in-out bg-primaryText shadow-lg shadow-slate-900 rounded-md">
            <ul>

                <motion.li
                    className={liStyle}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleItemClick(true, false, false, false, false)}
                >
                    <FolderGit />
                    <motion.p
                        className="hidden group-hover:block"
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.5 }}
                    >
                        Project
                    </motion.p>
                </motion.li>

                <motion.li
                    className={liStyle}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleItemClick(false, false, true, false, false)}
                >
                    <ClipboardList />
                    <motion.p
                        className="hidden group-hover:block"
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.5 }}
                    >
                        Task
                    </motion.p>
                </motion.li>

                <motion.li
                    className={liStyle}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleItemClick(false, true, false, false, false)}
                >
                    <UserRoundSearch />
                    <motion.p
                        className="hidden group-hover:block"
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.5 }}
                    >
                        Team
                    </motion.p>
                </motion.li>

                <motion.li
                    className={liStyle}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleItemClick(false, false, false, true, false)}
                >
                    <TicketX />
                    <motion.p
                        className="hidden group-hover:block"
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.5 }}
                    >
                        Ticket
                    </motion.p>
                </motion.li>

                <motion.li
                    className={liStyle}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleItemClick(false, false, false, false, true)}
                >
                    <Presentation />
                    <motion.p
                        className="hidden group-hover:block"
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.5 }}
                    >
                        Meeting
                    </motion.p>
                </motion.li>
            </ul>
        </div>
    );
};

export default SideBar;
