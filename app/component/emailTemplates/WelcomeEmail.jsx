import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Heading,
  Hr,
  Link,
  Img,
  Preview,
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

export default function WelcomeEmail({
  userName = 'User',
  appName = 'Vault',
  iconCid = 'app-icon',
  dashboardUrl = '',
  websiteUrl = '',
  githubUrl = 'https://github.com/harshchill/Vault',
  installUrl = '',
}) {
  const safeDashboard = String(dashboardUrl || '').replace(/\/+$/, '');
  const safeWebsite = String(websiteUrl || safeDashboard).replace(/\/+$/, '');
  const safeInstall = installUrl || (safeDashboard ? `${safeDashboard}?install=1` : '');

  return (
    <Html>
      <Head />
      <Preview>Welcome to {appName}! Discover papers, contribute, and make studying easier.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img src={`cid:${iconCid}`} width="56" height="56" alt="Logo" style={logo} />
            <Heading style={h1}>Welcome to {appName}</Heading>
            <Text style={heroText}>We’re excited to have you, {userName}. Here’s how to get started.</Text>
          </Section>

          <Section style={content}>
            <Text style={paragraph}>
              {appName} helps you discover, save, and share previous‑year papers with a clean and fast experience.
            </Text>
            <Text style={paragraph}>
              Jump in using the quick links below, or explore what the community is contributing.
            </Text>

            <Section style={gridContainer}>
              <Row>
                <Column>
                  <Text style={featureTitle}>📚 Browse Library</Text>
                  <Text style={featureText}>Filter by semester, department, and more.</Text>
                </Column>
                <Column>
                  <Text style={featureTitle}>⬆️ Upload Papers</Text>
                  <Text style={featureText}>Share helpful resources and build your profile.</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={featureTitle}>🏆 Leaderboard</Text>
                  <Text style={featureText}>See top contributors in the community.</Text>
                </Column>
                <Column>
                  <Text style={featureTitle}>📱 Install as App</Text>
                  <Text style={featureText}>Add to your home screen for instant access.</Text>
                </Column>
              </Row>
            </Section>

            <Section style={ctaContainer}>
              <Text style={ctaText}>Start with your dashboard, or install the app for a faster workflow.</Text>
              {safeDashboard && (
                <Button style={button} href={safeDashboard}>Open Dashboard</Button>
              )}
              {' '}
              {safeInstall && (
                <Button style={{ ...button, backgroundColor: 'rgba(5,150,105,0.12)', color: '#065F46' }} href={safeInstall}>Install the App</Button>
              )}
              {' '}
              {githubUrl && (
                <Button
                  href={githubUrl}
                  style={{
                    ...button,
                    backgroundColor: 'transparent',
                    color: '#065F46',
                    border: '1px solid #059669',
                  }}
                >
                  Contribute on GitHub
                </Button>
              )}
            </Section>

            <Section style={{ ...gridContainer, marginTop: 20 }}>
              <Text style={featureTitle}>💚 Open Source</Text>
              <Text style={featureText}>
                {appName} is open‑source. If you’d like to contribute, report issues, or star the repo, visit our GitHub.
              </Text>
              <Text style={{ ...featureText, marginTop: 8 }}>
                {safeWebsite && (
                  <>
                    <Link href={safeWebsite} style={link}>Visit Website</Link> {' • '}
                  </>
                )}
                <Link href={githubUrl} style={link}>GitHub</Link>
              </Text>
            </Section>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>© {new Date().getFullYear()} {appName} • Built with ❤️ in India</Text>
            <Text style={footerLinks}>
              <Link href={githubUrl} style={link}>GitHub</Link>
              {safeWebsite ? <> {' • '}<Link href={safeWebsite} style={link}>Website</Link></> : null}
            </Text>
            <Text style={footerAddress}>Satna, Madhya Pradesh, India</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles (inline for email clients)
const main = {
  backgroundColor: '#ECFDF5',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  marginBottom: '64px',
  maxWidth: '600px',
  borderRadius: '10px',
  boxShadow: '0 8px 28px rgba(5, 150, 105, 0.08)',
};

const header = {
  textAlign: 'center',
  paddingBottom: '20px',
};

const logo = {
  margin: '0 auto 16px',
  borderRadius: '9999px',
  border: '2px solid #059669',
};

const h1 = {
  color: '#065F46',
  fontSize: '24px',
  fontWeight: '800',
  lineHeight: '1.3',
  margin: '0',
};

const heroText = {
  fontSize: '15px',
  color: '#065F46',
  margin: '10px 0 0',
};

const content = {
  padding: '0 10px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#065F46',
  marginBottom: '20px',
};

const gridContainer = {
  background: '#F0FDF4',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '30px',
  border: '1px solid #BBF7D0',
};

const featureTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#065F46',
  marginBottom: '4px',
};

const featureText = {
  fontSize: '14px',
  color: '#065F46',
  margin: '0',
};

const ctaContainer = {
  textAlign: 'center',
  marginBottom: '20px',
};

const ctaText = {
  fontSize: '15px',
  color: '#065F46',
  marginBottom: '20px',
};

const button = {
  backgroundColor: '#059669',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '14px',
  fontWeight: '700',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '12px 24px',
};

const hr = {
  borderColor: '#A7F3D0',
  margin: '40px 0 20px',
};

const footer = {
  textAlign: 'center',
};

const footerText = {
  fontSize: '12px',
  color: '#065F46',
  marginBottom: '10px',
};

const footerLinks = {
  fontSize: '12px',
  color: '#065F46',
  marginBottom: '10px',
};

const link = {
  color: '#059669',
  textDecoration: 'underline',
};

const footerAddress = {
  fontSize: '10px',
  color: '#10B981',
};
