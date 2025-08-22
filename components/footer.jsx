"use client";

import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 text-center md:text-left">
          {/* Left Section - Contact & Company Info */}
          <div className="space-y-24 md:col-span-3">
            <div>
              <div className="text-4xl  mb-4 footer-gautham-book-title">
                Drop us a mail
              </div>
              <a
                href="mailto:contact@alivenow.in"
                className="text-4xl text-gray-300 hover:underline footer-gautham-book"
              >
                contact@alivenow.in
              </a>
              {/* <a
                href="mailto:contact@alivenow.in"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                contact@alivenow.in
              </a> */}
            </div>

            <div>
              <div className="text-4xl font-normal mb-4 footer-gautham-book-title">
                Registered Company:
              </div>
              <Link
                href="https://3d360technologies.com/"
                className="text-lg text-gray-300 space-y-1 underline hover:text-gray-400 transition-colors"
                target="_blank"
              >
                <div className="text-2xl footer-gautham-book">
                  3D360 Extended Reality
                </div>
                <div className="text-2xl footer-gautham-book">
                  Technologies Pvt Ltd
                </div>
              </Link>
            </div>
          </div>

          {/* Center Section - Navigation Links */}
          <div className="space-y-6 header-font">
            <div className="space-y-4 ">
              <Link
                href="https://www.alivenow.in/"
                className="block text-lg font-medium hover:text-gray-300 transition-colors"
                target="_blank"
              >
                HOME
              </Link>
              <Link
                href="https://www.alivenow.in/AboutUs.php"
                className="block text-lg font-medium hover:text-gray-300 transition-colors"
                target="_blank"
              >
                ABOUT
              </Link>
              <Link
                href="https://www.alivenow.in/newsletter.php"
                className="block text-lg font-medium hover:text-gray-300 transition-colors"
                target="_blank"
              >
                NEWSLETTER
              </Link>
              <Link
                href="https://www.alivenow.in/CaseStudies.php"
                className="block text-lg font-medium hover:text-gray-300 transition-colors"
                target="_blank"
              >
                CASE STUDY
              </Link>
              <Link
                href="https://www.alivenow.in/Portfolio.php"
                className="block text-lg font-medium hover:text-gray-300 transition-colors"
                target="_blank"
              >
                PORTFOLIO
              </Link>
              <Link
                href="https://www.alivenow.in/WhitePapers.php"
                className="block text-lg font-medium hover:text-gray-300 transition-colors"
                target="_blank"
              >
                WHITE PAPERS
              </Link>
              <Link
                href="https://www.alivenow.in/ContactUs.php"
                className="block text-lg font-medium hover:text-gray-300 transition-colors"
                target="_blank"
              >
                CONTACT
              </Link>
              <Link
                href="https://www.alivenow.in/Careers.php"
                className="block text-lg font-medium hover:text-gray-300 transition-colors"
                target="_blank"
              >
                CAREERS
              </Link>
            </div>
          </div>

          {/* Right Section - What We Do */}
          <div className="space-y-6 footer-gautham-book">
            <h3 className="text-2xl font-bold mb-6 footer-gautham-book-title">
              WHAT WE DO
            </h3>
            <div className="space-y-4 mt-3">
              <Link
                href="https://www.alivenow.in/GenerativeAI.php"
                className="block text-lg hover:text-gray-300 transition-colors"
                target="_blank"
              >
                Generative AI
              </Link>
              <Link
                href="https://www.alivenow.in/AugmentedReality.php"
                className="block text-lg hover:text-gray-300 transition-colors"
                target="_blank"
              >
                Augmented Reality
              </Link>
              <Link
                href="https://www.alivenow.in/TikTokAREffects.php"
                className="block text-lg hover:text-gray-300 transition-colors"
                target="_blank"
              >
                TikTok AR Effects
              </Link>
              <Link
                href="https://www.alivenow.in/WebAR.php"
                className="block text-lg hover:text-gray-300 transition-colors"
                target="_blank"
              >
                Web AR Experiences
              </Link>
              <Link
                href="https://www.alivenow.in/SnapARLenses.php"
                className="block text-lg hover:text-gray-300 transition-colors"
                target="_blank"
              >
                Snapchat AR Lenses
              </Link>
              <Link
                href="https://aliveonprint.com/"
                className="block text-lg hover:text-gray-300 transition-colors"
                target="_blank"
              >
                AliveOnPrint
              </Link>
              <Link
                href="https://www.alivenow.in/CGI-3D-Production.php"
                className="block text-lg hover:text-gray-300 transition-colors"
                target="_blank"
              >
                CGI & 3D Production
              </Link>
              <Link
                href="https://fliptokgames.com/"
                className="block text-lg hover:text-gray-300 transition-colors"
                target="_blank"
              >
                FlipTok Games
              </Link>
              <Link
                href="https://www.alivenow.in/SwipeUpGames.php"
                className="block text-lg hover:text-gray-300 transition-colors"
                target="_blank"
              >
                Swipe Up Games
              </Link>
              <Link
                href="https://www.alivenow.in/Newsfeedsmartapps.php"
                className="block text-lg hover:text-gray-300 transition-colors"
                target="_blank"
              >
                Newsfeed Smartapps
              </Link>
              <Link
                href="https://alivenow.in/PlayableAds.php"
                className="block text-lg hover:text-gray-300 transition-colors"
                target="_blank"
              >
                Playable Ads
              </Link>
              <Link
                href="https://www.alivenow.in/3D-360-Virtual-Stores.php"
                className="block text-lg hover:text-gray-300 transition-colors"
                target="_blank"
              >
                3D 360 Virtual Stores
              </Link>
              <Link
                href="https://www.alivenow.in/InteractiveVideos.php"
                className="block text-lg hover:text-gray-300 transition-colors"
                target="_blank"
              >
                Interactive Videos
              </Link>
              <Link
                href="https://www.alivenow.in/InAppGames.php"
                className="block text-lg hover:text-gray-300 transition-colors"
                target="_blank"
              >
                In-App Games
              </Link>
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-4 mt-16 mb-8">
          {[
            {
              icon: Facebook,
              href: "https://www.facebook.com/alivenowinc/",
              label: "Facebook",
            },
            {
              icon: Instagram,
              href: "https://www.instagram.com/alivenowinc/",
              label: "Instagram",
            },
            {
              icon: Twitter,
              href: "https://x.com/AliveNowInc",
              label: "Twitter",
            },
            {
              icon: Linkedin,
              href: "https://www.linkedin.com/company/alivenow/posts/?feedView=all",
              label: "LinkedIn",
            },
            {
              icon: Youtube,
              href: "https://www.youtube.com/alivenowinc",
              label: "YouTube",
            },
          ].map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              className="md:w-15 md:h-15 rounded-2xl bg-gray-700  flex items-center justify-center hover:bg-gray-600 transition-colors duration-200 md:mr-20 mr-2 w-10 h-10 mx-auto md:mx-0"
              aria-label={label}
            >
              <Icon className="h-5 w-5 md:w-7 md:h-7 text-gray-400 " />
            </a>
          ))}
          {/* TikTok Icon */}
          <a
            href="https://www.tiktok.com/@alivenowinc"
            className="md:w-15 md:h-15 rounded-2xl bg-gray-700  flex items-center justify-center hover:bg-gray-600 transition-colors duration-200 md:mr-20 mr-2 w-10 h-10 mx-auto md:mx-0"
            aria-label="TikTok"
          >
            <svg
              className="h-5 w-5 md:w-7 md:h-7 text-gray-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © alivenow (3D360 Extended Reality Technologies Pvt Ltd). All
              rights reserved 2025
            </div>
            <div>
              <Link
                href="/privacy-policy"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
