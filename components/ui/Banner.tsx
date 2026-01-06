'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsDarkMode } from '@/lib/theme';
import { GlassButton } from './GlassButton';

interface BannerSlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
  textColor?: string;
  alignment?: 'left' | 'center' | 'right';
}

interface BannerProps {
  slides: BannerSlide[];
  autoPlay?: boolean;
  interval?: number;
  height?: string | number;
  showDots?: boolean;
  showArrows?: boolean;
}

export function Banner({
  slides,
  autoPlay = true,
  interval = 5000,
  height = 500,
  showDots = true,
  showArrows = true,
}: BannerProps) {
  const isDark = useIsDarkMode();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, slides.length, goToNext]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const currentSlide = slides[currentIndex];

  return (
    <Box
      sx={{
        position: 'relative',
        height,
        overflow: 'hidden',
        borderRadius: { xs: 0, md: '24px' },
      }}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        >
          {/* Background Image */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${currentSlide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: isDark
                  ? 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)'
                  : 'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 100%)',
              },
            }}
          />

          {/* Content */}
          <Container
            maxWidth="lg"
            sx={{
              position: 'relative',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: currentSlide.alignment === 'center' ? 'center' :
                              currentSlide.alignment === 'right' ? 'flex-end' : 'flex-start',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{
                maxWidth: 600,
                textAlign: currentSlide.alignment || 'left',
              }}
            >
              {currentSlide.subtitle && (
                <Typography
                  variant="overline"
                  sx={{
                    color: currentSlide.textColor || 'rgba(255,255,255,0.9)',
                    letterSpacing: 2,
                    mb: 1,
                    display: 'block',
                  }}
                >
                  {currentSlide.subtitle}
                </Typography>
              )}
              <Typography
                variant="h2"
                sx={{
                  color: currentSlide.textColor || '#fff',
                  fontWeight: 700,
                  mb: 2,
                  textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                }}
              >
                {currentSlide.title}
              </Typography>
              {currentSlide.description && (
                <Typography
                  variant="h6"
                  sx={{
                    color: currentSlide.textColor || 'rgba(255,255,255,0.85)',
                    fontWeight: 400,
                    mb: 4,
                  }}
                >
                  {currentSlide.description}
                </Typography>
              )}
              {currentSlide.buttonText && (
                <GlassButton
                  variant="contained"
                  size="large"
                  href={currentSlide.buttonLink}
                  sx={{
                    px: 4,
                    py: 1.5,
                  }}
                >
                  {currentSlide.buttonText}
                </GlassButton>
              )}
            </motion.div>
          </Container>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <Box
            component={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToPrev}
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 24,
              zIndex: 2,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.3)',
              },
            }}
          >
            ‹
          </Box>
          <Box
            component={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToNext}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 24,
              zIndex: 2,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.3)',
              },
            }}
          >
            ›
          </Box>
        </>
      )}

      {/* Dots */}
      {showDots && slides.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            zIndex: 2,
          }}
        >
          {slides.map((_, index) => (
            <Box
              key={index}
              component={motion.button}
              whileHover={{ scale: 1.2 }}
              onClick={() => goToSlide(index)}
              sx={{
                width: currentIndex === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                border: 'none',
                backgroundColor: currentIndex === index ? '#fff' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default Banner;
