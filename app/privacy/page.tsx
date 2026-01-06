'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { motion } from 'framer-motion';
import SecurityIcon from '@mui/icons-material/Security';
import { MainLayout } from '@/components/layout';
import { GlassCard } from '@/components/ui';
import { useIsDarkMode } from '@/lib/theme';
import { appConfig } from '@/config';

const dataCategories = [
  { category: 'Account Information', examples: 'Name, email, phone, address', retention: 'Account lifetime + 3 years' },
  { category: 'Transaction Data', examples: 'Orders, payments, invoices', retention: '7 years' },
  { category: 'Usage Data', examples: 'Page views, clicks, searches', retention: '2 years' },
  { category: 'Device Information', examples: 'IP, browser, device type', retention: '1 year' },
  { category: 'Communications', examples: 'Support tickets, messages', retention: '3 years' },
  { category: 'Marketing Preferences', examples: 'Email opt-ins, preferences', retention: 'Until withdrawn' },
];

const sections = [
  {
    title: '1. Information We Collect',
    content: `We collect information in several ways:

**Information You Provide:**
• Account registration details (name, email, password)
• Profile information (address, phone number, profile picture)
• Payment information (processed by secure payment providers)
• Communications with us or other users
• Reviews, ratings, and feedback you submit

**Information Collected Automatically:**
• Device and browser information
• IP address and location data
• Usage data and browsing history
• Cookies and similar technologies
• Transaction and purchase history

**Information from Third Parties:**
• Social media profile data (when you connect accounts)
• Payment provider transaction details
• Shipping carrier delivery information
• Fraud prevention and verification services`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use your information for the following purposes:

**Providing Our Services:**
• Creating and managing your account
• Processing transactions and payments
• Facilitating communication between buyers and sellers
• Providing customer support
• Fulfilling orders and arranging shipping

**Improving Our Services:**
• Analyzing usage patterns and trends
• Personalizing your experience
• Developing new features and services
• Conducting research and surveys

**Safety and Security:**
• Detecting and preventing fraud
• Enforcing our terms and policies
• Protecting users and third parties
• Complying with legal obligations

**Marketing and Communications:**
• Sending promotional offers and updates
• Personalizing advertisements
• Providing recommendations
• Notifying you about account activity`,
  },
  {
    title: '3. Information Sharing',
    content: `We share your information in the following circumstances:

**With Other Users:**
• Buyers and sellers share necessary information to complete transactions
• Public profile information visible to other users
• Reviews and ratings you post

**With Service Providers:**
• Payment processors (Stripe, PayPal)
• Shipping carriers (FedEx, UPS, USPS)
• Cloud hosting providers
• Customer support tools
• Analytics services

**For Legal Reasons:**
• Compliance with laws and regulations
• Response to legal process or government requests
• Protection of our rights and property
• Prevention of fraud or illegal activity

**Business Transfers:**
• In connection with mergers, acquisitions, or sale of assets
• During due diligence for potential transactions

We do NOT sell your personal information to third parties for their marketing purposes.`,
  },
  {
    title: '4. Cookies and Tracking',
    content: `We use cookies and similar technologies for:

**Essential Functions:**
• Keeping you logged in
• Remembering your preferences
• Processing shopping cart items
• Security and fraud prevention

**Analytics:**
• Understanding how you use our Services
• Measuring the effectiveness of features
• Identifying popular products and pages

**Advertising:**
• Personalizing ads on our platform
• Measuring ad effectiveness
• Retargeting on third-party platforms

You can control cookies through your browser settings. Note that disabling certain cookies may affect functionality. For more details, see our Cookie Policy.`,
  },
  {
    title: '5. Your Rights and Choices',
    content: `You have the following rights regarding your data:

**Access and Portability:**
• Request a copy of your personal data
• Export your data in a portable format

**Correction:**
• Update or correct inaccurate information
• Modify your profile and preferences

**Deletion:**
• Request deletion of your account and data
• Note: Some data may be retained for legal compliance

**Opt-Out:**
• Unsubscribe from marketing emails
• Disable personalized advertising
• Opt out of certain data collection

**Restrict Processing:**
• Limit how we use your data
• Object to certain processing activities

To exercise these rights, visit Account Settings or contact privacy@${appConfig.name.toLowerCase()}.com.`,
  },
  {
    title: '6. Data Security',
    content: `We implement robust security measures to protect your data:

**Technical Safeguards:**
• 256-bit SSL/TLS encryption for data in transit
• Encryption at rest for sensitive data
• Regular security audits and penetration testing
• Secure data centers with physical access controls

**Organizational Measures:**
• Employee access controls and training
• Incident response procedures
• Regular policy reviews and updates
• Third-party security assessments

**Your Role:**
• Use strong, unique passwords
• Enable two-factor authentication
• Report suspicious activity immediately
• Keep your devices secure

While we strive to protect your data, no system is 100% secure. We cannot guarantee absolute security.`,
  },
  {
    title: '7. International Data Transfers',
    content: `${appConfig.name} operates globally, and your data may be processed in countries other than your own. We transfer data internationally using:

• Standard Contractual Clauses approved by the European Commission
• Adequacy decisions recognizing certain countries' data protection
• Your consent for specific transfers

We ensure that international transfers meet applicable legal requirements and maintain appropriate safeguards for your data.`,
  },
  {
    title: '8. Children\'s Privacy',
    content: `Our Services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we learn we have collected such information, we will promptly delete it.

Parents or guardians who believe their child has provided us with personal information should contact us immediately at privacy@${appConfig.name.toLowerCase()}.com.`,
  },
  {
    title: '9. California Privacy Rights',
    content: `California residents have additional rights under the CCPA:

**Right to Know:**
• Categories of personal information collected
• Sources of information
• Business purposes for collection
• Categories of third parties with whom we share data

**Right to Delete:**
• Request deletion of personal information
• Subject to certain exceptions

**Right to Non-Discrimination:**
• Equal service and pricing regardless of privacy choices

**Do Not Sell:**
• We do not sell personal information
• Opt-out rights for any future sales

To submit a request, contact privacy@${appConfig.name.toLowerCase()}.com or call 1-800-TRADEXA.`,
  },
  {
    title: '10. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last Modified" date.

For significant changes, we will provide additional notice through email or prominent website announcements. Your continued use of our Services after changes become effective constitutes acceptance of the revised policy.

We encourage you to review this policy periodically to stay informed about our data practices.`,
  },
  {
    title: '11. Contact Us',
    content: `For questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

**Data Protection Officer:**
${appConfig.name}, Inc.
123 Commerce Street
San Francisco, CA 94105
United States

Email: privacy@${appConfig.name.toLowerCase()}.com
Phone: 1-800-TRADEXA

We aim to respond to all privacy-related inquiries within 30 days.`,
  },
];

export default function PrivacyPage() {
  const isDark = useIsDarkMode();

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
              py: 6,
              px: 4,
              mb: 4,
              background: isDark
                ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(33, 150, 243, 0.15) 100%)'
                : 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(33, 150, 243, 0.1) 100%)',
            }}
          >
            <SecurityIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h2" fontWeight={700} sx={{ mb: 2 }}>
              Privacy Policy
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Last updated: December 1, 2024
            </Typography>
          </GlassCard>
        </motion.div>

        {/* Data Overview Table */}
        <GlassCard sx={{ p: { xs: 3, md: 4 }, mb: 4 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
            Data Collection Overview
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Data Category</strong></TableCell>
                  <TableCell><strong>Examples</strong></TableCell>
                  <TableCell><strong>Retention Period</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataCategories.map((row) => (
                  <TableRow key={row.category}>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.examples}</TableCell>
                    <TableCell>{row.retention}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </GlassCard>

        {/* Content */}
        <GlassCard sx={{ p: { xs: 3, md: 6 } }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            At {appConfig.name}, we take your privacy seriously. This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our website, mobile applications, and services.
          </Typography>

          {sections.map((section, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                {section.title}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  whiteSpace: 'pre-line',
                  lineHeight: 1.8,
                  '& strong': { color: 'text.primary' },
                }}
                dangerouslySetInnerHTML={{ __html: section.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
              />
              {index < sections.length - 1 && <Divider sx={{ mt: 4 }} />}
            </Box>
          ))}
        </GlassCard>
      </Container>
    </MainLayout>
  );
}
