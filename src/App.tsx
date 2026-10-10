import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { Overlay } from './components/Overlay';
import { portfolio } from './data/portfolio';

const PHASE_RATIOS = [0, 0.2, 0.38, 0.54, 0.76, 0.94] as const;
const SNAP_DURATION = 1.12;

export default function App() {
  const [progress, setProgress] = useState(0);
  const [selectedProjectNumber, setSelectedProjectNumber] = useState<string | null>(null);
  const [matchPlaying, setMatchPlaying] = useState(true);
  const lenisRef = useRef<Lenis | null>(null);
  const progressRef = useRef(0);
  const snapLockedRef = useRef(false);
  const wheelGestureRef = useRef(false);
  const wheelResetTimerRef = useRef<number | null>(null);
  const selectedProject = portfolio.projects.find((project) => project.number === selectedProjectNumber) ?? null;

  const navigateToPhase = useCallback((index: number) => {
    const boundedIndex = Math.max(0, Math.min(PHASE_RATIOS.length - 1, index));
    const lenis = lenisRef.current;
    if (!lenis) return;
    const limit = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    snapLockedRef.current = true;
    lenis.scrollTo(limit * PHASE_RATIOS[boundedIndex], {
      duration: SNAP_DURATION,
      easing: (time) => 1 - Math.pow(1 - time, 4),
      lock: true,
      onComplete: () => { snapLockedRef.current = false; },
    });
  }, []);

  const navigateToProgress = useCallback((ratio: number) => {
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    PHASE_RATIOS.forEach((phaseRatio, index) => {
      const distance = Math.abs(phaseRatio - ratio);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    navigateToPhase(nearestIndex);
  }, [navigateToPhase]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: SNAP_DURATION,
      smoothWheel: false,
      syncTouch: false,
      anchors: false,
    });
    lenisRef.current = lenis;
    const onScroll = ({ scroll, limit }: { scroll: number; limit: number }) => {
      const nextProgress = limit ? Math.min(1, Math.max(0, scroll / limit)) : 0;
      progressRef.current = nextProgress;
      setProgress(nextProgress);
    };
    lenis.on('scroll', onScroll);

    let raf = 0;
    const frame = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) lenis.stop();

    return () => {
      cancelAnimationFrame(raf);
      if (wheelResetTimerRef.current !== null) window.clearTimeout(wheelResetTimerRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (selectedProjectNumber) {
      lenisRef.current?.stop();
      snapLockedRef.current = false;
    } else if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      lenisRef.current?.start();
    }
  }, [selectedProjectNumber]);

  useEffect(() => {
    const isInsideProjectDialog = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest('.project-detail'));
    const isInteractiveTarget = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest('button, a, input, textarea, select, [role="dialog"]'));

    const snapByDirection = (direction: -1 | 1) => {
      if (snapLockedRef.current || selectedProjectNumber) return;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      PHASE_RATIOS.forEach((ratio, index) => {
        const distance = Math.abs(ratio - progressRef.current);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      navigateToPhase(closestIndex + direction);
    };

    const handleWheel = (event: WheelEvent) => {
      if (selectedProjectNumber) {
        // The project dialog itself stays scrollable; the scene behind it stays still.
        if (isInsideProjectDialog(event.target)) return;
        event.preventDefault();
        return;
      }
      event.preventDefault();
      if (wheelGestureRef.current || snapLockedRef.current) {
        if (wheelResetTimerRef.current !== null) window.clearTimeout(wheelResetTimerRef.current);
        wheelResetTimerRef.current = window.setTimeout(() => { wheelGestureRef.current = false; }, 180);
        return;
      }

      wheelGestureRef.current = true;
      if (wheelResetTimerRef.current !== null) window.clearTimeout(wheelResetTimerRef.current);
      wheelResetTimerRef.current = window.setTimeout(() => { wheelGestureRef.current = false; }, 180);
      snapByDirection(event.deltaY >= 0 ? 1 : -1);
    };

    let touchStartY: number | null = null;
    let touchStartTarget: EventTarget | null = null;
    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null;
      touchStartTarget = event.target;
    };
    const handleTouchMove = (event: TouchEvent) => {
      if (selectedProjectNumber && isInsideProjectDialog(event.target)) return;
      if (touchStartY === null || isInteractiveTarget(touchStartTarget)) return;
      event.preventDefault();
    };
    const handleTouchEnd = (event: TouchEvent) => {
      if (selectedProjectNumber && isInsideProjectDialog(touchStartTarget)) {
        touchStartY = null;
        touchStartTarget = null;
        return;
      }
      const endY = event.changedTouches[0]?.clientY;
      if (touchStartY !== null && endY !== undefined && Math.abs(endY - touchStartY) > 42 && !isInteractiveTarget(touchStartTarget)) {
        snapByDirection(endY < touchStartY ? 1 : -1);
      }
      touchStartY = null;
      touchStartTarget = null;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedProjectNumber || event.altKey || event.ctrlKey || event.metaKey || isInteractiveTarget(event.target)) return;
      const down = event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ';
      const up = event.key === 'ArrowUp' || event.key === 'PageUp';
      if (event.key === 'Home') {
        event.preventDefault();
        navigateToPhase(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        navigateToPhase(PHASE_RATIOS.length - 1);
      } else if (down || up) {
        event.preventDefault();
        snapByDirection(down ? 1 : -1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true, capture: true });
    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('wheel', handleWheel, true);
      window.removeEventListener('touchstart', handleTouchStart, true);
      window.removeEventListener('touchmove', handleTouchMove, true);
      window.removeEventListener('touchend', handleTouchEnd, true);
      window.removeEventListener('keydown', handleKeyDown, true);
      if (wheelResetTimerRef.current !== null) window.clearTimeout(wheelResetTimerRef.current);
    };
  }, [navigateToPhase, selectedProjectNumber]);

  return (
    <main className="site" id="top">
      <div className="scene-wrap" aria-hidden="true">
        <Canvas
          dpr={[1, 1.5]}
          shadows
          camera={{ position: [0, 2.3, 11], fov: 48, near: 0.1, far: 260 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <Scene progress={progress} onSelectProject={setSelectedProjectNumber} matchPlaying={matchPlaying} />
        </Canvas>
      </div>
      <Overlay
        progress={progress}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProjectNumber}
        onNavigate={navigateToProgress}
        onCloseProject={() => setSelectedProjectNumber(null)}
        matchPlaying={matchPlaying}
        onToggleMatch={() => setMatchPlaying((playing) => !playing)}
      />
      <div className="scroll-track">
        <section className="scroll-space scroll-space--intro" />
        <section className="scroll-space" />
        <section className="scroll-space" />
        <section className="scroll-space" />
        <section className="scroll-space" />
        <section className="scroll-space scroll-space--final" />
      </div>
    </main>
  );
}
