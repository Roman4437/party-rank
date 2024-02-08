import { getAuth, signInWithCustomToken } from 'firebase/auth';

import { Button, Container, Grid, Paper, Typography } from '@mui/material';

import * as Styled from './auth-page.styles';

const DISCORD_OAUTH_URL =
  'https://discord.com/api/oauth2/authorize?client_id=1205222499114160129&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fdiscord%2Fauth&scope=identify';

export const AuthPage = () => {
  return (
    <Container>
      <Grid
        sx={{
          height: '100%',
        }}
        container
        justifyContent="center"
        alignItems="center"
      >
        <Paper
          sx={{
            padding: 4,
          }}
        >
          <Grid container alignItems="center" direction="column" spacing={2}>
            <Grid item>
              <Typography
                variant="h4"
                noWrap
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
              >
                PARTY RANK
              </Typography>
            </Grid>
            <Grid item>
              <Button
                sx={{
                  backgroundColor: '#7289da',
                }}
                variant="contained"
                startIcon={<Styled.DiscordIcon />}
                href={DISCORD_OAUTH_URL}
                target="_self"
              >
                Войти через дискорд
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Container>
  );
};
