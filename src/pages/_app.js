import { Provider } from "@/provider";
import "@/styles/globals.css";
import { SocketProvider } from "../../context/socket";
import { AuthProvider } from "../../context/Auth";
import { ProjectProvider } from "../../context/ProjectContext";
import { NotificationProvider } from "../../context/NotificationContext";


export default function App({ Component, pageProps }) {
  return (
    <>
      <Provider>
        <SocketProvider>
          <NotificationProvider>
            <AuthProvider>
              <ProjectProvider>
                <Component {...pageProps} />
              </ProjectProvider>
            </AuthProvider>
          </NotificationProvider>
        </SocketProvider>
      </Provider>

    </>
  );
}
