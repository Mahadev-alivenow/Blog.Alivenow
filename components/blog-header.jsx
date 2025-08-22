"use client";

import { useState, useEffect } from "react";
import { Search, Menu, X, Ham, HammerIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

export default function BlogHeader({ onSearch, tags = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [randomTags, setRandomTags] = useState([]);

  useEffect(() => {
    if (tags.length > 0 && randomTags.length === 0) {
      // shuffle only once
      const shuffled = [...tags].sort(() => 0.5 - Math.random());
      setRandomTags(shuffled.slice(0, 10));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags]); // remove randomTags from dependency to avoid reshuffle

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const handleSearchClick = () => {
    onSearch();
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`bg-white header-font shadow-sm border-b sticky top-0 z-50 transition-all duration-500 ease-in-out ${
        isMenuOpen ? "h-screen" : "h-17"
      }`}
    >
      <div className="md:max-w-7xl max-w-5xl md:mx-auto mx-2 sm:px-6 lg:px-8 h-full">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16 my-2">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <Image
                src="/alivenow.svg"
                alt="AliveNow icon"
                width={100}
                height={100}
                className="md:h-16 h-8 w-auto"
              />
            </Link>
          </div>

          {/* Search Bar */}
          {/* Search Bar for Desktop */}
          <div className="hidden md:block">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={handleSearchClick}
                onKeyPress={handleSearchKeyPress}
                className="w-64 pl-10 pr-4 cursor-pointer"
                readOnly
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>

          {/* Search Bar for Mobile */}
          <div className=" block md:hidden w-1/2  mt-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={handleSearchClick}
                onKeyPress={handleSearchKeyPress}
                className="w-full pl-10 pr-4 cursor-pointer"
                readOnly
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="lg"
              onClick={toggleMenu}
              className="hidden md:flex items-center gap-2 transition-all duration-300 hover:cursor-pointer "
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="text-sm">{isMenuOpen ? "" : ""}</span>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden transition-all duration-300 "
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Expanded menu content that appears when isMenuOpen is true */}
        <div
          className={`flex-1  flex items-start  md:items-center justify-center pb-8 overflow-y-auto transition-all duration-500 ease-in-out mt-2 md:mt-8 ${
            isMenuOpen
              ? "transform translate-y-0 opacity-100"
              : "transform -translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="w-full max-w-6xl pt-4 px-2 md:pt-6 md:px-0 ">
            {/* Mobile Layout - 2 Column Grid */}
            <div className="block md:hidden">
              <div className="grid grid-cols-2 gap-2 text-black">
                {/* Left Column - About Us and Services */}
                <div className="space-y-8">
                  {/* About Us Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold tracking-wide header-font-title">
                      ABOUT US
                    </h2>
                    <div className="space-y-3">
                      <Link
                        href="https://www.alivenow.in/AboutUs.php"
                        target="_blank"
                        className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                      >
                        ALIVENOW
                      </Link>
                      <Link
                        href="https://www.alivenow.in/Clients.php"
                        target="_blank"
                        className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                      >
                        CLIENTS
                      </Link>
                      <Link
                        href="https://www.alivenow.in/newsletter.php"
                        target="_blank"
                        className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                      >
                        NEWSLETTER
                      </Link>
                    </div>
                  </div>

                  {/* Work Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold tracking-wide header-font-title">
                      WORK
                    </h2>
                    <div className="space-y-3">
                      <Link
                        href="https://www.alivenow.in/Portfolio.php"
                        target="_blank"
                        className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                      >
                        PORTFOLIO
                      </Link>
                      <Link
                        href="https://www.alivenow.in/CaseStudies.php"
                        target="_blank"
                        className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                      >
                        CASE STUDIES
                      </Link>
                      <Link
                        href="https://www.alivenow.in/WhitePapers.php"
                        target="_blank"
                        className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                      >
                        WHITE PAPERS
                      </Link>
                    </div>
                  </div>

                  {/* Contact Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold tracking-wide header-font-title">
                      CONTACT
                    </h2>
                    <div className="space-y-3">
                      <Link
                        href="https://www.alivenow.in/Careers.php"
                        target="_blank"
                        className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                      >
                        CAREERS
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right Column - Work and Contact */}
                <div className="space-y-8">
                  {/* Services Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold tracking-wide header-font-title">
                      SERVICES
                    </h2>
                    <div className="space-y-3">
                      <Link
                        href="https://www.alivenow.in/GenerativeAI.php"
                        target="_blank"
                        className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                      >
                        GENERATIVE AI
                      </Link>
                      <Link
                        href="https://www.alivenow.in/AugmentedReality.php"
                        target="_blank"
                        className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                      >
                        AUGMENTED REALITY
                      </Link>
                      <Link
                        href="https://www.alivenow.in/TikTokAREffects.php"
                        target="_blank"
                        className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                      >
                        TIKTOK AR EFFECTS
                      </Link>
                      <Link
                        href="https://www.alivenow.in/WebAR.php"
                        target="_blank"
                        className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                      >
                        WEB AR EXPERIENCES
                      </Link>
                      <Link
                        href="https://www.alivenow.in/SnapARLenses.php"
                        target="_blank"
                        className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                      >
                        SNAPCHAT AR LENSES
                      </Link>
                      <Link
                        href="https://aliveonprint.com/"
                        target="_blank"
                        className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                      >
                        ALIVE ON PRINT
                      </Link>
                      <Link
                        href="https://www.alivenow.in/CGI-3D-Production.php"
                        target="_blank"
                        className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                      >
                        CGI & 3D PRODUCTION
                      </Link>
                      <Link
                        href="https://fliptokgames.com/"
                        target="_blank"
                        className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                      >
                        FLIPTOK GAMES
                      </Link>
                      <Link
                        href="https://www.alivenow.in/SwipeUpGames.php"
                        target="_blank"
                        className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                      >
                        SWIPE UP GAMES
                      </Link>
                      <Link
                        href="https://www.alivenow.in/Newsfeedsmartapps.php"
                        target="_blank"
                        className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                      >
                        NEWSFEED SMARTAPPS
                      </Link>
                      <Link
                        href="https://alivenow.in/PlayableAds.php"
                        target="_blank"
                        className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                      >
                        PLAYABLE ADS
                      </Link>
                      <Link
                        href="https://www.alivenow.in/3D-360-Virtual-Stores.php"
                        target="_blank"
                        className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                      >
                        3D 360 VIRTUAL STORES
                      </Link>
                      <Link
                        href="https://www.alivenow.in/InteractiveVideos.php"
                        target="_blank"
                        className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                      >
                        INTERACTIVE VIDEOS
                      </Link>
                      <Link
                        href="https://www.alivenow.in/InAppGames.php"
                        target="_blank"
                        className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                      >
                        IN-APP GAMES
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Section - Bottom spanning both columns */}
              {/* <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="https://www.facebook.com/alivenowinc/"
                    target="_blank"
                    className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                  >
                    FACEBOOK
                  </Link>
                  <Link
                    href="https://www.instagram.com/alivenowinc/"
                    target="_blank"
                    className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                  >
                    INSTAGRAM
                  </Link>
                  <Link
                    href="https://x.com/AliveNowInc"
                    target="_blank"
                    className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                  >
                    TWITTER
                  </Link>
                  <Link
                    href="https://www.youtube.com/alivenowinc"
                    target="_blank"
                    className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                  >
                    YOUTUBE
                  </Link>
                  <Link
                    href="https://www.linkedin.com/company/alivenow/posts/?feedView=all"
                    target="_blank"
                    className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                  >
                    LINKEDIN
                  </Link>
                  <Link
                    href="https://www.tiktok.com/@alivenowinc"
                    target="_blank"
                    className="block text-sm hover:text-[#E92628] transition-colors duration-200"
                  >
                    TIKTOK
                  </Link>
                </div>
              </div> */}
              {/* Social Media Icons */}
              <div className="flex space-x-4 mt-10 mb-8">
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

            {/* Desktop Layout - Grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-black">
              {/* About Us Section */}
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold tracking-wide header-font-title">
                  ABOUT US
                </h2>
                <div className="space-y-4">
                  <Link
                    href="https://www.alivenow.in/AboutUs.php"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    ALIVENOW
                  </Link>
                  <Link
                    href="https://www.alivenow.in/Clients.php"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    CLIENTS
                  </Link>
                  <Link
                    href="https://www.alivenow.in/newsletter.php"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    NEWSLETTER
                  </Link>
                </div>
              </div>

              {/* Services Section */}
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold tracking-wide header-font-title">
                  SERVICES
                </h2>
                <div className="space-y-4">
                  <Link
                    href="https://www.alivenow.in/GenerativeAI.php"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    GENERATIVE AI
                  </Link>
                  <Link
                    href="https://www.alivenow.in/AugmentedReality.php"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    AUGMENTED REALITY
                  </Link>
                  <Link
                    href="https://www.alivenow.in/TikTokAREffects.php"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    TIKTOK AR EFFECTS
                  </Link>
                  <Link
                    href="https://www.alivenow.in/WebAR.php"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    WEB AR EXPERIENCES
                  </Link>
                  <Link
                    href="https://www.alivenow.in/SnapARLenses.php"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    SNAPCHAT AR LENSES
                  </Link>
                  <Link
                    href="https://aliveonprint.com/"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    ALIVE ON PRINT
                  </Link>
                  <Link
                    href="https://www.alivenow.in/CGI-3D-Production.php"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    CGI & 3D PRODUCTION
                  </Link>
                  <Link
                    href="https://fliptokgames.com/"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    FLIPTOK GAMES
                  </Link>
                  <Link
                    href="https://www.alivenow.in/SwipeUpGames.php"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    SWIPE UP GAMES
                  </Link>
                  <Link
                    href="https://www.alivenow.in/Newsfeedsmartapps.php"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    NEWSFEED SMARTAPPS
                  </Link>
                  <Link
                    href="https://alivenow.in/PlayableAds.php"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    PLAYABLE ADS
                  </Link>
                  <Link
                    href="https://www.alivenow.in/3D-360-Virtual-Stores.php"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    3D 360 VIRTUAL STORES
                  </Link>
                  <Link
                    href="https://www.alivenow.in/InteractiveVideos.php"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    INTERACTIVE VIDEOS
                  </Link>
                  <Link
                    href="https://www.alivenow.in/InAppGames.php"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    IN-APP GAMES
                  </Link>
                </div>
              </div>

              {/* Work Section */}
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold tracking-wide header-font-title">
                  WORK
                </h2>
                <div className="space-y-4">
                  <Link
                    href="https://www.alivenow.in/Portfolio.php"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    PORTFOLIO
                  </Link>
                  <Link
                    href="https://www.alivenow.in/CaseStudies.php"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    CASE STUDIES
                  </Link>
                  <Link
                    href="https://www.alivenow.in/WhitePapers.php"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    WHITE PAPERS
                  </Link>
                </div>

                <div className="pt-8">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-wide mb-6 header-font-title">
                    CONTACT
                  </h2>
                  <Link
                    href="https://www.alivenow.in/Careers.php"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    CAREERS
                  </Link>
                </div>
              </div>

              {/* Social Media Section */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <Link
                    href="https://www.facebook.com/alivenowinc/"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    FACEBOOK
                  </Link>
                  <Link
                    href="https://www.instagram.com/alivenowinc/"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    INSTAGRAM
                  </Link>
                  <Link
                    href="https://x.com/AliveNowInc"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    TWITTER
                  </Link>
                  <Link
                    href="https://www.youtube.com/alivenowinc"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    YOUTUBE
                  </Link>
                  <Link
                    href="https://www.linkedin.com/company/alivenow/posts/?feedView=all"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    LINKEDIN
                  </Link>
                  <Link
                    href="https://www.tiktok.com/@alivenowinc"
                    target="_blank"
                    className="block text-lg hover:text-[#E92628] transition-colors duration-200"
                  >
                    TIKTOK
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
