export interface Document {
  _id: string
  subjectId: string                   // References Subject._id
  type: "question_paper" | "notes" | "syllabus"
  subject_name: string
  file_url: string                    // Direct PDF URL
  pdf_filename: string
  exam_period: string                 // e.g. "ND-2025", "AM-2024"
  regulation: string
  department: string
  semester: string
  addedDate: string
  views: number
  downloads: number
  createdAt: string
  updatedAt: string
}

export const MOCK_DOCUMENTS: Document[] = [
  // OHS352 - Project Report Writing
  {
    _id: "doc_ohs352_qp1",
    subjectId: "cse_7_ohs352",
    type: "question_paper",
    subject_name: "Project Report Writing",
    file_url: "https://files.myarivon.in/Anna_University_Question_Paper_General_7th_Sem_OHS352_Project_Report_Writing_AM_2025_Reg_2021.pdf",
    pdf_filename: "Anna_University_QP_CSE_7_OHS352_ND2025_Reg2021.pdf",
    exam_period: "ND-2025",
    regulation: "2021",
    department: "CSE",
    semester: "7",
    addedDate: "24-03-2026",
    views: 540,
    downloads: 210,
    createdAt: "2026-03-26T23:39:04.148Z",
    updatedAt: "2026-03-26T23:39:04.148Z"
  },
  
  // CS3401 - Design and Analysis of Algorithms
  {
    _id: "doc_cs3401_qp1",
    subjectId: "cse_4_cs3401",
    type: "question_paper",
    subject_name: "Design and Analysis of Algorithms",
    file_url: "https://files.myarivon.in/Anna_University_Question_Paper_Cse_4th_Sem_CS3401_Algorithms_AM_2025_Reg_2021.pdf",
    pdf_filename: "AU_QP_CSE4_CS3401_ND2025_Reg2021.pdf",
    exam_period: "ND-2025",
    regulation: "2021",
    department: "CSE",
    semester: "4",
    addedDate: "28-02-2026",
    views: 890,
    downloads: 412,
    createdAt: "2026-03-26T23:39:04.148Z",
    updatedAt: "2026-03-26T23:39:04.148Z"
  },
 
  {
    _id: "doc_cs3401_notes",
    subjectId: "cse_4_cs3401",
    type: "notes",
    subject_name: "Design and Analysis of Algorithms",
    file_url: "https://files.myarivon.in/Anna_University_Question_Paper_Cse_4th_Sem_CS3401_Algorithms_AM_2025_Reg_2021.pdf",
    pdf_filename: "CS3401_Algorithms_Easy_Revision_Notes.pdf",
    exam_period: "N/A",
    regulation: "2021",
    department: "CSE",
    semester: "4",
    addedDate: "10-01-2026",
    views: 1200,
    downloads: 651,
    createdAt: "2026-03-26T23:39:04.148Z",
    updatedAt: "2026-03-26T23:39:04.148Z"
  },

  // CS3451 - Operating Systems
  {
    _id: "doc_cs3451_qp1",
    subjectId: "cse_4_cs3451",
    type: "question_paper",
    subject_name: "Operating Systems",
    file_url: "https://files.myarivon.in/Anna_University_Question_Paper_Cse_4th_Sem_CS3451_Introduction_To_Operation_Systems_ND_2025_Reg_2021.pdf",
    pdf_filename: "AU_QP_CSE4_CS3451_ND2025_Reg2021.pdf",
    exam_period: "ND-2025",
    regulation: "2021",
    department: "CSE",
    semester: "4",
    addedDate: "26-02-2026",
    views: 780,
    downloads: 320,
    createdAt: "2026-03-26T23:39:04.148Z",
    updatedAt: "2026-03-26T23:39:04.148Z"
  },

  // CS3391 - DBMS
  {
    _id: "doc_cs3391_qp1",
    subjectId: "cse_3_cs3391",
    type: "question_paper",
    subject_name: "Database Management Systems",
    file_url: "https://files.myarivon.in/Anna_University_Question_Paper_Cse_3th_Sem_CS3391_Object_Oriented_Programming_AM_2025_Reg_2021.pdf",
    pdf_filename: "AU_QP_CSE3_CS3391_ND2025_Reg2021.pdf",
    exam_period: "ND-2025",
    regulation: "2021",
    department: "CSE",
    semester: "3",
    addedDate: "10-02-2026",
    views: 450,
    downloads: 180,
    createdAt: "2026-03-26T23:39:04.148Z",
    updatedAt: "2026-03-26T23:39:04.148Z"
  },
  
  // EC3452 - DSP
  {
    _id: "doc_ec3452_qp1",
    subjectId: "ece_4_ec3452",
    type: "question_paper",
    subject_name: "Digital Signal Processing",
    file_url: "https://files.myarivon.in/Anna_University_Question_Paper_Ece_4th_Sem_EC3452_Electromagnetic_Fields_ND_2024_Reg_2021.pdf",
    pdf_filename: "AU_QP_ECE4_EC3452_ND2025_Reg2021.pdf",
    exam_period: "ND-2025",
    regulation: "2021",
    department: "ECE",
    semester: "4",
    addedDate: "20-03-2026",
    views: 730,
    downloads: 290,
    createdAt: "2026-03-26T23:39:04.148Z",
    updatedAt: "2026-03-26T23:39:04.148Z"
  },
 

  // EC3351 - Signals and Systems
  {
    _id: "doc_ec3351_qp1",
    subjectId: "ece_3_ec3351",
    type: "question_paper",
    subject_name: "Signals and Systems",
    file_url: "https://files.myarivon.in/Anna_University_Question_Paper_Ece_3th_Sem_EC3351_Control_Systems_ND_2025_Reg_2021.pdf",
    pdf_filename: "AU_QP_ECE3_EC3351_ND2025_Reg2021.pdf",
    exam_period: "ND-2025",
    regulation: "2021",
    department: "ECE",
    semester: "3",
    addedDate: "15-03-2026",
    views: 610,
    downloads: 220,
    createdAt: "2026-03-26T23:39:04.148Z",
    updatedAt: "2026-03-26T23:39:04.148Z"
  },
]