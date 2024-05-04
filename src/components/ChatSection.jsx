import React, { useRef, useEffect, useState } from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { ImagePlus } from 'lucide-react';
import axios from 'axios';
import { useSocket } from "../../context/socket";
import { useAuth } from '../../context/Auth';

const ChatSection = ({ mainUserId, otherUserId, chatId }) => {
    const socket = useSocket();

    const [userAuth] = useAuth()
    const chatEndRef = useRef(null);
    const [message, setMessage] = useState("");
    const [allMessage, setAllMessage] = useState([]);

    const sendMessage = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/chatRoom/sendMessage', {
                content: message,
                sender: mainUserId,
                receiver: otherUserId,
                chatId: chatId
            });
            if (data.success) {
                socket.emit('sendMessage', data.messages); // Emit the message data
            }
            setMessage(""); // Clear input field after sending message
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const getMessages = async () => {
        try {
            const { data } = await axios.get(`/api/chatRoom/allMessage?chatId=${chatId}`);
            if (data.success) {
                setAllMessage(data.messages);
            }
            if (socket) {
                socket.emit('join room', userAuth?.user?.id);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        getMessages();
    }, [chatId]);

    useEffect(() => {
        // Scroll to the bottom of the chat container when new messages are added
        chatEndRef.current?.scrollIntoView({ });
    }, [allMessage]);




    //    realt time message using socket
    useEffect(() => {
        if (socket) {
            socket.on('messageReceived', (newMessageRecieved) => {
                setAllMessage([...allMessage, newMessageRecieved])

            })
        }
    })




    return (
        <div className='h-full flex flex-col'>
            <ScrollableFeed className='h-[800%]'>
                <div className='relative flex flex-col overflow-auto h-[100%] py-2'>
                    {allMessage?.map((chat, i) => (
                        <div key={chat._id || i}>
                            <p className={`${chat?.receiver !== otherUserId ? 'bg-blue-100 mr-[60%] md:mr-[60%]' : 'bg-red-100 ml-[60%] md:ml-[60%]'} mx-4 rounded-md p-2 mb-2 `}>{chat?.content}</p>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
            </ScrollableFeed>
            <div className='bg-primaryBg h-[20%] flex justify-between items-center'>
                <form
                    onSubmit={sendMessage}
                    className='h-[60%] w-[90%] text-primaryBg rounded-md outline-none flex item-center'>
                    <input
                        className='bg-secondaryBg w-full text-primaryBg px-4 rounded-md outline-none'
                        type="text"
                        placeholder='Type here...'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </form>
                <ImagePlus className='text-secondaryBg cursor-pointer' />
            </div>
        </div>
    );
};

export default ChatSection;
