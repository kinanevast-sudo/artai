'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Zap, Sparkles, Calendar, ChartBar as BarChart2, Bot, Image, Users, Check, Star, Menu, X, ArrowRight, Play, Shield, Clock, TrendingUp, Globe } from 'lucide-react'
import {
  InstagramIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  TikTokIcon,
} from '@/components/ui/platform-icons'
import { Button } from '@/components/ui/button'

function useScrolled() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return scrolled
}

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return { ref, visible }
}

function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const { ref, visible } = useFadeIn()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

const features = [
  {
    icon: Sparkles,
    title: 'AI Content Writer',
    description:
      "Generate scroll-stopping captions, hashtags, and post ideas powered by GPT-4. Beat writer's block forever.",
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
  {
    icon: Calendar,
    title: 'Multi-Platform Scheduling',
    description:
      'Schedule posts across Instagram, Facebook, Twitter/X, LinkedIn, and TikTok simultaneously from one dashboard.',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: BarChart2,
    title: 'Smart Analytics',
    description:
      'Deep performance insights with competitor tracking, audience analysis, and exportable reports.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    icon: Bot,
    title: 'Auto-Reply Bot',
    description:
      '24/7 AI-powered comment and DM responses keep your audience engaged even while you sleep.',
    color: 'text-sky-500',
    bg: 'bg-sky-50 dark:bg-sky-900/20',
  },
  {
    icon: Image,
    title: 'Media Library',
    description:
      'Organize all your photos, videos, and graphics in a cloud media library accessible across your team.',
    color: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Multi-user workspaces with role-based permissions, approval workflows, and activity logs.',
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
  },
]

const platforms = [
  {
    name: 'Instagram',
    Icon: InstagramIcon,
    bg: 'bg-gradient-to-br from-pink-500 to-rose-500',
  },
  {
    name: 'Facebook',
    Icon: FacebookIcon,
    bg: 'bg-blue-600',
  },
  {
    name: 'Twitter / X',
    Icon: TwitterIcon,
    bg: 'bg-gray-900',
  },
  {
    name: 'LinkedIn',
    Icon: LinkedinIcon,
    bg: 'bg-sky-700',
  },
  {
    name: 'TikTok',
    Icon: TikTokIcon,
    bg: 'bg-gray-900',
  },
]

const steps = [
  {
    number: '01',
    title: 'Connect Your Accounts',
    description:
      'Link all your social profiles in under 2 minutes. We support OAuth for secure, instant connection without storing your passwords.',
    icon: Globe,
  },
  {
    number: '02',
    title: 'Create Content with AI',
    description:
      'Use our AI writer to generate platform-optimized posts, captions, and hashtags tailored to your brand voice and audience.',
    icon: Sparkles,
  },
  {
    number: '03',
    title: 'Schedule and Analyze',
    description:
      'Queue posts for optimal times, watch your metrics grow, and iterate with data-driven insights from your dashboard.',
    icon: TrendingUp,
  },
]

const testimonials = [
  {
    quote:
      'SocialAI cut our content creation time by 70%. The AI writer knows our brand voice better than some of our team members. Absolute game-changer.',
    name: 'Sarah Chen',
    role: 'Head of Marketing',
    company: 'Stride Ventures',
    rating: 5,
    initial: 'SC',
    color: 'bg-blue-500',
  },
  {
    quote:
      'We went from 12K to 87K followers in 6 months after switching to SocialAI. The analytics alone are worth 10x the price. Cannot imagine going back.',
    name: 'Marcus Williams',
    role: 'Founder & CEO',
    company: 'NovaBrand Co.',
    rating: 5,
    initial: 'MW',
    color: 'bg-emerald-500',
  },
  {
    quote:
      'Managing 8 brand accounts used to require a team of 4. Now I handle everything solo with SocialAI. The auto-reply bot is incredibly smart.',
    name: 'Priya Nair',
    role: 'Social Media Director',
    company: 'Pinnacle Agency',
    rating: 5,
    initial: 'PN',
    color: 'bg-rose-500',
  },
]

const plans = [
  {
    name: 'Trial',
    price: 'Free',
    period: '14 days',
    description: 'Perfect for exploring what SocialAI can do.',
    popular: false,
    features: [
      '1 social account',
      '30 posts per month',
      'Basic scheduling',
      'Standard analytics',
      'Email support',
      '5 GB media storage',
    ],
    cta: 'Start Free Trial',
    highlight: false,
  },
  {
    name: 'Basic',
    price: '$9',
    period: '/month',
    description: 'Great for creators and small businesses.',
    popular: false,
    features: [
      '3 social accounts',
      '100 posts per month',
      'AI writer (100 credits/mo)',
      'Advanced scheduling',
      'Full analytics suite',
      '20 GB media storage',
      'Priority email support',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For growing teams that need more power.',
    popular: true,
    features: [
      '10 social accounts',
      'Unlimited posts',
      'Unlimited AI credits',
      'Auto-reply bot',
      'Competitor tracking',
      '100 GB media storage',
      'Team collaboration (5 users)',
      'Live chat support',
    ],
    cta: 'Get Started',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/month',
    description: 'For agencies and large organizations.',
    popular: false,
    features: [
      'Unlimited social accounts',
      'Unlimited posts',
      'Unlimited AI credits',
      'Custom AI voice training',
      'White-label reports',
      'Unlimited media storage',
      'Unlimited team members',
      'Dedicated account manager',
      'SLA & uptime guarantee',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
]

export default function LandingPage() {
  const scrolled = useScrolled()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <div
      className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
      style={{ scrollBehavior: 'smooth' }}
    >
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <span className="text-gray-900 dark:text-white">SocialAI</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Testimonials
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2"
              >
                Log in
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Start Free Trial
                  <ArrowRight size={14} />
                </Button>
              </Link>
            </div>

            <button
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 px-4 py-4 space-y-3">
            <a
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Features
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Testimonials
            </a>
            <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-2">
              <Link href="/login">
                <Button variant="outline" className="w-full justify-center" size="md">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button className="w-full justify-center" size="md">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-gray-950 dark:via-gray-950 dark:to-blue-950/30" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-100/40 dark:bg-sky-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="absolute top-24 right-16 hidden lg:flex flex-col gap-3 opacity-70">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md border border-gray-100 dark:border-gray-700">
            <InstagramIcon size={16} className="text-pink-500" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Instagram</span>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md border border-gray-100 dark:border-gray-700 ml-6">
            <TikTokIcon size={16} className="text-gray-900 dark:text-gray-100" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">TikTok</span>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md border border-gray-100 dark:border-gray-700 ml-2">
            <LinkedinIcon size={16} className="text-sky-700" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">LinkedIn</span>
          </div>
        </div>

        <div className="absolute top-40 left-10 hidden lg:flex flex-col gap-3 opacity-60">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md border border-gray-100 dark:border-gray-700">
            <FacebookIcon size={16} className="text-blue-600" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Facebook</span>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md border border-gray-100 dark:border-gray-700 ml-8">
            <TwitterIcon size={16} className="text-gray-900 dark:text-gray-100" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Twitter / X</span>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-full px-4 py-1.5 mb-6">
            <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 tracking-wide uppercase">
              Powered by GPT-4
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
            Schedule{' '}
            <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
              smarter
            </span>
            .<br />
            Grow faster.
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The AI-powered social media management platform that helps you create, schedule, and
            analyze content across all major platforms — so you can focus on what matters.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/register">
              <Button size="lg" className="text-base px-8 py-3.5">
                Start Free Trial
                <ArrowRight size={18} />
              </Button>
            </Link>
            <button className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors group">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <Play size={14} className="text-gray-800 dark:text-gray-200 ml-0.5" />
              </div>
              See Demo
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { label: 'Brands trust us', value: '10,000+' },
              { label: 'Posts scheduled', value: '50M+' },
              { label: 'User rating', value: '4.9/5' },
              { label: 'Uptime', value: '99.9%' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 md:py-28 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to dominate social
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Stop juggling multiple tools. SocialAI brings your entire social media workflow into
              one intelligent platform.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 80}>
                <div className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <div
                    className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-5`}
                  >
                    <feature.icon size={22} className={feature.color} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Works with your favorite platforms
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
              Manage every major social network from one unified dashboard.
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              {platforms.map((platform) => (
                <div key={platform.name} className="flex flex-col items-center gap-3 group">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 ${platform.bg} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <platform.Icon size={32} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {platform.name}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Up and running in minutes
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              No complex setup. No developer required. Just connect, create, and grow.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-800 to-transparent" />
            {steps.map((step, i) => (
              <FadeIn key={step.number} delay={i * 120}>
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/40">
                      <step.icon size={26} className="text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white dark:bg-gray-900 border-2 border-blue-600 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">{i + 1}</span>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-blue-500 tracking-widest uppercase mb-2">
                    Step {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by 10,000+ teams
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Don't take our word for it. Here's what real users have to say.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 100}>
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={16} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6 flex-1">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}
                    >
                      {t.initial}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white text-sm">
                        {t.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {t.role} · {t.company}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 md:py-28 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Start free. No credit card required. Upgrade anytime as your business grows.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
            {plans.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 80}>
                <div
                  className={`relative rounded-2xl border p-6 flex flex-col h-full ${
                    plan.highlight
                      ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-200 dark:shadow-blue-900/40 scale-105'
                      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="bg-amber-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3
                      className={`text-base font-semibold mb-1 ${
                        plan.highlight ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <div className="flex items-end gap-1 mb-2">
                      <span
                        className={`text-4xl font-extrabold ${
                          plan.highlight ? 'text-white' : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span
                          className={`text-sm mb-1.5 ${
                            plan.highlight ? 'text-blue-200' : 'text-gray-400'
                          }`}
                        >
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-sm ${
                        plan.highlight ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            plan.highlight ? 'bg-blue-500' : 'bg-blue-50 dark:bg-blue-900/30'
                          }`}
                        >
                          <Check
                            size={10}
                            className={
                              plan.highlight ? 'text-white' : 'text-blue-600 dark:text-blue-400'
                            }
                          />
                        </div>
                        <span
                          className={
                            plan.highlight ? 'text-blue-50' : 'text-gray-600 dark:text-gray-300'
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/register" className="block">
                    <button
                      className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                        plan.highlight
                          ? 'bg-white text-blue-600 hover:bg-blue-50'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={200}>
            <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-8">
              All plans include SSL security, GDPR compliance, and 24/7 infrastructure monitoring.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-800/30 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6">
              <Shield size={14} className="text-blue-200" />
              <span className="text-xs font-semibold text-blue-100 tracking-wide uppercase">
                No credit card required
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              Ready to grow your social media?
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
              Join 10,000+ brands already using SocialAI. Start your free 14-day trial today — no
              commitments, cancel anytime.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <button className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl text-base transition-colors duration-200 flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight size={18} />
                </button>
              </Link>
              <div className="flex items-center gap-2 text-blue-200 text-sm">
                <Clock size={14} />
                <span>14 days free · No credit card</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <footer className="bg-gray-950 dark:bg-black text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap size={18} className="text-white" />
                </div>
                <span className="text-white">SocialAI</span>
              </Link>
              <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
                The smartest way to manage your social media presence across every major platform.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <a
                  href="#"
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                >
                  <TwitterIcon size={15} className="text-gray-400" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon size={15} className="text-gray-400" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon size={15} className="text-gray-400" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                {['Features', 'Pricing', 'Changelog', 'Roadmap', 'API'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                {['About', 'Blog', 'Careers', 'Press', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    GDPR
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">© 2024 SocialAI. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-gray-600" />
              <span className="text-xs text-gray-600 font-medium">CCPA & PIPEDA Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
