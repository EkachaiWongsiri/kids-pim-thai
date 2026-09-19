import { useState, useEffect, useRef, useCallback } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { GameHeader } from './components/GameHeader';
import { StageSelector } from './components/StageSelector';
import { CustomWordModal } from './components/CustomWordModal';
import { GameSettingsModal } from './components/GameSettingsModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { PortalNavbar } from './components/PortalNavbar';
import { PortalModals } from './components/PortalModals';
import { StartOverlay } from './components/StartOverlay';
import { AffiliateSidebar } from './components/AffiliateSidebar';

import { THAI_STAGES, ENGLISH_STAGES } from './data/stagesData';
import { Language, Stage, FallingWord, Particle, LaserBeam, FloatingText, GameStats } from './types/game';
import { GuiLanguage, TRANSLATIONS } from './data/i18n';
import { audioService } from './services/audioService';
import { StorageService, VoiceMode } from './services/storageService';
import { AlertTriangle } from 'lucide-react';

export function App() {
  // GUI Language ('th' | 'en')
  const [guiLang, setGuiLang] = useState<GuiLanguage>('th');
  const t = TRANSLATIONS[guiLang];

  // Game Configuration & Settings
  const [language, setLanguage] = useState<Language>('th');
  const [currentStage, setCurrentStage] = useState<Stage>(THAI_STAGES[0]);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(0.8);
  const [targetWordsCount, setTargetWordsCount] = useState<number>(10);
  const [maxConcurrentWords, setMaxConcurrentWords] = useState<number>(4);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(true);
  const [isSfxMuted, setIsSfxMuted] = useState<boolean>(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);
  const [isBgmMuted, setIsBgmMuted] = useState<boolean>(false);
  const [voiceMode, setVoiceMode] = useState<VoiceMode>('fast');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState<boolean>(false);

  // Ready State (Start overlay before words fall)
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  // Gameplay Reactive State
  const [gameState, setGameState] = useState<'playing' | 'gameover' | 'victory'>('playing');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [lives, setLives] = useState<number>(5);
  const maxLives = 5;

  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [wordsCompleted, setWordsCompleted] = useState<number>(0);
  const [lettersTyped, setLettersTyped] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [endTime, setEndTime] = useState<number | null>(null);

  const [targetChar, setTargetChar] = useState<string | null>(null);
  const [activePhysicalKey, setActivePhysicalKey] = useState<string | null>(null);

  // Modals
  const [isStageSelectOpen, setIsStageSelectOpen] = useState<boolean>(false);
  const [isCustomWordsOpen, setIsCustomWordsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [activePortalModal, setActivePortalModal] = useState<'about' | 'contact' | 'privacy' | 'terms' | null>(null);

  // Auto-pause when any modal opens
  const isAnyModalOpen = isStageSelectOpen || isCustomWordsOpen || isSettingsOpen || activePortalModal !== null;

  useEffect(() => {
    if (isAnyModalOpen && gameState === 'playing' && isGameStarted && !isPaused) {
      setIsPaused(true);
    }
  }, [isAnyModalOpen, gameState, isGameStarted, isPaused]);

  // High-performance simulation entity refs
  const wordsRef = useRef<FallingWord[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lasersRef = useRef<LaserBeam[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const cannonAngleRef = useRef<number>(0);

  // Timing & flow refs
  const nextSpawnTimeRef = useRef<number>(Date.now() + 400);
  const wordsIndexRef = useRef<number>(0);
  const wordsCompletedRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const comboRef = useRef<number>(0);
  const maxComboRef = useRef<number>(0);
  const livesRef = useRef<number>(5);

  const effectiveTargetCount = currentStage.category === 'custom'
    ? currentStage.targetCount
    : targetWordsCount;

  const stateRef = useRef({
    gameState,
    isPaused,
    isGameStarted,
    speedMultiplier,
    currentStage,
    language,
    lettersTyped,
    mistakes,
    startTime,
    targetCount: effectiveTargetCount,
    maxConcurrentWords,
  });

  // Keep stateRef synced
  useEffect(() => {
    stateRef.current = {
      gameState,
      isPaused,
      isGameStarted,
      speedMultiplier,
      currentStage,
      language,
      lettersTyped,
      mistakes,
      startTime,
      targetCount: effectiveTargetCount,
      maxConcurrentWords,
    };
    livesRef.current = lives;
    scoreRef.current = score;
    comboRef.current = combo;
    maxComboRef.current = maxCombo;
    wordsCompletedRef.current = wordsCompleted;
  }, [
    gameState,
    isPaused,
    isGameStarted,
    speedMultiplier,
    currentStage,
    language,
    lettersTyped,
    mistakes,
    startTime,
    effectiveTargetCount,
    maxConcurrentWords,
    lives,
    score,
    combo,
    maxCombo,
    wordsCompleted,
  ]);

  // Fullscreen state listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn('Fullscreen request failed:', err);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.warn('Exit fullscreen failed:', err);
        });
      }
    }
  }, []);

  // Load saved settings from LocalStorage
  useEffect(() => {
    const saved = StorageService.getSettings();
    setIsSfxMuted(!saved.sfxEnabled);
    setIsVoiceMuted(!saved.voiceEnabled);
    setIsBgmMuted(!saved.bgmEnabled);
    setIsKeyboardVisible(saved.keyboardVisible);
    setSpeedMultiplier(saved.speedMultiplier);
    setTargetWordsCount(saved.targetWordsCount || 10);
    setMaxConcurrentWords(saved.maxConcurrentWords || 4);

    const initialVoiceMode = saved.voiceMode || 'fast';
    setVoiceMode(initialVoiceMode);
    audioService.setVoiceMode(initialVoiceMode);

    audioService.isSfxMuted = !saved.sfxEnabled;
    audioService.isVoiceMuted = !saved.voiceEnabled;
    audioService.isBgmMuted = !saved.bgmEnabled;
    audioService.setBgmSpeed(saved.speedMultiplier);

    const initialStage = THAI_STAGES.find((s) => s.id === saved.lastPlayedStageId) || THAI_STAGES[0];
    setCurrentStage(initialStage);
    setLanguage(initialStage.language);
  }, []);

  // Sync BGM with game lifecycle
  useEffect(() => {
    if (gameState === 'playing' && isGameStarted && !isPaused && !isBgmMuted) {
      audioService.startBgm();
    } else {
      audioService.stopBgm();
    }
  }, [gameState, isGameStarted, isPaused, isBgmMuted]);

  // Compute and update target character for keyboard highlight
  const updateTargetChar = useCallback(() => {
    const words = wordsRef.current;
    if (words.length === 0) {
      setTargetChar(null);
      return;
    }

    const activeWord = words.find((w) => w.isTarget && w.typedIndex < w.text.length);
    if (activeWord) {
      setTargetChar(activeWord.text[activeWord.typedIndex]);
      return;
    }

    // Lowest word on screen
    const lowestWord = [...words].sort((a, b) => b.y - a.y)[0];
    if (lowestWord && lowestWord.text.length > 0) {
      setTargetChar(lowestWord.text[0]);
      return;
    }

    setTargetChar(null);
  }, []);

  // Initialize / Restart stage
  const initStage = useCallback((stage: Stage, newSpeed?: number, autoStart: boolean = false) => {
    setCurrentStage(stage);
    setLanguage(stage.language);
    setGameState('playing');
    setIsPaused(false);
    setIsGameStarted(autoStart);
    setLives(5);
    livesRef.current = 5;
    setScore(0);
    scoreRef.current = 0;
    setCombo(0);
    comboRef.current = 0;
    setMaxCombo(0);
    maxComboRef.current = 0;
    setWordsCompleted(0);
    wordsCompletedRef.current = 0;
    setLettersTyped(0);
    setMistakes(0);
    setStartTime(Date.now());
    setEndTime(null);

    wordsRef.current = [];
    particlesRef.current = [];
    lasersRef.current = [];
    floatingTextsRef.current = [];
    cannonAngleRef.current = 0;
    wordsIndexRef.current = 0;
    nextSpawnTimeRef.current = Date.now() + 500;

    setTargetChar(null);

    if (newSpeed !== undefined) {
      setSpeedMultiplier(newSpeed);
      StorageService.saveSettings({ speedMultiplier: newSpeed, lastPlayedStageId: stage.id });
    } else {
      StorageService.saveSettings({ lastPlayedStageId: stage.id });
    }
  }, []);

  // Trigger explosion particles at coordinates
  const triggerExplosion = (x: number, y: number, baseColor: string) => {
    const newParticles: Particle[] = [];
    const colors = [baseColor, '#f59e0b', '#38bdf8', '#ec4899', '#ffffff', '#10b981'];

    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1.0,
        size: Math.random() * 4 + 3,
        life: 0,
        maxLife: Math.random() * 25 + 25,
      });
    }

    particlesRef.current.push(...newParticles);
  };

  // Process typed character
  const handleCharInput = useCallback((char: string) => {
    const {
      gameState: curState,
      isPaused: curPaused,
      isGameStarted: curStarted,
      currentStage: curStage,
      startTime: curStartTime,
      mistakes: curMistakes,
      lettersTyped: curLettersTyped,
      targetCount: curTargetCount,
    } = stateRef.current;

    if (curState !== 'playing' || !curStarted || curPaused || wordsRef.current.length === 0) return;

    const words = wordsRef.current;

    // Check if there is an active target word
    let targetIndex = words.findIndex((w) => w.isTarget && w.typedIndex < w.text.length);
    let targetWord = targetIndex !== -1 ? words[targetIndex] : null;

    if (targetWord) {
      const expectedChar = targetWord.text[targetWord.typedIndex];
      const match = curStage.language === 'th'
        ? expectedChar === char
        : expectedChar.toLowerCase() === char.toLowerCase();

      if (match) {
        audioService.playHitLetterSound();

        const isCompleted = targetWord.typedIndex + 1 >= targetWord.text.length;
        if (!isCompleted) {
          audioService.speakSpellingChar(expectedChar, curStage.language);
        }

        targetWord.typedIndex += 1;
        setLettersTyped((prev) => prev + 1);

        if (isCompleted) {
          // Word Completed!
          const cannonX = 480;
          const cannonY = 460;
          const angle = Math.atan2(targetWord.x - cannonX, -(targetWord.y - cannonY));
          cannonAngleRef.current = angle;

          lasersRef.current.push({
            startX: cannonX,
            startY: cannonY - 20,
            targetX: targetWord.x,
            targetY: targetWord.y,
            alpha: 1.0,
            color: '#38bdf8',
          });

          audioService.playLaserSound();
          audioService.playExplosionSound();
          audioService.speakWordCompletion(expectedChar, targetWord.text, curStage.language);
          triggerExplosion(targetWord.x, targetWord.y, targetWord.color);

          const newCombo = comboRef.current + 1;
          const comboBonus = Math.min(newCombo * 20, 200);
          const wordScore = targetWord.text.length * 100 + comboBonus;
          const updatedScore = scoreRef.current + wordScore;

          comboRef.current = newCombo;
          maxComboRef.current = Math.max(maxComboRef.current, newCombo);
          scoreRef.current = updatedScore;

          setCombo(newCombo);
          setMaxCombo(maxComboRef.current);
          setScore(updatedScore);
          audioService.playComboChime(newCombo);

          floatingTextsRef.current.push({
            id: Math.random().toString(),
            text: newCombo > 1 ? `+${wordScore} (x${newCombo})` : `+${wordScore}`,
            x: targetWord.x,
            y: targetWord.y - 15,
            color: newCombo > 2 ? '#fbbf24' : '#38bdf8',
            alpha: 1.0,
            vy: -1.5,
          });

          // Remove word
          wordsRef.current = words.filter((_, idx) => idx !== targetIndex);

          const newCompleted = wordsCompletedRef.current + 1;
          wordsCompletedRef.current = newCompleted;
          setWordsCompleted(newCompleted);
          StorageService.incrementTotalWordsTyped();

          // Check Victory
          if (newCompleted >= curTargetCount) {
            setGameState('victory');
            setEndTime(Date.now());
            audioService.playVictoryFanfare();

            const totalChars = (curLettersTyped + 1);
            const durationMin = Math.max((Date.now() - curStartTime) / 60000, 0.1);
            const wpmVal = Math.round((totalChars / 5) / durationMin);
            const accuracyVal = Math.round((totalChars / (totalChars + curMistakes)) * 100);

            StorageService.saveStageScore({
              stageId: curStage.id,
              highScore: updatedScore,
              maxCombo: maxComboRef.current,
              accuracy: accuracyVal,
              wpm: wpmVal,
              stars: accuracyVal >= 90 ? 3 : 2,
              clearedAt: new Date().toISOString(),
            });
          }
        }
        updateTargetChar();
      } else {
        setMistakes((prev) => prev + 1);
      }
    } else {
      // Find lowest word starting with this character
      const candidateIndices = words
        .map((w, idx) => ({ word: w, index: idx }))
        .filter(({ word }) => {
          const firstChar = word.text[0];
          return curStage.language === 'th'
            ? firstChar === char
            : firstChar.toLowerCase() === char.toLowerCase();
        })
        .sort((a, b) => b.word.y - a.word.y);

      if (candidateIndices.length > 0) {
        const bestMatch = candidateIndices[0];
        const word = bestMatch.word;

        audioService.playHitLetterSound();

        if (word.text.length === 1) {
          audioService.speakChar(word.text[0], curStage.language);
        } else {
          audioService.speakSpellingChar(word.text[0], curStage.language);
        }
        setLettersTyped((prev) => prev + 1);

        if (word.text.length === 1) {
          const cannonX = 480;
          const cannonY = 460;
          const angle = Math.atan2(word.x - cannonX, -(word.y - cannonY));
          cannonAngleRef.current = angle;

          lasersRef.current.push({
            startX: cannonX,
            startY: cannonY - 20,
            targetX: word.x,
            targetY: word.y,
            alpha: 1.0,
            color: '#38bdf8',
          });

          audioService.playLaserSound();
          audioService.playExplosionSound();
          triggerExplosion(word.x, word.y, word.color);

          const newCombo = comboRef.current + 1;
          const wordScore = 100 + Math.min(newCombo * 15, 150);
          const updatedScore = scoreRef.current + wordScore;

          comboRef.current = newCombo;
          maxComboRef.current = Math.max(maxComboRef.current, newCombo);
          scoreRef.current = updatedScore;

          setCombo(newCombo);
          setMaxCombo(maxComboRef.current);
          setScore(updatedScore);
          audioService.playComboChime(newCombo);

          floatingTextsRef.current.push({
            id: Math.random().toString(),
            text: newCombo > 1 ? `+${wordScore} (x${newCombo})` : `+${wordScore}`,
            x: word.x,
            y: word.y - 15,
            color: '#fbbf24',
            alpha: 1.0,
            vy: -1.5,
          });

          wordsRef.current = words.filter((_, idx) => idx !== bestMatch.index);

          const newCompleted = wordsCompletedRef.current + 1;
          wordsCompletedRef.current = newCompleted;
          setWordsCompleted(newCompleted);
          StorageService.incrementTotalWordsTyped();

          if (newCompleted >= curTargetCount) {
            setGameState('victory');
            setEndTime(Date.now());
            audioService.playVictoryFanfare();
          }
        } else {
          // Lock target on this word
          words.forEach((w, idx) => {
            w.isTarget = idx === bestMatch.index;
            w.typedIndex = idx === bestMatch.index ? 1 : 0;
          });
        }
        updateTargetChar();
      } else {
        setMistakes((prev) => prev + 1);
      }
    }
  }, [updateTargetChar]);

  // Physical Keyboard Listener & Caps Lock Detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check Caps Lock
      const caps = e.getModifierState('CapsLock');
      setIsCapsLockOn(caps);

      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'Escape') {
        setIsPaused((prev) => !prev);
        return;
      }

      // If user presses Enter or Space while start overlay is active, start game
      if (!isGameStarted && (e.key === 'Enter' || e.key === ' ')) {
        setIsGameStarted(true);
        return;
      }

      setActivePhysicalKey(e.code);

      if (e.key.length === 1) {
        handleCharInput(e.key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const caps = e.getModifierState('CapsLock');
      setIsCapsLockOn(caps);
      setActivePhysicalKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleCharInput, isGameStarted]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const gameLoop = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const {
        gameState: curState,
        isPaused: curPaused,
        isGameStarted: curStarted,
        speedMultiplier: curSpeedMult,
        currentStage: curStage,
        targetCount: curTargetCount,
        maxConcurrentWords: curMaxConcurrent,
      } = stateRef.current;

      if (curState === 'playing' && curStarted && !curPaused) {
        const now = Date.now();
        const words = wordsRef.current;

        // 1. Spawning with user-configured concurrent count and target count
        const maxWordsOnScreen = curMaxConcurrent || 4;
        const totalToSpawn = curTargetCount + 2;

        if (
          now >= nextSpawnTimeRef.current &&
          words.length < maxWordsOnScreen &&
          wordsCompletedRef.current + words.length < totalToSpawn
        ) {
          const availableWords = curStage.words;
          const wordText = availableWords[wordsIndexRef.current % availableWords.length];
          wordsIndexRef.current += 1;

          const randomX = Math.floor(Math.random() * (760 - 200) + 200);

          const newWord: FallingWord = {
            id: Math.random().toString(),
            text: wordText,
            typedIndex: 0,
            x: randomX,
            y: 40,
            speed: Math.max(15, curStage.speedBase * curSpeedMult * 45), // px/sec
            color: '#38bdf8',
            balloonType: Math.floor(Math.random() * 6),
            isTarget: false,
          };

          words.push(newWord);
          updateTargetChar();

          const baseDelay = 3000 / Math.max(curSpeedMult, 0.2);
          nextSpawnTimeRef.current = now + baseDelay + Math.random() * 600;
        }

        // 2. Word movement & Bottom Collision
        const groundThreshold = 440;
        let livesLostCount = 0;
        const surviving: FallingWord[] = [];

        for (let i = 0; i < words.length; i++) {
          const w = words[i];
          w.y += w.speed * delta;

          if (w.y >= groundThreshold) {
            livesLostCount += 1;
            audioService.playHeartLostSound();
            triggerExplosion(w.x, groundThreshold, '#ef4444');

            floatingTextsRef.current.push({
              id: Math.random().toString(),
              text: '💔 พลาด!',
              x: w.x,
              y: groundThreshold - 10,
              color: '#ef4444',
              alpha: 1.0,
              vy: -1.0,
            });
          } else {
            surviving.push(w);
          }
        }

        wordsRef.current = surviving;

        if (livesLostCount > 0) {
          comboRef.current = 0;
          setCombo(0);

          const updatedLives = Math.max(0, livesRef.current - livesLostCount);
          livesRef.current = updatedLives;
          setLives(updatedLives);

          if (updatedLives <= 0) {
            setGameState('gameover');
            setEndTime(Date.now());
            audioService.playGameOverSound();
          }

          updateTargetChar();
        }

        // 3. Update Laser Beams
        const lasers = lasersRef.current;
        for (let i = lasers.length - 1; i >= 0; i--) {
          lasers[i].alpha -= delta * 3.5;
          if (lasers[i].alpha <= 0) {
            lasers.splice(i, 1);
          }
        }

        // 4. Update Explosion Particles
        const particles = particlesRef.current;
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.12; // Gravity
          p.life += 1;
          p.alpha = Math.max(0, 1 - p.life / p.maxLife);

          if (p.life >= p.maxLife || p.alpha <= 0) {
            particles.splice(i, 1);
          }
        }

        // 5. Update Floating Texts
        const fTexts = floatingTextsRef.current;
        for (let i = fTexts.length - 1; i >= 0; i--) {
          const ft = fTexts[i];
          ft.y += ft.vy;
          ft.alpha -= delta * 0.9;
          if (ft.alpha <= 0) {
            fTexts.splice(i, 1);
          }
        }
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [updateTargetChar]);

  // Handlers
  const handleToggleSfx = () => {
    const next = !isSfxMuted;
    setIsSfxMuted(next);
    audioService.isSfxMuted = next;
    StorageService.saveSettings({ sfxEnabled: !next });
  };

  const handleToggleVoice = () => {
    const next = !isVoiceMuted;
    setIsVoiceMuted(next);
    audioService.isVoiceMuted = next;
    StorageService.saveSettings({ voiceEnabled: !next });
  };

  const handleToggleBgm = () => {
    const next = !isBgmMuted;
    setIsBgmMuted(next);
    audioService.isBgmMuted = next;
    if (next) {
      audioService.stopBgm();
    } else {
      audioService.startBgm();
    }
    StorageService.saveSettings({ bgmEnabled: !next });
  };

  const handleSpeedChange = (spd: number) => {
    setSpeedMultiplier(spd);
    audioService.setBgmSpeed(spd);
    StorageService.saveSettings({ speedMultiplier: spd });
  };

  const handleTargetWordsCountChange = (count: number) => {
    setTargetWordsCount(count);
    StorageService.saveSettings({ targetWordsCount: count });
  };

  const handleMaxConcurrentWordsChange = (count: number) => {
    setMaxConcurrentWords(count);
    StorageService.saveSettings({ maxConcurrentWords: count });
  };

  const handleVoiceModeChange = (mode: VoiceMode) => {
    setVoiceMode(mode);
    audioService.setVoiceMode(mode);
    StorageService.saveSettings({ voiceMode: mode });
  };

  const handleLanguageChange = (newLang: Language) => {
    const stageList = newLang === 'th' ? THAI_STAGES : ENGLISH_STAGES;
    initStage(stageList[0], undefined, false);
  };

  const handleNextStage = () => {
    const stageList = language === 'th' ? THAI_STAGES : ENGLISH_STAGES;
    const currentIndex = stageList.findIndex((s) => s.id === currentStage.id);
    if (currentIndex !== -1 && currentIndex < stageList.length - 1) {
      initStage(stageList[currentIndex + 1], undefined, false);
    } else {
      setIsStageSelectOpen(true);
    }
  };

  const handleSlowDownAndRetry = () => {
    const slowerSpeed = Math.max(0.1, Number((speedMultiplier * 0.6).toFixed(1)));
    initStage(currentStage, slowerSpeed, false);
  };

  const stageList = language === 'th' ? THAI_STAGES : ENGLISH_STAGES;
  const currentStageIndex = stageList.findIndex((s) => s.id === currentStage.id);
  const hasNextStage = currentStageIndex !== -1 && currentStageIndex < stageList.length - 1;

  const currentStats: GameStats = {
    score,
    combo,
    maxCombo,
    wordsCompleted,
    lettersTyped,
    mistakes,
    startTime,
    endTime,
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 select-none">
      {/* 1. Mxia Portal Top Navbar */}
      <PortalNavbar
        guiLang={guiLang}
        onToggleGuiLang={() => setGuiLang(guiLang === 'th' ? 'en' : 'th')}
        onOpenModal={(modalName) => setActivePortalModal(modalName)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* 2. Main Body Container with Left & Right Affiliate Slots and Center Game */}
      <div className="flex-1 flex justify-center items-stretch overflow-hidden px-2 py-1 max-w-[1920px] mx-auto w-full gap-2">
        {/* Left Affiliate / Ads Slot */}
        <AffiliateSidebar
          position="left"
          guiLang={guiLang}
          onOpenContact={() => setActivePortalModal('contact')}
        />

        {/* Center Game Viewport */}
        <div className="flex-1 flex flex-col items-center justify-between max-w-5xl w-full h-full overflow-hidden relative">
          {/* Caps Lock Warning Banner */}
          {isCapsLockOn && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-slate-950 px-4 py-2 rounded-2xl font-black text-xs md:text-sm shadow-2xl shadow-orange-500/40 flex items-center gap-2 animate-bounce border-2 border-amber-300">
              <AlertTriangle className="w-5 h-5 text-slate-950 shrink-0" />
              <span>{t.capsLockTitle} {t.capsLockDesc}</span>
            </div>
          )}

          {/* Game Header Controls */}
          <GameHeader
            lives={lives}
            maxLives={maxLives}
            score={score}
            combo={combo}
            maxCombo={maxCombo}
            currentStage={currentStage}
            speedMultiplier={speedMultiplier}
            onSpeedChange={handleSpeedChange}
            language={language}
            onLanguageChange={handleLanguageChange}
            isSfxMuted={isSfxMuted}
            onToggleSfx={handleToggleSfx}
            isVoiceMuted={isVoiceMuted}
            onToggleVoice={handleToggleVoice}
            isBgmMuted={isBgmMuted}
            onToggleBgm={handleToggleBgm}
            voiceMode={voiceMode}
            onToggleVoiceMode={() => handleVoiceModeChange(voiceMode === 'fast' ? 'natural' : 'fast')}
            isPaused={isPaused}
            onTogglePause={() => setIsPaused((prev) => !prev)}
            onOpenStageSelect={() => setIsStageSelectOpen(true)}
            onOpenCustomWords={() => setIsCustomWordsOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onRestartStage={() => initStage(currentStage, undefined, false)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            targetCount={effectiveTargetCount}
            wordsCompleted={wordsCompleted}
            guiLang={guiLang}
          />

          {/* Game Canvas Container + Start Overlay */}
          <div className="relative w-full flex-1 min-h-[300px] md:min-h-[400px] flex flex-col">
            <GameCanvas
              wordsRef={wordsRef}
              particlesRef={particlesRef}
              lasersRef={lasersRef}
              floatingTextsRef={floatingTextsRef}
              cannonAngleRef={cannonAngleRef}
              lives={lives}
              maxLives={maxLives}
            />

            {/* Big Start Play Overlay */}
            {!isGameStarted && (
              <StartOverlay
                stage={currentStage}
                guiLang={guiLang}
                onStart={() => setIsGameStarted(true)}
                speedMultiplier={speedMultiplier}
              />
            )}
          </div>

          {/* Interactive Virtual Keyboard */}
          <VirtualKeyboard
            language={language}
            targetChar={isGameStarted ? targetChar : null}
            activePhysicalKey={activePhysicalKey}
            onKeyClick={handleCharInput}
            isVisible={isKeyboardVisible}
            onToggleVisibility={() => {
              const next = !isKeyboardVisible;
              setIsKeyboardVisible(next);
              StorageService.saveSettings({ keyboardVisible: next });
            }}
            guiLang={guiLang}
          />
        </div>

        {/* Right Affiliate / Ads Slot */}
        <AffiliateSidebar
          position="right"
          guiLang={guiLang}
          onOpenContact={() => setActivePortalModal('contact')}
        />
      </div>

      {/* 3. Portal Modals (About, Contact, Privacy, Terms) */}
      <PortalModals
        activeModal={activePortalModal}
        onClose={() => setActivePortalModal(null)}
        guiLang={guiLang}
      />

      {/* 4. Game Gameplay Modals */}
      <StageSelector
        isOpen={isStageSelectOpen}
        onClose={() => setIsStageSelectOpen(false)}
        onSelectStage={(stage) => initStage(stage, undefined, false)}
        currentStageId={currentStage.id}
        guiLang={guiLang}
      />

      <CustomWordModal
        isOpen={isCustomWordsOpen}
        onClose={() => setIsCustomWordsOpen(false)}
        onStartCustomStage={(stage) => initStage(stage, undefined, false)}
        currentLanguage={language}
        guiLang={guiLang}
      />

      <GameSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        targetWordsCount={targetWordsCount}
        onChangeTargetWordsCount={handleTargetWordsCountChange}
        maxConcurrentWords={maxConcurrentWords}
        onChangeMaxConcurrentWords={handleMaxConcurrentWordsChange}
        speedMultiplier={speedMultiplier}
        onChangeSpeed={handleSpeedChange}
        isSfxMuted={isSfxMuted}
        onToggleSfx={handleToggleSfx}
        isVoiceMuted={isVoiceMuted}
        onToggleVoice={handleToggleVoice}
        isBgmMuted={isBgmMuted}
        onToggleBgm={handleToggleBgm}
        voiceMode={voiceMode}
        onChangeVoiceMode={handleVoiceModeChange}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        guiLang={guiLang}
      />

      <GameOverModal
        isOpen={gameState === 'gameover'}
        stats={currentStats}
        currentStage={currentStage}
        onRetry={() => initStage(currentStage, undefined, false)}
        onOpenStageSelect={() => {
          setGameState('playing');
          setIsStageSelectOpen(true);
        }}
        onSlowDownAndRetry={handleSlowDownAndRetry}
        guiLang={guiLang}
      />

      <VictoryModal
        isOpen={gameState === 'victory'}
        stats={currentStats}
        currentStage={currentStage}
        hasNextStage={hasNextStage}
        onNextStage={handleNextStage}
        onReplay={() => initStage(currentStage, undefined, false)}
        onOpenStageSelect={() => {
          setGameState('playing');
          setIsStageSelectOpen(true);
        }}
        guiLang={guiLang}
      />
    </div>
  );
}

export default App;
