export interface Article {
  _id: string
  slug: string
  title: string
  excerpt: string
  content_markdown: string
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
    author: {
      name: "Arivon Team",
      avatarUrl: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
    },
    publishedAt: "2026-04-10T12:30:00.000Z",
    tags: ["Engineering", "Projects", "Career"],
    metaTitle: "5 Tips for Choosing Your Final Year Engineering Project | Arivon",
    metaDescription: "Learn how to choose a final year engineering project that aligns with your interests and career goals with these five essential tips."
  }
];