'use client'

import React, { useState, useEffect, FormEvent } from 'react';
import { MessageSquare, Send, User, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Define the comment type matching the backend model for frontend use
interface Comment {
  _id: string;
  name: string;
  message: string;
  createdAt: string;
  user?: { profilePicture?: string }; // Assuming user model might have this
}

interface CommentSectionProps {
  pageType: "subject" | "department"
  pageId: string
}

const formatDistanceToNow = (date: Date) => {
  const diff = Date.now() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? 's' : ''} ago`;
};

export function CommentSection({ pageType, pageId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [newMessage, setNewMessage] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/comments?pageType=${pageType}&pageId=${pageId}`);
        if (!response.ok) throw new Error('Failed to fetch comments.');
        
        const result = await response.json();
        if (result.success) {
          setComments(result.data);
        } else {
          throw new Error(result.error || 'An unknown error occurred.');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [pageType, pageId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      setSubmitError('Message cannot be empty.');
      return;
    }
    if (!guestName.trim() || !guestEmail.trim()) {
      setSubmitError('Name and email are required to post a comment.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const body = {
      pageType,
      pageId,
      message: newMessage,
      name: guestName,
      email: guestEmail,
    };

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to post comment.');
      }
      
      // Add new comment to the top of the list for instant UI update
      setComments(prev => [result.data, ...prev]);
      setNewMessage('');
      // Don't clear name/email so they can post again easily
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="comment-section" className="p-6 rounded-xl border border-[#E5E7EB] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] transition-colors duration-200">
      <h3 className="text-lg font-bold text-[#111827] dark:text-[#F9FAFB] mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-indigo-500" />
        Comments ({comments.length})
      </h3>

      {/* Comment compilation form */}
      <div className="mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700">
              <User size={20} className="text-gray-500 dark:text-gray-400" />
            </div>
            <Textarea
              placeholder="Share your thoughts or ask a question..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={3}
              disabled={isSubmitting}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-12">
            <Input type="text" placeholder="Your Name" value={guestName} onChange={(e) => setGuestName(e.target.value)} disabled={isSubmitting} required />
            <Input type="email" placeholder="Your Email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} disabled={isSubmitting} required />
          </div>
          <div className="flex justify-between items-center pl-12">
            {submitError && <p className="text-xs text-red-500">{submitError}</p>}
            <Button type="submit" disabled={isSubmitting || !newMessage.trim()} className="ml-auto">
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Posting...</> : <><Send className="mr-2 h-4 w-4" />Post Comment</>}
            </Button>
          </div>
        </form>
      </div>

      {/* Vertical Comments list */}
      <div id="comments-list-wrapper" className="space-y-6">
        {isLoading && <div className="text-center py-8 text-gray-500">Loading comments...</div>}
        {error && <div className="text-center py-8 text-red-500">Error: {error}</div>}
        {!isLoading && !error && comments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="mx-auto h-8 w-8 mb-2" />
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
        <ul className="space-y-6">
          {comments.map((comment) => (
            <li key={comment._id} className="flex items-start gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-bold text-sm select-none">
                {comment.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{comment.name}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(comment.createdAt))}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap break-words">{comment.message}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
