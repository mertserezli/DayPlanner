import React, { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Calendar from './Calendar';
import PeriodicTodoList from './PeriodicTodoList';
import TodoList from './TodoList';
import { auth, getTodoListQuery } from './Firebase';
import SignIn from './SignIn';
import SignUp from './SignUp';
import ForgotPassword from './ForgotPassword';
import TaskFlow from './TaskFlow';

import { Badge, Grid, Paper, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material';
import WavesIcon from '@mui/icons-material/Waves';
import EventIcon from '@mui/icons-material/Event';
import ChecklistIcon from '@mui/icons-material/Checklist';
import RepeatIcon from '@mui/icons-material/Repeat';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
} from '@mui/material/styles';

import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import SwipeableViews from 'react-swipeable-views';
import HeaderBar from './HeaderBar';
import Profile from './Profile';
import NotFound from './NotFound';
import LandingPage from './LandingPage';

function App() {
  const theme = extendTheme({
    colorSchemes: {
      light: true,
      dark: true,
    },
  });

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<LandingPage />} />
          <Route path={'/app'} element={<Application />} />
          <Route path={'/signin'} element={<SignIn />} />
          <Route path={'/signup'} element={<SignUp />} />
          <Route path={'/forgotpassword'} element={<ForgotPassword />} />
          <Route path={'/profile'} element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </CssVarsProvider>
  );
}

function Application() {
  const [user, loading] = useAuthState(auth);
  return (
    <div className="App">
      {loading ? <></> : user ? <DayPlanner /> : <Navigate replace to="/signin" />}
    </div>
  );
}

function DayPlanner() {
  const [isFlow, setIsFlow] = useState(false);
  const [tabIndex, setTabIndex] = useState(1);
  const [todoItems] = useCollection(getTodoListQuery());

  const todoCount = todoItems?.docs.length || 0;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const renderTodoSection = () => (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<WavesIcon />}
        onClick={() => setIsFlow(!isFlow)}
        sx={{ mb: 2 }}
      >
        {isFlow ? 'Stop Flow' : 'Start Flow'}
      </Button>
      {!isFlow ? <TodoList /> : <TaskFlow />}
    </>
  );

  return (
    <>
      <HeaderBar showSignOut={true} />
      {isMobile ? (
        <>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab icon={<EventIcon />} label="Calendar" />
            <Tab
              icon={<ChecklistIcon />}
              label={
                <Badge badgeContent={todoCount} color="primary">
                  To-Do
                </Badge>
              }
            />
            <Tab icon={<RepeatIcon />} label={'Periodic'} />
          </Tabs>

          <SwipeableViews index={tabIndex} onChangeIndex={setTabIndex}>
            <Box sx={{ p: 2 }}>
              <Calendar />
            </Box>
            <Box sx={{ p: 2 }}>{renderTodoSection()}</Box>
            <Box sx={{ p: 2 }}>
              <PeriodicTodoList />
            </Box>
          </SwipeableViews>
        </>
      ) : (
        <Grid container spacing={2} sx={{ px: 2, pb: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{ p: 2, borderRadius: 2, backgroundColor: 'background.paper' }}
            >
              <Calendar />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{ p: 2, borderRadius: 2, backgroundColor: 'background.paper' }}
            >
              {renderTodoSection()}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{ p: 2, borderRadius: 2, backgroundColor: 'background.paper' }}
            >
              <PeriodicTodoList />
            </Paper>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default App;
