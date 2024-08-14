"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Container,
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { raleway } from "../fonts";

export default function Chatbox() {
  const { data: session } = useSession(); // Fetch session using useSession hook

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // fetching chat history on render
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (session) {
        try {
          console.log("Fetching chat history...");
          const res = await axios.get(`/api/fetchMessage`);
          setMessages(res.data.messages);
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      }
    };
    fetchChatHistory();
  }, [session]);


  const handleSend = async () => {
    if (input.trim()) {
      const newMessage = { text: input, type: "user", timestamp: Date.now() };
      const newMessages = [...messages, newMessage];
      setMessages(newMessages);
      setInput("");

      try {
        console.log("Saving message:", newMessage);
        await axios.post("/api/saveMessage", { message: newMessage });
      } catch (error) {
        console.error("Error saving message:", error);
      }
    }
  };

  const fetchResponse = async () => {
    try {
      const lastUserMessage = messages[messages.length - 1]?.text; // grabbing the last user message text
      if (lastUserMessage) {
        console.log("Fetching response for message:", lastUserMessage);
        // const res = await axios.post('/api/sendMessage', {
        //   message: lastUserMessage,
        // });


        const botReply = "Testing bot response..."; // replace with actual bot response

        // here i'm adding the bot reply to the messages state
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botReply, type: "bot" },
        ]);

      }
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  useEffect(() => {
    // fetching response only if the last message is from the user. We don't want the bot to respond to itself
    if (messages.length && messages[messages.length - 1].type === "user") {
      fetchResponse();
    }
  }, [messages]); // onlys runs useEffect if messages array changes

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <Container maxWidth="sm" >
      <Paper
        elevation={3}
        style={{
          padding: "1rem",
          height: "75vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          className={`${raleway.className} text-black py-2 font-bold shadow-md bg-blue-50 rounded-t-lg`}
          variant="h5"
          align="center"
          gutterBottom
        > 
          Chat with ServBot
        </Typography>
        <Box className='bg-gray-100 shadow-inner' style={{ flexGrow: 1, overflowY: "auto", marginBottom: "1rem" }}>
          <List>
            {messages.map((message, index) => (
              <ListItem key={index}>
                <Grid
                  container
                  spacing={2}
                  justifyContent={
                    message.type === "user" ? "flex-end" : "flex-start"
                  }
                >
                  <Grid item xs={12} sm={8}>
                    <Paper
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor:
                          message.type === "user" ? "#1976d2" : "#ece7e7",
                        color: message.type === "user" ? "#ffffff" : "#000",
                        borderRadius: "20px",
                      }}
                    >
                      <ListItemText primary={message.text} />
                    </Paper>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box display="flex">
          <TextField
            variant="outlined"
            fullWidth
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
          />
          <IconButton color="primary" onClick={handleSend}>
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Container>
  );
}
