'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid2 as Grid,
  Avatar,
  Divider,
  Breadcrumbs,
  Container,
  Tabs,
  Tab,
} from '@mui/material';
import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import {
  GlassCard,
  GlassButton,
  GlassInput,
} from '@/components/ui';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ProfilePage() {
  const [tabValue, setTabValue] = useState(0);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
  });

  const handleSave = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setEditing(false);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
            <Typography color="text.primary">Profile</Typography>
          </Breadcrumbs>

          {/* Header */}
          <GlassCard sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: '2.5rem',
                  background: 'linear-gradient(135deg, #64B5F6 0%, #BA68C8 100%)',
                }}
              >
                JD
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight={700}>
                  {profileData.firstName} {profileData.lastName}
                </Typography>
                <Typography color="text.secondary">
                  {profileData.email}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Member since January 2024
                </Typography>
              </Box>
              <GlassButton
                startIcon={<EditIcon />}
                onClick={() => setEditing(!editing)}
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </GlassButton>
            </Box>
          </GlassCard>

          {/* Tabs */}
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{ mb: 2 }}
          >
            <Tab icon={<PersonIcon />} label="Personal Info" />
            <Tab icon={<SecurityIcon />} label="Security" />
            <Tab icon={<NotificationsIcon />} label="Notifications" />
          </Tabs>

          {/* Personal Info Tab */}
          <TabPanel value={tabValue} index={0}>
            <GlassCard>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Personal Information
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <GlassInput
                    label="First Name"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    disabled={!editing}
                    fullWidth
                    startIcon={<PersonIcon color="action" />}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <GlassInput
                    label="Last Name"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    disabled={!editing}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <GlassInput
                    label="Email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!editing}
                    fullWidth
                    startIcon={<EmailIcon color="action" />}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <GlassInput
                    label="Phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!editing}
                    fullWidth
                    startIcon={<PhoneIcon color="action" />}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" fontWeight={600} gutterBottom>
                Address
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <GlassInput
                    label="Street Address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    disabled={!editing}
                    fullWidth
                    startIcon={<LocationOnIcon color="action" />}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <GlassInput
                    label="City"
                    value={profileData.city}
                    onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                    disabled={!editing}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <GlassInput
                    label="State"
                    value={profileData.state}
                    onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                    disabled={!editing}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <GlassInput
                    label="ZIP Code"
                    value={profileData.zipCode}
                    onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                    disabled={!editing}
                    fullWidth
                  />
                </Grid>
              </Grid>

              {editing && (
                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <GlassButton onClick={() => setEditing(false)}>
                    Cancel
                  </GlassButton>
                  <GlassButton variant="contained" onClick={handleSave} loading={loading}>
                    Save Changes
                  </GlassButton>
                </Box>
              )}
            </GlassCard>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel value={tabValue} index={1}>
            <GlassCard>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Change Password
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <GlassInput
                    label="Current Password"
                    type="password"
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <GlassInput
                    label="New Password"
                    type="password"
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <GlassInput
                    label="Confirm New Password"
                    type="password"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3 }}>
                <GlassButton variant="contained">
                  Update Password
                </GlassButton>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" fontWeight={600} gutterBottom>
                Two-Factor Authentication
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Add an extra layer of security to your account
              </Typography>
              <GlassButton>
                Enable 2FA
              </GlassButton>
            </GlassCard>
          </TabPanel>

          {/* Notifications Tab */}
          <TabPanel value={tabValue} index={2}>
            <GlassCard>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Notification Preferences
              </Typography>
              <Typography color="text.secondary">
                Manage how you receive notifications
              </Typography>
              {/* Add notification settings here */}
            </GlassCard>
          </TabPanel>
        </Container>
      </MainLayout>
    </ProtectedRoute>
  );
}
