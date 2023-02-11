import React from "react";
import {auth} from "./Firebase";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import IconButton from "@mui/material/IconButton";

import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {useSignInWithEmailAndPassword, useSignInWithGoogle} from "react-firebase-hooks/auth";

export default function SignIn() {
    const navigate = useNavigate();
    const [signInWithGoogle, , , error] = useSignInWithGoogle(auth);
    const [signInWithEmailAndPassword, , , error2] = useSignInWithEmailAndPassword(auth);

    const signInWithGoogleHandler = () => {
        signInWithGoogle().then((result) => navigate("/"))
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        signInWithEmailAndPassword(String(data.get('email')), String(data.get('password'))).then((result) => navigate("/"));
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <span>{error}</span><br/>
                <span>{error2}</span><br/>
                <IconButton
                    aria-label="Sign-in with google"
                    color="primary"
                    onClick={signInWithGoogleHandler}
                >
                    <GoogleIcon />
                </IconButton >
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link component={RouterLink} to="/forgotpassword" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link component={RouterLink} to={"/signup"} variant="body2">
                                Don't have an account? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    )

}