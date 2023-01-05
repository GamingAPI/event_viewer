'use client';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from './page.module.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import EventComponent from '../components/EventComponent';
import { Grid, Skeleton, Stack, Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
let socket;
const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	const [messages, setMessages] = useState<any>([]);

	useEffect(() => {
    const socketInitializer = async () => {
      await fetch('/api/socket');
      socket = io();
    
      socket.on(
        'init-messages',
        (messages: any[]) => {
          setMessages((m: any) => [...messages].reverse());
        }
      );
      socket.on('newMessage', (message: any) => {
        setMessages((m: any) => [message, ...m]);
      });
    };
    socketInitializer();
	}, []);
  
	return (
		<main className={styles.main}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <h2 className={inter.className}>
            GamingAPI Event viewer for GamingAPI Sandbox server
          </h2>
          <p className={inter.className}>
            See the in-game event flow to your browser live as they happen on the game server.
          </p>
          <Typography gutterBottom variant="body1">
            Join the Rust game server (<a href='steam://connect/sandbox.gamingapi.org:28000'>sandbox.gamingapi.org:28000</a>) and see the events flow, and not only yours, also see what other players are doing!
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} container>
          {messages.length === 0 ? (
            <LinearProgress style={{width: "100%"}} color="secondary" />
          ) : (
            <Stack 
            style={{width: "100%", maxHeight: "700px", overflowY: "auto"}}
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
                    definitionLink={'/'}
                  />
              ))}
            </Stack>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="center">
        <Grid item xs={12} md={3}>
          <a
            href='https://gamingapi.org'
            className={styles.card}
            target='_blank'
            rel='noopener noreferrer'
          >
            <h2 className={inter.className}>
              GamingAPI <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Find in-depth information about GamingAPI.
            </p>
          </a>
        </Grid>
        <Grid item xs={12} md={3}>
          <a
            href='https://github.com/gamingapi/event-viewer-website'
            className={styles.card}
            target='_blank'
            rel='noopener noreferrer'
          >
            <h2 className={inter.className}>
              GitHub <span>-&gt;</span>
            </h2>
            <p className={inter.className}>Explore the event viewer code in GitHub.</p>
          </a>
        </Grid>
      </Grid>
		</main>
	);
}
