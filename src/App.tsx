import { useEffect, useRef } from 'react'
import type { MotionValue } from 'framer-motion'
import { motion, useScroll, useTransform } from 'framer-motion'
import Hls from 'hls.js'
import {
  Camera,
  Download,
  LockKeyhole,
  MapPin,
  MessageCircle,
} from 'lucide-react'
import TriverraHero from './components/TriverraHero'

const TESTFLIGHT_URL =
  import.meta.env.VITE_TESTFLIGHT_URL ||
  'https://apps.apple.com/us/app/testflight/id899247664'

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4'
const MISSION_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4'
const SOLUTION_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4'
const CTA_HLS =
  'https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
})

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Place Memory', href: '#place-memory' },
  { label: 'TestFlight', href: '#testflight' },
]

const workflowCards = [
  {
    name: 'Source Clue',
    image: '/icon-source-clue.png',
    description:
      'Drop in a screenshot, reel, link, menu photo, or friend tip before it gets lost.',
  },
  {
    name: 'Review Candidate',
    image: '/icon-review-candidate.png',
    description:
      'SAV-E keeps weak evidence separate until the place is clear enough to trust.',
  },
  {
    name: 'Map Stamp',
    image: '/icon-map-stamp.png',
    description:
      'Save the trusted place with why it mattered, who mentioned it, and when to use it.',
  },
]

const features = [
  {
    title: 'Private Saves',
    description:
      'Your food, cafe, date, and trip ideas stay in your own place memory.',
  },
  {
    title: 'Review Before Save',
    description:
      'Messy sources stay reviewable instead of becoming bad map pins.',
  },
  {
    title: 'Ask Your Places',
    description:
      'Find what you saved by vibe, city, source, or the reason you kept it.',
  },
  {
    title: 'Plan From Memory',
    description:
      'Build shortlists and routes from places you already cared about.',
  },
]

function LogoMark({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <img
      alt=""
      className={`logo-ink-shadow shrink-0 rounded-full object-cover ring-2 ring-[hsl(var(--outline))] ${className}`}
      src="/save-logo.png"
    />
  )
}

function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-5 py-4 md:px-28">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <a href="#home" className="flex items-center gap-3">
          <LogoMark className="h-9 w-9" />
          <span className="text-base font-bold">SAV-E</span>
        </a>

        <div className="hidden items-center gap-3 text-sm md:flex">
          {navLinks.map((link, index) => (
            <span className="flex items-center gap-3" key={link.label}>
              <a
                className="text-muted-foreground transition hover:text-foreground"
                href={link.href}
              >
                {link.label}
              </a>
              {index < navLinks.length - 1 ? (
                <span className="text-muted-foreground/70">•</span>
              ) : null}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {[
            { icon: Camera, label: 'Save screenshots' },
            { icon: MapPin, label: 'Map stamps' },
            { icon: MessageCircle, label: 'Saved tips' },
          ].map(({ icon: Icon, label }) => (
            <a
              aria-label={label}
              className="liquid-glass flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition hover:text-foreground"
              href="#place-memory"
              key={label}
            >
              <Icon className="h-4 w-4" strokeWidth={1.8} />
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}

function HeroSection() {
  return (
    <section
      className="hero-screen relative flex items-center justify-center overflow-hidden px-5 pt-28 md:pt-32"
      id="home"
    >
      <video
        aria-label="Abstract monochrome motion background"
        autoPlay
        className="brand-video absolute inset-0 h-full w-full object-cover opacity-80"
        loop
        muted
        playsInline
        src={HERO_VIDEO}
      />
      <div className="absolute inset-0 bg-[hsl(var(--background)_/_0.18)]" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        <div
          aria-hidden="true"
          className="pastel-spark absolute -top-14 right-[14%] h-5 w-12 rotate-[-62deg] rounded-full bg-[hsl(var(--pastel-blue)_/_0.85)]"
        />
        <div
          aria-hidden="true"
          className="pastel-spark absolute -top-2 right-[8%] h-4 w-12 rotate-[-30deg] rounded-full bg-[hsl(var(--pastel-yellow)_/_0.86)]"
        />
        <div
          aria-hidden="true"
          className="pastel-spark absolute right-[2%] top-12 h-4 w-14 rounded-full bg-[hsl(var(--pastel-pink)_/_0.82)]"
        />
        <motion.div
          {...fadeUp(0)}
          className="mb-8 flex flex-wrap items-center justify-center gap-3"
        >
          <div className="-space-x-2">
            {['/save-logo.png', '/avatar-1.png', '/avatar-2.png'].map((avatar) => (
              <img
                alt=""
                className="inline-block h-8 w-8 rounded-full border-2 border-background object-cover shadow-[0_5px_14px_hsl(var(--outline)_/_0.3)]"
                key={avatar}
                src={avatar}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Private beta now open on TestFlight
          </p>
        </motion.div>

        <motion.h1
          {...fadeUp(0.1)}
          className="max-w-5xl text-4xl font-medium leading-[0.95] sm:text-5xl md:text-7xl lg:text-8xl"
        >
          Save <span className="font-serif italic text-[hsl(var(--accent))]">Places</span> Before They
          Disappear
        </motion.h1>

        <motion.p
          {...fadeUp(0.2)}
          className="mt-8 max-w-2xl text-base leading-8 text-heroSubtitle sm:text-lg"
        >
          SAV-E turns screenshots, reels, links, menus, and friend tips into a
          private place memory you can review, map, and ask about later.
        </motion.p>

        <motion.div
          {...fadeUp(0.3)}
          className="liquid-glass mt-10 flex w-full max-w-lg items-center gap-2 rounded-full p-2"
        >
          <div className="hidden min-w-0 flex-1 items-center gap-2 px-4 text-left text-sm text-muted-foreground sm:flex">
            <LockKeyhole className="h-4 w-4 shrink-0" />
            <span className="truncate">iPhone beta for private place memory</span>
          </div>
          <motion.a
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-[0_7px_0_hsl(var(--outline)_/_0.28)] sm:w-auto sm:px-7"
            href={TESTFLIGHT_URL}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="h-4 w-4" />
            TESTFLIGHT
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  return (
    <section
      className="px-5 pb-6 pt-52 text-center md:pb-9 md:pt-64"
      id="how-it-works"
    >
      <div className="mx-auto max-w-7xl">
        <motion.h2
          {...fadeUp(0)}
          className="mx-auto max-w-5xl text-5xl font-medium leading-[0.98] md:text-7xl lg:text-8xl"
        >
          Saved places get <span className="font-serif italic text-[hsl(var(--accent))]">messy.</span>{' '}
          SAV-E keeps them clear.
        </motion.h2>
        <motion.p
          {...fadeUp(0.1)}
          className="mx-auto mb-24 mt-8 max-w-2xl text-lg leading-8 text-muted-foreground"
        >
          Most place ideas arrive without structure. SAV-E keeps the original
          clue, asks for review, then turns the trusted ones into map stamps.
        </motion.p>

        <div className="mb-20 grid gap-12 md:grid-cols-3 md:gap-8">
          {workflowCards.map((card, index) => (
            <motion.article
              {...fadeUp(0.15 + index * 0.08)}
              className="flex flex-col items-center text-center"
              key={card.name}
            >
              <img
                alt=""
                className="h-[200px] w-[200px] object-contain"
                src={card.image}
              />
              <h3 className="mt-8 text-base font-semibold">{card.name}</h3>
              <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
                {card.description}
              </p>
            </motion.article>
          ))}
        </div>

        <motion.p
          {...fadeUp(0.15)}
          className="text-center text-sm text-muted-foreground"
        >
          If it is not clear enough to trust, it stays a clue.
        </motion.p>
      </div>
    </section>
  )
}

function RevealWord({
  highlighted,
  index,
  scrollYProgress,
  total,
  word,
}: {
  highlighted: boolean
  index: number
  scrollYProgress: MotionValue<number>
  total: number
  word: string
}) {
  const start = index / total
  const end = Math.min(start + 0.24, 1)
  const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1])

  return (
    <motion.span
      className={highlighted ? 'text-foreground' : 'text-heroSubtitle'}
      style={{ opacity }}
    >
      {word}
      {index < total - 1 ? ' ' : ''}
    </motion.span>
  )
}

function ScrollWords({
  highlighted,
  text,
  tone = 'large',
}: {
  highlighted?: string[]
  text: string
  tone?: 'large' | 'medium'
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 85%', 'end 35%'],
  })
  const words = text.split(' ')
  const highlightSet = new Set(highlighted ?? [])

  return (
    <p
      className={
        tone === 'large'
          ? 'text-2xl font-medium leading-tight md:text-4xl lg:text-5xl'
          : 'mt-10 text-xl font-medium leading-snug md:text-2xl lg:text-3xl'
      }
      ref={ref}
    >
      {words.map((word, index) => {
        const normalized = word.toLowerCase().replace(/[^a-z]/g, '')
        return (
          <RevealWord
            highlighted={highlightSet.has(normalized)}
            index={index}
            key={`${word}-${index}`}
            scrollYProgress={scrollYProgress}
            total={words.length}
            word={word}
          />
        )
      })}
    </p>
  )
}

function PlaceMemorySection() {
  return (
    <section className="px-5 pb-32 pt-0 md:pb-44" id="place-memory">
      <div className="mx-auto max-w-6xl">
        <motion.video
          {...fadeUp(0)}
          aria-label="Monochrome looping place-memory object"
          autoPlay
          className="brand-video mx-auto h-auto w-full max-w-[800px] object-cover"
          loop
          muted
          playsInline
          src={MISSION_VIDEO}
        />
        <div className="mx-auto mt-12 max-w-5xl">
          <ScrollWords
            highlighted={['source', 'review', 'stamp']}
            text="SAV-E is a private place memory built around source, review, and stamp - so every saved place keeps its evidence, context, and reason to exist."
          />
          <ScrollWords
            text="It is not a generic travel app. It starts with the places you already noticed, then helps you remember what was real, why it mattered, and when to use it."
            tone="medium"
          />
        </div>
      </div>
    </section>
  )
}

function SolutionSection() {
  return (
    <section className="border-t border-border/30 px-5 py-32 md:py-44">
      <div className="mx-auto max-w-7xl">
        <motion.p
          {...fadeUp(0)}
          className="text-xs font-semibold uppercase tracking-[3px] text-muted-foreground"
        >
          PRODUCT
        </motion.p>
        <motion.h2
          {...fadeUp(0.08)}
          className="mt-6 max-w-4xl text-4xl font-medium leading-tight md:text-6xl"
        >
          The place-memory layer for{' '}
          <span className="font-serif italic">things you saved</span>
        </motion.h2>

        <motion.video
          {...fadeUp(0.15)}
          aria-label="Monochrome product motion"
          autoPlay
          className="brand-video mt-16 aspect-[3/1] w-full rounded-2xl object-cover"
          loop
          muted
          playsInline
          src={SOLUTION_VIDEO}
        />

        <div className="mt-12 grid gap-8 md:grid-cols-4">
          {features.map((feature, index) => (
            <motion.article {...fadeUp(0.15 + index * 0.06)} key={feature.title}>
              <h3 className="text-base font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {feature.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function HlsBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current

    if (!video) {
      return undefined
    }

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(CTA_HLS)
      hls.attachMedia(video)
      return () => hls.destroy()
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = CTA_HLS
    }

    return undefined
  }, [])

  return (
    <video
      aria-label="Streaming monochrome TestFlight background"
      autoPlay
      className="brand-video absolute inset-0 z-0 h-full w-full object-cover"
      loop
      muted
      playsInline
      ref={videoRef}
    />
  )
}

function TestFlightSection() {
  return (
    <section
      className="relative overflow-hidden border-t border-border/30 px-5 py-32 text-center md:py-44"
      id="testflight"
    >
      <HlsBackgroundVideo />
      <div className="absolute inset-0 z-[1] bg-background/45" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
        <motion.div {...fadeUp(0)}>
          <LogoMark className="h-12 w-12" />
        </motion.div>
        <motion.h2
          {...fadeUp(0.08)}
          className="mt-8 text-5xl font-medium leading-none md:text-7xl"
        >
          Try <span className="font-serif italic text-[hsl(var(--accent))]">SAV-E</span> on TestFlight
        </motion.h2>
        <motion.p
          {...fadeUp(0.16)}
          className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground"
        >
          Join the beta if your camera roll, chats, and maps are already full
          of places you meant to remember.
        </motion.p>
        <motion.div
          {...fadeUp(0.24)}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <motion.a
            className="inline-flex rounded-lg bg-foreground px-8 py-3.5 text-sm font-semibold text-background"
            href={TESTFLIGHT_URL}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Download TestFlight
          </motion.a>
          <a
            className="liquid-glass rounded-lg px-8 py-3.5 text-sm font-semibold text-foreground"
            href="#how-it-works"
          >
            See the Flow
          </a>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="flex flex-col gap-6 px-8 py-12 md:flex-row md:items-center md:justify-between md:px-28">
      <p className="text-sm text-muted-foreground">
        © 2026 SAV-E. Private place memory.
      </p>
      <div className="flex gap-6" id="contact">
        {['Privacy', 'Terms', 'Contact'].map((link) => (
          <a
            className="text-sm text-muted-foreground transition hover:text-foreground"
            href={link === 'Contact' ? 'mailto:hello@save.app' : '#home'}
            key={link}
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  )
}

function App() {
  return (
    <>
      <Navbar />
      <main>
        <TriverraHero />
        <HeroSection />
        <HowItWorksSection />
        <PlaceMemorySection />
        <SolutionSection />
        <TestFlightSection />
      </main>
      <Footer />
    </>
  )
}

export default App
