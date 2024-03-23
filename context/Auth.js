import React, { createContext, useContext, useEffect, useState } from 'react';


const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [userAuth, setUserAuth] = useState(null)

    useEffect(() => {

        const fetchData =  () => {
            const data = localStorage.getItem('auth')
            if (data) {
                const parsedData = JSON.parse(data)
                setUserAuth({ user: parsedData })

            }
            else {
                console.log("something went wrong while using authcontext")
            }
        }

        fetchData()

    }, [])

    return (<AuthContext.Provider value={[userAuth, setUserAuth]}>
        {children}
    </AuthContext.Provider>

    )
}

const useAuth = () => useContext(AuthContext)
export { useAuth, AuthProvider }
