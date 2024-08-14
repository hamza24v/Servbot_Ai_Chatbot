import { getServerSession } from "next-auth/next";
import { options } from "../auth/[...nextauth]/options";
import { db } from '../../firebase';
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession({ req, options });

  if (!session) {
    return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
  }

  const { message } = await req.json();

  try {
    const userChatRef = doc(db, "chats", session.user.email);
    await setDoc(userChatRef, { messages: arrayUnion(message) }, { merge: true });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error saving chat history:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
