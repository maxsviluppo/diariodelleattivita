import React from "react";
import * as Icons from "lucide-react";

interface IconRendererProps {
  name: string;
  className?: string;
  id?: string;
}

export default function IconRenderer({ name, className, id }: IconRendererProps) {
  if (name === "HighHeel") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        id={id}
      >
        <path d="M4 18h3.5a1.5 1.5 0 0 0 1.3 -.75l3.4 -5.8a1.5 1.5 0 0 1 1.3 -.75h6.5a2 2 0 0 1 2 2v1a1 1 0 0 1 -1 1h-1.5a1 1 0 0 1 -1 -1v-1" />
        <path d="M19 15v5H17.5" />
      </svg>
    );
  }
  if (name.startsWith("Baby")) {
    switch (name) {
      case "BabyBottle":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M8 8.5h8v9.5a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z" />
            <rect x="9" y="5.5" width="6" height="3" rx="1" />
            <path d="M11 5.5v-1.5a1 1 0 0 1 2 0v1.5" />
            <line x1="10" y1="11" x2="12" y2="11" />
            <line x1="10" y1="14" x2="13" y2="14" />
            <line x1="10" y1="17" x2="11.5" y2="17" />
          </svg>
        );
      case "BabyPacifier":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <circle cx="12" cy="17" r="4" />
            <path d="M5 11.5a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-1a1.5 1.5 0 0 0-1.5-1.5h-11A1.5 1.5 0 0 0 5 10.5z" />
            <path d="M9 8.5C9 5.5 10.5 4 12 4s3 1.5 3 4.5" />
          </svg>
        );
      case "BabyStroller":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <circle cx="8" cy="19" r="2" />
            <circle cx="16" cy="19" r="2" />
            <path d="M5 11h11a4 4 0 0 1 4 4v.5" />
            <path d="M8 17h8" />
            <path d="M5 11l2 6" />
            <path d="M16 11c-2-6-10-5-10 0" />
            <path d="M4 11s-2-3-2-5a1 1 0 0 1 1-1" />
          </svg>
        );
      case "BabyOnesie":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M9 3H7a1 1 0 0 0-1 1v3.5l2 1.5v7l-2 1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1l-2-1v-7l2-1.5V4a1 1 0 0 0-1-1h-2" />
            <path d="M9 3a3 3 0 0 0 6 0" />
            <path d="M12 11.5c.5-.8 1.5-1.2 2-0.5s0 1.5-2 2.5c-2-1-2.5-1.8-2-2.5s1.5-.3 2 .5z" fill="currentColor" fillOpacity="0.4" />
          </svg>
        );
      case "BabyRattle":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <circle cx="12" cy="19" r="2.5" />
            <line x1="12" y1="16.5" x2="12" y2="10" />
            <circle cx="12" cy="6.5" r="3.5" />
            <circle cx="12" cy="6.5" r="1.2" fill="currentColor" />
            <path d="M7.5 6.5h1.5M15 6.5h1.5" />
          </svg>
        );
      case "BabyCrib":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <rect x="4" y="6" width="16" height="11" rx="1.5" />
            <line x1="8" y1="6" x2="8" y2="17" />
            <line x1="12" y1="6" x2="12" y2="17" />
            <line x1="16" y1="6" x2="16" y2="17" />
            <line x1="5" y1="17" x2="5" y2="21" />
            <line x1="19" y1="17" x2="19" y2="21" />
            <path d="M3 21a10 10 0 0 0 18 0" />
          </svg>
        );
      case "BabySocks":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M5 6v6a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2V6H5z" />
            <line x1="5" y1="8" x2="12" y2="8" />
            <path d="M12 9v6a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2V9h-7z" />
            <line x1="12" y1="11" x2="19" y2="11" />
          </svg>
        );
      case "BabyDiaper":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M4 6h16v3.5c0 1.5-1 4.5-8 7.5-7-3-8-6-8-3.5z" />
            <line x1="4" y1="9" x2="20" y2="9" />
            <rect x="5" y="7" width="2.5" height="1" rx="0.5" fill="currentColor" />
            <rect x="16.5" y="7" width="2.5" height="1" rx="0.5" fill="currentColor" />
            <path d="M11 11h2c.5 0 .5.8 0 .8h-2c-.5 0-.5-.8 0-.8z" />
          </svg>
        );
      case "BabyBib":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M9 5a3 3 0 0 1 6 0" />
            <path d="M9 5S7 3 7 1" />
            <path d="M15 5S17 3 17 1" />
            <path d="M6 5.5v7a6 6 0 0 0 12 0v-7h-12z" />
            <path d="M8 9.5h8v2.5a4 4 0 0 1-8 0z" />
          </svg>
        );
      case "BabyTeddy":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <circle cx="12" cy="11.5" r="4.5" />
            <circle cx="8" cy="7.5" r="1.8" />
            <circle cx="16" cy="7.5" r="1.8" />
            <circle cx="10.5" cy="11" r="0.6" fill="currentColor" />
            <circle cx="13.5" cy="11" r="0.6" fill="currentColor" />
            <ellipse cx="12" cy="12.8" rx="1.2" ry="0.8" fill="currentColor" fillOpacity="0.2" />
            <polygon points="11.5,12.5 12.5,12.5 12,13" fill="currentColor" />
            <path d="M11.5 13.5c.2.2.5.2.5 0s.3-.2.5 0" />
            <path d="M8.5 16C7 17.5 7 21 12 21s5-3.5 3.5-5" />
          </svg>
        );
      case "BabyBalloon":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <ellipse cx="12" cy="9.5" rx="6" ry="7" />
            <polygon points="11,16.5 13,16.5 12,18" fill="currentColor" />
            <path d="M12 18c0 3-2 3-2 5" />
            <ellipse cx="9" cy="7" rx="1.2" ry="2" opacity="0.35" fill="currentColor" transform="rotate(-15 9 7)" />
          </svg>
        );
      case "BabyBlocks":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <rect x="3" y="11" width="8" height="8" rx="1" />
            <rect x="13" y="11" width="8" height="8" rx="1" />
            <rect x="8" y="3" width="8" height="8" rx="1" />
            <line x1="5.5" y1="17" x2="8.5" y2="17" />
            <line x1="15.5" y1="17" x2="18.5" y2="17" />
            <line x1="10.5" y1="9" x2="13.5" y2="9" />
          </svg>
        );
      case "BabyDuck":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <circle cx="15.5" cy="8.5" r="3.5" />
            <path d="M19 8.5c1.5-.2 2-.8 2-.8h-2" fill="currentColor" />
            <circle cx="14.5" cy="7.5" r="0.6" fill="currentColor" />
            <path d="M12 11c-2.5-1-6-.5-7 2.5s2.5 5.5 7 5.5h4c2.5 0 3-2.5 3-4s-1-4-7-4" />
            <path d="M9 13.5c1-1 3-1 3.5.5s-1.5 2-3.5-.5" fill="currentColor" fillOpacity="0.2" />
          </svg>
        );
      case "BabyElephant":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M16 11c0-4.5-5.5-5-8.5-4s-3.5 4-3.5 7.5c0 1.5 1 2 2 2h6c2.5 0 4-2.5 4-5.5z" />
            <path d="M16 11.5s2-.5 2.5.5s-.3 3.5 2 3.5c1 0 1.2-1.5.5-2" />
            <ellipse cx="10" cy="11.5" rx="2.8" ry="3.8" fill="currentColor" fillOpacity="0.25" />
            <rect x="6" y="15.5" width="2" height="4.5" rx="0.5" />
            <rect x="11.5" y="15.5" width="2" height="4.5" rx="0.5" />
            <circle cx="13.5" cy="10" r="0.6" fill="currentColor" />
          </svg>
        );
      case "BabyStork":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M21 7.5A1.5 1.5 0 1 0 19.5 6h.5c.5.5 1 2 1 1.5z" />
            <path d="M19.5 7.5S17 10 17 12" />
            <line x1="21" y1="7.5" x2="23" y2="7.5" strokeWidth="2" stroke="#ea580c" />
            <ellipse cx="13" cy="13.5" rx="4.5" ry="2.5" />
            <line x1="11.5" y1="16" x2="11.5" y2="21" />
            <line x1="14" y1="16" x2="14.5" y2="21" />
            <path d="M12 14.5l-4-5C6 7.5 3 7.5 3 11a4 4 0 0 0 6 3" fill="currentColor" fillOpacity="0.1" />
          </svg>
        );
      case "BabySafetyPin":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M7 17a3 3 0 1 0 6 0" />
            <line x1="7" y1="17" x2="7" y2="6.5" />
            <line x1="13" y1="17" x2="15.5" y2="8" />
            <rect x="5.5" y="3" width="3.5" height="4" rx="1" fill="currentColor" />
          </svg>
        );
      case "BabyHeart":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M12 21s-6.5-4-8.5-7a5 5 0 0 1 8.5-5 5 5 0 0 1 8.5 5c-2 3-8.5 7-8.5 7z" fill="currentColor" fillOpacity="0.15" />
            <circle cx="9.5" cy="11.5" r="0.6" fill="currentColor" />
            <circle cx="14.5" cy="11.5" r="0.6" fill="currentColor" />
            <path d="M10.5 13.5a2 2 0 0 0 3 0" />
          </svg>
        );
      case "BabyFootprint":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M11 15.5c0 2.5-1 4.5-3 4.5s-2.5-1.5-2.5-3.5S7 11 8.5 11c1.5 0 2.5 2 2.5 4.5z" fill="currentColor" fillOpacity="0.3" />
            <circle cx="7.5" cy="7.5" r="1.1" fill="currentColor" />
            <circle cx="9.5" cy="8.5" r="0.9" fill="currentColor" />
            <circle cx="11.2" cy="10" r="0.8" fill="currentColor" />
            <circle cx="12.5" cy="11.8" r="0.7" fill="currentColor" />
            <circle cx="6.1" cy="8.2" r="1" fill="currentColor" />
          </svg>
        );
      case "BabyMobile":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <line x1="12" y1="2" x2="12" y2="8" />
            <path d="M5 8h14" />
            <line x1="5" y1="8" x2="5" y2="12" />
            <path d="M5 13l3.5-2.5h-5.5" />
            <line x1="12" y1="8" x2="12" y2="13" />
            <path d="M11.5 14.5a2 2 0 0 0 2.5 2 2.2 2.2 0 1 1-2.5-2z" fill="currentColor" />
            <line x1="19" y1="8" x2="19" y2="12" />
            <path d="M19 13s.8-.5 1.2-.5s.8.3.8.8s-1 1.2-1 1.2z" fill="currentColor" />
          </svg>
        );
      case "BabyCloud":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M5 16s-2 0-2-3c0-3.5 3-4 4-3a5 5 0 0 1 9-2c1.5-.5 5 1 5 4.5c0 3.5-3.5 3.5-3.5 3.5z" />
            <circle cx="8" cy="19.5" r="0.8" fill="currentColor" />
            <circle cx="12" cy="21.5" r="0.8" fill="currentColor" />
            <circle cx="16" cy="19.5" r="0.8" fill="currentColor" />
          </svg>
        );
      case "BabyShower":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            {/* Gift Box Base */}
            <rect x="5" y="11" width="10" height="9" rx="1" fill="currentColor" fillOpacity="0.1" />
            <rect x="4" y="9" width="12" height="2" rx="0.5" />
            <path d="M10 9v11M5 15h10" />
            {/* Bow ribbon loops on the gift box */}
            <path d="M10 9c-1.5-2.5-4-2-3-0.5C8 9.5 10 9 10 9z" />
            <path d="M10 9c1.5-2.5 4-2 3-0.5C12 9.5 10 9 10 9z" />
            {/* Upright balloon connected with cute string */}
            <circle cx="17" cy="6" r="3.5" fill="currentColor" fillOpacity="0.3" p-id="balloon" />
            <path d="M17 9.5c0 1.5-2 2-2 4l-1.5 2" />
            {/* Festive sparkle star */}
            <path d="M21 11.5l1 1-1 1-1-1z" fill="currentColor" />
          </svg>
        );
    }
  }
  if (name.startsWith("Travel")) {
    switch (name) {
      case "TravelGlobe":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
        );
      case "TravelPlane":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3.5s-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.9-.2-1.7.3-1.9 1.2V8l7.5 4.5-3 3H5l-2 2h3l2-1 3-3 4.5 7.5c.2.5.5.8 1 .8h.3c.9-.2 1.4-1 1-1.8z" />
          </svg>
        );
      case "TravelSuitcase":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <rect x="3" y="6" width="18" height="14" rx="2" />
            <path d="M16 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
            <line x1="12" y1="6" x2="12" y2="20" />
          </svg>
        );
      case "TravelMap":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M3 6V22l6-4 6 4 6-4V2l-6 4L9 2z" />
            <line x1="9" y1="2" x2="9" y2="18" />
            <line x1="15" y1="6" x2="15" y2="22" />
          </svg>
        );
      case "TravelCompass":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="currentColor" fillOpacity="0.2" />
          </svg>
        );
      case "TravelPassport":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <rect x="4" y="3" width="16" height="18" rx="2" />
            <circle cx="12" cy="11" r="3" fill="currentColor" fillOpacity="0.2" />
            <line x1="8" y1="16" x2="16" y2="16" />
            <line x1="10" y1="18" x2="14" y2="18" />
          </svg>
        );
      case "TravelCamera":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" fill="currentColor" fillOpacity="0.1" />
          </svg>
        );
      case "TravelBackpack":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <rect x="4" y="8" width="16" height="12" rx="2" />
            <path d="M9 8V4a3 3 0 0 1 6 0v4" />
            <path d="M8 8V4" />
            <path d="M16 8V4" />
            <path d="M4 12h16" />
            <rect x="8" y="14" width="8" height="6" rx="1" fill="currentColor" fillOpacity="0.2" />
          </svg>
        );
      case "TravelHotel":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M3 21h18" />
            <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
            <rect x="9" y="15" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.2" />
            <circle cx="8" cy="7" r="1.1" />
            <circle cx="12" cy="7" r="1.1" />
            <circle cx="16" cy="7" r="1.1" />
            <circle cx="8" cy="11" r="1.1" />
            <circle cx="12" cy="11" r="1.1" />
            <circle cx="16" cy="11" r="1.1" />
          </svg>
        );
      case "TravelTent":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <polygon points="12 2 2 22 22 22" fill="currentColor" fillOpacity="0.1" />
            <line x1="12" y1="2" x2="12" y2="22" />
            <polygon points="12 10 7 22 17 22" />
          </svg>
        );
      case "TravelBinoculars":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M8 3H4a2 2 0 0 0-2 2v12a4 4 0 0 0 8 0V5a2 2 0 0 0-2-2z" />
            <path d="M20 3h-4a2 2 0 0 0-2 2v12a4 4 0 0 0 8 0V5a2 2 0 0 0-2-2z" />
            <line x1="8" y1="7" x2="16" y2="7" />
            <line x1="10" y1="12" x2="14" y2="12" />
          </svg>
        );
      case "TravelBeach":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M2 20c5 0 8-2 10-2s5 2 10 2" strokeWidth="2" stroke="currentColor" />
            <path d="M6 18c0-4.5 2.5-9 6.5-11.5L10 6.5c-3.5 2-6 5.5-6 11.5z" fill="currentColor" fillOpacity="0.25" />
            <path d="M12 6.5C13 4 15.5 3 18 3.5s3 3 2 5.5-3.5 1-4.5-2.5z" />
          </svg>
        );
      case "TravelCampfire":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M5 19 19 5M19 19 5 5" strokeWidth="2.5" />
            <path d="M12 2C8.5 7 8 13.5 12 16c4-2.5 3.5-9 0-14z" fill="currentColor" fillOpacity="0.35" />
            <path d="M12 7c-1.5 2-1.5 5 0 6s1.5-4 0-6z" fill="currentColor" />
          </svg>
        );
      case "TravelMountain":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <polygon points="3 20 9 10 13 16 19 8 22 20" fill="currentColor" fillOpacity="0.15" />
            <polygon points="19 8 17 11 15 9" fill="currentColor" />
          </svg>
        );
      case "TravelTickets":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <rect x="2" y="5" width="14" height="11" rx="2" transform="rotate(-10 9 10)" />
            <rect x="6" y="8" width="14" height="11" rx="2" transform="rotate(5 13 13)" fill="currentColor" fillOpacity="0.15" />
            <circle cx="7" cy="11" r="1" />
            <circle cx="15" cy="14" r="1" />
          </svg>
        );
      case "TravelCocktail":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <polygon points="3 3 21 3 12 13" fill="currentColor" fillOpacity="0.15" />
            <line x1="12" y1="13" x2="12" y2="21" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <circle cx="16" cy="6" r="1" fill="currentColor" />
            <line x1="6" y1="9" x2="18" y2="9" />
          </svg>
        );
      case "TravelPostcard":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <line x1="12" y1="4" x2="12" y2="20" strokeDasharray="3,3" />
            <rect x="17" y="6" width="3" height="4" rx="0.5" fill="currentColor" fillOpacity="0.2" />
            <line x1="4" y1="8" x2="10" y2="8" />
            <line x1="4" y1="12" x2="10" y2="12" />
          </svg>
        );
      case "TravelSunbed":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M22 17H6a2 2 0 0 1-2-2V9h1.5a1 1 0 0 1 1 1v2l13.5 3V17c1 0 2-.8 2-2" />
            <line x1="8" y1="16" x2="8" y2="20" />
            <line x1="18" y1="16" x2="18" y2="20" />
          </svg>
        );
      case "TravelLuggageTag":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M12.5 2.5a2 2 0 0 0-3 0L3 9.5a2 2 0 0 0 0 3l8.5 8.5a2 2 0 0 0 3 0l6.5-6.5a2 2 0 0 0 0-3z" />
            <circle cx="16" cy="8" r="1.5" fill="currentColor" />
            <line x1="7" y1="13" x2="13" y2="13" />
          </svg>
        );
      case "TravelHotAirBalloon":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M12 2a8 8 0 0 0-8 8c0 3 1.5 5 4 7.5L10 20h4l2-2.5c2.5-2.5 4-4.5 4-7.5a8 8 0 0 0-8-8z" fill="currentColor" fillOpacity="0.15" />
            <rect x="10" y="21" width="4" height="2" rx="0.5" fill="currentColor" />
            <line x1="8" y1="17.5" x2="10" y2="21" />
            <line x1="16" y1="17.5" x2="14" y2="21" />
          </svg>
        );
    }
  }
  if (name.startsWith("Transit")) {
    switch (name) {
      case "TransitScooter":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <circle cx="5" cy="18" r="2.5" />
            <circle cx="19" cy="18" r="2.5" />
            <path d="M18 18H7.5" strokeWidth="2" />
            <path d="M15 18l-5-13" strokeWidth="1.8" />
            <path d="M11.5 5h-4" strokeWidth="1.8" />
            <ellipse cx="14" cy="14" rx="1.5" ry="1" fill="currentColor" fillOpacity="0.2" />
          </svg>
        );
      case "TransitBike":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <circle cx="5" cy="15" r="3" />
            <circle cx="19" cy="15" r="3" />
            <path d="M12 15V8.5L16 4.5" />
            <line x1="12" y1="8.5" x2="8" y2="8.5" />
            <line x1="16" y1="4.5" x2="12" y2="4.5" />
            <polygon points="5,15 12,8.5 19,15 12,15" fill="currentColor" fillOpacity="0.15" />
          </svg>
        );
      case "TransitCarRental":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 6 16 6H8S5.3 10.6 3.5 11.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2.5" />
            <circle cx="17" cy="17" r="2.5" />
            <path d="M5 14h14" />
            <path d="M10 8h4" strokeWidth="2" stroke="currentColor" />
          </svg>
        );
      case "TransitBus":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <rect x="4" y="3" width="16" height="14" rx="2" />
            <line x1="4" y1="11" x2="20" y2="11" />
            <rect x="6" y="5" width="4" height="4" rx="0.5" />
            <rect x="14" y="5" width="4" height="4" rx="0.5" />
            <circle cx="7.5" cy="19" r="1.5" />
            <circle cx="16.5" cy="19" r="1.5" />
            <line x1="9" y1="17" x2="15" y2="17" />
          </svg>
        );
      case "TransitMetro":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <rect x="4" y="4" width="16" height="12" rx="3" />
            <path d="M12 4v12" />
            <circle cx="8" cy="11" r="1" fill="currentColor" />
            <circle cx="16" cy="11" r="1" fill="currentColor" />
            <line x1="6" y1="16" x2="4" y2="20" />
            <line x1="18" y1="16" x2="20" y2="20" />
            <path d="M9 20h6" strokeWidth="1.5" />
          </svg>
        );
      case "TransitTrain":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <rect x="4" y="3" width="16" height="15" rx="2" />
            <rect x="6" y="5" width="12" height="6" rx="0.5" fill="currentColor" fillOpacity="0.1" />
            <circle cx="8" cy="15" r="1.5" />
            <circle cx="16" cy="15" r="1.5" />
            <line x1="3" y1="21" x2="21" y2="21" strokeWidth="2" />
            <line x1="6" y1="18" x2="6" y2="21" />
            <line x1="18" y1="18" x2="18" y2="21" />
          </svg>
        );
      case "TransitTaxi":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M19 17h2c.6 0 1-.4 1-1v-3l-3.5-5.5H5.5L2 13v3c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />
            <rect x="9" y="3" width="6" height="3" rx="1" fill="currentColor" />
            <line x1="4" y1="12" x2="20" y2="12" />
          </svg>
        );
      case "TransitWalk":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <circle cx="13" cy="4" r="2" fill="currentColor" />
            <path d="M13 6l-3 4-2-1 1-3H5" />
            <path d="M13 10V15l-3 5H8l2.5-5.5L10 10" />
            <path d="M13 10l3 3.5 2.5-1" />
          </svg>
        );
      case "TransitTicketSharing":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 11a3 3 0 0 1 3-3V11z" fill="currentColor" />
            <path d="M21 11a3 3 0 0 0-3-3V11z" fill="currentColor" />
            <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
          </svg>
        );
      case "TransitChargingStation":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <rect x="4" y="3" width="10" height="18" rx="2" />
            <path d="M9 13v-4l-3 3h4z" fill="currentColor" />
            <path d="M14 6h3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1" />
            <circle cx="17" cy="16" r="1.5" fill="currentColor" />
          </svg>
        );
    }
  }
  if (name.startsWith("Face") || name.startsWith("Kid")) {
    let eyes: React.ReactNode = null;
    let mouth: React.ReactNode = null;
    let head: React.ReactNode = <circle cx="12" cy="12" r="9" />;
    let eyebrows: React.ReactNode = null;
    let extra: React.ReactNode = null;

    const eyeNormal = (
      <>
        <circle cx="9" cy="10.5" r="1.2" fill="currentColor" />
        <circle cx="15" cy="10.5" r="1.2" fill="currentColor" />
      </>
    );

    const mouthSmile = <path d="M8 15a4 4 0 0 0 8 0" />;

    switch (name) {
      case "FaceSmile":
        eyes = eyeNormal;
        mouth = mouthSmile;
        break;
      case "FaceFrown":
        eyes = eyeNormal;
        mouth = <path d="M8 17a4 4 0 0 1 8 0" />;
        break;
      case "FaceMeh":
        eyes = eyeNormal;
        mouth = <line x1="8.5" y1="15" x2="15.5" y2="15" />;
        break;
      case "FaceWink":
        eyes = (
          <>
            <path d="M7.5 10.5h3" />
            <circle cx="15" cy="10.5" r="1.2" fill="currentColor" />
          </>
        );
        mouth = mouthSmile;
        break;
      case "FaceLaugh":
        eyes = (
          <>
            <path d="M7.5 10a1.5 1.5 0 0 1 3 0" />
            <path d="M13.5 10a1.5 1.5 0 0 1 3 0" />
          </>
        );
        mouth = (
          <path d="M8 14a4 4 0 0 0 8 0H8z" fill="currentColor" fillOpacity="0.25" />
        );
        break;
      case "FaceAngry":
        eyes = eyeNormal;
        eyebrows = (
          <>
            <path d="M7 8l2.5 1" />
            <path d="M17 8l-2.5 1" />
          </>
        );
        mouth = <path d="M9.5 16s1.5-1 2.5-1 2.5 1 2.5 1" />;
        break;
      case "FaceWorried":
        eyes = eyeNormal;
        eyebrows = (
          <>
            <path d="M7 9.5a1.5 1.5 0 0 1 3-0.5" />
            <path d="M14 9a1.5 1.5 0 0 1 3 .5" />
          </>
        );
        mouth = <path d="M9 16.5c1-1.5 5-1.5 6 0" />;
        break;
      case "FaceSurprised":
        eyes = (
          <>
            <circle cx="9" cy="10" r="1.5" />
            <circle cx="15" cy="10" r="1.5" />
          </>
        );
        mouth = <circle cx="12" cy="15" r="2" />;
        break;
      case "FaceCry":
        eyes = (
          <>
            <circle cx="9" cy="10.5" r="1.2" fill="currentColor" />
            <circle cx="15" cy="10.5" r="1.2" fill="currentColor" />
            <path d="M9 12v3" stroke="#38bdf8" strokeWidth="1.2" />
            <path d="M15 12v3" stroke="#38bdf8" strokeWidth="1.2" />
          </>
        );
        mouth = <path d="M9 17a3 3 0 0 1 6 0" />;
        break;
      case "FaceLove":
        eyes = (
          <>
            <path d="M7.5 9.5a1.2 1.2 0 0 0 2 0c0-1.5-2-2.5-2-2.5S5.5 8 5.5 9.5a1.2 1.2 0 0 0 2 0z" fill="currentColor" />
            <path d="M14.5 9.5a1.2 1.2 0 0 0 2 0c0-1.5-2-2.5-2-2.5s-2 1-2 2.5a1.2 1.2 0 0 0 2 0z" fill="currentColor" />
          </>
        );
        mouth = mouthSmile;
        break;
      case "FaceCool":
        eyes = (
          <>
            <rect x="6" y="9" width="4.5" height="3" rx="1.5" fill="currentColor" />
            <rect x="13.5" y="9" width="4.5" height="3" rx="1.5" fill="currentColor" />
            <line x1="10.5" y1="10" x2="13.5" y2="10" />
            <line x1="6" y1="10" x2="4" y2="9.5" />
            <line x1="18" y1="10" x2="20" y2="9.5" />
          </>
        );
        mouth = <path d="M9 15a3 3 0 0 0 6 0" />;
        break;
      case "FaceSleep":
        eyes = (
          <>
            <path d="M7 10a2 2 0 0 0 4 0" />
            <path d="M13 10a2 2 0 0 0 4 0" />
          </>
        );
        mouth = <circle cx="12" cy="15.5" r="1.2" fill="currentColor" />;
        extra = (
          <>
            <path d="M17 6h2l-2 2h2" stroke="currentColor" strokeWidth="1" />
            <path d="M19 4h1.5l-1.5 1.5h1.5" stroke="currentColor" strokeWidth="0.8" />
          </>
        );
        break;
      case "FaceNervous":
        eyes = eyeNormal;
        mouth = <path d="M8.5 15.5l1.5-1 1.5 1 1.5-1 1.5 1 1.5-1" />;
        break;
      case "FaceSweat":
        eyes = eyeNormal;
        mouth = <path d="M9 16c1-1 5-1 6 0" />;
        extra = <path d="M5.5 8.5C5 9.5 4.5 11 5 12c.5 1-.5 1-1 0s0-2 .5-3.5" stroke="#38bdf8" fill="none" />;
        break;
      case "FaceKiss":
        eyes = eyeNormal;
        mouth = <path d="M10 15a2 2 0 0 1 4 0c0-0.8-0.8-1.2-1.5-1.2S11 14.2 10 15z" />;
        extra = <path d="M17.5 14.5a1 1 0 0 0 1 1c0-1-1-1.5-1-1.5s-.5.5-.5 1a1 1 0 0 0 1-0.5" fill="currentColor" />;
        break;
      case "FaceTongue":
        eyes = eyeNormal;
        mouth = (
          <>
            <path d="M8 14h8" />
            <path d="M10 14v2.5a2 2 0 0 0 4 0V14" fill="currentColor" />
          </>
        );
        break;
      case "FaceDizzy":
        eyes = (
          <>
            <path d="M7.5 9l3 3M10.5 9l-3 3M13.5 9l3 3M16.5 9l-3 3" />
          </>
        );
        mouth = <circle cx="12" cy="15.5" r="2" />;
        break;
      case "FaceBlush":
        eyes = eyeNormal;
        mouth = mouthSmile;
        extra = (
          <>
            <ellipse cx="6" cy="12" rx="1.5" ry="0.8" fill="currentColor" opacity="0.3" />
            <ellipse cx="18" cy="12" rx="1.5" ry="0.8" fill="currentColor" opacity="0.3" />
          </>
        );
        break;
      case "FaceShock":
        eyes = (
          <>
            <circle cx="8.5" cy="10" r="1.8" />
            <circle cx="15.5" cy="10" r="1.8" />
          </>
        );
        mouth = <ellipse cx="12" cy="15" rx="3" ry="1.8" fill="currentColor" fillOpacity="0.2" />;
        break;
      case "FaceBored":
        eyes = (
          <>
            <line x1="7" y1="10" x2="11" y2="10" />
            <line x1="13" y1="10" x2="17" y2="10" />
          </>
        );
        mouth = <line x1="9" y1="15" x2="15" y2="15" />;
        break;
      case "FaceRelieved":
        eyes = (
          <>
            <path d="M7 11a2 2 0 0 1 4 0" />
            <path d="M13 11a2 2 0 0 1 4 0" />
          </>
        );
        mouth = <path d="M9 14.5a3 3 0 0 0 6 0" />;
        break;
      case "FaceScream":
        eyes = (
          <>
            <ellipse cx="8" cy="9.5" rx="1.5" ry="2.2" />
            <ellipse cx="16" cy="9.5" rx="1.5" ry="2.2" />
          </>
        );
        mouth = <ellipse cx="12" cy="15.5" rx="2.5" ry="3.5" fill="currentColor" />;
        break;
      case "FaceYawn":
        eyes = (
          <>
            <path d="M7.5 10.5a1.5 1.5 0 0 1 3 0" />
            <path d="M13.5 10.5a1.5 1.5 0 0 1 3 0" />
          </>
        );
        mouth = <circle cx="12" cy="15" r="3" fill="currentColor" opacity="0.15" />;
        extra = <path d="M5.5 15h2" />;
        break;
      case "FaceSmug":
        eyes = (
          <>
            <path d="M7 11a1.5 1.5 0 0 1 3-0.5" />
            <circle cx="15" cy="10.5" r="1.2" fill="currentColor" />
          </>
        );
        mouth = <path d="M8.5 16c2-0.5 5-2 6.5-1.5" />;
        break;
      case "FaceDetermined":
        eyes = eyeNormal;
        eyebrows = (
          <>
            <line x1="7" y1="8.5" x2="11" y2="9.5" />
            <line x1="17" y1="8.5" x2="13" y2="9.5" />
          </>
        );
        mouth = <path d="M9 15.5c2 0.5 4 0.5 6 0" />;
        break;
      case "FaceSceptic":
        eyes = (
          <>
            <circle cx="8.5" cy="11" r="1" fill="currentColor" />
            <circle cx="15.5" cy="10" r="1.5" fill="currentColor" />
          </>
        );
        eyebrows = (
          <>
            <line x1="7" y1="10" x2="10" y2="10" />
            <line x1="13" y1="8" x2="17" y2="9" />
          </>
        );
        mouth = <line x1="9" y1="15" x2="15" y2="14" />;
        break;
      case "FaceShy":
        eyes = eyeNormal;
        mouth = <path d="M9.5 15a2.5 2.5 0 0 0 5 0" />;
        extra = (
          <>
            <line x1="5.5" y1="12.5" x2="6.5" y2="11.5" stroke="#f43f5e" />
            <line x1="17.5" y1="12.5" x2="18.5" y2="11.5" stroke="#f43f5e" />
          </>
        );
        break;
      case "FaceSick":
        eyes = (
          <>
            <line x1="7" y1="10.5" x2="10.5" y2="10.5" />
            <line x1="13.5" y1="10.5" x2="17" y2="10.5" />
          </>
        );
        mouth = (
          <rect x="8" y="13" width="8" height="4" rx="1" fill="currentColor" fillOpacity="0.2" />
        );
        break;
      case "FaceQuiet":
        eyes = eyeNormal;
        mouth = <line x1="10" y1="15" x2="14" y2="15" />;
        extra = <line x1="12" y1="13" x2="12" y2="17" strokeWidth="2.5" />;
        break;
      case "FaceThinking":
        eyes = eyeNormal;
        eyebrows = <path d="M13.5 8a1.5 1.5 0 0 1 3 0.5" />;
        mouth = <path d="M9 15c1 0.5 4 0.5 5-0.5" />;
        extra = <path d="M9.5 18a1.5 1.5 0 0 1-1.5 1.5H7.5" fill="none" />;
        break;
      case "FacePouting":
        eyes = eyeNormal;
        eyebrows = (
          <>
            <line x1="7" y1="8.5" x2="10.5" y2="10" />
            <line x1="17" y1="8.5" x2="13.5" y2="10" />
          </>
        );
        mouth = <path d="M8.5 17c1.5-1.5 4.5-1.5 6 0" />;
        break;
      case "FaceStarry":
        eyes = (
          <>
            <path d="M9 7.5l.5 1.5h1.5l-1.2.9.5 1.6-1.3-1-1.3 1 .5-1.6-1.2-.9h1.5z" fill="#f59e0b" stroke="none" />
            <path d="M15 7.5l.5 1.5h1.5l-1.2.9.5 1.6-1.3-1-1.3 1 .5-1.6-1.2-.9h1.5z" fill="#f59e0b" stroke="none" />
          </>
        );
        mouth = mouthSmile;
        break;
      case "FaceMonocle":
        eyes = (
          <>
            <circle cx="8.5" cy="10.5" r="1.2" fill="currentColor" />
            <circle cx="15.5" cy="10.5" r="1.2" fill="currentColor" />
            <circle cx="15.5" cy="10.5" r="3" />
            <line x1="18.5" y1="10.5" x2="20" y2="18" />
          </>
        );
        mouth = <path d="M9 15.5a3 3 0 0 0 5 0" />;
        break;
      case "FaceHalo":
        eyes = eyeNormal;
        mouth = mouthSmile;
        extra = <ellipse cx="12" cy="1.5" rx="5" ry="1" fill="none" stroke="#f59e0b" strokeWidth="1.5" />;
        break;
      case "FaceDevil":
        eyes = (
          <>
            <circle cx="8.5" cy="11" r="1" fill="currentColor" />
            <circle cx="15.5" cy="11" r="1" fill="currentColor" />
          </>
        );
        eyebrows = (
          <>
            <line x1="6.5" y1="9" x2="10" y2="10" />
            <line x1="17.5" y1="9" x2="14" y2="10" />
            <path d="M6.5 4.5L8 6" />
            <path d="M17.5 4.5L16 6" />
          </>
        );
        mouth = <path d="M8 15a4 4 0 0 0 8 0" />;
        break;
      case "FaceClown":
        eyes = (
          <>
            <path d="M7 8l2 2" />
            <path d="M10 8L8 10" />
            <path d="M14 8l2 2" />
            <path d="M17 8l-2 2" />
          </>
        );
        mouth = <path d="M7.5 14.5a4.5 4.5 0 0 0 9 0" />;
        extra = (
          <>
            <circle cx="12" cy="11.5" r="2.2" fill="#ef4444" stroke="none" />
            <circle cx="6" cy="14" r="1.5" fill="#f43f5e" opacity="0.4" />
            <circle cx="18" cy="14" r="1.5" fill="#f43f5e" opacity="0.4" />
          </>
        );
        break;
      case "FaceAlien":
        head = <path d="M5 10C5 5 12 3 19 10C19 16 16 21 12 21C8 21 5 16 5 10Z" />;
        eyes = (
          <>
            <ellipse cx="8.5" cy="11" rx="2.5" ry="3.8" fill="currentColor" transform="rotate(-15 8.5 11)" />
            <ellipse cx="15.5" cy="11" rx="2.5" ry="3.8" fill="currentColor" transform="rotate(15 15.5 11)" />
          </>
        );
        mouth = <path d="M10.5 17c1 .5 2 .5 3 0" />;
        break;
      case "FaceRobot":
        head = <rect x="4.5" y="4.5" width="15" height="15" rx="2" />;
        eyes = (
          <>
            <rect x="7" y="8" width="3" height="3" fill="currentColor" />
            <rect x="14" y="8" width="3" height="3" fill="currentColor" />
          </>
        );
        mouth = <rect x="8.5" y="14" width="7" height="2" fill="currentColor" />;
        extra = (
          <>
            <line x1="12" y1="4.5" x2="12" y2="2" />
            <circle cx="12" cy="1.5" r="1" fill="currentColor" />
          </>
        );
        break;
      case "FaceCat":
        eyes = (
          <>
            <path d="M7.5 10a1 1 0 1 1 2 0" />
            <path d="M14.5 10a1 1 0 1 1 2 0" />
          </>
        );
        mouth = <path d="M8 14.5c1 .5 2 .5 2.5-.5c.5 1 1.5 1 2.5.5" />;
        extra = (
          <>
            <path d="M4.5 7.5L3 2l5 3M19.5 7.5L21 2l-5 3" />
            <line x1="4" y1="13" x2="1" y2="12.5" />
            <line x1="4" y1="14.5" x2="1" y2="14.5" />
            <line x1="20" y1="13" x2="23" y2="12.5" />
            <line x1="20" y1="14.5" x2="23" y2="14.5" />
          </>
        );
        break;
      case "FaceDog":
        eyes = eyeNormal;
        mouth = <path d="M10 14.5c.8.8 1.5 0 2 0c.5 0 1.2.8 2 0" />;
        extra = (
          <>
            <path d="M3.5 6C2 8 3 13 4 14M20.5 6C22 8 21 13 20 14" strokeWidth="2" />
            <polygon points="11,12 13,12 12,13.5" fill="currentColor" />
            <path d="M11 14.5c0 1.5 1 3 1 3s1-1.5 1-3z" fill="#f43f5e" stroke="none" />
          </>
        );
        break;
      case "FaceRich":
        eyes = (
          <>
            <text x="6.5" y="12" className="text-[7px] font-bold fill-current">$</text>
            <text x="13.5" y="12" className="text-[7px] font-bold fill-current">$</text>
          </>
        );
        mouth = (
          <>
            <line x1="8" y1="15" x2="16" y2="15" />
            <path d="M9.5 15v3.5a1 1 0 0 0 2 0V15m1 0v3.5a1 1 0 0 0 2 0V15" fill="currentColor" />
          </>
        );
        break;
      case "FaceWhistling":
        eyes = eyeNormal;
        mouth = <circle cx="12" cy="15.5" r="1" fill="currentColor" />;
        extra = (
          <>
            <path d="M15 14h1.5M16.5 16h1.5" />
          </>
        );
        break;
      case "FaceDisgusted":
        eyes = (
          <>
            <path d="M7.5 10l1.5 1M9 10l-1.5 1" />
            <path d="M14.5 10l1.5 1M16 10l-1.5 1" />
          </>
        );
        mouth = <path d="M9 16.5s1.2-1.5 3-1.5s3 1.5 3 1.5" />;
        break;
      case "FaceSneezing":
        eyes = (
          <>
            <path d="M7 11.5l2-1.5M15 10l2 1.5" />
          </>
        );
        mouth = <polygon points="11,14 13,14 12,16" fill="currentColor" />;
        extra = <path d="M4 16h3" />;
        break;
      case "FaceDrooling":
        eyes = (
          <>
            <path d="M7 10h4M13 10h4" />
          </>
        );
        mouth = <path d="M8 14h8v1a4 4 0 0 1-8 0z" />;
        extra = <path d="M14 14.5c0 1.5-1 2-1 2v-2" stroke="#38bdf8" fill="none" />;
        break;
      case "FaceHungry":
        eyes = eyeNormal;
        mouth = <path d="M7.5 13.5c1.5 1.5 3.5 1.5 5 0" />;
        extra = <path d="M12.5 13.5c0 1.5 1.5 2 1.5 2s-1 .5-1.5-2" fill="#ef4444" stroke="none" />;
        break;
      case "FaceStudious":
        eyes = (
          <>
            <circle cx="8.5" cy="10" r="2.5" />
            <circle cx="15.5" cy="10" r="2.5" />
            <line x1="11" y1="10" x2="13" y2="10" />
            <circle cx="8.5" cy="10" r="1" fill="currentColor" />
            <circle cx="15.5" cy="10" r="1" fill="currentColor" />
          </>
        );
        mouth = mouthSmile;
        break;
      case "FaceMuted":
        eyes = eyeNormal;
        mouth = (
          <>
            <line x1="8" y1="15" x2="16" y2="15" />
            <line x1="8.5" y1="14" x2="8.5" y2="16" />
            <line x1="10.5" y1="14" x2="10.5" y2="16" />
            <line x1="12.5" y1="14" x2="12.5" y2="16" />
            <line x1="14.5" y1="14" x2="14.5" y2="16" />
          </>
        );
        break;
      case "FaceExploding":
        eyes = (
          <>
            <circle cx="8" cy="11.5" r="1.2" fill="currentColor" />
            <circle cx="16" cy="11.5" r="1.2" fill="currentColor" />
          </>
        );
        mouth = <circle cx="12" cy="16" r="2" fill="currentColor" />;
        head = <path d="M3 11.5A9 9 0 0 0 21 11.5M4.5 9c-.5-1 .5-2 1.5-2.5C7.5 5 10 4 12 4s4.5 1 6 2.5c1 .5 2 1.5 1.5 2.5" fill="none" />;
        extra = (
          <path d="M5 6C5 4 7 3 12 3s7 1 7 3c0.5-2.5-3-3.5-7-3.5S4.5 3.5 5 6" fill="#f97316" stroke="none" />
        );
        break;
      case "FaceHypnotized":
        eyes = (
          <>
            <circle cx="8.5" cy="10.5" r="2.5" />
            <path d="M7 10.5a1.5 1.5 0 1 1 3 0" />
            <circle cx="15.5" cy="10.5" r="2.5" />
            <path d="M14 10.5a1.5 1.5 0 1 1 3 0" />
          </>
        );
        mouth = <ellipse cx="12" cy="15.5" rx="2" ry="3" />;
        break;

      // Kids
      case "KidCap":
        eyes = eyeNormal;
        mouth = mouthSmile;
        extra = (
          <>
            <path d="M3.5 9A9 9 0 0 1 20 8.5" fill="#f43f5e" />
            <path d="M7 6c1-2.5 8-2.5 10 0l-5 1.5" fill="#f43f5e" />
            <path d="M13.5 5.5l5.5 1.5c1.5.5 1-.5-.5-.5" stroke="#e11d48" strokeWidth="2.2" />
          </>
        );
        break;
      case "KidBraids":
        eyes = eyeNormal;
        mouth = mouthSmile;
        extra = (
          <>
            <path d="M4 10c2-3 4-3.5 8-3.5s6 .5 8 3.5" strokeWidth="2" />
            <path d="M3 11s-2 2-1.5 4c.5 1.5-1 3.5-1.5 4" strokeWidth="1.8" />
            <path d="M21 11s2 2 1.5 4c-.5 1.5 1 3.5 1.5 4" strokeWidth="1.8" />
            <circle cx="1" cy="19" r="1.5" fill="#ec4899" />
            <circle cx="23" cy="19" r="1.5" fill="#ec4899" />
          </>
        );
        break;
      case "KidCurls":
        eyes = eyeNormal;
        mouth = mouthSmile;
        extra = (
          <>
            <path d="M4 8A2 2 0 0 1 6 6M6 6A2 2 0 0 1 8 4M8 4A2 2 0 0 1 12 3M12 3A2 2 0 0 1 16 4M16 4A2 2 0 0 1 18 6" strokeWidth="2.5" fill="none" />
          </>
        );
        break;
      case "KidGlasses":
        eyes = (
          <>
            <circle cx="8.5" cy="10" r="2.2" strokeWidth="2" />
            <circle cx="15.5" cy="10" r="2.2" strokeWidth="2" />
            <line x1="10.7" y1="10" x2="13.3" y2="10" strokeWidth="2" />
            <circle cx="8.5" cy="10" r="1" fill="currentColor" />
            <circle cx="15.5" cy="10" r="1" fill="currentColor" />
          </>
        );
        mouth = mouthSmile;
        break;
      case "KidCrown":
        eyes = eyeNormal;
        mouth = mouthSmile;
        extra = (
          <polygon points="7,4.5 9,1.5 12,3.5 15,1.5 17,4.5" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
        );
        break;
      case "KidRibbon":
        eyes = eyeNormal;
        mouth = mouthSmile;
        extra = (
          <>
            <path d="M5 4c-1 0-1.5 1.5-1.5 1.5s1 1.5 2 0.5M8 6c0-1-1.5-1.8-1.5-1.8S5.2 5 6.2 5.8" fill="#ef4444" stroke="none" />
            <circle cx="6" cy="5" r="1" fill="#ef4444" />
          </>
        );
        break;
      case "KidHeadphones":
        eyes = eyeNormal;
        mouth = mouthSmile;
        extra = (
          <>
            <path d="M2.5 11c0-5 4-7.5 9.5-7.5s9.5 2.5 9.5 7.5" fill="none" strokeWidth="2.2" />
            <rect x="1.5" y="9.5" width="2" height="4" rx="1" fill="currentColor" />
            <rect x="20.5" y="9.5" width="2" height="4" rx="1" fill="currentColor" />
          </>
        );
        break;
      case "KidBandana":
        eyes = (
          <>
            <path d="M7.5 10.5h3" />
            <circle cx="15" cy="10.5" r="1.2" fill="currentColor" />
          </>
        );
        mouth = <path d="M8.5 15c1 0.5 3 .5 5-0.5" />;
        extra = (
          <>
            <path d="M3 8A9 9 0 0 1 21 8" stroke="#10b981" strokeWidth="2.5" fill="none" />
            <circle cx="21" cy="8" r="1" fill="#10b981" />
            <path d="M21 8l2 2m-2-2l1.5-1" stroke="#10b981" />
          </>
        );
        break;
      case "KidHat":
        eyes = eyeNormal;
        mouth = mouthSmile;
        extra = (
          <>
            <ellipse cx="12" cy="7" rx="11" ry="1.8" fill="#f59e0b" stroke="#d97706" />
            <path d="M7 6.5C7 3 10 2 12 2s5 1 5 4.5" fill="#f59e0b" stroke="#d97706" />
          </>
        );
        break;
      case "KidBun":
        eyes = eyeNormal;
        mouth = mouthSmile;
        extra = (
          <>
            <circle cx="12" cy="2.5" r="2.5" fill="currentColor" />
            <path d="M4 10A9 9 0 0 1 20 10" strokeWidth="1" />
          </>
        );
        break;
      default:
        eyes = eyeNormal;
        mouth = mouthSmile;
    }

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        id={id}
      >
        {head}
        {eyebrows}
        {eyes}
        {mouth}
        {extra}
      </svg>
    );
  }

  // Gracefully fallback to HelpCircle if icon name is unrecognized
  const IconComponent = (Icons as any)[name] || Icons.HelpCircle;
  return <IconComponent className={className} id={id} />;
}
