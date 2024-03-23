import { useEffect } from "react";
import { useSocket } from "../../context/socket";

export default function Home() {
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.emit('join chat', "232323");
    }
  }, [socket]);

  return (
    <div className=" bg-[#3d3d3d] h-[100vh] text-white text-2xl">
      Home page
    </div>
  );
}
