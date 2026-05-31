'use client'

import React from "react"
import { MOCK_NOTIFICATIONS } from "@/data/mock-notifications"

export function NotificationMarquee() {
  const activeNotifications = MOCK_NOTIFICATIONS.filter(notif => notif.isActive)

  if (activeNotifications.length === 0) return null

  const marqueeContent = activeNotifications.map((notif, index) => {
    // Remove emojis like 🎉 and 🔥 and trim
    const cleanMessage = notif.message.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
    return (
      <React.Fragment key={notif._id}>
        {index > 0 && <span className="opacity-50 mx-4"> • </span>}
        <span className="inline-flex items-center gap-2">
          <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-white/25 text-white tracking-widest leading-none">New</span>
          {cleanMessage}
        </span>
      </React.Fragment>
    )
  });

  return (
    <div id="notification-marquee" className="relative w-full bg-indigo-600 text-white overflow-hidden py-2 h-9 flex items-center z-30 transition-colors duration-200">
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .marquee-container {
          display: flex;
          align-items: center;
          white-space: nowrap;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .marquee-container:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      {/* Repeating the content to ensure seamless wrapping */}
      <div className="marquee-container text-xs font-medium tracking-wide">
        <div className="flex items-center pr-4">{marqueeContent}</div>
        <div className="flex items-center pr-4"><span className="opacity-50 mx-4"> • </span>{marqueeContent}</div>
        <div className="flex items-center pr-4"><span className="opacity-50 mx-4"> • </span>{marqueeContent}</div>
        <div className="flex items-center pr-4"><span className="opacity-50 mx-4"> • </span>{marqueeContent}</div>
      </div>
    </div>
  )
}
