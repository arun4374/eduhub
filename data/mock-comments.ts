export interface Comment {
  _id: string
  pageType: "subject" | "department"
  pageId: string                      // slug or subject _id
  name: string
  email: string
  message: string
  createdAt: string
}

export const MOCK_COMMENTS: Comment[] = [
  {
    _id: "comment1",
    pageType: "subject",
    pageId: "cse_7_ohs352",
    name: "Vijay Kumar",
    email: "vijay.k@gmail.com",
    message: "This lecture notes PDF is really helpful! Thanks for uploading. It covers almost 90% of the syllabus for Project Report Writing.",
    createdAt: "2026-05-20T14:32:00.000Z"
  },
  {
    _id: "comment2",
    pageType: "subject",
    pageId: "cse_7_ohs352",
    name: "Aishwarya R",
    email: "aishu.r@yahoo.com",
    message: "Does anyone have the ND-2024 solved solutions or key? The questions in Unit 3 were quite tricky.",
    createdAt: "2026-05-22T09:15:00.000Z"
  },
  {
    _id: "comment3",
    pageType: "department",
    pageId: "cse",
    name: "Suresh Balaji",
    email: "suresh.b@outlook.com",
    message: "EduHub is exactly what we needed. Finding Anna University materials is usually a headache, but having everything in clean semesters is super convenient.",
    createdAt: "2026-05-25T18:40:00.000Z"
  },
  {
    _id: "comment4",
    pageType: "subject",
    pageId: "cse_4_cs3401",
    name: "Deepak Raj",
    email: "deepak.raj@gmail.com",
    message: "The CS3401 Algorithms Revision Notes is outstanding! It simplified dynamic programming (Floyd Warshall and Knapsack) beautifully.",
    createdAt: "2026-05-28T05:22:00.000Z"
  }
];
