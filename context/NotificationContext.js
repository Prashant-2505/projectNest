import React, { createContext, useContext, useEffect, useState } from 'react';

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [teamNotificationContext, setTeamNotificationContext] = useState(null);
  const [taskNotificationContext, setTaskNotificationContext] = useState(null);
  const [ticketNotificationContext, setTicketNotificationContext] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      const data = JSON.parse(localStorage.getItem('notificationContext'))
      if (data) {
        if (data.team) {
          console.log(data)
          setTeamNotificationContext(data.team);
        }
        if (data.task) {
          setTaskNotificationContext(data.task);
        }
        if (data.ticket) {
          setTicketNotificationContext(data.ticket);
        }
      } else {
        console.log("No notification data found in localStorage");
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once when component mounts

  return (
    <NotificationContext.Provider value={[teamNotificationContext, setTeamNotificationContext,taskNotificationContext, setTaskNotificationContext,ticketNotificationContext, setTicketNotificationContext]}>
      {children}
    </NotificationContext.Provider>
  );
};

const useNotification = () => useContext(NotificationContext);

export { useNotification, NotificationProvider };
