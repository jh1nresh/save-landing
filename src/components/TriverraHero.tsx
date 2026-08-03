'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const BACKGROUND_VIDEO = 'https://cdn.jiro.build/Jahid/Random/Triverra/All%20Images/Header%20BG%20travel.mp4'
const BRAND_LOGO = 'https://cdn.jiro.build/Jahid/Random/Triverra/All%20SVG/brand%20logo%20triverra.svg'
const ARROW_RIGHT = 'https://cdn.jiro.build/Jahid/Random/Triverra/All%20SVG/arrow-right.svg'
const ARROW_UP_RIGHT = 'https://cdn.jiro.build/Jahid/Random/Triverra/All%20SVG/arrow-up-right.svg'

const NAV_ITEMS = ['Home', 'Services', 'Tours', 'Destinations', 'Contacts']

export default function TriverraHero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [activeNavItem, setActiveNavItem] = useState('Home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [primaryHovered, setPrimaryHovered] = useState(false)
  const [secondaryHovered, setSecondaryHovered] = useState(false)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8
    }
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Gantari:wght@400;500;600;700&display=swap');
        .font-gantari { font-family: 'Gantari', sans-serif; }
      `}</style>

      <main className="relative w-full h-screen min-h-[650px] overflow-hidden flex flex-col justify-between select-none font-gantari text-white">
        {/* Background video layer */}
        <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full object-cover scale-[1.02]"
            autoPlay
            loop
            muted
            playsInline
            src={BACKGROUND_VIDEO}
          />
        </div>

        {/* Ambient float wrapper */}
        <motion.div
          className="w-full h-full flex flex-col relative z-20"
          animate={{ y: [0, -8, 0], rotate: [0, 0.5, 0] }}
          transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity }}
        >
          {/* Navbar */}
          <motion.header
            className="w-full pt-[16px] px-6 md:px-[48px] min-[1440px]:px-[64px]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between w-full gap-6 lg:gap-[48px]">
              {/* Brand logo */}
              <a href="#" className="hover:opacity-90 transition-opacity">
                <img
                  src={BRAND_LOGO}
                  alt="Triverra"
                  className="h-[22px] md:h-[24px] lg:h-[34px] w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </a>

              {/* Desktop menu pill */}
              <nav className="hidden lg:flex py-2 px-4 gap-6 rounded-full bg-white/10 backdrop-blur-md border border-white/5 relative">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveNavItem(item)}
                    className={`text-[16px] tracking-[-0.2px] relative ${
                      activeNavItem === item
                        ? 'text-white font-semibold'
                        : 'text-white/80 font-normal hover:text-white'
                    }`}
                  >
                    {item}
                    {activeNavItem === item && (
                      <motion.div
                        layoutId="activeDot"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </nav>

              {/* Register button (desktop) */}
              <button
                className="hidden lg:block py-[10px] px-[18px] rounded-full border border-white/60 bg-transparent text-white font-semibold text-[16px] tracking-[-0.2px] hover:border-white transition-colors"
                style={{ borderColor: 'rgba(255,255,255,0.6)' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,1)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)')}
              >
                Register Now
              </button>

              {/* Mobile trigger */}
              <button
                className="block lg:hidden p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={20} />
              </button>
            </div>
          </motion.header>

          {/* Spacer 1x */}
          <div style={{ flexGrow: 1, minHeight: '24px' }} />

          {/* Hero content */}
          <div className="max-w-[580px] text-center mx-auto px-6">
            {/* Title badge */}
            <motion.p
              className="text-[14px] md:text-[18px] font-normal tracking-[-0.4px] md:tracking-[-0.72px] opacity-90 mb-1 lg:mb-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Your AI Travel Companion - Plan Smarter. Explore Deeper.
            </motion.p>

            {/* Headline */}
            <motion.h1
              className="text-[42px] sm:text-[60px] lg:text-[80px] font-normal leading-[100%] tracking-[-2px] sm:tracking-[-4px] lg:tracking-[-6px] mb-8 lg:mb-[40px] flex flex-col items-center"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <span>Dream deeper.</span>
              <span>Travel farther.</span>
            </motion.h1>

            {/* Button row */}
            <motion.div
              className="flex flex-col sm:flex-row items-center gap-[12px] mb-6 lg:mb-[18px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {/* Primary button */}
              <button
                className="w-[240px] sm:w-auto py-[14px] px-[16px] rounded-[12px] bg-white text-[#0D130D] font-medium text-[18px] sm:text-[20px] tracking-[-0.8px] sm:tracking-[-1px] shadow-lg flex items-center justify-center gap-2"
                onMouseEnter={() => setPrimaryHovered(true)}
                onMouseLeave={() => setPrimaryHovered(false)}
              >
                <span className="relative inline-block overflow-hidden h-[24px] sm:h-[28px] leading-none">
                  <span
                    className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ transform: primaryHovered ? 'translateY(-50%)' : 'translateY(0%)' }}
                  >
                    <span className="h-[24px] sm:h-[28px] flex items-center justify-center leading-none">Build My Trip Free</span>
                    <span className="h-[24px] sm:h-[28px] flex items-center justify-center leading-none">Build My Trip Free</span>
                  </span>
                </span>
                <div className="relative w-[18px] h-[18px] shrink-0 overflow-hidden">
                  <img
                    src={ARROW_RIGHT}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      opacity: primaryHovered ? 0 : 1,
                      transform: primaryHovered ? 'translate(6px,-6px) scale(0.8)' : 'translate(0,0) scale(1)',
                      filter: 'invert(7%) sepia(19%) saturate(1441%) hue-rotate(80deg) brightness(96%) contrast(96%)'
                    }}
                    referrerPolicy="no-referrer"
                  />
                  <img
                    src={ARROW_UP_RIGHT}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      opacity: primaryHovered ? 1 : 0,
                      transform: primaryHovered ? 'translate(0,0) scale(1)' : 'translate(-6px,6px) scale(0.8)',
                      filter: 'invert(7%) sepia(19%) saturate(1441%) hue-rotate(80deg) brightness(96%) contrast(96%)'
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </button>

              {/* Secondary button */}
              <button
                className="w-[240px] sm:w-auto py-[14px] px-[16px] rounded-[12px] border border-white/40 bg-[#0D130D]/10 text-white backdrop-blur-sm font-medium text-[18px] sm:text-[20px] tracking-[-0.8px] sm:tracking-[-1px] flex items-center justify-center gap-2 hover:border-[rgba(255,255,255,0.7)] transition-colors"
                onMouseEnter={() => setSecondaryHovered(true)}
                onMouseLeave={() => setSecondaryHovered(false)}
              >
                <span className="relative inline-block overflow-hidden h-[24px] sm:h-[28px] leading-none">
                  <span
                    className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ transform: secondaryHovered ? 'translateY(-50%)' : 'translateY(0%)' }}
                  >
                    <span className="h-[24px] sm:h-[28px] flex items-center justify-center leading-none">See How It Works</span>
                    <span className="h-[24px] sm:h-[28px] flex items-center justify-center leading-none">See How It Works</span>
                  </span>
                </span>
                <div className="relative w-[18px] h-[18px] shrink-0 overflow-hidden">
                  <img
                    src={ARROW_RIGHT}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      opacity: secondaryHovered ? 0 : 1,
                      transform: secondaryHovered ? 'translate(6px,-6px) scale(0.8)' : 'translate(0,0) scale(1)',
                      filter: 'brightness(0) invert(1)'
                    }}
                    referrerPolicy="no-referrer"
                  />
                  <img
                    src={ARROW_UP_RIGHT}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      opacity: secondaryHovered ? 1 : 0,
                      transform: secondaryHovered ? 'translate(0,0) scale(1)' : 'translate(-6px,6px) scale(0.8)',
                      filter: 'brightness(0) invert(1)'
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </button>
            </motion.div>

            {/* Trusted stat */}
            <motion.p
              className="text-white/80 text-[14px] md:text-[16px] tracking-[-0.4px]"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <strong className="text-white">8370+</strong> trips planned • Rated <strong className="text-white">4.9</strong> by travelers worldwide
            </motion.p>
          </div>

          {/* Spacer 3x */}
          <div style={{ flexGrow: 3, minHeight: '72px' }} />

          {/* Footer description */}
          <motion.footer
            className="w-full pb-[32px] px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 1.0 }}
          >
            <div className="max-w-[560px] text-center mx-auto">
              <p className="text-white/90 text-[14px] md:text-[18px] leading-[140%] tracking-[-0.4px] md:tracking-[-0.72px]">
                Triverra uses advanced AI to create travel plans tailored to your preferences, budget, and pace. Say goodbye to many tabs and decision overload. Enjoy one smart itinerary — ready for your trip.
              </p>
            </div>
          </motion.footer>
        </motion.div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              key="mobile-drawer"
              className="fixed inset-0 z-50 bg-white/[0.01] backdrop-blur-md lg:hidden flex flex-col pt-[76px] pb-12 px-6 overflow-y-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              {/* Close button */}
              <button
                className="absolute top-[16px] right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={20} />
              </button>

              {/* Menu list */}
              <nav className="flex flex-col items-center gap-8 mt-[40px]">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setActiveNavItem(item)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`text-[22px] tracking-[-0.4px] ${
                      activeNavItem === item
                        ? 'text-white font-bold'
                        : 'text-white/60'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </nav>

              {/* Register button */}
              <button
                className="mt-[64px] w-full max-w-[280px] py-[10px] px-[18px] rounded-full border border-white/60 bg-transparent text-white font-semibold text-[16px] tracking-[-0.2px] mx-auto block"
                style={{ borderColor: 'rgba(255,255,255,0.6)' }}
              >
                Register Now
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  )
}
