'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ShareButtonProps {
  title: string
  slug: string
}

export function ShareButton({ title, slug }: ShareButtonProps) {
  const [isCopied, setIsCopied] = useState(false)
  
  // Use window.location.origin if available, otherwise fallback to env var or default.
  const siteUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : (process.env.NEXT_PUBLIC_SITE_URL || 'https://myarivon.in');
  const url = `${siteUrl}/articles/${slug}`

  const handleShare = async () => {
    // Use Web Share API if available (mostly on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this article on Arivon: ${title}`,
          url: url,
        })
      } catch (error) {
        // AbortError is thrown when the user cancels the share dialog, which is not a real error.
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error)
        }
      }
    } else {
      // Fallback to copying link to clipboard for desktop
      try {
        await navigator.clipboard.writeText(url)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2500) // Reset after 2.5 seconds
      } catch (error) {
        console.error('Failed to copy link to clipboard:', error)
        alert('Failed to copy link.')
      }
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-2 text-gray-600 dark:text-gray-300" aria-label="Share this article">
      {isCopied ? <><Check className="h-4 w-4 text-green-500" /><span>Link Copied!</span></> : <><Share2 className="h-4 w-4" /><span>Share</span></>}
    </Button>
  )
}