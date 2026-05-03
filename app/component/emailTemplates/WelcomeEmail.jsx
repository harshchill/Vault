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

const BookIcon = () => (
  <Img src="https://img.icons8.com/ios-filled/50/00baa4/book.png" width="24" height="24" alt="Book" />
);

const UploadIcon = () => (
  <Img src="https://img.icons8.com/ios-filled/50/00baa4/upload-to-cloud.png" width="24" height="24" alt="Upload" />
);

const TrophyIcon = () => (
  <Img src="https://img.icons8.com/ios-filled/50/00baa4/trophy.png" width="24" height="24" alt="Trophy" />
);

export default function WelcomeEmail({
  userName = 'User',
  appName = 'Vault',
  dashboardUrl = '',
  websiteUrl = '',
  githubUrl = 'https://github.com/harshchill/Vault',
  installUrl = '', // Keeping it for compatibility but we won't use it directly in the new layout
}) {
  const safeDashboard = String(dashboardUrl || '').replace(/\/+$/, '');
  const safeWebsite = String(websiteUrl || safeDashboard).replace(/\/+$/, '');
  
  const termsUrl = safeWebsite ? `${safeWebsite}/terms` : '';
  const privacyUrl = safeWebsite ? `${safeWebsite}/privacy` : '';
  const uploadUrl = safeWebsite ? `${safeWebsite}/user/upload` : '';

  return (
    <Html>
      <Head />
      <Preview>Welcome to {appName}! Unlocking past papers to make studying easier.</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img 
              src={safeWebsite && !safeWebsite.includes('localhost') ? `${safeWebsite}/icon-192x192.png` : 'https://raw.githubusercontent.com/harshchill/Vault/main/public/icon-192x192.png'} 
              width="56" 
              height="56" 
              alt={`${appName} Logo`} 
              style={logo} 
            />
            <Text style={brandName}>{appName}</Text>
          </Section>

          {/* Hero */}
          <Section style={heroSection}>
            <Heading style={heading}>
              Welcome aboard, <br />
              <span style={elegantName}>{userName}</span>
            </Heading>
            <Text style={heroText}>
              We&apos;re thrilled to have you here. {appName} is your hub to discover, save, and share academic papers. Let&apos;s make studying smarter, together.
            </Text>
            
            <Section style={buttonGroup}>
              {safeDashboard && (
                <Button style={primaryButton} href={safeDashboard}>
                  Go to Dashboard
                </Button>
              )}
              {installUrl && (
                <Button style={outlineButton} href={installUrl}>
                  Install App
                </Button>
              )}
              {githubUrl && (
                <Button style={outlineButton} href={githubUrl}>
                  GitHub
                </Button>
              )}
            </Section>
          </Section>

          <Hr style={divider} />

          {/* Features */}
          <Section style={featuresSection}>
            <Heading style={subheading}>Here&apos;s what you can do</Heading>
            
            <Row>
              <Column style={iconColumn}>
                <BookIcon />
              </Column>
              <Column style={textColumn}>
                <Text style={featureTitle}>Browse the Library</Text>
                <Text style={featureDescription}>Find and save previous year papers for offline access.</Text>
              </Column>
            </Row>

            <Row>
              <Column style={iconColumn}>
                <UploadIcon />
              </Column>
              <Column style={textColumn}>
                <Text style={featureTitle}>Upload & Contribute</Text>
                <Text style={featureDescription}>Help your juniors by sharing your past semester papers.</Text>
              </Column>
            </Row>

            <Row>
              <Column style={iconColumn}>
                <TrophyIcon />
              </Column>
              <Column style={textColumn}>
                <Text style={featureTitle}>Climb the Leaderboard</Text>
                <Text style={featureDescription}>Earn recognition for your approved paper uploads.</Text>
              </Column>
            </Row>
          </Section>

          {/* Call to Action - Upload */}
          <Section style={uploadCard}>
            <Heading style={uploadCardTitle}>Help the community grow</Heading>
            <Text style={uploadCardText}>
              The best way to start is by contributing. Upload your past papers today to help out your juniors.
            </Text>
            {uploadUrl && (
              <Button style={secondaryButton} href={uploadUrl}>
                Upload a Paper Now
              </Button>
            )}
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Hr style={divider} />
            <Text style={footerLinks}>
              {termsUrl && <><Link href={termsUrl} style={footerLink}>Terms & Conditions</Link> • </>}
              {privacyUrl && <><Link href={privacyUrl} style={footerLink}>Privacy Policy</Link> • </>}
              {githubUrl && <Link href={githubUrl} style={footerLink}>GitHub</Link>}
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} {appName}. Built with precision.
            </Text>
            <Text style={footerAddress}>
              Satna, Madhya Pradesh, India
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#F8FAFC',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  padding: '40px 0',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px',
  maxWidth: '600px',
  borderRadius: '16px',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
  border: '1px solid #E2E8F0',
};

const header = {
  textAlign: 'center',
  marginBottom: '32px',
};

const logo = {
  margin: '0 auto',
  borderRadius: '12px',
  border: '2px solid #F1F5F9',
};

const brandName = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#00BAA4',
  marginTop: '16px',
  marginBottom: '0',
  letterSpacing: '-0.5px',
};

const heroSection = {
  textAlign: 'center',
  marginBottom: '32px',
};

const heading = {
  fontSize: '26px',
  fontWeight: '800',
  color: '#0F172A',
  margin: '0 0 16px',
  letterSpacing: '-0.5px',
};

const elegantName = {
  fontFamily: '"Playfair Display", "Baskerville", "Georgia", serif',
  fontStyle: 'italic',
  color: '#00BAA4',
  fontWeight: '800',
  fontSize: '32px',
  display: 'inline-block',
  marginTop: '8px',
};

const heroText = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#475569',
  margin: '0 0 24px',
};

const buttonGroup = {
  textAlign: 'center',
  marginTop: '8px',
};

const primaryButton = {
  backgroundColor: '#00BAA4',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '12px 24px',
  margin: '0 4px 8px 4px',
  boxShadow: '0 4px 12px rgba(0, 186, 164, 0.2)',
};

const outlineButton = {
  backgroundColor: '#ffffff',
  border: '1px solid #E2E8F0',
  borderRadius: '8px',
  color: '#475569',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '11px 24px',
  margin: '0 4px 8px 4px',
};

const divider = {
  borderColor: '#E2E8F0',
  margin: '32px 0',
};

const featuresSection = {
  marginBottom: '32px',
};

const subheading = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#0F172A',
  margin: '0 0 24px',
};

const iconColumn = {
  width: '40px',
  verticalAlign: 'top',
  paddingBottom: '24px',
};

const textColumn = {
  verticalAlign: 'top',
  paddingBottom: '24px',
};

const featureTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#0F172A',
  margin: '0 0 4px',
};

const featureDescription = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#475569',
  margin: '0',
};

const uploadCard = {
  backgroundColor: '#F0FDFB',
  borderRadius: '12px',
  padding: '32px 24px',
  textAlign: 'center',
  border: '1px solid #CCFBF3',
  marginBottom: '32px',
};

const uploadCardTitle = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#00BAA4',
  margin: '0 0 12px',
};

const uploadCardText = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#0F172A',
  margin: '0 0 20px',
};

const secondaryButton = {
  backgroundColor: '#ffffff',
  border: '1px solid #00BAA4',
  borderRadius: '8px',
  color: '#00BAA4',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '12px 24px',
};

const footer = {
  textAlign: 'center',
};

const footerLinks = {
  fontSize: '14px',
  color: '#64748B',
  marginBottom: '16px',
};

const footerLink = {
  color: '#64748B',
  textDecoration: 'underline',
};

const footerText = {
  fontSize: '14px',
  color: '#94A3B8',
  margin: '0 0 8px',
};

const footerAddress = {
  fontSize: '12px',
  color: '#CBD5E1',
  margin: '0',
};

