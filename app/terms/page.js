const baseUrl = "https://paper-vault.app";

export const metadata = {
  title: "Terms and Conditions",
  description:
    "Read Vault's Terms and Conditions governing platform usage, user-uploaded content, legal compliance, and dispute handling.",
  alternates: {
    canonical: "/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "article",
    url: `${baseUrl}/terms`,
    title: "Terms and Conditions | Vault",
    description:
      "Understand the Terms and Conditions for using paper-vault.app, including user responsibilities and content rules.",
    siteName: "Vault",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms and Conditions | Vault",
    description:
      "Understand the Terms and Conditions for using paper-vault.app, including user responsibilities and content rules.",
  },
};

const listClass = "list-disc pl-6 space-y-2 text-slate-700";

export default function TermsPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-10 space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold tracking-widest text-teal-600 uppercase">Vault</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Terms and Conditions of Use</h1>
          <p className="text-slate-600">paper-vault.app</p>
          <p className="text-sm text-slate-600 font-medium">
            Effective Date: April 25, 2025 | Last Updated: April 25, 2025
          </p>
        </header>

        <p className="text-slate-700 leading-relaxed">
          Please read these Terms and Conditions carefully before using the Vault Platform. By
          accessing or using the Platform, you agree to be bound by these Terms. If you do not agree,
          do not use the Platform.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">1. About Vault</h2>
          <p className="text-slate-700 leading-relaxed">
            Vault (&quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a community-driven educational platform
            accessible at https://paper-vault.app that enables students to access, browse, and upload
            previous year and previous semester examination papers. Vault does not create, own, or
            publish any examination papers. All content on the Platform is user-generated.
          </p>
          <p className="text-slate-700 leading-relaxed">
            These Terms constitute a legally binding agreement between you (&quot;User&quot;, &quot;you&quot;) and Vault,
            governed by the laws of the Republic of India.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">2. Eligibility</h2>
          <p className="text-slate-700 leading-relaxed">
            By using the Platform, you represent and warrant that:
          </p>
          <ul className={listClass}>
            <li>You are at least 13 years of age.</li>
            <li>
              You have the legal capacity to enter into a binding agreement under the Indian Contract
              Act, 1872.
            </li>
            <li>You are accessing the Platform for lawful educational purposes only.</li>
            <li>All information you provide during registration is accurate and truthful.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">3. Account Registration</h2>
          <ul className={listClass}>
            <li>You must create an account to access certain features of the Platform.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You are responsible for all activity that occurs under your account.</li>
            <li>
              You must notify us immediately of any unauthorised use of your account at
              legal@paper-vault.app.
            </li>
            <li>
              We reserve the right to terminate accounts at our sole discretion for violation of
              these Terms.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            4. User-Generated Content - Core Legal Framework
          </h2>
          <p className="text-slate-700 leading-relaxed">
            Vault is an intermediary as defined under Section 2(1)(w) of the Information Technology
            Act, 2000. All examination papers and documents on the Platform are uploaded exclusively
            by users. Vault does not own, verify, create, or endorse any user-uploaded content.
          </p>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">4.1 Your Representations When Uploading</h3>
            <p className="text-slate-700 leading-relaxed">
              By uploading any content to the Platform, you represent, warrant, and undertake that:
            </p>
            <ul className={listClass}>
              <li>
                The content is an examination paper from an educational institution and is being
                shared for bona fide educational and reference purposes.
              </li>
              <li>
                The content does not infringe any copyright, trademark, privacy right, or any other
                intellectual property or proprietary right of any third party.
              </li>
              <li>
                To the best of your knowledge, the content qualifies as fair dealing under Section 52
                of the Copyright Act, 1957 (India), including for purposes of research, private
                study, or reporting.
              </li>
              <li>
                The content does not contain any personal data of individuals that would violate
                applicable privacy laws.
              </li>
              <li>
                The content is not defamatory, obscene, threatening, discriminatory, or otherwise
                unlawful.
              </li>
              <li>
                You are the sole uploader and the content is not a duplicate of existing content on
                the Platform.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">4.2 Licence Granted to Vault</h3>
            <p className="text-slate-700 leading-relaxed">
              By uploading content, you grant Vault a non-exclusive, worldwide, royalty-free,
              sublicensable licence to host, store, display, distribute, and make the content
              available to registered users of the Platform for educational purposes. This licence
              continues until the content is removed from the Platform.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">4.3 Vault&apos;s Intermediary Protection</h3>
            <p className="text-slate-700 leading-relaxed">
              Vault shall not be liable for any third-party content uploaded by users, provided
              Vault:
            </p>
            <ul className={listClass}>
              <li>Does not initiate the transmission of user-uploaded content.</li>
              <li>Does not select the receiver of the content.</li>
              <li>Does not modify the content.</li>
              <li>
                Acts expeditiously to remove or disable access to content upon receiving actual
                knowledge of unlawfulness or a valid court order.
              </li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              This protection is consistent with Section 79 of the IT Act, 2000 and the Information
              Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021
              (&quot;Intermediary Guidelines&quot;).
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">4.4 Content Moderation</h3>
            <p className="text-slate-700 leading-relaxed">
              All content uploaded by users is subject to review and approval by Platform
              administrators before becoming visible to other users. Vault reserves the right to
              reject, remove, or restrict access to any content at any time, including without prior
              notice, if Vault forms a reasonable belief that the content is unlawful, violates these
              Terms, or has been validly reported.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">5. Prohibited Conduct</h2>
          <p className="text-slate-700 leading-relaxed">You agree not to use the Platform to:</p>
          <ul className={listClass}>
            <li>
              Upload, share, or distribute content that infringes any intellectual property rights,
              including copyright, under the Copyright Act, 1957.
            </li>
            <li>
              Upload personal examination scripts, answer sheets, or any content containing the
              personal data of students or individuals.
            </li>
            <li>
              Reverse engineer, scrape, crawl, or extract data from the Platform using automated
              tools without written permission.
            </li>
            <li>Create fake accounts, manipulate leaderboards, or abuse referral programmes.</li>
            <li>
              Upload malicious code, viruses, or any content designed to disrupt the Platform.
            </li>
            <li>Impersonate any person, institution, or university.</li>
            <li>Use the Platform for any commercial purpose other than as expressly permitted.</li>
            <li>Circumvent any security measure or access control on the Platform.</li>
            <li>
              Upload content that is obscene, pornographic, defamatory, threatening, or promotes
              hatred or discrimination contrary to the Indian Penal Code or applicable law.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">6. Intellectual Property</h2>
          <p className="text-slate-700 leading-relaxed">
            The Vault brand, logo, design, software, and Platform infrastructure are owned by Vault
            and protected under applicable Indian intellectual property laws. No content on the
            Platform owned by Vault may be reproduced, distributed, or used without express written
            permission.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Vault does not claim ownership of user-uploaded content. Respective uploaders retain
            ownership of content they upload, subject to the licence granted in Section 4.2.
          </p>
          <p className="text-slate-700 leading-relaxed">
            If you believe content on the Platform infringes your copyright, please submit a takedown
            request to legal@paper-vault.app with the following information: (a) your contact
            details; (b) identification of the allegedly infringing content; (c) a statement that
            you have a good faith belief the use is unauthorised; (d) your signature.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">7. Disclaimer of Warranties</h2>
          <p className="text-slate-700 leading-relaxed font-semibold uppercase">
            The platform is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of
            any kind, either express or implied. Vault does not warrant that the platform will be
            uninterrupted, error-free, or free of viruses. Vault does not verify the accuracy,
            completeness, or relevance of any user-uploaded examination paper.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Use of examination papers on the Platform is at your own risk. Vault strongly recommends
            verifying the authenticity and currency of any paper with your educational institution.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">8. Limitation of Liability</h2>
          <p className="text-slate-700 leading-relaxed">
            To the maximum extent permitted by applicable Indian law:
          </p>
          <ul className={listClass}>
            <li>
              Vault shall not be liable for any indirect, incidental, special, consequential, or
              punitive damages arising from your use of the Platform or reliance on user-uploaded
              content.
            </li>
            <li>
              Vault&apos;s total aggregate liability for any direct damages shall not exceed INR 1,000
              (Rupees One Thousand Only).
            </li>
            <li>
              Vault is not liable for any loss or damage caused by user-uploaded content, including
              copyright infringement claims arising from such content.
            </li>
          </ul>
          <p className="text-slate-700 leading-relaxed">
            Nothing in this clause limits liability for death, personal injury, or fraud caused by
            Vault&apos;s negligence, or any liability that cannot be excluded under applicable Indian law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">9. Indemnification</h2>
          <p className="text-slate-700 leading-relaxed">
            You agree to indemnify, defend, and hold harmless Vault and its officers, directors,
            employees, and agents from and against any claims, liabilities, damages, losses, and
            expenses (including reasonable legal fees) arising out of or in any way connected with:
          </p>
          <ul className={listClass}>
            <li>Your access to or use of the Platform.</li>
            <li>Any content you upload to the Platform.</li>
            <li>Your violation of these Terms.</li>
            <li>Your violation of any applicable law or third-party right.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">10. Reporting Violations</h2>
          <p className="text-slate-700 leading-relaxed">
            The Platform provides a Report function on all uploaded content. Users are encouraged to
            report:
          </p>
          <ul className={listClass}>
            <li>Content that they believe infringes their copyright or another&apos;s copyright.</li>
            <li>Duplicate or spam content.</li>
            <li>Content that appears to contain personal information of individuals.</li>
            <li>Content that is obscene, unlawful, or harmful.</li>
          </ul>
          <p className="text-slate-700 leading-relaxed">
            Vault will review all reports and take appropriate action in accordance with its content
            moderation policy and the Intermediary Guidelines, 2021. Vault shall respond to valid
            takedown orders from competent courts or government authorities within the timeframes
            prescribed by law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">11. Termination</h2>
          <p className="text-slate-700 leading-relaxed">
            Vault reserves the right to suspend or terminate your account and access to the Platform
            at any time, with or without notice, for:
          </p>
          <ul className={listClass}>
            <li>Violation of these Terms.</li>
            <li>
              Conduct that Vault reasonably believes is harmful to other users, the Platform, or
              third parties.
            </li>
            <li>Repeated uploading of content that is reported and found to be in violation.</li>
            <li>Any reason at Vault&apos;s sole discretion.</li>
          </ul>
          <p className="text-slate-700 leading-relaxed">
            Upon termination, your right to use the Platform ceases immediately. Provisions of these
            Terms that by their nature should survive termination shall do so, including Sections 4,
            6, 7, 8, 9, and 13.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">12. Governing Law &amp; Dispute Resolution</h2>
          <p className="text-slate-700 leading-relaxed">
            These Terms are governed by and construed in accordance with the laws of the Republic of
            India. Any dispute arising out of or relating to these Terms or the Platform shall be
            subject to the exclusive jurisdiction of the courts located in India.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Before initiating legal proceedings, parties agree to attempt resolution through good
            faith negotiation for a period of 30 days from written notice of the dispute.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">13. Compliance with Indian Law</h2>
          <p className="text-slate-700 leading-relaxed">
            Vault complies with its obligations as an intermediary under:
          </p>
          <ul className={listClass}>
            <li>Information Technology Act, 2000 (Sections 67, 67A, 67B, 79).</li>
            <li>
              Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules,
              2021.
            </li>
            <li>Copyright Act, 1957.</li>
            <li>Digital Personal Data Protection Act, 2023.</li>
            <li>Consumer Protection Act, 2019 (where applicable).</li>
          </ul>
          <p className="text-slate-700 leading-relaxed">
            Vault shall designate a Grievance Officer in compliance with Rule 3(2) of the
            Intermediary Guidelines, 2021. Contact details are provided in Section 14.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">14. Grievance Officer</h2>
          <p className="text-slate-700 leading-relaxed">
            In accordance with the Intermediary Guidelines, 2021, and the DPDP Act, 2023, our
            Grievance Officer details are:
          </p>
          <ul className={listClass}>
            <li>Name: Grievance Officer, Vault</li>
            <li>Email: legal@paper-vault.app</li>
            <li>Jurisdiction: India</li>
            <li>
              Response Time: Complaints acknowledged within 48 hours; resolved within 30 days (15
              days for IT Act-related complaints).
            </li>
          </ul>
          <p className="text-slate-700 leading-relaxed">
            If you are not satisfied with our response, you may approach the Data Protection Board of
            India or a court of competent jurisdiction.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">15. Modifications to Terms</h2>
          <p className="text-slate-700 leading-relaxed">
            Vault reserves the right to modify these Terms at any time. Modified Terms will be posted
            on the Platform with a revised effective date. Continued use of the Platform after
            posting of modified Terms constitutes your acceptance of the modified Terms. Material
            changes will be communicated to registered users via email.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">16. Miscellaneous</h2>
          <div className="space-y-3">
            <p className="text-slate-700 leading-relaxed">
              <span className="font-semibold">Severability:</span> If any provision of these Terms is
              held invalid or unenforceable, the remaining provisions shall continue in full force
              and effect.
            </p>
            <p className="text-slate-700 leading-relaxed">
              <span className="font-semibold">Entire Agreement:</span> These Terms, together with the
              Privacy Policy, constitute the entire agreement between you and Vault regarding your use
              of the Platform.
            </p>
            <p className="text-slate-700 leading-relaxed">
              <span className="font-semibold">Waiver:</span> Vault&apos;s failure to enforce any right or
              provision of these Terms shall not constitute a waiver of such right or provision.
            </p>
            <p className="text-slate-700 leading-relaxed">
              <span className="font-semibold">Assignment:</span> You may not assign your rights under
              these Terms without Vault&apos;s written consent. Vault may assign its rights without
              restriction.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">17. Contact</h2>
          <p className="text-slate-700 leading-relaxed">
            For any questions about these Terms, contact us at:
          </p>
          <p className="text-slate-700 leading-relaxed font-medium">support@paper-vault.app</p>
          <p className="text-slate-700 leading-relaxed">Vault Platform | https://paper-vault.app</p>
        </section>
      </div>
    </div>
  );
}
