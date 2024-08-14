import { NextResponse } from 'next/server';
import { db } from '../../firebase';
import { doc, getDoc,  } from 'firebase/firestore';
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";

export async function GET(req) {
  const session = await getServerSession({ req, options });

  if(!session) {
    return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
  }

  try {
  
    const userDoc = doc(db, 'chats', session.user.email);
    const userChat = await getDoc(userDoc);
    
    if (userChat.exists()) {
        return NextResponse.json({ success: true, messages: userChat.data().messages }, { status: 200 });
    } else {
        return NextResponse.json({ ssuccess: false, error: 'Chat history not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
