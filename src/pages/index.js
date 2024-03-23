import { useEffect } from "react";
import { useSocket } from "../../context/socket";
import { useAuth } from "../../context/Auth";
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const socket = useSocket();

  const [userAuth] = useAuth()
  const roomId = uuidv4()

  useEffect(() => {
    if (socket) {
      socket.emit('join chat',roomId);
    }
  }, [socket]);

  return (
    <div className=" bg-[#3d3d3d] h-[100vh] text-white text-2xl">
      Home page
    </div>
  );
}
