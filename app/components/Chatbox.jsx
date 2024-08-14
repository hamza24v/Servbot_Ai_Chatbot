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
import Image from "next/image";

export default function Chatbox() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // fetching chat history on render
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (session) {
        try {
          console.log("Fetching chat history...");
          const response = await axios.get(`/api/fetchMessage`);
          setMessages(response.data.messages);
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
        setFetching(false);
      }
    };
    fetchChatHistory();
  }, [session]);

  const saveMessage = async (newMessage) => {
    try {
      console.log("Saving message:", newMessage);
      await axios.post("/api/saveMessage", { message: newMessage });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const handleSend = async () => {
    if (input.trim()) {
      const newMessage = { text: input, type: "user", timestamp: Date.now() };
      const newMessages = [...messages, newMessage];
      setMessages(newMessages);
      setInput("");

      await saveMessage(newMessage);
      setLoading(true);

      const botResponse = await fetchBotResponse();
      const botMessage = {
        text: botResponse,
        type: "bot",
        timestamp: Date.now(),
      };
      console.log("Bot response:", botResponse);

      const finalMessages = [...newMessages, botMessage];
      setMessages(finalMessages);
      setLoading(false);

      await saveMessage(botMessage);
    }
  };

  const fetchBotResponse = async () => {
    try {
      const lastUserMessage = messages[messages.length - 2]?.text; // grabbing the last user message text
      if (lastUserMessage) {
        console.log("Fetching response for message:", lastUserMessage);
        const res = await axios.post("/api/sendMessage", {
          message: lastUserMessage,
        });

        const botReply = res.data.reply;
        return botReply || "Sorry I couldn't process that.";
      }
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  useEffect(() => {
    // fetching response only if the last message is from the user. We don't want the bot to respond to itself
    if (messages.length && messages[messages.length - 1].type === "user") {
      fetchBotResponse();
    }
  }, [messages]); // onlys runs useEffect if messages array changes

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <Container maxWidth="sm">
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
        <Box
          className="bg-gray-100 shadow-inner"
          style={{ flexGrow: 1, overflowY: "auto", marginBottom: "1rem" }}
        >
          {fetching ? (
            <div className="relative flex flex-col h-full justify-center items-center">
              <Image
                src="/loader.svg"
                alt="Loading..."
                width={50}
                height={50}
              />
              <p>Loading Conversation...</p>
            </div>
          ) : (
            <List>
              {messages.length > 1 ? (
                messages.map((message, index) => (
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
                ))
              ) : (
                <div className="relative grid place-items-center h-full text-gray-400">
                  Start a new conversation with Servbot
                </div>
              )}
              {loading && (
                <Box className="ml-20">
                  <Image
                    src="/loader.svg"
                    alt="Loading..."
                    width={40}
                    height={40}
                  />
                </Box>
              )}
            </List>
          )}
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
