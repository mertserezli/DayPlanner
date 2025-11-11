import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Stack,
    IconButton, Tooltip
} from '@mui/material';
import TodayIcon from '@mui/icons-material/Today';
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import {useColorScheme} from '@mui/material/styles';
import {useUserStore} from "./AuthProvider";
import {auth} from "./Firebase";
import LogoutIcon from "@mui/icons-material/Logout";

export default function HeaderBar({showSignOut = null }) {
    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <TodayIcon color="primary" />
                    <Typography variant="h6" component="div">
                        Day Planner
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                    <ThemeToggle />
                    {showSignOut && <SignOut />}
                </Stack>
            </Toolbar>
        </AppBar>
    );
}

function ThemeToggle() {
    const { mode, setMode } = useColorScheme();

    if (!mode) return null;

    return (
        <IconButton
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            color="inherit"
        >
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
    );
}

function SignOut() {
    const user = useUserStore();
    function handleSignOut(){auth.signOut()}
    return user && (
        <Tooltip title="Sign Out"
                 enterDelay={0}
                 leaveDelay={0}>
            <IconButton
                color="primary"
                onClick={handleSignOut}
                aria-label="sign out"
            >
                <LogoutIcon />
            </IconButton>
        </Tooltip>
    )
}