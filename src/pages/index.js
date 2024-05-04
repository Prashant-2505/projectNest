import { useEffect, useState } from "react";
import { useSocket } from "../../context/socket";
import { useAuth } from "../../context/Auth";
import { v4 as uuidv4 } from 'uuid';
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Spinner, useToast } from "@chakra-ui/react";
import ProjectDetails from "@/components/ProjectDetails";
import Image from "next/image";

export default function Home() {
  const socket = useSocket();
  const [userAuth] = useAuth();


  const toast = useToast();
  const router = useRouter();

  // leader states
  const [projectDetails, setProjectDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProject, setShowProject] = useState(true);

  // member state
  const [memberProject, setMemberProject] = useState([]);
  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    if (socket) {
      socket.emit('join chat', userAuth?.user?.id);
    } else {
      console.log('no socket');
    }
  }, [socket, userAuth]);



  const fetchMemberProject = async () => {
    try {
      const response = await fetch(`/api/project/getMemberProject?id=${userAuth?.user?.id}`, { cache: 'force-cache' });
      if (!response.ok) {
        throw new Error('Failed to fetch member projects');
      }
      const data = await response.json();
      if (data.success) {
        setMemberProject(data?.existingProjects);
      }
    } catch (error) {
      console.error(error);
    }
  };


  // work if user is not leader
  useEffect(() => {
    if (userAuth?.user?.leader === false) {
      fetchMemberProject();
    }
  }, [userAuth?.user?.id]);


  //  leader project
  const handleProject = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/project/getProject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ leaderId: userAuth?.user?.id })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch project details');
      }
      const data = await response.json();
      if (data.success) {
        setProjectDetails(data.existingProject);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to fetch project details',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  // work if user is leader 
  useEffect(() => {
    if (userAuth?.user?.leader) {
      handleProject();
    }
  }, [userAuth?.user?.id]);


  const projectJoiningReq = async () => {
    try {
      const { data } = await axios.post(`/api/project/verifyProject/`, { projectId }, { applicationsType: "your_application_type" });
      if (data.success) {
        const { data: data2 } = await axios.post('/api/auth/joinUserRequest', {
          name: userAuth?.user.name,
          email: userAuth?.user.email,
          projectId: projectId,
          applicationsType: "your_application_type"
        });
        if (data2.success) {
          toast({
            title: 'Success',
            description: "Welcome back",
            status: 'success',
            duration: 3000,
            isClosable: true
          });
          router.push(`/project?id=${projectId}`);
        } else {

          if (socket) {
            socket.emit('new member joinded request', {
              data: {
                name: userAuth?.user.name,
                email: userAuth?.user.email,
              }
            });
          }

          toast({
            description: data2.message,
            status: 'success',
            duration: 3000,
            isClosable: true
          });
        }
      } else {
        toast({
          title: 'Warning',
          description: 'No project found, please enter a valid project ID',
          status: 'warning',
          duration: 4000,
          isClosable: true
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-primaryBg h-[100vh] text-primaryText ">
      {userAuth
        ?
        (
          userAuth?.user?.leader ? (
            // leader div
            <div className="min-h-[100%]">
              {loading ? (
                <div className="h-[80vh] w-full flex flex-col justify-evenly items-center gap-4">
                  <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                  />
                  <p className="text-md bg-secondaryBg text-primaryBg p-2 rounded-lg shadow-md shadow-slate-950">ProjectNest</p>
                </div>
              ) : (
                <div className="h-[80vh] w-full flex justify-center  ">
                  {projectDetails.length > 0 ? (
                    showProject && (
                      <div className="h-[70vh] w-[60%] flex flex-col items-center justify-between ">
                        <div className="w-full h-full overflow-scroll  mt-4 shadow-lg shadow-slate-950">
                          <ProjectDetails projects={projectDetails} />
                        </div>
                        <div className="mt-4">
                          <Link href={"/createproject"}>
                            <span className="text-blue-300 cursor-pointer border-b-2 border-blue-400 hover:border-b-2 hover:text-blue-400 duration-100 ease-in-out">
                              Create New Project
                            </span>
                          </Link>
                        </div>
                      </div>
                    )
                  ) : (
                    <p className="mt-[10rem]">
                      Not created Project yet?{" "}
                      <Link href={"/createproject"}>
                        <span className="text-blue-300 cursor-pointer hover:border-b-2 border-blue-400 hover:text-blue-400 duration-100 ease-in-out">
                          Create Project
                        </span>
                      </Link>
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            // member div
            <div className="min-h-[100%]">
              <div className="flex items-center flex-col h-full w-full pt-[6rem]">
                {memberProject?.length > 0 ? (
                  showProject && (
                    <div className="h-[50vh] w-[60%] flex flex-col items-center justify-between ">
                      <div className="w-full h-full overflow-scroll no-scrollbar mt-4 shadow-lg shadow-slate-950">
                        <ProjectDetails projects={memberProject} />
                      </div>
                      <div className="mt-2 flex flex-col justify-between items-center gap-2">
                        <p>Enrolled in New Project:</p>
                        <div className="flex justify-center items-center gap-4">
                          <input
                            className="px-6 py-4 rounded-md text-primaryBg outline-none"
                            type="text"
                            value={projectId}
                            onChange={(e) => setProjectId(e.target.value)}
                            placeholder="Enter project ID"
                          />
                          {projectId && projectId.length === 24 ? (
                            <button
                              onClick={projectJoiningReq}
                              className="bg-secondaryBg text-primaryBg px-4 py-2 rounded-sm hover:bg-slate-300 duration-150 ease-in-out"
                            >
                              submit
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <>
                    <p> Not enrolled in Project yet?{" "}</p>

                    <input
                      className="px-6 py-4 rounded-md text-primaryBg outline-none mt-4"
                      type="text"
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      placeholder="Enter project ID"
                    />
                    {projectId && projectId.length === 24 ? (
                      <button
                        onClick={projectJoiningReq}
                        className="bg-secondaryBg text-primaryBg px-4 py-2 rounded-sm hover:bg-slate-300 duration-150 ease-in-out mt-4"
                      >
                        submit
                      </button>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          )
        ) : (
          <section className=" h-[100vh] w-full py-12 md:py-0">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                      Build projects as a team
                    </h1>
                    <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                      Collaborate with your team on a central platform to bring your projects to life.
                    </p>
                  </div>
                  <Link
                    href='/Login'
                    className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"

                  >
                    Get Started
                  </Link>
                </div>
                <Image
                  alt="Hero"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-bottom sm:w-full lg:order-last lg:aspect-square"
                  height="540"
                  src="/Hero.gif"
                  width="550"
                />
              </div>
            </div>
          </section>
        )}
    </div>
  );
}
