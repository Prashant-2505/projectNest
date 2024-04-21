import React from 'react'
import {motion} from 'framer-motion'
const ProjectHeader = ({projectId,projectName,projectLeaderName}) => {
    return (
        <motion.div
         initial={{opacity:0}}
         animate={{opacity:1}}
         transition={{ duration: 1 }}        >
            <div className="bg-primaryText text-primaryBg min-h-[15vh] h-full w-full mt-4 rounded-md flex justify-between items-center px-8 mr-4">
                <div className='text-center'>
                    <p className='font-semibold text-lg border-b-2 border-primaryBg border-opacity-15'>Project Id</p>
                    <p className='pt-2'>{projectId}</p>
                </div>
                <div className='text-center'>
                    <p className='font-semibold text-lg border-b-2 border-primaryBg border-opacity-15'>Project </p>
                    <p className='pt-2'>{projectName}</p>
                </div>
                <div className='text-center'>
                    <p className='font-semibold text-lg border-b-2 border-primaryBg border-opacity-15'>Project Leader</p>
                    <p className='pt-2'>{projectLeaderName}</p>
                </div>
            </div>
        </motion.div>
    )
}

export default ProjectHeader
