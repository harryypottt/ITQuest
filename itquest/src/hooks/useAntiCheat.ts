import { useEffect, useState, useRef } from 'react';

interface AntiCheatOptions {
  enabled: boolean; // Set to false kapag practice quiz
  maxWarnings?: number;
  onViolationExceeded?: () => void;
}

export function useAntiCheat({
  enabled,
  maxWarnings = 3,
  onViolationExceeded,
}: AntiCheatOptions) {
  const [warnings, setWarnings] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Helper function para mag-increment ng violation warning
  const triggerWarning = (reason: string) => {
    console.warn(`[Anti-Cheat Violation]: ${reason}`);
    setWarnings((prev) => {
      const nextWarnings = prev + 1;
      if (nextWarnings >= maxWarnings && onViolationExceeded) {
        onViolationExceeded();
      }
      return nextWarnings;
    });
  };

  // 1. WEBCAM SETUP
  useEffect(() => {
    if (!enabled) return;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
          audio: false, // 🛑 No Audio/Noise Detection
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
        setCameraError(null);
      } catch (err) {
        console.error('Camera access denied:', err);
        setIsCameraActive(false);
        setCameraError('Kailangan mong i-enable ang camera permission para sa exam.');
      }
    }

    startCamera();

    return () => {
      // I-stop ang camera stream kapag umalis sa quiz
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [enabled]);

  // 2. FULLSCREEN, TAB-SWITCH, & SHORTCUT GUARDS
  useEffect(() => {
    if (!enabled) return;

    // A. Fullscreen Enforcement
    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.error('Failed to request fullscreen:', err);
      }
    };
    enterFullscreen();

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        triggerWarning('Exited Fullscreen Mode');
      } else {
        setIsFullscreen(true);
      }
    };

    // B. Block Right Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // C. Block Copy / Paste / DevTools Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const isDevTools =
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U'));

      const isCopyPaste =
        (e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C' || e.key === 'v' || e.key === 'V');

      if (isDevTools || isCopyPaste) {
        e.preventDefault();
        triggerWarning(`Blocked Keyboard Shortcut: ${e.key}`);
      }
    };

    // D. Tab-Switch / Blur / Dual Monitor Focus Loss Detector
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerWarning('Tab Switched or Browser Minimized');
      }
    };

    const handleWindowBlur = () => {
      triggerWarning('Lost Window Focus (Alt-Tab or Dual Monitor Click)');
    };

    // Add Event Listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    // Cleanup Listeners
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [enabled, maxWarnings]);

  // Helper method para pwedeng i-trigger ng user pabalik sa fullscreen via button
  const requestFullscreenAgain = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return {
    videoRef,
    warnings,
    isFullscreen,
    isCameraActive,
    cameraError,
    requestFullscreenAgain,
  };
}