import React, { createContext, useContext, useEffect, useState } from 'react';

const ProjectContext = createContext();

const ProjectProvider = ({ children }) => {
    const [projectContext, setProjectContext] = useState(null);

    useEffect(() => {
        const fetchData = () => {
            const data = localStorage.getItem('project');
            if (data) {
                const parsedData = JSON.parse(data);
                setProjectContext(parsedData); // Pass parsedData directly instead of wrapping it in an object
            } else {
                console.log("Something went wrong while using authcontext");
            }
        };

        fetchData();
    }, []);

    return (
        <ProjectContext.Provider value={[projectContext, setProjectContext]}>
            {children}
        </ProjectContext.Provider>
    );
};

const useProject = () => useContext(ProjectContext);

export { useProject, ProjectProvider };
