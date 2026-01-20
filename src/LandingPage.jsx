import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
                {t('hero.title')}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }} paragraph>
                {t('hero.subtitle')}
              </Typography>
              <Stack direction="row" spacing={2} mt={3}>
                <Button
                  component={RouterLink}
                  to="/signin"
                  variant="contained"
                  size="large"
                  color="secondary"
                >
                  {t('hero.getStarted')}
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
          {t('features.title')}
        </Typography>
        <Grid container spacing={4}>
          <Feature
            icon={<BoltIcon fontSize="large" color="primary" />}
            title={t('features.valueBased.title')}
            description={t('features.valueBased.description')}
          />
          <Feature
            icon={<ViewDayIcon fontSize="large" color="primary" />}
            title={t('features.flowMode.title')}
            description={t('features.flowMode.description')}
          />
          <Feature
            icon={<RepeatIcon fontSize="large" color="primary" />}
            title={t('features.recurring.title')}
            description={t('features.recurring.description')}
          />
          <Feature
            icon={<EventIcon fontSize="large" color="primary" />}
            title={t('features.calendar.title')}
            description={t('features.calendar.description')}
          />
        </Grid>
      </Container>

      {/* CTA */}
      <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
        <Container sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {t('cta.title')}
          </Typography>
          <Typography color="text.secondary" mb={4}>
            {t('cta.subtitle')}
          </Typography>
          <Button component={RouterLink} to="/app" variant="contained" size="large">
            {t('cta.startPlanning')}
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
          <Typography color="text.secondary">
            © {new Date().getFullYear()} {t('footer.brand')}
          </Typography>
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
  { titleKey: 'flowMode.tasks.proposal', score: 27 },
  { titleKey: 'flowMode.tasks.agenda', score: 21 },
  { titleKey: 'flowMode.tasks.notes', score: 18 },
];

const ROW_HEIGHT = 56;

export function FlowModeMock() {
  const { t } = useTranslation();
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
        {t('flowMode.title')}
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={2}>
        {t('flowMode.subtitle')}
      </Typography>

      <Stack spacing={2}>
        {tasks.map((task, index) => {
          const active = index === 0;
          const isLeaving = active && leaving;

          return (
            <Box
              key={task.titleKey}
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
                    label={active ? t('flowMode.now') : t('flowMode.next')}
                    color={active ? 'primary' : 'default'}
                    variant={active ? 'filled' : 'outlined'}
                  />

                  <Box flexGrow={1}>
                    <Typography fontWeight={active ? 600 : 400}>{t(task.titleKey)}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('flowMode.score')}: {task.score}
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
