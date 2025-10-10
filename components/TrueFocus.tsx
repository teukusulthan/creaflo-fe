"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface TrueFocusProps {
  sentence?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  groupSize?: number; // jumlah kata per fokus (default: 1)
}

interface FocusRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const TrueFocus: React.FC<TrueFocusProps> = ({
  sentence = "True Focus",
  manualMode = false,
  blurAmount = 3,
  borderColor = "var(--primary)",
  glowColor = "rgba(99,102,241,0.5)", // warna glow sesuai primary
  animationDuration = 1.2,
  pauseBetweenAnimations = 0.8,
  groupSize = 1,
}) => {
  // 🪄 Pecah kalimat per spasi, lalu kelompokkan per N kata
  const allWords = sentence.trim().split(/\s+/);
  const words: string[] = [];
  for (let i = 0; i < allWords.length; i += groupSize) {
    words.push(allWords.slice(i, i + groupSize).join(" "));
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusRect, setFocusRect] = useState<FocusRect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // Auto animate antar kata
  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
      }, (animationDuration + pauseBetweenAnimations) * 1000);
      return () => clearInterval(interval);
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  // Hitung posisi fokus rectangle
  useEffect(() => {
    if (!wordRefs.current[currentIndex] || !containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    });
  }, [currentIndex, words.length]);

  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode && lastActiveIndex !== null) {
      setCurrentIndex(lastActiveIndex);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-wrap gap-3 justify-start items-center text-left text-foreground/90 leading-tight"
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={index}
            ref={(el: HTMLSpanElement | null) => {
              wordRefs.current[index] = el;
            }}
            className="relative text-[2rem] sm:text-[2.5rem] font-bold cursor-pointer select-none"
            style={{
              filter: isActive ? "blur(0px)" : `blur(${blurAmount}px)`,
              transition: `filter ${animationDuration}s ease`,
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        );
      })}

      <motion.div
        className="absolute top-0 left-0 pointer-events-none box-border border-0"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 ? 1 : 0,
        }}
        transition={{ duration: animationDuration }}
        style={
          {
            "--border-color": borderColor,
            "--glow-color": glowColor,
          } as React.CSSProperties
        }
      >
        {["tl", "tr", "bl", "br"].map((corner) => {
          const pos =
            corner === "tl"
              ? "top-[-10px] left-[-10px] border-r-0 border-b-0"
              : corner === "tr"
              ? "top-[-10px] right-[-10px] border-l-0 border-b-0"
              : corner === "bl"
              ? "bottom-[-10px] left-[-10px] border-r-0 border-t-0"
              : "bottom-[-10px] right-[-10px] border-l-0 border-t-0";
          return (
            <span
              key={corner}
              className={`absolute w-4 h-4 border-[3px] rounded-[3px] ${pos}`}
              style={{
                borderColor: "var(--border-color)",
                filter: "drop-shadow(0 0 6px var(--glow-color))",
              }}
            ></span>
          );
        })}
      </motion.div>
    </div>
  );
};

export default TrueFocus;
