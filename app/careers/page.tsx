'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid2 as Grid,
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
  Collapse,
  IconButton,
  Skeleton,
  Alert,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CodeIcon from '@mui/icons-material/Code';
import BrushIcon from '@mui/icons-material/Brush';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import { MainLayout } from '@/components/layout';
import { GlassCard, GlassButton } from '@/components/ui';
import { useIsDarkMode } from '@/lib/theme';
import { appConfig } from '@/config';
import { useCareers, useCareerDepartments, Career } from '@/lib/hooks/useContent';

const departmentIcons: Record<string, React.ReactNode> = {
  Engineering: <CodeIcon />,
  Design: <BrushIcon />,
  'Customer Support': <SupportAgentIcon />,
  Marketing: <TrendingUpIcon />,
  Sales: <TrendingUpIcon />,
  Operations: <SettingsIcon />,
  'Human Resources': <PeopleIcon />,
  Product: <BusinessCenterIcon />,
};

const perks = [
  { title: 'Remote First', description: 'Work from anywhere in the world' },
  { title: 'Unlimited PTO', description: 'Take the time you need to recharge' },
  { title: 'Health Benefits', description: 'Comprehensive medical, dental, and vision' },
  { title: 'Learning Budget', description: '$2,000/year for courses and conferences' },
  { title: 'Stock Options', description: 'Own a piece of what you build' },
  { title: 'Home Office', description: '$1,500 stipend for your workspace' },
];

const locationTypes = ['All', 'REMOTE', 'HYBRID', 'ONSITE'];

function formatLocationType(type: string): string {
  const labels: Record<string, string> = {
    REMOTE: 'Remote',
    HYBRID: 'Hybrid',
    ONSITE: 'On-site',
  };
  return labels[type] || type;
}

function JobSkeleton() {
  return (
    <GlassCard sx={{ mb: 2, p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Skeleton variant="rounded" width={48} height={48} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width="40%" height={28} />
          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
            <Skeleton width={100} height={20} />
            <Skeleton width={120} height={20} />
            <Skeleton width={80} height={20} />
          </Box>
        </Box>
      </Box>
    </GlassCard>
  );
}

export default function CareersPage() {
  const isDark = useIsDarkMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedLocationType, setSelectedLocationType] = useState('All');
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const { departments } = useCareerDepartments();
  const { careers, loading, error } = useCareers({
    filter: {
      search: searchQuery || undefined,
      department: selectedDepartment !== 'All' ? selectedDepartment : undefined,
      locationType: selectedLocationType !== 'All' ? selectedLocationType : undefined,
    },
    limit: 50,
  });

  const allDepartments = ['All', ...departments];

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard
            variant="elevated"
            sx={{
              textAlign: 'center',
              py: 8,
              px: 4,
              mb: 6,
              background: isDark
                ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(33, 150, 243, 0.15) 100%)'
                : 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(33, 150, 243, 0.1) 100%)',
            }}
          >
            <BusinessCenterIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h2" fontWeight={700} sx={{ mb: 2 }}>
              Join Our Team
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Help us build the future of eCommerce. We're looking for passionate people
              to join our mission.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Chip
                label={loading ? 'Loading...' : `${careers.length} Open Positions`}
                color="primary"
                size="medium"
              />
            </Box>
          </GlassCard>
        </motion.div>

        {/* Perks Section */}
        <Typography variant="h4" fontWeight={700} sx={{ mb: 4, textAlign: 'center' }}>
          Why Work at {appConfig.name}?
        </Typography>
        <Grid container spacing={2} sx={{ mb: 6 }}>
          {perks.map((perk, index) => (
            <Grid key={index} size={{ xs: 6, md: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard sx={{ p: 3, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {perk.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {perk.description}
                  </Typography>
                </GlassCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Filters */}
        <GlassCard sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder="Search positions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <TextField
                select
                fullWidth
                label="Department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {allDepartments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <TextField
                select
                fullWidth
                label="Location Type"
                value={selectedLocationType}
                onChange={(e) => setSelectedLocationType(e.target.value)}
              >
                {locationTypes.map((loc) => (
                  <MenuItem key={loc} value={loc}>
                    {loc === 'All' ? 'All Locations' : formatLocationType(loc)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </GlassCard>

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            Failed to load job listings. Please try again later.
          </Alert>
        )}

        {/* Job Listings */}
        <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
          Open Positions ({loading ? '...' : careers.length})
        </Typography>
        <AnimatePresence mode="wait">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <JobSkeleton key={i} />
              ))}
            </>
          ) : (
            careers.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                layout
              >
                <GlassCard sx={{ mb: 2, overflow: 'hidden' }}>
                  <Box
                    sx={{
                      p: 3,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: 'primary.main',
                          color: 'white',
                          display: 'flex',
                        }}
                      >
                        {departmentIcons[job.department] || <WorkIcon />}
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {job.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 0.5, flexWrap: 'wrap' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <WorkIcon fontSize="small" /> {job.department}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationOnIcon fontSize="small" /> {job.location}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTimeIcon fontSize="small" /> {job.employmentType?.replace('_', ' ')}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={formatLocationType(job.locationType)}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                      <IconButton>
                        {expandedJob === job.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                  </Box>
                  <Collapse in={expandedJob === job.id}>
                    <Box sx={{ px: 3, pb: 3, pt: 0 }}>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {job.description}
                      </Typography>
                      {job.requirements && job.requirements.length > 0 && (
                        <>
                          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                            Requirements:
                          </Typography>
                          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                            {job.requirements.map((req, i) => (
                              <Typography key={i} component="li" variant="body2" color="text.secondary">
                                {req}
                              </Typography>
                            ))}
                          </Box>
                        </>
                      )}
                      {job.responsibilities && job.responsibilities.length > 0 && (
                        <>
                          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                            Responsibilities:
                          </Typography>
                          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                            {job.responsibilities.map((resp, i) => (
                              <Typography key={i} component="li" variant="body2" color="text.secondary">
                                {resp}
                              </Typography>
                            ))}
                          </Box>
                        </>
                      )}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                        {job.benefits.map((benefit) => (
                          <Chip key={benefit} label={benefit} size="small" variant="outlined" />
                        ))}
                      </Box>
                      {job.salaryMin && job.salaryMax && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Salary: {job.salaryCurrency || 'USD'} {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}
                        </Typography>
                      )}
                      <GlassButton
                        variant="contained"
                        href={job.applicationUrl || `mailto:${job.applicationEmail || 'careers@tradexa.com'}`}
                      >
                        Apply Now
                      </GlassButton>
                    </Box>
                  </Collapse>
                </GlassCard>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {!loading && careers.length === 0 && !error && (
          <GlassCard sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No positions found matching your criteria
            </Typography>
          </GlassCard>
        )}
      </Container>
    </MainLayout>
  );
}
