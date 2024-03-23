import Navbar from "@/components/Navbar";
import { Provider } from "@/provider";
import "@/styles/globals.css";
import { SocketProvider } from "../../context/socket";


export default function App({ Component, pageProps }) {
  return (
    <>
      <Provider>
        <SocketProvider>
          <Navbar />
          <Component {...pageProps} />
        </SocketProvider>
      </Provider>

    </>
  );
}
