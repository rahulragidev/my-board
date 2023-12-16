import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Board from "@/components/Board";
import Image from "next/image";

export default function Home() {
  const [isLogoAnimated, setIsLogoAnimated] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    const image = new window.Image();
    image.src = "/images/logo.png";
    image.onload = () => console.log("Logo preloaded");

    if (typeof window !== "undefined") {
      // Code that should run only in the browser
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) {
        setIsLogoAnimated(true);
        setIsContentVisible(true);
      }

      if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
          navigator.serviceWorker.register("/service-worker.js").then((reg) => {
            console.log("Service worker registered.", reg);
          });
        });
      }
    }
  }, []);

  const handleAnimationComplete = () => {
    setIsLogoAnimated(true);

    // Delay the display of content for a smooth transition
    setTimeout(() => {
      setIsContentVisible(true);
    }, 500); // Adjust the delay as needed for optimal user experience
  };

  const logoVariants = {
    initial: { scale: 6, opacity: 0, rotate: 360 },
    animate: { scale: 1, opacity: 1, rotate: 0 },
    exit: { scale: 0.2, opacity: 0.5, top: 20, left: 20 },
  };

  const contentVariants = {
    initial: { y: -30, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 2 }}
      className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-200"
    >
      <AnimatePresence>
        {!isLogoAnimated && (
          <motion.div
            variants={logoVariants}
            transition={{ duration: 2, type: "spring" }}
            onAnimationComplete={handleAnimationComplete}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={200}
              height={200}
              className="rounded-full shadow-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {isContentVisible && (
        <>
          <motion.div
            variants={contentVariants}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="w-full"
          >
            <Board />
          </motion.div>

          <motion.p
            variants={contentVariants}
            transition={{ delay: 1, duration: 0.7 }}
            className="text-gray-300 font-semibold my-2 text-sm tracking-wide"
          >
            Created by Rahul Ragi
          </motion.p>
        </>
      )}
    </motion.div>
  );
}
