import Link from 'next/link'
import { Zap, ArrowLeft, Shield } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy - SocialAI',
  description: 'Learn how SocialAI collects, uses, and protects your personal information.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
        {title}
      </h2>
      <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
        {children}
      </div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap size={15} className="text-white" />
            </div>
            <span className="text-gray-900 dark:text-white">SocialAI</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={15} />
            Back to home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Shield size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              Legal
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Effective date: January 1, 2024 · Last updated: January 1, 2024
          </p>
        </div>

        <Section title="1. Introduction">
          <p>
            SocialAI ("we," "our," or "us") is committed to protecting your privacy. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your information when you
            use our social media management platform, website, and related services (collectively,
            the "Service").
          </p>
          <p>
            Please read this policy carefully. By accessing or using the Service, you agree to the
            collection and use of information in accordance with this policy. If you do not agree
            with the terms of this Privacy Policy, please do not access the Service.
          </p>
          <p>
            This policy applies to all users of SocialAI, including visitors to our website,
            registered account holders, and paying subscribers.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>
            We collect several types of information in connection with the Service:
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Account Information:</strong> When
            you register, we collect your name, email address, password (stored as a hashed value),
            company name, and billing information such as credit card details (processed securely
            via our payment processor, Stripe).
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Social Media Data:</strong> To
            provide the Service, we access data from the social media accounts you connect,
            including your posts, comments, messages, follower counts, engagement metrics, and
            profile information. We only access data necessary to provide the Service features you
            use.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Usage Data:</strong> We
            automatically collect information about how you interact with the Service, including
            pages visited, features used, time spent, click patterns, and error logs. This data is
            collected through cookies, log files, and similar tracking technologies.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Device Information:</strong> We
            collect information about the devices you use to access the Service, including IP
            address, browser type and version, operating system, device identifiers, and referring
            URLs.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Communications:</strong> If you
            contact us via email or support channels, we retain copies of those communications,
            including any information you provide.
          </p>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use the information we collect for the following purposes:</p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Providing the Service:</strong>{' '}
            To operate, maintain, and improve the Service; authenticate users; process transactions;
            send scheduled posts to social media platforms on your behalf; and generate analytics
            reports.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">AI Features:</strong> Content you
            submit to our AI writing tools may be processed by our AI model providers (including
            OpenAI) to generate responses. We do not use your content to train AI models without
            explicit consent.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Communications:</strong> To send
            transactional emails (receipts, security alerts, password resets), product updates, and
            marketing communications. You may opt out of marketing emails at any time via the
            unsubscribe link.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Analytics and Improvement:</strong>{' '}
            To understand usage patterns, diagnose technical issues, and improve our product through
            aggregated and anonymized analysis.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Legal Compliance:</strong> To
            comply with applicable laws, respond to legal requests, enforce our Terms of Service,
            and protect the rights, property, or safety of SocialAI, our users, or others.
          </p>
        </Section>

        <Section title="4. Data Sharing and Disclosure">
          <p>
            We do not sell your personal information to third parties. We may share your information
            in the following circumstances:
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Service Providers:</strong> We
            engage trusted third-party service providers to perform functions on our behalf,
            including cloud hosting (AWS), payment processing (Stripe), email delivery (SendGrid),
            analytics (Mixpanel), and customer support (Intercom). These providers are contractually
            obligated to use your data only to provide services to us.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Social Platforms:</strong> When
            you connect social accounts, we share data with those platforms as required to post
            content, retrieve metrics, and use their APIs. Your use is also subject to those
            platforms' own privacy policies.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Business Transfers:</strong> In
            the event of a merger, acquisition, reorganization, or sale of assets, your information
            may be transferred. We will provide notice before your information is transferred and
            subject to a different privacy policy.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Legal Requirements:</strong> We
            may disclose your information if required by law, court order, or governmental authority,
            or if we believe disclosure is necessary to protect our rights or the safety of others.
          </p>
        </Section>

        <Section title="5. Data Security">
          <p>
            We implement industry-standard security measures to protect your personal information,
            including:
          </p>
          <p>
            All data transmitted between your browser and our servers is encrypted using TLS 1.2 or
            higher. Data at rest is encrypted using AES-256. We maintain SOC 2 Type II compliance
            and conduct regular security audits. Access to personal data is restricted to authorized
            personnel on a need-to-know basis. We maintain a vulnerability disclosure program and
            respond to security reports within 72 hours.
          </p>
          <p>
            Despite these measures, no method of transmission over the internet or electronic
            storage is 100% secure. We cannot guarantee absolute security, and you use the Service
            at your own risk. If you believe your account has been compromised, please contact us
            immediately at security@socialai.com.
          </p>
        </Section>

        <Section title="6. Your Rights (CCPA & PIPEDA)">
          <p>
            Depending on your jurisdiction, you may have certain rights regarding your personal
            information:
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">
              California Residents (CCPA):
            </strong>{' '}
            You have the right to know what personal information we collect and how it is used; the
            right to request deletion of your personal information; the right to opt out of the sale
            of personal information (we do not sell personal information); and the right to
            non-discrimination for exercising your privacy rights. To submit a CCPA request, email
            privacy@socialai.com with the subject line "CCPA Request."
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">
              Canadian Residents (PIPEDA):
            </strong>{' '}
            Under Canada's Personal Information Protection and Electronic Documents Act, you have
            the right to access your personal information, correct inaccurate information, withdraw
            consent where applicable, and file a complaint with the Office of the Privacy
            Commissioner of Canada. To exercise these rights, contact privacy@socialai.com.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">All Users:</strong> You may
            access, update, or delete your account information at any time through your account
            settings. Account deletion requests will be processed within 30 days. Certain data may
            be retained for legal compliance purposes as outlined in this policy.
          </p>
        </Section>

        <Section title="7. Cookies and Tracking Technologies">
          <p>
            We use cookies and similar tracking technologies to enhance your experience on the
            Service. Cookies are small files stored on your device that help us remember your
            preferences, authenticate sessions, and analyze usage.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Essential Cookies:</strong> Required
            for the Service to function. These cannot be disabled without impairing your ability to
            use the Service.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Analytics Cookies:</strong> Help us
            understand how users interact with the Service. We use tools such as Mixpanel and Google
            Analytics. You may opt out by visiting our cookie preferences center or using browser
            settings to block tracking.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Marketing Cookies:</strong> Used to
            deliver relevant advertisements. We do not use third-party advertising cookies on
            authenticated pages.
          </p>
          <p>
            You can control cookies through your browser settings. However, disabling certain
            cookies may affect functionality. For more details, see our Cookie Policy.
          </p>
        </Section>

        <Section title="8. Data Retention">
          <p>
            We retain your personal information for as long as your account is active or as needed
            to provide the Service. After account deletion, we will delete or anonymize your data
            within 30 days, except where we are required to retain it for legal, tax, or regulatory
            purposes (typically up to 7 years for financial records).
          </p>
          <p>
            Aggregated, anonymized analytics data may be retained indefinitely as it cannot be used
            to identify you.
          </p>
        </Section>

        <Section title="9. Contact Us">
          <p>
            If you have questions, concerns, or requests regarding this Privacy Policy or our data
            practices, please contact us:
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">SocialAI Privacy Team</strong>
            <br />
            Email: privacy@socialai.com
            <br />
            Address: 100 Market Street, Suite 300, San Francisco, CA 94105, United States
          </p>
          <p>
            We will respond to all privacy inquiries within 30 days. For urgent security concerns,
            contact security@socialai.com.
          </p>
        </Section>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            © 2024 SocialAI. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400 dark:text-gray-500">
            <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center gap-1">
              <ArrowLeft size={13} />
              Back to home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
