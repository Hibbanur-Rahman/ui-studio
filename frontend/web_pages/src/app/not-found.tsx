'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Home, ArrowLeft, Search } from 'lucide-react'
import NotFoundSvg from '@/assets/images/404notfound.svg'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 SVG Image */}
        <div className="mb-2 flex justify-center">
          <Image
            src={NotFoundSvg}
            alt="404 Not Found"
            width={400}
            height={300}
            priority
            className="w-full max-w-md"
          />
        </div>

        {/* Error Message */}
        <div className="mb-4">

          <p className="text-lg text-gray-600 mb-2">
            Sorry! That page can’t be found.
          </p>
          <p className="text-sm text-gray-500">
            It may have been moved or removed, or the address may be incorrect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 cursor-pointer" />
            <span>Go Back</span>
          </button>

          <Link
            href="/dashboard"
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-600 transition-all shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5 cursor-pointer" />
            <span>Go to Dashboard</span>
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12  mb-20 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  )
}

