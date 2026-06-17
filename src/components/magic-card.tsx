'use client';

// Extracted from the React Bits MagicBento component: the reusable per-card
// effect wrapper (particles + tilt + magnetism + click ripple + border glow)
// and a single app-wide cursor spotlight. Adapted to TypeScript and applied
// to the app's real elements rather than the demo grid.
import { gsap } from 'gsap';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import './magic-bento.css';

const BRAND_GLOW = '223, 155, 95';
const MOBILE_BREAKPOINT = 768;

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

function createParticle(x: number, y: number, color: string): HTMLDivElement {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute; width: 4px; height: 4px; border-radius: 50%;
    background: rgba(${color}, 1); box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none; z-index: 100; left: ${x}px; top: ${y}px;`;
  return el;
}

export interface MagicCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  glowColor?: string;
  particleCount?: number;
  enableStars?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  disableAnimations?: boolean;
}

export function MagicCard({
  children,
  className = '',
  style,
  glowColor = BRAND_GLOW,
  particleCount = 10,
  enableStars = true,
  enableTilt = false,
  enableMagnetism = true,
  clickEffect = true,
  disableAnimations = false,
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<number[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);
  const isMobile = useIsMobile();
  const off = disableAnimations || isMobile;

  const initParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticle(Math.random() * width, Math.random() * height, glowColor),
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearParticles = useCallback(() => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();
    particlesRef.current.forEach((p) => {
      gsap.to(p, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => p.parentNode?.removeChild(p),
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;
    if (!particlesInitialized.current) initParticles();
    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = window.setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;
        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);
        gsap.fromTo(
          clone,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' },
        );
        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true,
        });
        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
        });
      }, index * 100);
      timeoutsRef.current.push(timeoutId);
    });
  }, [initParticles]);

  useEffect(() => {
    if (off || !cardRef.current) return;
    const element = cardRef.current;

    const onEnter = () => {
      isHoveredRef.current = true;
      if (enableStars) animateParticles();
      if (enableTilt) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000,
        });
      }
    };

    const onLeave = () => {
      isHoveredRef.current = false;
      clearParticles();
      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
      if (enableMagnetism) {
        gsap.to(element, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
      }
    };

    const onMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      if (enableTilt) {
        gsap.to(element, {
          rotateX: ((y - cy) / cy) * -8,
          rotateY: ((x - cx) / cx) * 8,
          duration: 0.1,
          ease: 'power2.out',
          transformPerspective: 1000,
        });
      }
      if (enableMagnetism) {
        magnetismAnimationRef.current = gsap.to(element, {
          x: (x - cx) * 0.04,
          y: (y - cy) * 0.04,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    const onClick = (e: MouseEvent) => {
      if (!clickEffect) return;
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height),
      );
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute; width: ${maxDistance * 2}px; height: ${maxDistance * 2}px;
        border-radius: 50%; background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px; top: ${y - maxDistance}px; pointer-events: none; z-index: 1000;`;
      element.appendChild(ripple);
      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => ripple.remove(),
        },
      );
    };

    element.addEventListener('mouseenter', onEnter);
    element.addEventListener('mouseleave', onLeave);
    element.addEventListener('mousemove', onMove);
    element.addEventListener('click', onClick);
    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', onEnter);
      element.removeEventListener('mouseleave', onLeave);
      element.removeEventListener('mousemove', onMove);
      element.removeEventListener('click', onClick);
      clearParticles();
    };
  }, [
    animateParticles,
    clearParticles,
    off,
    enableStars,
    enableTilt,
    enableMagnetism,
    clickEffect,
    glowColor,
  ]);

  return (
    <div
      ref={cardRef}
      className={`magic-bento-card magic-bento-card--border-glow particle-container ${className}`}
      style={
        {
          ...style,
          '--glow-color': glowColor,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

export interface SpotlightLayerProps {
  spotlightRadius?: number;
  glowColor?: string;
  disableAnimations?: boolean;
}

/** One cursor-following spotlight for the whole app. Mount once. */
export function SpotlightLayer({
  spotlightRadius = 300,
  glowColor = BRAND_GLOW,
  disableAnimations = false,
}: SpotlightLayerProps) {
  const isMobile = useIsMobile();
  useEffect(() => {
    if (disableAnimations || isMobile) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed; width: 800px; height: 800px; border-radius: 50%;
      pointer-events: none; background: radial-gradient(circle,
        rgba(${glowColor}, 0.12) 0%, rgba(${glowColor}, 0.07) 15%,
        rgba(${glowColor}, 0.04) 25%, rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%, transparent 70%);
      z-index: 200; opacity: 0; transform: translate(-50%, -50%);
      mix-blend-mode: screen;`;
    document.body.appendChild(spotlight);

    const proximity = spotlightRadius * 0.5;
    const fadeDistance = spotlightRadius * 0.75;

    const onMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll<HTMLElement>(
        '.magic-bento-card',
      );
      if (cards.length === 0) {
        gsap.to(spotlight, { opacity: 0, duration: 0.3 });
        return;
      }
      let minDistance = Infinity;
      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        const cxx = r.left + r.width / 2;
        const cyy = r.top + r.height / 2;
        const distance =
          Math.hypot(e.clientX - cxx, e.clientY - cyy) -
          Math.max(r.width, r.height) / 2;
        const eff = Math.max(0, distance);
        minDistance = Math.min(minDistance, eff);
        let intensity = 0;
        if (eff <= proximity) intensity = 1;
        else if (eff <= fadeDistance)
          intensity = (fadeDistance - eff) / (fadeDistance - proximity);
        const relX = ((e.clientX - r.left) / r.width) * 100;
        const relY = ((e.clientY - r.top) / r.height) * 100;
        card.style.setProperty('--glow-x', `${relX}%`);
        card.style.setProperty('--glow-y', `${relY}%`);
        card.style.setProperty('--glow-intensity', intensity.toString());
        card.style.setProperty('--glow-radius', `${spotlightRadius}px`);
      });

      gsap.to(spotlight, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });
      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0;
      gsap.to(spotlight, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: 'power2.out',
      });
    };

    const onLeave = () => {
      document
        .querySelectorAll<HTMLElement>('.magic-bento-card')
        .forEach((c) => c.style.setProperty('--glow-intensity', '0'));
      gsap.to(spotlight, { opacity: 0, duration: 0.3 });
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      spotlight.parentNode?.removeChild(spotlight);
    };
  }, [disableAnimations, isMobile, spotlightRadius, glowColor]);

  return null;
}
