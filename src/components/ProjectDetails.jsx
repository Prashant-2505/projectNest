import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Link } from 'lucide-react';

const ProjectDetails = ({ projects }) => {
    const router = useRouter()
    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }} // Staggered animation
                className={`w-[100%] flex flex-col justify-center items-center gap-4 p-4  cursor-pointer overflow-scroll`}>
              
                {projects.map((project, index) => (
                    <div
                        onClick={() => router.push(`/project?id=${project._id}`)}
                        key={project._id}
                        className="h-[3rem] w-full flex justify-between items-center bg-primaryText text-primaryBg rounded-md px-4 hover:bg-slate-300 duration-200 ease-in-out "
                    >
                        <p>{project.name}</p>
                    </div>
                ))}
               
            </motion.div>

        </>
    );
};

export default ProjectDetails;
