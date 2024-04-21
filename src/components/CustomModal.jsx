import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
} from '@chakra-ui/react';
import axios from 'axios';

const CustomModal = ({ isOpen, onClose, modalTitle, modalData, updateModalData }) => {
    const addUserToProject = async (userMail, projectId) => {
        try {
            const { data } = await axios.put('/api/member/addMember', { userMail, projectId });
            if (data.success) {
                // Filter out the user from modalData
                const updatedData = modalData.filter(user => user.email !== userMail);
                // Call the function to update modalData in the parent component
                updateModalData(updatedData);
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle error
        }
    };

    return (
        <div>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{modalTitle}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {modalData.map((user) => (
                            <div key={user._id} className='flex justify-between items-center bg-red-300 rounded-md p-2'>
                                <p>Email : <span>{user.email}</span></p>
                                <button
                                    onClick={() => addUserToProject(user.email, user.projectId)} // Pass a function reference
                                    className='bg-primaryText px-2 rounded-md hover:bg-slate-300'
                                >
                                    Confirm to Add
                                </button>
                            </div>
                        ))}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default CustomModal;
