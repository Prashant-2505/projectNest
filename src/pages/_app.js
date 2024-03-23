import Navbar from "@/components/Navbar";
import { Provider } from "@/provider";
import "@/styles/globals.css";
import { SocketProvider } from "../../context/socket";
import { AuthProvider } from "../../context/Auth";


export default function App({ Component, pageProps }) {
  return (
    <>
      <Provider>

        <SocketProvider>
          <AuthProvider>
            <Navbar />
            <Component {...pageProps} />
          </AuthProvider>
        </SocketProvider>
      </Provider>

    </>
  );
}
