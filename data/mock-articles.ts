export interface Article {
  _id: string
  slug: string
  title: string
  excerpt: string
  content_markdown: string
  coverImage: string
  views: number
  author: {
    name: string
    avatarUrl: string
  }
  publishedAt: string // ISO 8601 date string
  tags: string[]
  metaTitle: string
  metaDescription: string
}

export const MOCK_ARTICLES: Article[] = [
  {
    _id: "article_1",
    slug: "how-to-prepare-for-university-exams",
    title: "How to Prepare for University Exams: A Step-by-Step Guide",
    excerpt: "University exams can be stressful, but with the right preparation strategy, you can tackle them with confidence. This guide breaks down the process into manageable steps.",
    content_markdown: `
## Introduction
University exams are a significant part of academic life. Effective preparation is key to success. This guide provides a structured approach to help you study smarter, not harder.

### Step 1: Understand the Syllabus
Before you start studying, get a clear overview of the entire syllabus.
- **Identify key topics:** Which units or chapters have the most weightage?
- **Check the format:** Is it multiple choice, essay-based, or a mix?
- **Gather materials:** Collect all necessary notes, textbooks, and past papers.

### Step 2: Create a Study Schedule
A well-planned schedule keeps you on track and prevents last-minute cramming.
- **Allocate time for each subject:** Give more time to subjects you find difficult.
- **Include breaks:** Short breaks between study sessions can improve focus.
- **Be realistic:** Don't create a schedule that's impossible to follow.

### Step 3: Use Active Recall and Spaced Repetition
Passive reading is not enough. Engage with the material actively.
- **Active Recall:** After reading a topic, close the book and try to recall the key points.
- **Spaced Repetition:** Review topics at increasing intervals to move information from short-term to long-term memory.

### Step 4: Practice with Past Papers
Solving previous year question papers is one of the most effective study techniques.
- **Familiarize yourself with the pattern:** Understand the types of questions asked.
- **Time yourself:** Practice finishing the paper within the allotted time.
- **Identify weak areas:** Analyze your mistakes to know where you need more work.

## Conclusion
Consistent effort and a smart study plan are your best tools for acing university exams. Start early, stay organized, and take care of your health. Good luck!
    `,
    coverImage: "https://picsum.photos/seed/university-exams-guide/1200/630",
    views: 4820,
    author: {
      name: "Arivon Team",
      avatarUrl: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
    },
    publishedAt: "2026-04-15T10:00:00.000Z",
    tags: ["Study Tips", "Exams", "Productivity"],
    metaTitle: "How to Prepare for University Exams | Arivon",
    metaDescription: "A step-by-step guide on how to effectively prepare for university exams, including tips on scheduling, active recall, and practicing with past papers."
  },
  {
    _id: "article_2",
    slug: "choosing-your-final-year-project",
    title: "5 Tips for Choosing Your Final Year Engineering Project",
    excerpt: "Selecting the right final year project is a crucial decision. Here are five tips to help you choose a project that is both interesting and impactful for your career.",
    content_markdown: `
## Introduction
Your final year project is more than just a requirement for graduation; it's a chance to showcase your skills, explore your interests, and create something meaningful. Here's how to make the right choice.

### 1. Align with Your Interests and Career Goals
Choose a topic you are genuinely passionate about. You'll be spending a lot of time on it, so your interest will keep you motivated. Also, consider how the project aligns with the career path you want to pursue.

### 2. Assess Feasibility
Be realistic about what you can achieve within the given timeframe and with the available resources.
- **Scope:** Is the project scope manageable?
- **Resources:** Do you have access to the necessary labs, software, or hardware?
- **Guidance:** Is there a faculty member who can guide you on this topic?

### 3. Look for Real-World Problems
A project that solves a real-world problem is often more rewarding and impressive. It demonstrates your ability to apply theoretical knowledge to practical challenges. Look for issues in your community or industry that technology can address.

### 4. Review Existing Literature
Before finalizing a topic, do a thorough literature review. This helps you understand what has already been done in the field, identify gaps, and refine your project idea to make it unique.

### 5. Think About Innovation
Don't be afraid to think outside the box. Can you improve an existing solution? Can you combine technologies in a new way? An innovative project will stand out and provide a great learning experience.

## Conclusion
Choosing your final year project is an exciting opportunity. By aligning with your interests, ensuring feasibility, and aiming for innovation, you can select a project that you'll be proud of.
    `,
    coverImage: "https://picsum.photos/seed/final-year-project-tips/1200/630",
    views: 3190,
    author: {
      name: "Arivon Team",
      avatarUrl: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
    },
    publishedAt: "2026-04-10T12:30:00.000Z",
    tags: ["Engineering", "Projects", "Career"],
    metaTitle: "5 Tips for Choosing Your Final Year Engineering Project | Arivon",
    metaDescription: "Learn how to choose a final year engineering project that aligns with your interests and career goals with these five essential tips."
  },
  {
    _id: "article_3",
    slug: "effective-note-taking-strategies",
    title: "Mastering Note-Taking: Techniques for Better Retention",
    excerpt: "Discover effective note-taking strategies like the Cornell Method and mind mapping to improve your comprehension and memory during lectures.",
    content_markdown: `
## The Importance of Good Notes
Taking good notes is not just about transcribing what the lecturer says. It's about actively processing information, identifying key concepts, and creating a resource that will be invaluable for revision.

### The Cornell Method
This method divides your page into three sections: a main notes column, a cues column, and a summary section at the bottom.
- **Notes Column (Right):** During the lecture, take notes in this largest section.
- **Cues Column (Left):** After the lecture, pull out main ideas, keywords, and questions from your notes and write them here.
- **Summary (Bottom):** In a sentence or two, summarize the key takeaways from the page.

### Mind Mapping
For visual learners, mind mapping can be a powerful tool.
- Start with the central topic in the middle of the page.
- Branch out with main sub-topics.
- Use colors, images, and keywords to connect ideas. This non-linear approach can help you see the bigger picture and make new connections.

### Digital Note-Taking
Apps like Notion, Evernote, or OneNote offer powerful features for organizing notes.
- **Tagging and Linking:** Easily connect related topics.
- **Searchability:** Find information instantly.
- **Multimedia:** Embed images, videos, and web links.

## Conclusion
Experiment with different methods to find what works best for you. The goal is to create notes that are not just a record, but a tool for learning.
    `,
    coverImage: "https://picsum.photos/seed/note-taking-strategies/1200/630",
    views: 6215,
    author: {
      name: "Arivon Team",
      avatarUrl: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
    },
    publishedAt: "2026-04-05T09:00:00.000Z",
    tags: ["Study Skills", "Productivity", "Note-Taking"],
    metaTitle: "Effective Note-Taking Strategies for Students | Arivon",
    metaDescription: "Learn how to take better notes with techniques like the Cornell Method and mind mapping to boost your academic performance."
  },
  {
    _id: "article_4",
    slug: "anna-university-gpa-cgpa-calculation-guide",
    title: "Anna University GPA & CGPA Calculation: The Complete Guide (Regulation 2021)",
    excerpt: "Confused about how your GPA and CGPA are calculated at Anna University? Here's a simple, step-by-step breakdown of the formula, grading scale, and percentage conversion.",
    content_markdown: `
## Why This Matters
Your GPA and CGPA decide your degree classification, placement eligibility, and higher-studies applications. Yet most students never learn how these numbers are actually calculated — they just wait for the COE portal to show a figure. This guide breaks it down so you can calculate it yourself, semester by semester.

### What's the Difference Between GPA and CGPA?
- **GPA (Grade Point Average):** Your performance in a single semester.
- **CGPA (Cumulative GPA):** Your overall performance across all completed semesters.

### The Anna University Grading Scale (Regulation 2021)
| Marks Range | Grade | Grade Point |
|---|---|---|
| 91–100 | O | 10 |
| 81–90 | A+ | 9 |
| 71–80 | A | 8 |
| 61–70 | B+ | 7 |
| 51–60 | B | 6 |
| 41–50 | C | 5 |
| Below 40 | RA (Re-Appear) | 0 |

Note: Regulation 2021 introduced the C grade (5 points) as the minimum passing grade. Under the older Regulation 2017, the minimum passing grade was B (6 points), so if you're checking an R2017 marksheet, don't apply the R2021 table by mistake.

### Step 1: Calculate GPA for a Semester
GPA is a **credit-weighted average**, not a simple average of grade points. The formula is:

**GPA = Σ(Ci × GPi) / ΣCi**

Where Ci is the credit for a course and GPi is the grade point you earned in it.

**Worked example (Semester with 3 subjects):**
- Subject A: 4 credits, Grade O (10 points) → 4 × 10 = 40
- Subject B: 4 credits, Grade A (8 points) → 4 × 8 = 32
- Subject C: 2 credits, Grade O (10 points) → 2 × 10 = 20

Total = 40 + 32 + 20 = 92, Total Credits = 4 + 4 + 2 = 10
GPA = 92 / 10 = **9.2**

### Step 2: Calculate CGPA Across Semesters
Once you have the GPA for each semester, CGPA is the same credit-weighted formula applied across *all* semesters completed so far:

**CGPA = Σ(All Credits × Grade Points across every semester) / Σ(All Credits earned so far)**

A quicker way: multiply each semester's GPA by that semester's total credits, add them up, then divide by the total credits across all semesters.

### Step 3: Convert CGPA to Percentage
Anna University's official conversion, printed on your consolidated marksheet, is:

**Percentage = CGPA × 10**

So a CGPA of 8.2 equals 82%. Don't use the CBSE-style "×9.5" formula — it isn't what Anna University uses.

### Degree Classification Cut-offs
- **First Class with Distinction:** CGPA ≥ 8.5, with no arrears in any subject (cleared on first attempt).
- **First Class:** CGPA ≥ 6.5.
- Anything below this is classified as Second Class, per your regulation's norms.

### Common Mistakes Students Make
- Averaging grade points directly instead of weighting them by credit — this gives a wrong GPA, especially when your subjects have different credit values.
- Forgetting that arrear (RA) subjects contribute 0 points until cleared, and get replaced by the new grade point once you pass them.
- Mixing up R2017 and R2021 grading tables.

## Conclusion
Once you understand that GPA and CGPA are just credit-weighted averages, the math becomes simple. Keep a semester-wise tracker in a spreadsheet — it'll save you the guesswork every time results are released, and you'll know your standing before the official marksheet even shows it.
    `,
    coverImage: "https://picsum.photos/seed/anna-university-gpa-cgpa-guide/1200/630",
    views: 8940,
    author: {
      name: "Arivon Team",
      avatarUrl: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
    },
    publishedAt: "2026-05-20T09:30:00.000Z",
    tags: ["GPA", "CGPA", "Results", "Anna University"],
    metaTitle: "Anna University GPA & CGPA Calculation Guide (R2021) | Arivon",
    metaDescription: "Learn the exact formula Anna University uses to calculate GPA and CGPA under Regulation 2021, with a worked example and percentage conversion."
  },
  {
    _id: "article_5",
    slug: "how-to-check-anna-university-results-coe-portal",
    title: "How to Check Your Anna University Results on the COE Portal (Step-by-Step)",
    excerpt: "Result day stress is real. Here's exactly how to check your Anna University semester results on coe.annauniv.edu without getting stuck on a crashed page or a wrong login.",
    content_markdown: `
## Where Results Are Published
Anna University semester results are published on the official Controller of Examinations (COE) portal — usually at **coe.annauniv.edu** or its mirror **coe1.annauniv.edu**. Both are official; if one is slow or down on result day due to heavy traffic, try the other.

### Step-by-Step: Checking Your Result
1. Go to **coe.annauniv.edu** (or coe1.annauniv.edu) in your browser.
2. On the homepage, look for the **"Student login"** panel — separate from the "Institution/Staff login" panel, so make sure you're in the right box.
3. Enter your **Register Number**.
4. Enter your **Date of Birth** in **DD-MM-YYYY** format — this acts as your password, so no separate account or OTP is needed.
5. Enter the **Captcha** shown on screen. If it's hard to read, most portals have a "Play" audio option or a refresh icon next to it — use that instead of guessing repeatedly.
6. Click **Login** / **Get Result**.
7. Your provisional marksheet will load, showing subject-wise grades and your semester GPA.

### Reading Your Result
- **P** — Pass.
- **RA** — Re-Appear (you didn't clear the minimum passing grade for that subject and need to write the arrear exam).
- **AB** — Absent.
- **W** — Withheld (usually pending fee dues, malpractice case, or document verification — contact your college exam cell).

### A Few Things to Keep in Mind
- The result shown online is a **provisional** marksheet for your own reference. The official consolidated mark sheet is issued physically through your college after verification.
- Don't panic if the site is slow right after results are announced — thousands of students hit the portal at once. Try again after a few minutes, or use the alternate COE mirror.
- Save your result as a PDF (Ctrl+P → Save as PDF) immediately after it loads, so you have a copy even if the site goes down later.
- If you got an RA in a subject, note the arrear registration dates from your college notice board — you'll need to re-register for that exam in the next available cycle.
- Not satisfied with your marks? You can apply for **photocopy of the answer script** first, and **revaluation** afterward, both through the COE portal within the announced deadline — don't miss this window, it's usually short.

### Only Use Official Sites
Stick to the official coe.annauniv.edu / coe1.annauniv.edu domains. Avoid third-party "result" links shared in WhatsApp/Telegram groups that ask you to enter your details on unfamiliar pages — always type the URL yourself rather than clicking a forwarded link.

## Conclusion
Checking your Anna University result takes less than a minute once you know exactly where to click. Keep your register number and date of birth handy on result day, use the official portal, and save your marksheet as soon as it loads.
    `,
    coverImage: "https://picsum.photos/seed/anna-university-coe-result-check/1200/630",
    views: 11230,
    author: {
      name: "Arivon Team",
      avatarUrl: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
    },
    publishedAt: "2026-06-02T08:00:00.000Z",
    tags: ["Results", "COE Portal", "Anna University", "How-To"],
    metaTitle: "How to Check Anna University Results on COE Portal | Arivon",
    metaDescription: "A simple step-by-step guide to checking your Anna University semester results at coe.annauniv.edu, including how to read RA, AB, and W status codes."
  },
  {
    _id: "article_6",
    slug: "how-to-score-more-marks-anna-university-exams",
    title: "How to Score More Marks in Anna University Exams: Practical Tips That Actually Work",
    excerpt: "Beyond just 'study hard' — here are specific, actionable strategies to push your internal and semester exam marks higher at Anna University.",
    content_markdown: `
## It's Not Just About Studying More — It's About Studying Smart
Two students can put in the same hours and land very different marks. The difference is usually in *how* they approach internals, answer writing, and exam strategy — not just how many hours they read.

### 1. Don't Neglect Internal Assessment Marks
Your internal marks (usually out of 20 or as per your curriculum) get added directly to your final grade — they aren't a separate formality.
- Attend and submit every assignment, model exam, and lab record on time; missed submissions cost easy marks.
- Attendance often affects eligibility to even write the exam — falling below 75% can put you in the **SA (Prevention of Re-appearance)** category, meaning you can't write the exam at all and must redo the semester.
- Treat internal exams seriously — they're a preview of your actual exam pattern from the same question setter's mindset.

### 2. Understand the Question Pattern, Not Just the Syllabus
- Go through at least the last 3–4 years of question papers for each subject. Anna University often repeats concepts (not necessarily exact questions) across years.
- Identify high-weightage units — some units consistently carry more marks (especially in Part B/C long-answer sections).
- Know your split: Part A (2-mark), Part B (13-mark), Part C (15-mark, if applicable) — allocate prep time in proportion to marks, not just page count.

### 3. Answer-Writing Technique in the Exam
- **Attempt every question**, even partially. A half-answered question earns partial marks; an unattempted one earns zero.
- Underline key terms, use labeled diagrams where relevant, and write in point-wise/step format for theory answers — examiners scan quickly, and structure helps you get full credit for what you know.
- For numerical/derivation subjects, show all steps — many valuators award step marks even if your final answer is wrong.
- Manage your time: don't spend 40 minutes perfecting one answer and rush the rest. Divide time roughly by mark-weightage.

### 4. Prioritize High-Credit Subjects
Since your GPA is credit-weighted, a 4-credit subject affects your GPA far more than a 1-credit lab or elective. When you're short on time before exams, prioritize revision of high-credit theory subjects over low-credit ones.

### 5. Use the Revaluation and Photocopy Option When It Matters
If your marks in a crucial subject seem lower than expected, apply for an **answer script photocopy** through the COE portal to see exactly where marks were lost, then apply for **revaluation** if genuinely warranted. This is a standard, official process — use it within the announced deadline, don't let it pass.

### 6. Group Study — Done Right
Group study works only if it's structured: assign topics, explain to each other (teaching a concept is one of the strongest ways to retain it), and use the group to solve past papers together rather than just casual reading sessions.

## Conclusion
Marks in Anna University exams reward preparation that's aligned with the actual exam pattern — internal consistency, understanding weightage, and disciplined answer writing matter as much as raw study hours. Small, consistent habits across the semester beat last-week cramming every time.
    `,
    coverImage: "https://picsum.photos/seed/anna-university-score-more-marks/1200/630",
    views: 7654,
    author: {
      name: "Arivon Team",
      avatarUrl: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
    },
    publishedAt: "2026-06-18T11:15:00.000Z",
    tags: ["Study Tips", "Exams", "Anna University", "Marks"],
    metaTitle: "How to Score More Marks in Anna University Exams | Arivon",
    metaDescription: "Practical, actionable tips to improve your internal and semester exam marks at Anna University — from answer-writing technique to revaluation strategy."
  },
  {
    _id: "article_7",
    slug: "anna-university-college-transfer-guide",
    title: "How to Transfer to Another Anna University College: Rules & Process Explained",
    excerpt: "Thinking of switching to another Anna University affiliated college or a constituent campus like CEG, MIT, or ACT? Here's what's actually allowed and how the transfer process works.",
    content_markdown: `
## Can You Even Transfer? Know the Rules First
Anna University does allow inter-college transfers, but only under specific conditions. Before applying, check which category you and your target college fall under — this determines whether a transfer is even possible.

### Who Can Transfer
- Transfers are permitted **only after completing the first year** of your course.
- You can transfer **only within the same branch** of study (e.g., CSE to CSE). Branch changes during a transfer are not allowed.
- You must have **passed all exams** conducted so far by your current college/university for the duration of study already completed — arrears can block a transfer.

### The Category Rules (This Is Where Most Students Get Confused)
- **Self-financing (non-autonomous) college → another self-financing (non-autonomous) college:** Permitted.
- **Government / Government-aided (non-autonomous) college → self-financing (non-autonomous) college:** Permitted.
- **Autonomous college → another autonomous college:** **Not permitted.**
- **Autonomous ↔ non-autonomous (either direction):** **Not permitted.**
- Constituent colleges of Anna University (like CEG, ACT, MIT, SAP) fall under a separate category handled directly through the university's Centre for Student Affairs, rather than the general DOTE process — check with that office specifically if you're targeting one of these campuses.

### The Process, Step by Step
1. **Talk to your current college first.** You need the consent/forwarding endorsement of the Principal of your current (transferor) college.
2. **Get provisional consent from the target college.** The Principal of the college you want to move to (transferee college) also needs to agree, subject to seat availability in that branch.
3. **Apply through the proper channel.** For transfers between self-financing/government engineering colleges, applications are routed through the **Directorate of Technical Education (DOTE), Chennai**, via your college. For Anna University's own constituent colleges, apply through the university's **Centre for Student Affairs**.
4. **Obtain a No Objection Certificate (NOC)** from Anna University as part of the documentation.
5. **Continue attending your current college** until the transfer order is officially issued — stopping classes before approval can hurt you if the transfer gets delayed or rejected.
6. Once approved, you'll be governed by the **fee structure of the new college**, not your old one.

### Important Things to Know
- Submitting an application with both Principals' consent **does not guarantee approval** — the Director of Technical Education (or Anna University, for constituent colleges) reserves the right to accept, reject, or withhold the request on administrative grounds.
- If you're transferring after an official break of study, you're subject to the time limit for course completion under the regulation in force at that time, and you'll follow the regulations applicable at the time of transfer — not your original batch's regulation.
- Self-financing colleges sometimes delay issuing your Transfer Certificate (TC) since outgoing students can affect their intake numbers — if this happens, you can approach Anna University's Centre for Student Affairs for a grievance redressal.
- Keep all your academic documents (mark sheets, TC, conduct certificate) ready — the transferee college will ask for documentary proof that you've cleared everything so far.

## Conclusion
A college transfer within Anna University is possible, but it's a process with real bureaucratic steps — not a quick campus switch. Start early, get both Principals on board, keep attending your current college until the order is issued, and route your application through the correct authority (DOTE for affiliated colleges, Centre for Student Affairs for constituent campuses like CEG/ACT/MIT).
    `,
    coverImage: "https://picsum.photos/seed/anna-university-college-transfer-guide/1200/630",
    views: 5320,
    author: {
      name: "Arivon Team",
      avatarUrl: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
    },
    publishedAt: "2026-06-25T14:45:00.000Z",
    tags: ["College Transfer", "TC", "Anna University", "Guidance"],
    metaTitle: "Anna University College Transfer Rules & Process | Arivon",
    metaDescription: "A clear breakdown of Anna University's inter-college transfer rules — who's eligible, category restrictions, and the step-by-step process to apply."
  }
];