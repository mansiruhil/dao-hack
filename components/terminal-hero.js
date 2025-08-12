"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TypingLine } from "./typing-line";
import "@/styles/terminal.css";

export function TerminalHero({ onEnter = () => {}, autoProceed = false }) {
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [interactionEnabled, setInteractionEnabled] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Enter" && interactionEnabled) {
        onEnter();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onEnter, interactionEnabled]);

  const handleClick = () => {
    if (interactionEnabled) {
      onEnter();
    }
  };

  return (
    <section
      className="relative min-h-[100svh] flex items-center"
      ref={containerRef}
      onClick={handleClick}
      style={{ cursor: interactionEnabled ? "pointer" : "default" }}
    >
      <div className="mx-auto max-w-3xl w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="terminal-window"
        >
          <TypingLine
            text="> Initializing solmind..."
            onDone={() => setStep(1)}
          />
          {step >= 1 && (
            <TypingLine
              text="> Loading challenges..."
              delay={0.2}
              onDone={() => setStep(2)}
            />
          )}
          {step >= 2 && (
            <TypingLine
              text="> Ready. Press [Enter] or click anywhere to start."
              delay={0.2}
              glow
              onDone={() => {
                setFinished(true);
                setInteractionEnabled(true);
              }}
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}
