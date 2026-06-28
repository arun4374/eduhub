'use client'

import React, { useState } from "react"
import { Send, User, Calendar, MessageSquare, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MOCK_COMMENTS, Comment } from "@/data/mock-comments"

interface CommentSectionProps {
  pageType: "subject" | "department"
  pageId: string
}

export function CommentSection({ pageType, pageId }: CommentSectionProps) {
  // Filter initial mock data for this page:
  const initialComments = MOCK_COMMENTS.filter(
    (c) => c.pageType === pageType && c.pageId === pageId
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const [comments, setComments] = useState<Comment[]>(initialComments)
  
  // Form states
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  
  // Feedback states
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({})
  const [successMsg, setSuccessMsg] = useState("")

  const validateForm = () => {
    const tempErrors: { name?: string; email?: string; message?: string } = {}
    let isValid = true

    if (!name.trim()) {
      tempErrors.name = "Name is required."
      isValid = false
    }

    if (!email.trim()) {
      tempErrors.email = "Email is required."
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Invalid email format (e.g., mail@example.com)."
      isValid = false
    }

    if (!message.trim()) {
      tempErrors.message = "Message is required."
      isValid = false
    } else if (message.trim().length < 10) {
      tempErrors.message = "Message must be at least 10 characters long."
      isValid = false
    }

    setErrors(tempErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg("")
    
    if (validateForm()) {
      const newComment: Comment = {
        _id: `user_comment_${Date.now()}`,
        pageType,
        pageId,
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString()
      }

      // Add to local list at the top (newest first)
      setComments([newComment, ...comments])
      
      // Reset form fields
      setName("")
      setEmail("")
      setMessage("")
      setErrors({})
      
      // Show success toast feedback
      setSuccessMsg("🎉 Comment posted successfully! Your feedback is displayed below.")
      setTimeout(() => setSuccessMsg(""), 6000)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div id="comment-section" className="p-6 rounded-xl border border-[#E5E7EB] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] transition-colors duration-200">
      <h3 className="text-lg font-bold text-[#111827] dark:text-[#F9FAFB] mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-sky-500" />
        Comments ({comments.length})
      </h3>

      {/* Success notifier banner */}
      {successMsg && (
        <div id="comment-success-alert" className="mb-6 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 text-sm font-medium">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Comment compilation form */}
      <form id="comment-form" onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="commentor-name" className="text-xs font-semibold text-[#111827] dark:text-[#F9FAFB]">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="commentor-name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.name && (
              <span className="text-xs text-red-500 flex items-center gap-1 mt-0.5 font-medium">
                <AlertCircle className="h-3 w-3" /> {errors.name}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="commentor-email" className="text-xs font-semibold text-[#111827] dark:text-[#F9FAFB]">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              id="commentor-email"
              type="text"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.email && (
              <span className="text-xs text-red-500 flex items-center gap-1 mt-0.5 font-medium">
                <AlertCircle className="h-3 w-3" /> {errors.email}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="commentor-message" className="text-xs font-semibold text-[#111827] dark:text-[#F9FAFB]">
            Comment message <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="commentor-message"
            placeholder="Write your study questions, updates, correction requests or feedback (minimum 10 characters)..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className={errors.message ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.message && (
            <span className="text-xs text-red-500 flex items-center gap-1 mt-0.5 font-medium">
              <AlertCircle className="h-3 w-3" /> {errors.message}
            </span>
          )}
        </div>

        <Button id="comment-submit-btn" type="submit" className="flex items-center gap-2">
          <Send className="h-4 w-4" />
          Post Comment
        </Button>
      </form>

      {/* Vertical Comments list */}
      <div id="comments-list-wrapper" className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => {
            const initial = comment.name ? comment.name.charAt(0).toUpperCase() : "?"
            return (
              <div
                id={`comment-item-${comment._id}`}
                key={comment._id}
                className="flex items-start gap-4 p-4 rounded-xl border border-dashed border-[#E5E7EB] dark:border-[#2A2A2A]/80 hover:bg-[#F9FAFB]/50 dark:hover:bg-[#1A1A1A]/30 transition-colors"
                style={{ contentVisibility: "auto" }}
              >
                {/* Avatar Badge */}
                <span className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-sky-500 to-sky-700 text-white font-bold text-sm select-none">
                  {initial}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                    <span className="font-bold text-sm text-[#111827] dark:text-[#F9FAFB]">
                      {comment.name}
                    </span>
                    <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] flex items-center gap-1 font-mono">
                      <Calendar className="h-3 w-3 text-[#6B7280]" />
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed whitespace-pre-line text-justify break-words">
                    {comment.message}
                  </p>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-10 select-none border border-dashed border-[#E5E7EB] dark:border-[#2A2A2A] rounded-xl text-xs text-[#6B7280] dark:text-[#9CA3AF] flex flex-col items-center justify-center gap-2">
            <MessageSquare className="h-6 w-6 text-gray-300" />
            <span>No comments posted yet. Be the first to start the discussion!</span>
          </div>
        )}
      </div>
    </div>
  )
}
