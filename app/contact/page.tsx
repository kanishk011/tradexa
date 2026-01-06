'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid2 as Grid,
  TextField,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { MainLayout } from '@/components/layout';
import { GlassCard, GlassButton } from '@/components/ui';
import { useIsDarkMode } from '@/lib/theme';
import { appConfig } from '@/config';
import { useContactSubmission } from '@/lib/hooks/useContent';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Please select a subject'),
  category: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const subjects = [
  'General Inquiry',
  'Order Issue',
  'Payment Problem',
  'Shipping Question',
  'Return Request',
  'Seller Support',
  'Technical Issue',
  'Partnership Inquiry',
  'Other',
];

const contactInfo = [
  {
    icon: <LocationOnIcon sx={{ fontSize: 32 }} />,
    title: 'Address',
    details: ['123 Commerce Street', 'San Francisco, CA 94105', 'United States'],
  },
  {
    icon: <EmailIcon sx={{ fontSize: 32 }} />,
    title: 'Email',
    details: [`support@${appConfig.name.toLowerCase()}.com`, `sales@${appConfig.name.toLowerCase()}.com`],
  },
  {
    icon: <PhoneIcon sx={{ fontSize: 32 }} />,
    title: 'Phone',
    details: ['1-800-TRADEXA', '+1 (415) 555-0123'],
  },
  {
    icon: <AccessTimeIcon sx={{ fontSize: 32 }} />,
    title: 'Hours',
    details: ['Mon - Fri: 9am - 6pm PST', 'Sat - Sun: 10am - 4pm PST'],
  },
];

export default function ContactPage() {
  const isDark = useIsDarkMode();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const { submitContact, loading: isSubmitting } = useContactSubmission();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      category: '',
      message: '',
    },
  });

  const selectedSubject = watch('subject');

  const onSubmit = async (data: ContactFormData) => {
    try {
      await submitContact({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        category: data.category,
        message: data.message,
      });
      setShowSuccess(true);
      reset();
    } catch (error) {
      console.error('Contact form submission failed:', error);
      setShowError(true);
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="overline" color="primary" sx={{ letterSpacing: 2 }}>
              Contact Us
            </Typography>
            <Typography variant="h2" fontWeight={700} sx={{ mt: 1, mb: 2 }}>
              Get in Touch
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Have a question or feedback? We'd love to hear from you. Our team is here to help.
            </Typography>
          </Box>
        </motion.div>

        {/* Contact Info Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {contactInfo.map((info, index) => (
            <Grid key={index} size={{ xs: 6, md: 3 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{info.icon}</Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {info.title}
                  </Typography>
                  {info.details.map((detail, i) => (
                    <Typography key={i} variant="body2" color="text.secondary">
                      {detail}
                    </Typography>
                  ))}
                </GlassCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                  Send us a Message
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Your Name"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            disabled={isSubmitting}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Email Address"
                            type="email"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            disabled={isSubmitting}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name="subject"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            fullWidth
                            label="Subject"
                            error={!!errors.subject}
                            helperText={errors.subject?.message}
                            disabled={isSubmitting}
                          >
                            {subjects.map((subject) => (
                              <MenuItem key={subject} value={subject}>
                                {subject}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Phone Number (Optional)"
                            placeholder="+1 (555) 123-4567"
                            disabled={isSubmitting}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={12}>
                      <Controller
                        name="message"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Your Message"
                            multiline
                            rows={5}
                            error={!!errors.message}
                            helperText={errors.message?.message}
                            disabled={isSubmitting}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={12}>
                      <GlassButton
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </GlassButton>
                    </Grid>
                  </Grid>
                </form>
              </GlassCard>
            </motion.div>
          </Grid>

          {/* Side Info */}
          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {/* Live Chat */}
              <GlassCard
                sx={{
                  p: 4,
                  mb: 3,
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(76, 175, 80, 0.2) 100%)'
                    : 'linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rgba(76, 175, 80, 0.15) 100%)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <ChatIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Live Chat
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average response time: 2 min
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Get instant help from our support team. Available 24/7 for urgent issues.
                </Typography>
                <GlassButton variant="contained" fullWidth>
                  Start Live Chat
                </GlassButton>
              </GlassCard>

              {/* FAQ Link */}
              <GlassCard sx={{ p: 4, mb: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Frequently Asked Questions
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Find quick answers to common questions in our Help Center.
                </Typography>
                <GlassButton variant="outlined" fullWidth href="/faq">
                  Browse FAQs
                </GlassButton>
              </GlassCard>

              {/* Response Time */}
              <GlassCard sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Response Times
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Email Support
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    24-48 hours
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Live Chat
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    ~2 minutes
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Phone Support
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    Immediate
                  </Typography>
                </Box>
              </GlassCard>
            </motion.div>
          </Grid>
        </Grid>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GlassCard sx={{ mt: 6, p: 0, overflow: 'hidden' }}>
            <Box
              sx={{
                height: 400,
                bgcolor: isDark ? 'grey.900' : 'grey.200',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <LocationOnIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" fontWeight={600}>
                  {appConfig.name} Headquarters
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  123 Commerce Street, San Francisco, CA 94105
                </Typography>
              </Box>
            </Box>
          </GlassCard>
        </motion.div>

        {/* Success Snackbar */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={6000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setShowSuccess(false)}
            severity="success"
            variant="filled"
            icon={<CheckCircleIcon />}
            sx={{ width: '100%' }}
          >
            Your message has been sent successfully! We'll get back to you soon.
          </Alert>
        </Snackbar>

        {/* Error Snackbar */}
        <Snackbar
          open={showError}
          autoHideDuration={6000}
          onClose={() => setShowError(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setShowError(false)}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
          >
            Failed to send message. Please try again later.
          </Alert>
        </Snackbar>
      </Container>
    </MainLayout>
  );
}
