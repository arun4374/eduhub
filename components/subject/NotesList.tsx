'use client'

import React from "react"
import { Download, Edit3, Calendar } from "lucide-react"
import { Document } from "@/data/mock-documents"
import { Button } from "@/components/ui/button"

interface NotesListProps {
  documents: Document[]
}

export function NotesList({ documents }: NotesListProps) {
  // Filter for notes
  const notes = documents.filter((doc) => doc.type === "notes")

  if (notes.length === 0) {
    return (
      <div id="no-notes-box" className="text-center py-12 border border-dashed border-[#E5E7EB] dark:border-[#2A2A2A] rounded-xl bg-white dark:bg-[#1A1A1A] select-none text-xs text-[#6B7280] dark:text-[#9CA3AF] flex flex-col items-center justify-center gap-2">
        <Edit3 className="h-6 w-6 text-gray-400" />
        <span>Lecture notes coming soon. Our syllabus curators are wrapping up compilation!</span>
      </div>
    )
  }

  // Clean up display file name for production look
  const cleanFilename = (filename: string) => {
    return filename.replace(/_/g, " ").replace(".pdf", "")
  }

  return (
    <div id="subject-notes-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {notes.map((note) => (
        <div
          id={`notes-card-${note._id}`}
          key={note._id}
          className="p-5 rounded-xl border border-[#E5E7EB] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] hover:border-emerald-500 transition-colors flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-3">
              <span className="p-1.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                <Edit3 className="h-4 w-4" />
              </span>
              <span>Lecture Note</span>
            </div>
            
            <h4 className="font-bold text-sm text-[#111827] dark:text-[#F9FAFB] leading-snug line-clamp-2 select-text">
              {cleanFilename(note.pdf_filename)}
            </h4>
            
            <div className="flex items-center gap-1 mt-3 text-xs text-[#6B7280] dark:text-[#9CA3AF] font-mono">
              <Calendar className="h-3 w-3" />
              <span>Added: {note.addedDate || "N/A"}</span>
            </div>
          </div>

          <a
            id={`notes-download-link-${note._id}`}
            href={note.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block w-full"
          >
            <Button
              id={`notes-download-btn-${note._id}`}
              variant="outline"
              className="w-full text-xs flex items-center justify-center gap-1 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 py-1.5 h-9 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              Download Notes (PDF)
            </Button>
          </a>
        </div>
      ))}
    </div>
  )
}
