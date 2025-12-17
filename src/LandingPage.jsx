import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Paper,
  useTheme,
  Chip,
  Divider,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import BoltIcon from '@mui/icons-material/Bolt';
import RepeatIcon from '@mui/icons-material/Repeat';
import ViewDayIcon from '@mui/icons-material/ViewDay';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import HeaderBar from './HeaderBar';

export default function LandingPage() {
  return (
    <Box>
      {/* Navbar */}
      <HeaderBar showSignOut={false} />

      {/* Hero */}
      <Box
        sx={{
          py: 14,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? `
          radial-gradient(
            1200px circle at 10% 10%,
            ${theme.palette.primary.main}33,
            transparent 60%
          ),
          radial-gradient(
            800px circle at 90% 20%,
            ${theme.palette.secondary.main}26,
            transparent 55%
          ),
          ${theme.palette.background.default}
        `
              : `
          linear-gradient(
            135deg,
            ${theme.palette.primary.main},
            ${theme.palette.secondary.main}
          )
        `,
          color: 'text.primary',
        }}
      >
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight={800} gutterBottom>
                Plan Your Day.
                <br />
                Maximize Your Impact.
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }} paragraph>
                A smart day planner that prioritizes tasks by value and time — so you always know
                what to do next.
              </Typography>
              <Stack direction="row" spacing={2} mt={3}>
                <Button
                  component={RouterLink}
                  to="/signin"
                  variant="contained"
                  size="large"
                  color="secondary"
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  color="inherit"
                  href="https://github.com/mertserezli/DayPlanner"
                >
                  GitHub
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <FlowModeMock />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container sx={{ py: 10 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={6}>
          Why Day Planner?
        </Typography>
        <Grid container spacing={4}>
          <Feature
            icon={<BoltIcon fontSize="large" color="primary" />}
            title="Value-Based Prioritization"
            description="Automatically focus on tasks with the highest impact per unit of time."
          />
          <Feature
            icon={<ViewDayIcon fontSize="large" color="primary" />}
            title="Flow Mode"
            description="Work distraction-free by tackling one high-impact task at a time."
          />
          <Feature
            icon={<RepeatIcon fontSize="large" color="primary" />}
            title="Recurring Tasks"
            description="Build habits with daily, weekly, or custom periodic tasks."
          />
          <Feature
            icon={<EventIcon fontSize="large" color="primary" />}
            title="Calendar View"
            description="Drag, drop, and schedule tasks visually across your day."
          />
        </Grid>
      </Container>

      {/* CTA */}
      <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
        <Container sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Take Control of Your Day
          </Typography>
          <Typography color="text.secondary" mb={4}>
            Stop guessing what to do next. Let value and time guide your focus.
          </Typography>
          <Button component={RouterLink} to="/app" variant="contained" size="large">
            Start Planning
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4 }}>
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <Typography color="text.secondary">© {new Date().getFullYear()} Day Planner</Typography>
          <Stack direction="row" spacing={2}>
            <Button href="https://github.com/mertserezli/DayPlanner">GitHub</Button>
            <Button component={RouterLink} to="/app">
              App
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

Feature.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
function Feature({ icon, title, description }) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card
        sx={{
          height: '100%',
          borderRadius: 4,
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Box mb={2}>{icon}</Box>
          <Typography fontWeight={600} gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

const INITIAL_TASKS = [
  { title: 'Write project proposal', score: 0.27 },
  { title: 'Prepare meeting agenda', score: 0.21 },
  { title: 'Review notes', score: 0.18 },
];

const ROW_HEIGHT = 56;

export function FlowModeMock() {
  const theme = useTheme();
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLeaving(true);

      setTimeout(() => {
        setTasks((prev) => {
          const [first, ...rest] = prev;
          return [...rest, first];
        });
        setLeaving(false);
      }, 350);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Paper
      elevation={theme.palette.mode === 'dark' ? 2 : 4}
      sx={{
        p: 3,
        borderRadius: 4,
        maxWidth: 380,
        mx: 'auto',
        bgcolor: 'background.paper',
      }}
    >
      <Typography fontWeight={700} gutterBottom>
        Flow Mode
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Highest value / time task, one at a time
      </Typography>

      <Stack spacing={2}>
        {tasks.map((task, index) => {
          const active = index === 0;
          const isLeaving = active && leaving;

          return (
            <Box
              key={task.title}
              sx={{
                height: ROW_HEIGHT,
                display: 'flex',
                alignItems: 'center',
                transition: 'opacity 300ms ease, transform 300ms ease',
                opacity: isLeaving ? 0 : active ? 1 : 0.5,
                transform: isLeaving ? 'translateY(-12px)' : 'translateY(0)',
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Chip
                    size="small"
                    icon={active ? <PlayArrowIcon /> : null}
                    label={active ? 'Now' : 'Next'}
                    color={active ? 'primary' : 'default'}
                    variant={active ? 'filled' : 'outlined'}
                  />

                  <Box flexGrow={1}>
                    <Typography fontWeight={active ? 600 : 400}>{task.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Score: {task.score}
                    </Typography>
                  </Box>
                </Box>

                {index < tasks.length - 1 && <Divider sx={{ mt: 1.25, ml: 6 }} />}
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}
