'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import Cookies from 'js-cookie'
import { motion, AnimatePresence } from 'framer-motion'

const emojis = ['💖', '😍', '👍', '🎉', '🌟', '🔥', '💯', '🙌', '😊', '💪']

const ParticleEffect = () => {
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 200 - 100,
    y: Math.random() * 200 - 100,
    scale: Math.random() * 0.5 + 0.5,
    opacity: Math.random(),
  }))

  return (
    <div className="absolute left-0 w-full h-full pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-pink-500 rounded-full"
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{
            x: particle.x,
            y: particle.y,
            scale: particle.scale,
            opacity: 0,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}
    </div>
  )
}

export default function SpectacularLikeButton({ id = 'default' }: { id?: string }) {
  const [likes, setLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [showVirtualEmoji, setShowVirtualEmoji] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const likedState = Cookies.get(`liked_${id}`)
    if (likedState) {
      setIsLiked(true)
      setLikes(1)
    } else {
      const interval = setInterval(() => {
        if (Math.random() < 0.3) {
          setShowVirtualEmoji(true)
          setTimeout(() => setShowVirtualEmoji(false), 2000)
        }
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [id])

  useEffect(() => {
    if (isLiked) {
      setShowCelebration(true)
      const timer = setTimeout(() => {
        setShowCelebration(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isLiked])

  const handleLike = () => {
    if (!isLiked) {
      setLikes(1)
      setIsLiked(true)
      setShowParticles(true)
      setTimeout(() => setShowParticles(false), 1000)
      Cookies.set(`liked_${id}`, 'true', { expires: 365 })
    }
  }

  return (
    <div className="relative">
      <motion.button
        onClick={handleLike}
        disabled={isLiked}
        className={`flex items-center space-x-2 px-8 py-4 rounded-full transition-all duration-300 ease-in-out ${
          isLiked
            ? 'bg-pink-100 text-pink-500 cursor-default'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
        whileHover={!isLiked ? { scale: 1.05 } : {}}
        whileTap={!isLiked ? { scale: 0.95 } : {}}
        aria-label={isLiked ? "Liked" : "Like this content"}
      >
        <motion.div
          animate={isLiked ? {
            scale: [1, 1.2, 1],
            rotate: [0, 15, -15, 0],
          } : {}}
          transition={{ duration: 0.5 }}
        >
          <Heart
            className={`w-8 h-8 transition-transform duration-300 ease-in-out ${
              isLiked ? 'fill-current text-pink-500' : ''
            }`}
          />
        </motion.div>
        {isLiked && <span className="font-semibold">{likes}</span> }
      </motion.button>

      <AnimatePresence>
        {!isLiked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, scale: [1, 1.2, 1] }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
            className="absolute left-8 transform -translate-x-1/2"
          >
            <span role="img" aria-label="Pointing up" className="text-2xl">
              👆
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isLiked && showVirtualEmoji && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <span role="img" aria-label="Random emoji" className="text-2xl">
                {emojis[Math.floor(Math.random() * emojis.length)]}
              </span>
              <span className="text-sm font-medium text-gray-800">Click!!!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            {['🎉', '💥', '🎉', '💥'].map((emoji, index) => (
              <motion.span
                key={index}
                className="text-4xl absolute"
                initial={{ scale: 0, rotate: 0 }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                  x: Math.cos(index * Math.PI / 2) * 50,
                  y: Math.sin(index * Math.PI / 2) * 50,
                }}
                transition={{
                  duration: 0.5,
                  repeat: 1,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {showParticles && <ParticleEffect />}
    </div>
  )
}