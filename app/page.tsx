'use client';
import { Inter } from '@next/font/google';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import { Grid, Typography, LinearProgress, Stack } from '@mui/material';
import EventComponent from '../components/EventComponent';
let socket;
const inter = Inter({ subsets: ['latin'] });

interface EventViewerProps {
  serverName?: string
}

function getProps(): EventViewerProps {
  return {
    serverName: process.env.SERVER_NAME ? process.env.SERVER_NAME.toString() : "GamingAPI Sandbox server"
  }
}
 

export default function Home() {
  const { serverName } = getProps();
	const [messages, setMessages] = useState<any>([]);

	useEffect(() => {
    const socketInitializer = async () => {
      await fetch('/api/socket');
      socket = io();
    
      /**
       * Listen for initial messages, i.e. not live events
       */
      socket.on(
        'init-messages',
        (messages: any[]) => {
          setMessages((m: any) => [...messages].reverse());
        }
      );
      /**
       * Listen for live events
       */
      socket.on('newMessage', (message: any) => {
        setMessages((m: any) => [message, ...m]);
      });
    };
    socketInitializer();
	}, []);
  
	return (
    <Grid container>
      <Grid item xs={12}>
        <Typography gutterBottom variant="h2">
          GamingAPI Event viewer for {serverName}
        </Typography>
        <Typography gutterBottom variant="h5">
          See the in-game event flow to your browser live as they happen on the game server.
        </Typography>
        <Typography gutterBottom variant="body1">
          Join the Rust game server (<a href='steam://connect/sandbox.gamingapi.org:28000'>sandbox.gamingapi.org:28000</a>) and see the events flow, and not only yours, also see what other players are doing!
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {messages.length === 0 ? (
          <LinearProgress style={{width: "100%"}} color="secondary" />
        ) : (
          <Stack 
          style={{}}
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}>
            {messages.map((message: any) => (
                <EventComponent
                  key={message.channel + message.msg}
                  message={message.msg}
                  channel={message.channel}
                  params={message.params}
                  definitionLink={message.definitionLink}
                  definitionLinkText={message.definitionLinkText}
                />
            ))}
          </Stack>
        )}
      </Grid>
    </Grid>
	);
}
