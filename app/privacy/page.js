const baseUrl = "https://paper-vault.app";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Read Vault's Privacy Policy covering data collection, processing, retention, security, and user rights under applicable Indian law.",
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "article",
    url: `${baseUrl}/privacy`,
    title: "Privacy Policy | Vault",
    description:
      "Understand how Vault collects, uses, protects, and shares personal data for the paper-vault.app platform.",
    siteName: "Vault",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Vault",
    description:
      "Understand how Vault collects, uses, protects, and shares personal data for the paper-vault.app platform.",
  },
};

const listClass = "list-disc pl-6 space-y-2 text-slate-700";

export default function PrivacyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-10 space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold tracking-widest text-teal-600 uppercase">Vault</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Privacy Policy</h1>
          <p className="text-slate-600">paper-vault.app</p>
          <p className="text-sm text-slate-600 font-medium">
            Effective Date: April 25, 2025 | Last Updated: April 25, 2025
          </p>
        </header>

        <p className="text-slate-700 leading-relaxed">
          This Privacy Policy is published in compliance with the Information Technology Act, 2000,
          the Information Technology (Reasonable Security Practices and Procedures and Sensitive
          Personal Data or Information) Rules, 2011 (&quot;SPDI Rules&quot;), and the Digital Personal Data
          Protection Act, 2023 (&quot;DPDP Act&quot;), Government of India.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">1. Introduction &amp; Identity of Data Fiduciary</h2>
          <p className="text-slate-700 leading-relaxed">
            Vault (&quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is operated as a digital platform accessible at
            https://paper-vault.app. For the purposes of the Digital Personal Data Protection Act,
            2023, Vault acts as a Data Fiduciary in relation to the personal data collected from users
            of this Platform.
          </p>
          <p className="text-slate-700 leading-relaxed">
            This Privacy Policy describes what data we collect, why we collect it, how we use and
            protect it, and what rights you have as a Data Principal under Indian law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">2. Data We Collect</h2>
          <h3 className="text-lg font-semibold text-slate-900">2.1 Data You Provide Directly</h3>
          <ul className={listClass}>
            <li>Email address and name (on account registration).</li>
            <li>Educational information (university, course, semester) - provided voluntarily.</li>
            <li>Files and documents you upload to the Platform (exam papers, study material).</li>
            <li>Communication you send us (support emails, reports).</li>
          </ul>
          <h3 className="text-lg font-semibold text-slate-900">2.2 Data Collected Automatically</h3>
          <ul className={listClass}>
            <li>IP address, browser type, device type, and operating system.</li>
            <li>Pages visited, time spent, and navigation patterns.</li>
            <li>Referring URLs and search terms used to find our Platform.</li>
            <li>Cookies and similar tracking technologies (see Section 7).</li>
          </ul>
          <h3 className="text-lg font-semibold text-slate-900">2.3 Data We Do NOT Collect</h3>
          <p className="text-slate-700 leading-relaxed">
            We do not collect sensitive personal data such as financial account details, biometric
            data, health information, sexual orientation, or government-issued ID numbers. We do not
            knowingly collect data from persons under 13 years of age.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">3. Purpose &amp; Legal Basis for Processing</h2>
          <p className="text-slate-700 leading-relaxed">
            We process your personal data for the following purposes under the DPDP Act, 2023:
          </p>
          <ul className={listClass}>
            <li>Account creation and authentication - to provide you access to the Platform.</li>
            <li>
              Platform functionality - to enable browsing, uploading, saving, and accessing exam
              papers.
            </li>
            <li>
              Communication - to send you account-related notifications and respond to support
              requests.
            </li>
            <li>
              Safety and compliance - to investigate abuse, enforce our Terms of Service, and comply
              with legal obligations.
            </li>
            <li>
              Analytics and improvement - to understand how users interact with the Platform and
              improve features (processed in aggregate/anonymised form wherever possible).
            </li>
          </ul>
          <p className="text-slate-700 leading-relaxed">
            The legal basis for processing is primarily your consent (obtained at registration) and
            our legitimate interest in operating a lawful, functional educational platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">
            4. User-Generated Content - Critical Disclosure
          </h2>
          <p className="text-slate-700 leading-relaxed">
            IMPORTANT: All exam papers and documents on Vault are uploaded exclusively by users.
            Vault does not create, own, verify, or endorse any content uploaded by users. Vault
            operates as an intermediary platform under Section 79 of the Information Technology Act,
            2000, and is not liable for user-uploaded content provided it acts on notice as required
            by law.
          </p>
          <p className="text-slate-700 leading-relaxed">
            By uploading content to the Platform, you represent that:
          </p>
          <ul className={listClass}>
            <li>
              You have the right to share the content, or the content is in the public domain, or
              fair dealing under Section 52 of the Copyright Act, 1957 applies to the use.
            </li>
            <li>The content does not violate any applicable law or third-party rights.</li>
            <li>
              You grant Vault a non-exclusive, royalty-free licence to host, display, and make the
              content accessible to other registered users on the Platform.
            </li>
          </ul>
          <p className="text-slate-700 leading-relaxed">
            Vault reserves the right to remove content at its sole discretion upon receiving a valid
            complaint or upon forming a reasonable belief that the content is unlawful.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">5. Sharing of Personal Data</h2>
          <p className="text-slate-700 leading-relaxed">
            We do not sell, trade, or rent your personal data to third parties. We may share data in
            the following limited circumstances:
          </p>
          <ul className={listClass}>
            <li>
              Service Providers: Third-party vendors who help us operate the Platform (hosting
              providers, email delivery services, analytics tools) - bound by confidentiality and
              data processing agreements.
            </li>
            <li>
              Legal Compliance: Where required by law, court order, or government authority,
              including responses to valid legal process from Indian authorities.
            </li>
            <li>
              Safety: To protect the rights, safety, or property of Vault, our users, or the public.
            </li>
            <li>
              Business Transfer: In the event of a merger, acquisition, or sale of assets, user data
              may be transferred - users will be notified in advance.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">6. Data Retention</h2>
          <p className="text-slate-700 leading-relaxed">
            We retain your personal data only for as long as necessary for the purposes described in
            this Policy:
          </p>
          <ul className={listClass}>
            <li>
              Account data: Retained for the duration of your account and for 2 years following
              account deletion (for legal compliance purposes).
            </li>
            <li>
              Uploaded content: Retained until removed by admin or upon a valid takedown request.
            </li>
            <li>Usage logs: Retained for up to 90 days for security and debugging purposes.</li>
            <li>
              Legal holds: Retained for longer periods if required by ongoing legal proceedings.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">7. Cookies</h2>
          <p className="text-slate-700 leading-relaxed">
            We use cookies and similar technologies to:
          </p>
          <ul className={listClass}>
            <li>Maintain your session and authentication state.</li>
            <li>Remember your preferences.</li>
            <li>Analyse Platform usage through privacy-respecting analytics tools.</li>
          </ul>
          <p className="text-slate-700 leading-relaxed">
            You may disable cookies through your browser settings; however, this may affect Platform
            functionality. We do not use tracking cookies for advertising purposes at this time.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">8. Data Security</h2>
          <p className="text-slate-700 leading-relaxed">
            We implement reasonable technical and organisational security measures as required under
            the SPDI Rules, 2011, including:
          </p>
          <ul className={listClass}>
            <li>HTTPS encryption for all data in transit.</li>
            <li>Access controls limiting who can access user data internally.</li>
            <li>Periodic review of security practices.</li>
          </ul>
          <p className="text-slate-700 leading-relaxed">
            However, no method of transmission over the internet is 100% secure. In the event of a
            personal data breach that is likely to result in risk to users, we will notify affected
            Data Principals and the Data Protection Board of India as required under the DPDP Act,
            2023.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">9. Your Rights as a Data Principal</h2>
          <p className="text-slate-700 leading-relaxed">
            Under the Digital Personal Data Protection Act, 2023, you have the following rights:
          </p>
          <ul className={listClass}>
            <li>
              Right to Access: Request a summary of your personal data processed by Vault. Email:
              legal@paper-vault.app
            </li>
            <li>
              Right to Correction: Request correction of inaccurate or incomplete personal data.
            </li>
            <li>
              Right to Erasure: Request deletion of your personal data, subject to legal retention
              obligations.
            </li>
            <li>
              Right to Nominate: Nominate an individual to exercise these rights on your behalf in
              the event of your death or incapacity.
            </li>
            <li>
              Right to Grievance Redressal: Lodge a complaint with our Grievance Officer (see
              Section 11) or the Data Protection Board of India.
            </li>
          </ul>
          <p className="text-slate-700 leading-relaxed">
            We will respond to verifiable requests within a reasonable time, not exceeding 30 days.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">10. Cross-Border Data Transfers</h2>
          <p className="text-slate-700 leading-relaxed">
            Our servers and service providers may be located outside India. Any transfer of personal
            data outside India is conducted in compliance with the DPDP Act, 2023, and applicable
            rules notified by the Central Government. By using the Platform, you consent to such
            transfers subject to appropriate safeguards.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">11. Grievance Officer</h2>
          <p className="text-slate-700 leading-relaxed">
            In accordance with the Information Technology Act, 2000 and the DPDP Act, 2023, the
            details of our Grievance Officer are:
          </p>
          <ul className={listClass}>
            <li>Name: Grievance Officer, Vault</li>
            <li>Email: legal@paper-vault.app</li>
            <li>
              Response Time: Complaints will be acknowledged within 48 hours and resolved within 30
              days.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">12. Children&apos;s Privacy</h2>
          <p className="text-slate-700 leading-relaxed">
            The Platform is not directed at children under the age of 13. We do not knowingly
            collect personal data from children under 13. If we become aware that a child under 13
            has provided us personal data, we will promptly delete it. Parents or guardians who
            believe their child has submitted data should contact us at legal@paper-vault.app.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">13. Changes to This Policy</h2>
          <p className="text-slate-700 leading-relaxed">
            We may update this Privacy Policy from time to time. When we do, we will revise the
            &quot;Last Updated&quot; date at the top and, where changes are material, notify registered users
            via email or an in-app notice. Continued use of the Platform after such notice
            constitutes acceptance of the updated Policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">14. Contact Us</h2>
          <p className="text-slate-700 leading-relaxed">
            For any questions about this Privacy Policy, contact us at:
          </p>
          <p className="text-slate-700 leading-relaxed font-medium">support@paper-vault.app</p>
          <p className="text-slate-700 leading-relaxed">Vault Platform | https://paper-vault.app</p>
        </section>
      </div>
    </div>
  );
}
