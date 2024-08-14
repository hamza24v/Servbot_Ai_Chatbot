import Navbar from "./components/Navbar";
import ChaboxBody from "./components/Chatbox";
import { options } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";


export default async function Home() {
  const session = await getServerSession(options);

  return (
    <div className="bg-gradient-to-b from-blue-200 flex h-screen items-center justify-center">
      {session ? (
        <>
          <Navbar />
          <ChaboxBody />
        </>
      ) : (
        <h1 className="text-5xl">You Shall Not Pass!</h1>
      )}
    </div>
  );
}
