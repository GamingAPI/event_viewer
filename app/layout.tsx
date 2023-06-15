'use client';
import './globals.css';
import styles from './page.module.css';
import { Grid, Typography, LinearProgress, Stack } from '@mui/material';
import { Inter } from '@next/font/google';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <Grid container>
          <Grid item xs={12}>
            <main className={styles.main}>
              {children}
            </main>
          </Grid>
          <Grid item xs={12} container spacing={2}
            direction="row"
            justifyContent="center"
            alignItems="center"
            paddingBottom={15}
            style={{backgroundColor: "rgb(27 17 48)"}}>
            <Grid item xs={12} md={3}>
              <a
                href='https://gamingapi.org'
                className={styles.card}
                target='_blank'
                rel='noopener noreferrer'
                style={{textDecoration: "none"}}
              >
                <Typography variant='h2' color={"white"}>GamingAPI <span>-&gt;</span></Typography>
                <Typography color={"white"}>Find in-depth information about GamingAPI.</Typography>
              </a>
            </Grid>
            <Grid item xs={12} md={3}>
              <a
                href='https://github.com/gamingapi/event_viewer'
                className={styles.card}
                target='_blank'
                rel='noopener noreferrer'
                style={{textDecoration: "none"}}
              >
                <Typography variant='h2' color={"white"}>GitHub <span>-&gt;</span></Typography>
                <Typography color={"white"}>Explore the event viewer code in GitHub.</Typography>
              </a>
            </Grid>
          </Grid>
        </Grid>
      </body>

    </html>
  )
}
