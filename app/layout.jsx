import "./globals.css";
import { options } from "./api/auth/[...nextauth]/options";
import Provider from "./Provider";
import { getServerSession } from "next-auth/next";
import { inter } from './fonts';

export const metadata = {
  title: "ServBot AI",
  description: "AI-powered support chatbot",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(options);


  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider session={session} >
          {children}
        </Provider>
      </body>
    </html>
  );
}
