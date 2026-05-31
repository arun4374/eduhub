export interface Notification {
  _id: string
  message: string
  isActive: boolean
  createdAt: string
  expiresAt: string
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    _id: "notif001",
    message: "🎉 Anna University November December 2025 Question Papers are now available! Check your department page.",
    isActive: true,
    createdAt: "2026-03-26T00:00:00.000Z",
    expiresAt: "2026-06-30T00:00:00.000Z"
  },
  {
    _id: "notif002",
    message: "🔥 Regulation 2021 Syllabus and Notes compiled for all semesters. Download now for free!",
    isActive: true,
    createdAt: "2026-03-26T00:00:00.000Z",
    expiresAt: "2026-06-30T00:00:00.000Z"
  }
];
