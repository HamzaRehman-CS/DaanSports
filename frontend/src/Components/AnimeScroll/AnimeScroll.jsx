import React, { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

export function useAnimeReveal(className = '.anime-reveal') {
  useEffect(() => {
    const elements = document.querySelectorAll(className);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            try {
              animate(entry.target, {
                opacity: [0, 1],
                translateY: [35, 0],
                scale: [0.97, 1],
                duration: 800,
                ease: 'outExpo',
                delay: stagger ? stagger(80) : 0
              });
            } catch (err) {
              console.warn("Anime reveal notice:", err);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [className]);
}

export function useAnimePulse(className = '.anime-pulse') {
  useEffect(() => {
    const elements = document.querySelectorAll(className);
    if (!elements.length) return;

    try {
      const animation = animate(elements, {
        scale: [1, 1.03, 1],
        opacity: [0.9, 1, 0.9],
        duration: 3000,
        loop: true,
        ease: 'inOutSine'
      });
      return () => {
        if (animation && animation.pause) animation.pause();
      };
    } catch (err) {
      console.warn("Anime pulse notice:", err);
    }
  }, [className]);
}

export default function AnimeCardWrapper({ children, className = "" }) {
  const cardRef = useRef(null);

  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    try {
      animate(cardRef.current, {
        translateY: -8,
        scale: 1.02,
        duration: 350,
        ease: 'outQuad'
      });
    } catch (e) {
      // fallback safe
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    try {
      animate(cardRef.current, {
        translateY: 0,
        scale: 1,
        duration: 350,
        ease: 'outQuad'
      });
    } catch (e) {
      // fallback safe
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`will-change-transform transition-shadow duration-300 ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}
