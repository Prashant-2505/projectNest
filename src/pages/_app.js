import Navbar from "@/components/Navbar";
import { Provider } from "@/provider";
import "@/styles/globals.css";
import { SocketProvider } from "../../context/socket";
import { AuthProvider } from "../../context/Auth";
import { ProjectProvider } from "../../context/ProjectContext";


export default function App({ Component, pageProps }) {
  return (
    <>
      <Provider>
        <SocketProvider>
          <AuthProvider>
            <ProjectProvider>
              <Navbar />
              <Component {...pageProps} />
            </ProjectProvider>
          </AuthProvider>
        </SocketProvider>
      </Provider>

    </>
  );
}
