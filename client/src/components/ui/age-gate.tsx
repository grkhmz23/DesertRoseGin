import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface AgeGateProps {
  onVerify?: () => void;
}

export function AgeGate({ onVerify }: AgeGateProps) {
  const { t } = useTranslation('common');

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState<string | null>(null);

  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleDayChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 2);
    setDay(cleaned);
    setError(null);
    if (cleaned.length === 2) monthRef.current?.focus();
  };

  const handleMonthChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 2);
    setMonth(cleaned);
    setError(null);
    if (cleaned.length === 2) yearRef.current?.focus();
  };

  const handleYearChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 4);
    setYear(cleaned);
    setError(null);
  };

  const handleConfirm = () => {
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    // Basic validation
    if (
      !day || !month || !year ||
      isNaN(d) || isNaN(m) || isNaN(y) ||
      d < 1 || d > 31 ||
      m < 1 || m > 12 ||
      y < 1900 || y > new Date().getFullYear()
    ) {
      setError(t('ui.ageGate.invalidDate'));
      return;
    }

    const birthDate = new Date(y, m - 1, d);
    // Confirm the date didn't overflow (e.g. Feb 31)
    if (
      birthDate.getFullYear() !== y ||
      birthDate.getMonth() !== m - 1 ||
      birthDate.getDate() !== d
    ) {
      setError(t('ui.ageGate.invalidDate'));
      return;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setError(t('ui.ageGate.underage'));
      return;
    }

    document.body.style.overflow = "unset";
    if (onVerify) onVerify();
  };

  const handleExit = () => {
    window.location.href = "https://www.google.com";
  };

  const inputClass =
    "w-full bg-transparent border-b border-[#C79A5A]/40 text-center text-[#F7F2E8] font-hud tracking-[0.2em] text-lg py-2 outline-none focus:border-[#C79A5A] transition-colors duration-200 placeholder:text-[#F7F2E8]/25 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

  return (
    <AnimatePresence>
      <motion.div
        key="age-gate"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 z-[20000] overflow-y-auto px-4 py-4 sm:flex sm:items-center sm:justify-center sm:px-6 sm:py-6"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2B1810] via-[#4E3022] to-[#2B1810]" />

        {/* Grain */}
        <div className="absolute inset-0 opacity-20 mix-blend-soft-light pointer-events-none bg-[url('/textures/stardust.png')]" />

        {/* Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative my-auto w-full max-w-md border border-[#C79A5A]/25 bg-gradient-to-b from-[#2B1810]/90 via-[#4E3022]/95 to-[#2B1810]/98 px-5 py-6 shadow-2xl max-sm:min-h-[calc(100dvh-2rem)] max-sm:overflow-y-auto sm:px-8 sm:py-10"
        >
          {/* Brand mark */}
          <div className="mb-6 text-center sm:mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#C79A5A]/35 sm:h-14 sm:w-14">
              <span className="font-lux tracking-[0.25em] text-xs text-[#C79A5A]">DR</span>
            </div>
            <h1 className="mt-4 font-lux text-2xl tracking-wide text-[#F7F2E8] sm:mt-5 sm:text-3xl">Desert Rose Gin</h1>
            <p className="mt-2 font-hud text-[9px] uppercase tracking-[0.24em] text-[#C79A5A]/70 sm:text-[10px] sm:tracking-[0.3em]">
              {t('ui.ageGate.subtitle')}
            </p>
          </div>

          {/* Copy */}
          <p className="mb-6 text-center font-body text-sm leading-relaxed text-[#F7F2E8]/80 sm:mb-8">
            {t('ui.ageGate.message')}
          </p>

          {/* DOB label */}
          <p className="mb-4 text-center font-hud text-[9px] uppercase tracking-[0.24em] text-[#C79A5A]/70 sm:text-[10px] sm:tracking-[0.3em]">
            {t('ui.ageGate.dobLabel')}
          </p>

          {/* DOB inputs */}
          <div className="mb-2 grid grid-cols-3 gap-3 sm:flex sm:gap-4">
            <div className="flex-1 text-center">
              <input
                type="number"
                inputMode="numeric"
                placeholder={t('ui.ageGate.day')}
                value={day}
                onChange={(e) => handleDayChange(e.target.value)}
                min={1}
                max={31}
                className={inputClass}
              />
              <p className="mt-1 font-hud text-[9px] uppercase tracking-[0.2em] text-[#C79A5A]/40">
                {t('ui.ageGate.day')}
              </p>
            </div>
            <div className="flex-1 text-center">
              <input
                ref={monthRef}
                type="number"
                inputMode="numeric"
                placeholder={t('ui.ageGate.month')}
                value={month}
                onChange={(e) => handleMonthChange(e.target.value)}
                min={1}
                max={12}
                className={inputClass}
              />
              <p className="mt-1 font-hud text-[9px] uppercase tracking-[0.2em] text-[#C79A5A]/40">
                {t('ui.ageGate.month')}
              </p>
            </div>
            <div className="flex-[1.4] text-center">
              <input
                ref={yearRef}
                type="number"
                inputMode="numeric"
                placeholder={t('ui.ageGate.year')}
                value={year}
                onChange={(e) => handleYearChange(e.target.value)}
                min={1900}
                max={new Date().getFullYear()}
                className={inputClass}
              />
              <p className="mt-1 font-hud text-[9px] uppercase tracking-[0.2em] text-[#C79A5A]/40">
                {t('ui.ageGate.year')}
              </p>
            </div>
          </div>

          {/* Error */}
          <div className="mb-4 min-h-[20px]">
            <AnimatePresence>
              {error && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center font-hud text-[10px] uppercase tracking-[0.2em] text-red-400/80"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleConfirm}
              className="w-full border border-[#C79A5A]/60 px-5 py-3 font-hud text-[10px] uppercase tracking-[0.22em] text-[#C79A5A] transition-colors duration-300 hover:bg-[#C79A5A] hover:text-[#2B1810] sm:px-6 sm:text-[11px] sm:tracking-[0.25em]"
            >
              {t('ui.ageGate.enter')}
            </button>
            <button
              onClick={handleExit}
              className="w-full px-5 py-2 font-hud text-[9px] uppercase tracking-[0.22em] text-[#F7F2E8]/60 transition-colors duration-300 hover:bg-white/5 hover:text-[#F7F2E8] sm:px-6 sm:text-[10px] sm:tracking-[0.25em]"
            >
              {t('ui.ageGate.exit')}
            </button>
          </div>

          <p className="mt-5 text-center font-hud text-[9px] tracking-[0.18em] text-[#F7F2E8]/35 sm:text-[10px] sm:tracking-[0.2em]">
            {t('ui.product.responsibly')}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
