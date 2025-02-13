'use client';

import { importantLinks } from '@/data/important-link';
import { useGetList } from '@/hooks/APIHooks';
import { ChevronRight, Facebook, Instagram, MapPinned, Twitter, Youtube } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface HeaderData {
  _id: string;
  logo: string;
  school_name: string;
  address: string;
  eiin: number;
  school_code: number;
  email: string;
  mobile_no: string;
  website: string;
}

export default function Footer() {
  const { data: headerData, isLoading } = useGetList<HeaderData>('/info', 'info');

  return (
    <footer className="bg-[#0B8B9C] text-white ">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Left Column */}
          <div className="space-y-4">
            {isLoading ? (
              <div
                role="status"
                className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center h-28 w-28"
              >
                <div className="flex items-center justify-center w-full h-full bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                  <svg
                    className="w-10 h-10 text-gray-200 dark:text-gray-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 18"
                  >
                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                  </svg>
                </div>
              </div>
            ) : (
              <Image
                priority
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${headerData ? headerData[0]?.logo : 'logo/logo.jpg'}`}
                alt="school logo"
                width={100}
                height={100}
                className="h-28 w-auto mb-4"
              />
            )}
            <p className="text-sm">
              শিক্ষা মানুষের মৌলিক অধিকার। দেশ-
              <br />
              আত্মিক গড়ে তোলাই সকল শিক্ষার
              <br />
              মূল উদ্দেশ্য। সমাজ ও রাষ্ট্র গঠনের
              <br />
              জন্য এবং উন্নত বিস্তারিত জানুন
            </p>
            <div className="flex space-x-4 text-white">
              <Link href="#" className="rounded-full bg-[#1B365C] p-2 hover:opacity-80">
                <span className="sr-only">Facebook</span>
                <Facebook className="w-4 h-4" />
              </Link>
              <Link href="#" className="rounded-full bg-[#1B365C] p-2 hover:opacity-80">
                <span className="sr-only">Twitter</span>
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="rounded-full bg-[#1B365C] p-2 hover:opacity-80">
                <span className="sr-only">Google</span>
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="#" className="rounded-full bg-[#1B365C] p-2 hover:opacity-80">
                <span className="sr-only">YouTube</span>
                <Youtube className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Middle Column */}
          <div>
            <h3 className="mb-6 text-xl font-">Important Websites</h3>
            <ul className="mt-2 space-y-2 text-white">
              {importantLinks.map((link, index) => (
                <li key={index}>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" text-base flex items-center"
                  >
                    <ChevronRight className="inline w-5 mb-1 text-yellow-400" />
                    <span className="ml-2">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-6 text-xl font-">Our Location</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <MapPinned className="inline w-5 mb-1 text-yellow-400" />{' '}
                <div className="text-md">
                  {isLoading ? (
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 "></div>
                  ) : (
                    <span>{headerData && headerData[0].address}</span>
                  )}
                </div>
              </li>
            </ul>
          </div>

          {/* Right Column */}
          <div>
            <h3 className="mb-6 text-xl font-">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <div className="text-md">
                  {isLoading ? (
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 "></div>
                  ) : (
                    <span>{headerData && headerData[0].school_name}</span>
                  )}
                </div>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <div className="text-md">
                  {isLoading ? (
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 "></div>
                  ) : (
                    <span>{headerData && headerData[0].mobile_no}</span>
                  )}
                </div>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div className="text-md">
                  {isLoading ? (
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 "></div>
                  ) : (
                    <span>{headerData && headerData[0].email}</span>
                  )}
                </div>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                <div className="text-md">
                  {isLoading ? (
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 "></div>
                  ) : (
                    <span>{headerData && headerData[0].website}</span>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-[#1B365C] py-4 text-center text-sm">
        <div className="container mx-auto max-w-7xl px-4">
          <p>
            Copyright © 2021, {headerData && headerData[0]?.school_name}. All Rights Reserved.
            <Link href="#" className="text-yellow-400 hover:underline">
              Design & Developed by Bangladesh Associate of IT Solution.
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
