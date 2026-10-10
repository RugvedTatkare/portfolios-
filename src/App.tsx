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
  const [exploreMode, setExploreMode] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const progressRef = useRef(0);
  const snapLockedRef = useRef(false);
  const wheelGestureRef = useRef(false);
  const wheelResetTimerRef = useRef<number | null>(null);
  const selectedProject = portfolio.projects.find((project) => project.number === selectedProjectNumber) ?? null;
  const closeProject = useCallback(() => setSelectedProjectNumber(null), []);
  const toggleMatch = useCallback(() => setMatchPlaying((playing) => !playing), []);
  const toggleExplore = useCallback(() => setExploreMode((active) => !active), []);
  const exitExplore = useCallback(() => setExploreMode(false), []);

  const navigateToPhase = useCallback((index: number) => {
    setExploreMode(false);
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
    if (selectedProjectNumber || exploreMode) {
      lenisRef.current?.stop();
      snapLockedRef.current = false;
    } else if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      lenisRef.current?.start();
    }
  }, [selectedProjectNumber, exploreMode]);

  useEffect(() => {
    const isInsideProjectDialog = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest('.project-detail'));
    const isInteractiveTarget = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest('button, a, input, textarea, select, [role="dialog"]'));

    const scrollActiveCopy = (deltaY: number) => {
      const activeCopy = Array.from(document.querySelectorAll<HTMLElement>('.copy'))
        .find((element) => element.style.visibility === 'visible');
      if (!activeCopy || activeCopy.scrollHeight <= activeCopy.clientHeight + 2) return false;
      const canScrollDown = deltaY > 0 && activeCopy.scrollTop + activeCopy.clientHeight < activeCopy.scrollHeight - 2;
      const canScrollUp = deltaY < 0 && activeCopy.scrollTop > 2;
      if (!canScrollDown && !canScrollUp) return false;
      activeCopy.scrollTop = Math.max(0, Math.min(activeCopy.scrollHeight - activeCopy.clientHeight, activeCopy.scrollTop + deltaY));
      return true;
    };

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
        // Keep project details scrollable even when the scene is in free-look mode.
        if (isInsideProjectDialog(event.target)) return;
        event.preventDefault();
        return;
      }
      if (exploreMode) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      // Scroll longer copy only when the gesture starts on that visible text panel.
      if (event.target instanceof Element && event.target.closest('.copy') && scrollActiveCopy(event.deltaY)) return;
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
    let lastTouchY: number | null = null;
    let touchStartTarget: EventTarget | null = null;
    let touchConsumedByCopy = false;
    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null;
      lastTouchY = touchStartY;
      touchStartTarget = event.target;
      touchConsumedByCopy = false;
    };
    const handleTouchMove = (event: TouchEvent) => {
      if (selectedProjectNumber && isInsideProjectDialog(event.target)) return;
      if (exploreMode) {
        event.preventDefault();
        return;
      }
      if (touchStartY === null || isInteractiveTarget(touchStartTarget)) return;
      const currentY = event.touches[0]?.clientY;
      if (currentY !== undefined && lastTouchY !== null) {
        const deltaY = lastTouchY - currentY;
        if (Math.abs(deltaY) > 1 && touchStartTarget instanceof Element && touchStartTarget.closest('.copy') && scrollActiveCopy(deltaY)) touchConsumedByCopy = true;
        lastTouchY = currentY;
      }
      event.preventDefault();
    };
    const handleTouchEnd = (event: TouchEvent) => {
      if (selectedProjectNumber && isInsideProjectDialog(touchStartTarget)) {
        touchStartY = null;
        lastTouchY = null;
        touchStartTarget = null;
        touchConsumedByCopy = false;
        return;
      }
      if (exploreMode) {
        touchStartY = null;
        lastTouchY = null;
        touchStartTarget = null;
        touchConsumedByCopy = false;
        return;
      }
      const endY = event.changedTouches[0]?.clientY;
      if (!touchConsumedByCopy && touchStartY !== null && endY !== undefined && Math.abs(endY - touchStartY) > 42 && !isInteractiveTarget(touchStartTarget)) {
        snapByDirection(endY < touchStartY ? 1 : -1);
      }
      touchStartY = null;
      lastTouchY = null;
      touchStartTarget = null;
      touchConsumedByCopy = false;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedProjectNumber) return;
      if (exploreMode) {
        if (event.key === 'Escape') {
          event.preventDefault();
          exitExplore();
        }
        return;
      }
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
  }, [navigateToPhase, selectedProjectNumber, exploreMode, exitExplore]);

  return (
    <main className={`site ${exploreMode ? 'is-exploring' : ''}`} id="top">
      <div className="scene-wrap" aria-hidden="true">
        <Canvas
          dpr={[1, 1.5]}
          shadows
          camera={{ position: [0, 2.3, 11], fov: 48, near: 0.1, far: 260 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <Scene progress={progress} onSelectProject={setSelectedProjectNumber} matchPlaying={matchPlaying} exploreMode={exploreMode} />
        </Canvas>
      </div>
      <Overlay
        progress={progress}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProjectNumber}
        onNavigate={navigateToProgress}
        onCloseProject={closeProject}
        matchPlaying={matchPlaying}
        onToggleMatch={toggleMatch}
        exploreMode={exploreMode}
        onToggleExplore={toggleExplore}
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
