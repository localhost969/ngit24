'use client'

import { useState, useEffect } from 'react'

const SLIDES = [
  { id: 1, imageUrl: '/test.jpg', alt: 'Academic Announcement' },
  { id: 2, imageUrl: '/km.jpeg', alt: 'Campus Notice' },
  { id: 3, imageUrl: '/333.webp', alt: 'Student Guidelines' },
]

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, 3500)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="w-full pt-1 pb-4">
      <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-md">
        {SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={slide.imageUrl}
              alt={slide.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
