interface Job {
  title: string;
  description: string;
  location: string;
  requiredSkills: string[];
}

interface Resume {
  id: string;
  companyName: string;
  jobTitle: string;
  jobDescription?: string;
  imagePath: string;
  resumePath: string;
  feedback: Feedback | '';
}

interface Feedback {
  overallScore: number;
  ATS: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
    }[];
  };
  toneAndStyle: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  content: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  structure: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  skills: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
}

interface FSItem {
    name: string;
    type: string;
    path: string;
    size: number;
    modified: string;
}

interface PuterUser {
    name: string;
    email: string;
    avatar?: string;
}

interface ChatMessage {
    role: string;
    content: Array<{
        type: string;
        text?: string;
        puter_path?: string;
    }>;
}

interface PuterChatOptions {
    model?: string;
    max_tokens?: number;
    temperature?: number;
}

interface AIResponse {
    message: {
        content: string | Array<{ text: string }>;
    };
}

interface KVItem {
    key: string;
    value: string;
}