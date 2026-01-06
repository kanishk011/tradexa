'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import GavelIcon from '@mui/icons-material/Gavel';
import { MainLayout } from '@/components/layout';
import { GlassCard } from '@/components/ui';
import { useIsDarkMode } from '@/lib/theme';
import { appConfig } from '@/config';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using ${appConfig.name}'s website, mobile applications, or any other services provided by ${appConfig.name} (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Services.

We may modify these Terms at any time by posting the revised version on our website. Your continued use of the Services after any such changes constitutes your acceptance of the new Terms. We encourage you to review these Terms periodically.`,
  },
  {
    title: '2. Description of Services',
    content: `${appConfig.name} provides an online marketplace platform that connects buyers and sellers. Our Services include:

• Facilitating the listing and sale of products by sellers
• Enabling buyers to browse, search, and purchase products
• Providing payment processing and secure checkout
• Offering customer support and dispute resolution
• Providing seller tools and analytics

We reserve the right to modify, suspend, or discontinue any part of our Services at any time without prior notice.`,
  },
  {
    title: '3. User Accounts',
    content: `To access certain features of our Services, you must create an account. When creating an account, you agree to:

• Provide accurate, current, and complete information
• Maintain and promptly update your account information
• Keep your password secure and confidential
• Not share your account credentials with others
• Be responsible for all activities under your account
• Notify us immediately of any unauthorized access

We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent, illegal, or harmful activities.`,
  },
  {
    title: '4. Buyer Terms',
    content: `As a buyer on ${appConfig.name}, you agree to:

• Provide accurate shipping and payment information
• Pay for items you commit to purchase
• Not engage in fraudulent or deceptive practices
• Respect seller policies and product descriptions
• Communicate respectfully with sellers
• File disputes in good faith and through proper channels

All purchases are subject to our Buyer Protection Policy, which provides coverage for items that don't arrive or don't match the listing description.`,
  },
  {
    title: '5. Seller Terms',
    content: `As a seller on ${appConfig.name}, you agree to:

• Provide accurate and honest product descriptions
• Maintain adequate inventory for listed items
• Ship items promptly within stated timeframes
• Respond to buyer inquiries within 24-48 hours
• Comply with all applicable laws and regulations
• Pay applicable fees and commissions
• Maintain professional conduct with buyers

Sellers are responsible for the products they sell and must ensure compliance with all applicable laws, including consumer protection, product safety, and intellectual property laws.`,
  },
  {
    title: '6. Prohibited Activities',
    content: `You may not use our Services to:

• Violate any laws, regulations, or third-party rights
• Sell counterfeit, stolen, or illegal items
• Engage in fraud, money laundering, or deceptive practices
• Harass, abuse, or harm other users
• Spam, phish, or distribute malware
• Interfere with the proper functioning of our Services
• Circumvent fees, security measures, or policies
• Create multiple accounts to evade restrictions
• Manipulate reviews, ratings, or search results
• Collect user information without consent

Violation of these prohibitions may result in immediate account termination and legal action.`,
  },
  {
    title: '7. Intellectual Property',
    content: `All content on ${appConfig.name}, including but not limited to text, graphics, logos, icons, images, audio, video, software, and code, is the property of ${appConfig.name} or its licensors and is protected by intellectual property laws.

You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any content without prior written consent. Sellers retain ownership of their product listings and images but grant ${appConfig.name} a license to use such content for operating and promoting the marketplace.`,
  },
  {
    title: '8. Payment and Fees',
    content: `${appConfig.name} charges various fees for using our Services:

• Transaction Fee: 10% commission on each sale
• Payment Processing: Included in transaction fee
• Premium Features: Optional paid features as listed
• Promoted Listings: Advertising fees as specified

All fees are non-refundable unless otherwise stated. We reserve the right to change our fee structure with 30 days' notice. Sellers are responsible for all applicable taxes on their sales.`,
  },
  {
    title: '9. Dispute Resolution',
    content: `We encourage users to resolve disputes directly. If direct resolution is not possible:

1. Contact our customer support team
2. We will review the case and gather information
3. A resolution will be provided within 5-7 business days
4. Appeals can be submitted within 30 days

For disputes over $10,000 that cannot be resolved through our process, binding arbitration will be conducted in accordance with the rules of the American Arbitration Association.`,
  },
  {
    title: '10. Limitation of Liability',
    content: `To the maximum extent permitted by law, ${appConfig.name} shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill.

Our total liability for any claim arising from these Terms or use of our Services shall not exceed the greater of (a) the fees you paid to ${appConfig.name} in the 12 months preceding the claim, or (b) $100.

We are not responsible for the actions of buyers, sellers, or third parties, or for the quality, safety, or legality of items listed on our marketplace.`,
  },
  {
    title: '11. Indemnification',
    content: `You agree to indemnify, defend, and hold harmless ${appConfig.name}, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorney's fees) arising from:

• Your use of our Services
• Your violation of these Terms
• Your violation of any third-party rights
• Products you sell on our marketplace
• Content you submit or post`,
  },
  {
    title: '12. Termination',
    content: `We may terminate or suspend your account at any time for any reason, including violation of these Terms. Upon termination:

• Your right to use our Services immediately ceases
• Pending transactions may be canceled or completed at our discretion
• You remain liable for any outstanding fees or obligations
• Provisions that should survive termination will remain in effect

You may close your account at any time through account settings or by contacting support.`,
  },
  {
    title: '13. Governing Law',
    content: `These Terms are governed by the laws of the State of California, without regard to conflict of law principles. Any legal action must be brought in the state or federal courts located in San Francisco County, California, and you consent to the jurisdiction of such courts.`,
  },
  {
    title: '14. Contact Information',
    content: `For questions about these Terms of Service, please contact us:

${appConfig.name}, Inc.
123 Commerce Street
San Francisco, CA 94105
United States

Email: legal@${appConfig.name.toLowerCase()}.com
Phone: 1-800-TRADEXA`,
  },
];

export default function TermsPage() {
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
                ? 'linear-gradient(135deg, rgba(63, 81, 181, 0.15) 0%, rgba(33, 150, 243, 0.15) 100%)'
                : 'linear-gradient(135deg, rgba(63, 81, 181, 0.1) 0%, rgba(33, 150, 243, 0.1) 100%)',
            }}
          >
            <GavelIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h2" fontWeight={700} sx={{ mb: 2 }}>
              Terms of Service
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Last updated: December 1, 2024
            </Typography>
          </GlassCard>
        </motion.div>

        {/* Content */}
        <GlassCard sx={{ p: { xs: 3, md: 6 } }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Welcome to {appConfig.name}! These Terms of Service govern your access to and use of our website, services, and applications. Please read these terms carefully before using our platform.
          </Typography>

          {sections.map((section, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                {section.title}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}
              >
                {section.content}
              </Typography>
              {index < sections.length - 1 && <Divider sx={{ mt: 4 }} />}
            </Box>
          ))}
        </GlassCard>
      </Container>
    </MainLayout>
  );
}
