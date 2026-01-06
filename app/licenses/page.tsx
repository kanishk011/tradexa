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
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { motion } from 'framer-motion';
import GavelIcon from '@mui/icons-material/Gavel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { MainLayout } from '@/components/layout';
import { GlassCard, GlassButton } from '@/components/ui';
import { useIsDarkMode } from '@/lib/theme';
import { appConfig } from '@/config';

interface License {
  name: string;
  version: string;
  license: string;
  author: string;
  url: string;
}

const frontendLicenses: License[] = [
  { name: 'React', version: '19.0.0', license: 'MIT', author: 'Meta', url: 'https://react.dev' },
  { name: 'Next.js', version: '15.1.3', license: 'MIT', author: 'Vercel', url: 'https://nextjs.org' },
  { name: 'Material-UI', version: '6.3.0', license: 'MIT', author: 'MUI', url: 'https://mui.com' },
  { name: 'Framer Motion', version: '11.18.0', license: 'MIT', author: 'Framer', url: 'https://framer.com/motion' },
  { name: 'Emotion', version: '11.14.0', license: 'MIT', author: 'Emotion Team', url: 'https://emotion.sh' },
  { name: 'Apollo Client', version: '3.12.4', license: 'MIT', author: 'Apollo', url: 'https://apollographql.com' },
  { name: 'GraphQL', version: '16.9.0', license: 'MIT', author: 'GraphQL Foundation', url: 'https://graphql.org' },
  { name: 'React Hook Form', version: '7.54.2', license: 'MIT', author: 'Beier Luo', url: 'https://react-hook-form.com' },
  { name: 'Zod', version: '3.24.1', license: 'MIT', author: 'Colin McDonnell', url: 'https://zod.dev' },
  { name: 'Zustand', version: '5.0.3', license: 'MIT', author: 'Daishi Kato', url: 'https://zustand-demo.pmnd.rs' },
];

const backendLicenses: License[] = [
  { name: 'Node.js', version: '20.x', license: 'MIT', author: 'OpenJS Foundation', url: 'https://nodejs.org' },
  { name: 'Express', version: '4.22.1', license: 'MIT', author: 'TJ Holowaychuk', url: 'https://expressjs.com' },
  { name: 'Apollo Server', version: '4.12.2', license: 'MIT', author: 'Apollo', url: 'https://apollographql.com' },
  { name: 'Prisma', version: '7.2.0', license: 'Apache-2.0', author: 'Prisma', url: 'https://prisma.io' },
  { name: 'PostgreSQL', version: '16.x', license: 'PostgreSQL', author: 'PostgreSQL Global Dev Group', url: 'https://postgresql.org' },
  { name: 'bcryptjs', version: '2.4.3', license: 'MIT', author: 'Daniel Wirtz', url: 'https://github.com/dcodeIO/bcrypt.js' },
  { name: 'jsonwebtoken', version: '9.0.3', license: 'MIT', author: 'Auth0', url: 'https://github.com/auth0/node-jsonwebtoken' },
  { name: 'Helmet', version: '8.1.0', license: 'MIT', author: 'Adam Baldwin', url: 'https://helmetjs.github.io' },
];

const licenseTexts = [
  {
    name: 'MIT License',
    description: 'A short and simple permissive license with conditions only requiring preservation of copyright and license notices.',
    permissions: ['Commercial use', 'Modification', 'Distribution', 'Private use'],
    conditions: ['License and copyright notice'],
    limitations: ['Liability', 'Warranty'],
  },
  {
    name: 'Apache License 2.0',
    description: 'A permissive license whose main conditions require preservation of copyright and license notices.',
    permissions: ['Commercial use', 'Modification', 'Distribution', 'Patent use', 'Private use'],
    conditions: ['License and copyright notice', 'State changes'],
    limitations: ['Liability', 'Trademark use', 'Warranty'],
  },
  {
    name: 'PostgreSQL License',
    description: 'A liberal Open Source license, similar to the BSD or MIT licenses.',
    permissions: ['Commercial use', 'Modification', 'Distribution', 'Private use'],
    conditions: ['License and copyright notice'],
    limitations: ['Liability', 'Warranty'],
  },
];

export default function LicensesPage() {
  const isDark = useIsDarkMode();

  const getLicenseColor = (license: string): 'success' | 'primary' | 'info' => {
    if (license === 'MIT') return 'success';
    if (license === 'Apache-2.0') return 'primary';
    return 'info';
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
          <GlassCard
            variant="elevated"
            sx={{
              textAlign: 'center',
              py: 6,
              px: 4,
              mb: 4,
              background: isDark
                ? 'linear-gradient(135deg, rgba(103, 58, 183, 0.15) 0%, rgba(63, 81, 181, 0.15) 100%)'
                : 'linear-gradient(135deg, rgba(103, 58, 183, 0.1) 0%, rgba(63, 81, 181, 0.1) 100%)',
            }}
          >
            <GavelIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h2" fontWeight={700} sx={{ mb: 2 }}>
              Open Source Licenses
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {appConfig.name} is built with open source software
            </Typography>
          </GlassCard>
        </motion.div>

        {/* Introduction */}
        <GlassCard sx={{ p: 4, mb: 4 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We believe in the power of open source software and are grateful to the communities that make these projects possible. Below you'll find a list of the open source packages we use, along with their respective licenses.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            If you have any questions about our use of open source software or licensing, please contact us at{' '}
            <Typography component="span" color="primary.main">
              legal@{appConfig.name.toLowerCase()}.com
            </Typography>
          </Typography>
        </GlassCard>

        {/* License Types */}
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          License Types Used
        </Typography>
        <Box sx={{ mb: 4 }}>
          {licenseTexts.map((license, index) => (
            <Accordion
              key={index}
              sx={{
                mb: 2,
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                borderRadius: 2,
                '&:before': { display: 'none' },
                '&.Mui-expanded': { margin: '0 0 16px 0' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {license.name}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {license.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <Box>
                    <Typography variant="overline" color="success.main" fontWeight={600}>
                      Permissions
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {license.permissions.map((p) => (
                        <Typography key={p} variant="body2" color="text.secondary">
                          • {p}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="overline" color="primary.main" fontWeight={600}>
                      Conditions
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {license.conditions.map((c) => (
                        <Typography key={c} variant="body2" color="text.secondary">
                          • {c}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="overline" color="error.main" fontWeight={600}>
                      Limitations
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {license.limitations.map((l) => (
                        <Typography key={l} variant="body2" color="text.secondary">
                          • {l}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Frontend Dependencies */}
        <GlassCard sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
            Frontend Dependencies
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Package</strong></TableCell>
                  <TableCell><strong>Version</strong></TableCell>
                  <TableCell><strong>License</strong></TableCell>
                  <TableCell><strong>Author</strong></TableCell>
                  <TableCell align="right"><strong>Link</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {frontendLicenses.map((pkg) => (
                  <TableRow key={pkg.name}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {pkg.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <code>{pkg.version}</code>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={pkg.license}
                        size="small"
                        color={getLicenseColor(pkg.license)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{pkg.author}</TableCell>
                    <TableCell align="right">
                      <GlassButton
                        size="small"
                        variant="outlined"
                        href={pkg.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        endIcon={<OpenInNewIcon fontSize="small" />}
                      >
                        View
                      </GlassButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </GlassCard>

        {/* Backend Dependencies */}
        <GlassCard sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
            Backend Dependencies
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Package</strong></TableCell>
                  <TableCell><strong>Version</strong></TableCell>
                  <TableCell><strong>License</strong></TableCell>
                  <TableCell><strong>Author</strong></TableCell>
                  <TableCell align="right"><strong>Link</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {backendLicenses.map((pkg) => (
                  <TableRow key={pkg.name}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {pkg.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <code>{pkg.version}</code>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={pkg.license}
                        size="small"
                        color={getLicenseColor(pkg.license)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{pkg.author}</TableCell>
                    <TableCell align="right">
                      <GlassButton
                        size="small"
                        variant="outlined"
                        href={pkg.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        endIcon={<OpenInNewIcon fontSize="small" />}
                      >
                        View
                      </GlassButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </GlassCard>

        <Divider sx={{ my: 4 }} />

        {/* Full License Text */}
        <GlassCard sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
            MIT License (Full Text)
          </Typography>
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}
          >
            <Typography variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
{`MIT License

Copyright (c) ${new Date().getFullYear()} ${appConfig.name}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
            </Typography>
          </Box>
        </GlassCard>
      </Container>
    </MainLayout>
  );
}
