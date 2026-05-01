import Link from 'next/link'
import { Zap, ArrowLeft, FileText } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service - SocialAI',
  description: 'Read the Terms of Service governing your use of the SocialAI platform.',
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

export default function TermsPage() {
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
              <FileText size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              Legal
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
            Terms of Service
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Effective date: January 1, 2024 · Last updated: January 1, 2024
          </p>
        </div>

        <Section title="1. Agreement to Terms">
          <p>
            These Terms of Service ("Terms") constitute a legally binding agreement between you
            ("you," "your," or "User") and SocialAI, Inc. ("SocialAI," "we," "our," or "us")
            governing your access to and use of the SocialAI platform, website, APIs, and all
            related services (collectively, the "Service").
          </p>
          <p>
            By creating an account, clicking "I agree," or otherwise accessing or using the
            Service, you acknowledge that you have read, understood, and agree to be bound by these
            Terms and our Privacy Policy, which is incorporated herein by reference.
          </p>
          <p>
            If you are using the Service on behalf of an organization, you represent and warrant
            that you have authority to bind that organization to these Terms, and "you" refers to
            that organization. If you do not agree to these Terms, you must not access or use the
            Service.
          </p>
          <p>
            We reserve the right to modify these Terms at any time. We will provide notice of
            material changes via email or through the Service at least 30 days before they take
            effect. Continued use after the effective date constitutes acceptance of the revised
            Terms.
          </p>
        </Section>

        <Section title="2. Use of Service">
          <p>
            Subject to these Terms, SocialAI grants you a limited, non-exclusive, non-transferable,
            revocable license to access and use the Service for your internal business or personal
            purposes in accordance with your subscription plan.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Eligibility:</strong> You must be
            at least 18 years of age and capable of forming a binding contract. The Service is not
            directed to children under 13. If you become aware that a child has provided us with
            personal information, please contact us immediately.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Account Responsibility:</strong>{' '}
            You are responsible for maintaining the confidentiality of your account credentials and
            for all activities that occur under your account. You must notify us immediately at
            support@socialai.com if you suspect any unauthorized access or security breach. We are
            not liable for any loss arising from unauthorized use of your credentials.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Acceptable Use:</strong> You agree
            to use the Service only for lawful purposes and in compliance with these Terms,
            applicable laws, and the terms of service of connected social media platforms (including
            Meta, Twitter/X Corp., LinkedIn, and TikTok). You are solely responsible for all
            content you schedule, publish, or otherwise transmit through the Service.
          </p>
        </Section>

        <Section title="3. Subscription and Billing">
          <p>
            SocialAI offers the following subscription plans: Trial (free, 14 days), Basic
            ($9/month), Pro ($29/month), and Enterprise ($99/month). Plan features and limits are
            as described on our pricing page and are subject to change with 30 days' notice.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Free Trial:</strong> New users
            receive a 14-day free trial with Trial plan access. No credit card is required to start
            a trial. At the end of the trial period, your account will be downgraded unless you
            subscribe to a paid plan.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Billing Cycle:</strong> Paid
            subscriptions are billed monthly or annually in advance. Subscriptions automatically
            renew unless cancelled before the renewal date. All fees are in US dollars and are
            non-refundable except as expressly provided herein.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Payment Processing:</strong>{' '}
            Payments are processed by Stripe. By providing payment information, you authorize us to
            charge the applicable fees to your payment method. If a charge fails, we may retry and
            suspend access to the Service until payment is received.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Refunds:</strong> We offer a
            pro-rated refund within 7 days of initial subscription payment if you are unsatisfied
            with the Service. To request a refund, contact billing@socialai.com. Annual plan
            refunds are evaluated on a case-by-case basis.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Price Changes:</strong> We may
            change subscription prices with 30 days' advance notice. Price changes will not affect
            your current billing period.
          </p>
        </Section>

        <Section title="4. Prohibited Activities">
          <p>
            You agree not to engage in any of the following activities in connection with your use
            of the Service:
          </p>
          <p>
            Violating any applicable local, state, national, or international law or regulation;
            infringing the intellectual property, privacy, publicity, or other rights of any third
            party; uploading, transmitting, or distributing content that is unlawful, defamatory,
            obscene, fraudulent, harmful, or otherwise objectionable; using the Service to send
            unsolicited communications (spam) or to engage in phishing or other deceptive
            practices; attempting to gain unauthorized access to the Service, other user accounts,
            or our systems and networks; reverse engineering, decompiling, disassembling, or
            attempting to derive source code from the Service; scraping, crawling, or using
            automated tools to extract data from the Service beyond what is permitted by our API;
            reselling, sublicensing, or otherwise commercializing access to the Service without
            express written authorization; interfering with or disrupting the integrity or
            performance of the Service; creating multiple accounts to circumvent plan limits or
            suspensions; or using the AI features to generate content that is discriminatory,
            hateful, or promotes violence.
          </p>
          <p>
            We reserve the right to investigate violations and take appropriate action, including
            removing content, suspending or terminating accounts, and cooperating with law
            enforcement authorities.
          </p>
        </Section>

        <Section title="5. Intellectual Property">
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Our Intellectual Property:</strong>{' '}
            The Service and its underlying technology, including software, algorithms, user
            interfaces, trademarks, logos, and all related intellectual property, are owned by
            SocialAI or our licensors and are protected by applicable intellectual property laws.
            Nothing in these Terms grants you any right to use our trademarks or branding.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Your Content:</strong> You retain
            all ownership rights in content you create or upload through the Service ("User
            Content"). By using the Service, you grant SocialAI a limited, worldwide, royalty-free
            license to access, store, process, and transmit your User Content solely as necessary
            to provide the Service, including posting content to connected social platforms on your
            behalf.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">AI-Generated Content:</strong>{' '}
            Content generated by our AI features is provided for your use. You are responsible for
            reviewing AI-generated content before publishing and ensuring it does not infringe third-party
            rights. SocialAI makes no warranties regarding the originality or non-infringement of
            AI-generated outputs.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Feedback:</strong> If you provide
            suggestions, ideas, or feedback about the Service, you grant SocialAI the right to use
            such feedback without restriction or compensation to you.
          </p>
        </Section>

        <Section title="6. Termination">
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Termination by You:</strong> You
            may cancel your subscription and close your account at any time through your account
            settings or by contacting support@socialai.com. Cancellation takes effect at the end of
            your current billing period. No refunds are issued for partial periods, except as
            provided in Section 3.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Termination by Us:</strong> We
            reserve the right to suspend or terminate your account, without prior notice or
            liability, for any reason including breach of these Terms, non-payment, fraudulent
            activity, or if we determine it is necessary to protect the Service or other users. In
            cases of serious violations, termination may be immediate.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Effect of Termination:</strong>{' '}
            Upon termination, your right to access the Service ceases immediately. We may delete
            your data within 30 days of termination. You should export any data you need before
            closing your account. Sections 4, 5, 7, 8, and 9 of these Terms survive termination.
          </p>
        </Section>

        <Section title="7. Disclaimer of Warranties">
          <p>
            THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF
            ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
          </p>
          <p>
            SOCIALAI DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE,
            OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. WE DO NOT WARRANT THAT THE RESULTS
            OBTAINED FROM USING THE SERVICE WILL BE ACCURATE, RELIABLE, OR MEET YOUR REQUIREMENTS.
          </p>
          <p>
            YOU UNDERSTAND AND AGREE THAT YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK. ANY CONTENT
            DOWNLOADED OR OTHERWISE OBTAINED THROUGH THE SERVICE IS ACCESSED AT YOUR OWN DISCRETION
            AND RISK.
          </p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL SOCIALAI, ITS
            AFFILIATES, DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY
            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES,
            INCLUDING WITHOUT LIMITATION LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS
            OPPORTUNITIES, ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR YOUR USE OF THE
            SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          </p>
          <p>
            OUR TOTAL CUMULATIVE LIABILITY TO YOU FOR ANY CLAIMS ARISING OUT OF OR RELATED TO
            THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE GREATER OF (A) THE TOTAL FEES PAID BY
            YOU TO SOCIALAI IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM OR (B) ONE HUNDRED US
            DOLLARS ($100).
          </p>
          <p>
            Some jurisdictions do not allow exclusion of certain warranties or limitation of
            liability for certain damages, so some of the above limitations may not apply to you.
            In such jurisdictions, our liability is limited to the greatest extent permitted by law.
          </p>
        </Section>

        <Section title="9. Governing Law and Dispute Resolution">
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State
            of California, United States, without regard to its conflict of law provisions.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Informal Resolution:</strong> Before
            filing any formal legal claim, you agree to attempt to resolve the dispute informally
            by contacting us at legal@socialai.com. We will try to resolve disputes within 30 days.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Arbitration:</strong> Any dispute
            that cannot be resolved informally shall be submitted to binding arbitration administered
            by the American Arbitration Association under its Commercial Arbitration Rules. The
            arbitration will be conducted in San Francisco, California. The arbitrator's decision
            shall be final and binding.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Class Action Waiver:</strong> You
            agree that any arbitration or legal proceeding shall be conducted on an individual basis
            and not as a class, consolidated, or representative action. You waive your right to
            participate in a class action lawsuit.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">Exceptions:</strong> Either party
            may seek injunctive or other equitable relief in any court of competent jurisdiction to
            prevent irreparable harm. For users in Quebec, Canada, disputes are governed by the
            laws of the Province of Quebec.
          </p>
        </Section>

        <Section title="10. Contact Us">
          <p>
            If you have questions about these Terms of Service, please contact us:
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">SocialAI Legal Team</strong>
            <br />
            Email: legal@socialai.com
            <br />
            Address: 100 Market Street, Suite 300, San Francisco, CA 94105, United States
          </p>
          <p>
            For billing inquiries, contact billing@socialai.com. For general support, visit our
            Help Center or email support@socialai.com.
          </p>
        </Section>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            © 2024 SocialAI. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400 dark:text-gray-500">
            <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Privacy Policy
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
