import React, {useState} from "react";
import {auth} from "./Firebase";

import {useCreateUserWithEmailAndPassword} from "react-firebase-hooks/auth";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import {Link as RouterLink, useNavigate} from 'react-router-dom';

export default function SignUp() {
    const navigate = useNavigate();
    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useCreateUserWithEmailAndPassword(auth);

    function handleSubmit(event){
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        createUserWithEmailAndPassword(String(data.get('email')), String(data.get('password'))).then((result) => navigate("/"));
    }

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
                    Sign up
                </Typography>
                {user && <><span>{"You are already logged in"}</span><br/></>}
                {error && <><span>{error.message}</span><br/></>}
                {loading && <><span>{"loading"}</span><br/></>}
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
                        Sign Up
                    </Button>
                    <Link component={RouterLink} to={"/signin"} variant="body2">
                        Already have an account? Sign In
                    </Link>
                </Box>
            </Box>
        </Container>
    )

}