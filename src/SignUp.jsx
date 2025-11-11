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
import {InputAdornment, LinearProgress, Tooltip} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import HeaderBar from "./HeaderBar";

export default function SignUp() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isCapsLockOn, setIsCapsLockOn] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordStrength, setPasswordStrength] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useCreateUserWithEmailAndPassword(auth);

    const handleEmailChange = (event) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailValue = event.target.value;
        setEmail(emailValue);

        if (emailValue.trim() === '') {
            setEmailError('');
        } else if (!emailRegex.test(emailValue)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    };

    const passwordStrengthColorMap = {
        "Very Weak": "#d32f2f",   // red
        "Weak": "#f57c00",        // orange
        "Moderate": "#fbc02d",    // yellow
        "Strong": "#388e3c",      // green
        "Very Strong": "#2e7d32"  // dark green
    };

    const passwordStrengthHintMap = {
        "Very Weak": "Try adding uppercase letters, numbers, and symbols.",
        "Weak": "Include more character types for better security.",
        "Moderate": "Good start! Add symbols or longer length.",
        "Strong": "Strong password. Consider making it even longer.",
        "Very Strong": "Excellent! Your password is very secure."
    };

    const evaluatePasswordStrength = (pwd) => {
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[a-z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;

        switch (score) {
            case 0:
            case 1:
                setPasswordStrength("Very Weak");
                break;
            case 2:
                setPasswordStrength("Weak");
                break;
            case 3:
                setPasswordStrength("Moderate");
                break;
            case 4:
                setPasswordStrength("Strong");
                break;
            case 5:
                setPasswordStrength("Very Strong");
                break;
            default:
                setPasswordStrength("");
        }
    };

    const getPasswordStrengthProgressValue = () => {
        switch (passwordStrength) {
            case "Very Weak": return 20;
            case "Weak": return 40;
            case "Moderate": return 60;
            case "Strong": return 80;
            case "Very Strong": return 100;
            default: return 0;
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    function handleSubmit(event){
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        createUserWithEmailAndPassword(String(data.get('email')), String(data.get('password'))).then(() => navigate("/"));
    }

    return (
        <>
            <HeaderBar showSignOut={false}/>
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
                            value={email}
                            onChange={handleEmailChange}
                            error={!!emailError}
                            helperText={emailError}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => {
                                const pwd = e.target.value;
                                setPassword(pwd);
                                evaluatePasswordStrength(pwd);
                            }}
                            onKeyDown={(e)=>{setIsCapsLockOn( e.getModifierState && e.getModifierState("CapsLock"))}}
                            onBlur={()=>{setIsCapsLockOn(false)}}
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end">
                                        {isCapsLockOn && (
                                            <Tooltip title="Caps Lock is ON">
                                                <WarningAmberIcon color="warning" />
                                            </Tooltip>
                                        )}
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={togglePasswordVisibility}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ,
                            }}
                        />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Password Strength: {passwordStrength}
                        </Typography>
                        <Tooltip title={passwordStrengthHintMap[passwordStrength] || ""}>
                            <LinearProgress
                                variant="determinate"
                                value={getPasswordStrengthProgressValue()}
                                sx={{
                                    mt: 1,
                                    height: 8,
                                    borderRadius: 5,
                                    backgroundColor: "#e0e0e0",
                                    "& .MuiLinearProgress-bar": {
                                        backgroundColor: passwordStrengthColorMap[passwordStrength] || "#90caf9"
                                    }
                                }}
                            />
                        </Tooltip>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={!!emailError || email.trim() === ''}
                        >
                            Sign Up
                        </Button>
                        <Link component={RouterLink} to={"/signin"} variant="body2">
                            Already have an account? Sign In
                        </Link>
                    </Box>
                </Box>
            </Container>
        </>
    )

}