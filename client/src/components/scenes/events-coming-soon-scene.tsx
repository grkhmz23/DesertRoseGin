"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Sparkles, Mail, ArrowRight } from 'lucide-react';

export function EventsComingSoonScene() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#2B1810] via-[#1a100a] to-[#2B1810] overflow-hidden">
      {/* Background texture */}
      <div 
        className="absolute inset-0 opacity-5 mix-blend-overlay" 
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
      />

      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#CD7E31] blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#a65d3d] blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 md:px-12 text-center">

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 blur-xl opacity-50"
            >
              <Sparkles className="w-16 h-16 md:w-20 md:h-20 text-[#CD7E31]" />
            </motion.div>
            <Sparkles className="relative w-16 h-16 md:w-20 md:h-20 text-[#CD7E31]" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-light text-[#F5EFE6] mb-4 font-ergon"
        >
          Events & Partnership
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-[#CD7E31] uppercase tracking-[0.3em] mb-8 font-medium"
        >
          Coming Soon
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-base md:text-lg text-[#F5EFE6]/80 max-w-2xl leading-relaxed mb-12"
        >
          We're preparing something special. Exclusive tasting events, 
          collaborative partnerships, and unique experiences that celebrate 
          the spirit of Desert Rose Gin.
        </motion.p>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 max-w-4xl w-full"
        >
          {/* Feature 1 */}
          <div className="flex flex-col items-center p-6 bg-[#2B1810]/50 backdrop-blur-sm border border-[#CD7E31]/20 rounded-lg">
            <Calendar className="w-8 h-8 text-[#CD7E31] mb-3" />
            <h3 className="text-sm md:text-base font-medium text-[#F5EFE6] mb-2">
              Exclusive Events
            </h3>
            <p className="text-xs md:text-sm text-[#F5EFE6]/60 text-center">
              Private tastings and launch celebrations
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center p-6 bg-[#2B1810]/50 backdrop-blur-sm border border-[#CD7E31]/20 rounded-lg">
            <Users className="w-8 h-8 text-[#CD7E31] mb-3" />
            <h3 className="text-sm md:text-base font-medium text-[#F5EFE6] mb-2">
              Partnerships
            </h3>
            <p className="text-xs md:text-sm text-[#F5EFE6]/60 text-center">
              Collaborate with the Desert Rose team
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center p-6 bg-[#2B1810]/50 backdrop-blur-sm border border-[#CD7E31]/20 rounded-lg">
            <Sparkles className="w-8 h-8 text-[#CD7E31] mb-3" />
            <h3 className="text-sm md:text-base font-medium text-[#F5EFE6] mb-2">
              VIP Experiences
            </h3>
            <p className="text-xs md:text-sm text-[#F5EFE6]/60 text-center">
              Behind-the-scenes access and more
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <a
            href="mailto:events@desertrose.gin"
            className="group flex items-center gap-2 px-6 py-3 bg-[#CD7E31] text-[#2B1810] hover:bg-[#F5EFE6] transition-all duration-300 font-medium text-sm uppercase tracking-wider"
          >
            <Mail className="w-4 h-4" />
            Get Notified
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <p className="text-xs text-[#F5EFE6]/50 uppercase tracking-wider">
            or follow us on social media
          </p>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-xs text-[#F5EFE6]/40 uppercase tracking-widest"
        >
          Launching Q2 2025
        </motion.p>
      </div>
    </div>
  );
}