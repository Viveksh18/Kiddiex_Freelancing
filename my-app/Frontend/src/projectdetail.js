// import email_cover from "./media/image/project/Email_cover.png"
// import email_gallery from "./media/image/project/Email_Gallery.png"

import calling_cover from "./media/image/project/Voice_calling/voice_cover.png"
import calling_gallery1 from "./media/image/project/Voice_calling/voice_gallery1.png"
import calling_gallery2 from "./media/image/project/Voice_calling/voice_gallery2.png"

// import RAG_cover from "./media/image/project/legal-retrieval-cover.png"
import RAG_gallery1 from "./media/image/project/RAG/RAG_gallery1.png"
import RAG_gallery2 from "./media/image/project/RAG/RAG_gallery2.png"
import RAG_cover from "./media/image/project/RAG/RAG_cover.png"

import email_cover from "./media/image/project/Email_copilot/email_cover.png"
import email_gallery1 from "./media/image/project/Email_copilot/Email_Gallery1.png"
import email_gallery2 from "./media/image/project/Email_copilot/Email_Gallery2.png"
import email_gallery3 from "./media/image/project/Email_copilot/Email_Gallery3.png"




import video1_cover from "./media/image/project/video_cover/video1_cover.png"
import video2_cover from "./media/image/project/video_cover/video2_cover.png"
import video3_cover from "./media/image/project/video_cover/video3_cover.png"
import video4_cover from "./media/image/project/video_cover/video4_cover.png"
import video5_cover from "./media/image/project/video_cover/video5_cover.png"
import video6_cover from "./media/image/project/video_cover/video6_cover.png"



import video1 from "./media/video/video1.mp4"
import video2 from "./media/video/video2.mp4"
import video3 from "./media/video/video3.mp4"
import video4 from "./media/video/video4.mp4"
import video5 from "./media/video/video5.mp4"
import video6 from "./media/video/video6.mp4"



export const projects = [
  {
    id: "email-copilot",
    title: "AI Powered Email Copilot",
    tag: "AI Agent",
    color: "#ffd9e6",
    image: email_cover,
    description:
      "An AI agent that reads your inbox, summarizes long threads, and drafts context-aware replies in the tone you choose.",
    role: "AI Agent Design & Development",
    year: "2026",
    tools: ["React", "Node.js", "LLM API", "Gmail API"],
    href: "https://github.com/Viveksh18/AI-powered-Email-Copilot.git",
    live: "", // add a live demo link, or leave empty to hide the button

    overview: [
      "AI Powered Email Copilot connects to your inbox, understands what each email is asking, and prepares a ready-to-send reply in the tone you choose.",
      "It cuts down repetitive writing and helps you respond faster, while you stay in control by reviewing every draft before it goes out.",
    ],
    challenge:
      "Inboxes fill up with long threads and repetitive questions. Reading, understanding and replying to each one takes time that should go to real work.",
    solution:
      "An AI agent that summarizes each thread, works out what is being asked, and writes a clear draft reply that matches your tone, ready for a quick review.",
    features: [
      { title: "Thread summaries", text: "Long email chains turned into a few clear lines." },
      { title: "Smart draft replies", text: "Context-aware replies written for each message." },
      { title: "Tone control", text: "Choose professional, friendly or short before drafting." },
      { title: "Review before send", text: "Nothing goes out until you approve the draft." },
    ],
    gallery: [email_gallery1,email_gallery2,email_gallery3],
    timeline: [
      { title: "Research & planning", date: "Jul 2026", state: "done", text: "Defined the problem, the users and the core features." },
      { title: "UI & workflow design", date: "Aug 2026", state: "done", text: "Designed the inbox view and the reply flow." },
      { title: "AI reply drafting", date: "Sep 2026", state: "done", text: "Built summaries and context-aware draft replies." },
      { title: "Inbox integration", date: "Oct 2026", state: "current", text: "Connecting the copilot to real email accounts." },
      { title: "Testing & polish", date: "Nov 2026", state: "upcoming", text: "Bug fixes, speed and tone quality checks." },
      { title: "Launch", date: "Dec 2026", state: "upcoming", text: "Public release and feedback collection." },
    ],// e.g. ["/projects/email-1.jpg", "/projects/email-2.jpg"]
  },
  {
    id: "legal-retrieval",
    title: "Legal Information Retrieval System",
    tag: "AI Search",
    color: "#e3f3ff",
    image: RAG_cover,
    description:
      "A smart search system for legal documents that ranks results by meaning, not just keywords.",
    role: "AI Design & Development",
    year: "2026",
    tools: ["Python", "NLP", "Vector Search", "React"],
    href: "https://github.com/Viveksh18/YOUR-REPO-NAME",
    live: "",

    overview: [
      "Legal Information Retrieval System lets you ask a question in plain language and finds the most relevant cases, acts and clauses.",
      "Results are ranked by meaning instead of exact keyword matches, so you reach the right document faster.",
    ],
    challenge:
      "Legal documents are long, dense and full of specialist wording. Keyword search misses relevant passages when the words do not match exactly.",
    solution:
      "A retrieval system that understands the meaning of a question and matches it to the most relevant passages, then shows them with clear context.",
    features: [
      { title: "Plain-language search", text: "Ask the way you would ask a person." },
      { title: "Meaning-based ranking", text: "Finds relevant text even when the words differ." },
      { title: "Focused results", text: "Shows the matching passage, not just the file." },
      { title: "Fast lookup", text: "Searches large collections of documents in seconds." },
    ],
    gallery: [RAG_gallery1,RAG_gallery2],
    timeline: [
      { title: "Research & planning", date: "Aug 2026", state: "done", text: "Scoped the document types and the questions users ask." },
      { title: "Data collection & indexing", date: "Sep 2026", state: "done", text: "Collected legal documents and prepared them for search." },
      { title: "Search & ranking", date: "Oct 2026", state: "current", text: "Tuning meaning-based search so the best passages come first." },
      { title: "Search interface", date: "Nov 2026", state: "upcoming", text: "A clean results page with highlighted passages." },
      { title: "Testing & launch", date: "Dec 2026", state: "upcoming", text: "Accuracy checks and the first public version." },
    ],
  },
  {
    id: "ai-calling-agent",
    title: "AI Calling Agent",
    tag: "AI Agent",
    color: "#d9f5ee",
    image: calling_cover,
    description:
      "A voice-based AI agent that makes and answers phone calls and handles tasks on its own.",
    role: "AI Agent Design & Development",
    year: "2026",
    tools: ["Python", "Speech-to-Text", "LLM API", "Telephony API"],
    href: "https://github.com/Viveksh18/YOUR-REPO-NAME",
    live: "",

    overview: [
      "AI Calling Agent is a voice assistant that makes and answers phone calls, holds natural conversations, and handles tasks like follow-ups, bookings and customer queries.",
      "It frees people from repetitive calls so they can focus on conversations that need a human.",
    ],
    challenge:
      "Routine calls such as reminders, follow-ups and common questions take up a lot of time, and missed calls mean missed opportunities.",
    solution:
      "A voice agent that listens, understands what the caller needs, answers in natural speech, and completes the task or passes it to a person.",
    features: [
      { title: "Natural conversation", text: "Listens and replies in a smooth, human-like way." },
      { title: "Inbound and outbound", text: "Answers incoming calls and makes calls on its own." },
      { title: "Task handling", text: "Books, follows up and answers common questions." },
      { title: "Always available", text: "Picks up calls any time of day." },
    ],
    gallery: [calling_gallery1,calling_gallery2],
    timeline: [
      { title: "Research & planning", date: "Sep 2026", state: "done", text: "Chose the call scenarios and the voice stack." },
      { title: "Voice pipeline", date: "Oct 2026", state: "current", text: "Connecting speech recognition, the AI and natural speech output." },
      { title: "Conversation flows", date: "Nov 2026", state: "upcoming", text: "Scripts for follow-ups, bookings and common questions." },
      { title: "Testing", date: "Dec 2026", state: "upcoming", text: "Live call tests and handing off to a human when needed." },
      { title: "Launch", date: "Jan 2027", state: "upcoming", text: "First real calls and monitoring." },
    ],
  },
  {
    id: "ai-video-editing",
    title: "AI Cinematic Short Film",
    tag: "AI Video",
    color: "#e6e6ff",
    image: video2_cover,
    description:
      "A short cinematic story made with AI-generated footage, edited for emotion, pacing and a film-style look.",
    role: "AI Video Editing & Color",
    year: "2026",
    tools: ["AI Video Generation", "Premiere Pro", "DaVinci Resolve"],   // replace with the tools you really used
    href: "",
    live: "",

    overview: [
      "A 24-second cinematic short that moves between a warm memory in golden light and a dark, tense present.",
      "The footage is AI-generated, then cut, graded and sound-designed by hand so the story reads as one film instead of a set of separate clips.",
    ],
    challenge:
      "AI-generated shots often differ in lighting, color and mood, so they feel disconnected when placed next to each other.",
    solution:
      "Careful shot selection, matched color grading and rhythm-based cuts turn separate AI clips into a single story with a clear emotional arc.",
    features: [
      { title: "Story-first cutting", text: "Shots ordered to build emotion, from warm memory to tension." },
      { title: "Cinematic color", text: "Warm sunset tones and cold shadows graded for contrast and mood." },
      { title: "Shot consistency", text: "AI clips matched in look so they feel like one film." },
      { title: "Sound & pacing", text: "Cuts and audio timed to the emotional beats." },
    ],
    gallery: [],

    videos: [
      { id: "ai-1", category: "ai", title: "AI Cinematic Short", type: "file", src: video2, poster: video2_cover },
    ],

    timeline: [
      { title: "Concept & script", date: "Oct 2026", state: "done", text: "Defined the story, mood and shot list." },
      { title: "AI shot generation", date: "Oct 2026", state: "done", text: "Generated and selected the best takes." },
      { title: "Edit & color grade", date: "Nov 2026", state: "done", text: "Cut the sequence and matched the look across shots." },
      { title: "Sound & final export", date: "Nov 2026", state: "done", text: "Mixed audio and exported for social and web." },
    ],
  },
  {
    id: "ai-portrait-edit",
    title: "AI Portrait & Crowd Edit",
    tag: "AI Video",
    color: "#e6e6ff",
    image: video1_cover,
    description:
      "A square short that moves from a busy fan-crowd moment to clean studio portraits, edited with AI tools for a polished, high-end look.",
    role: "AI Video Editing & Color",
    year: "2026",
    tools: ["AI Video Tools", "Premiere Pro", "DaVinci Resolve"],   // replace with the tools you really used
    href: "",
    live: "",

    overview: [
      "A 26-second square clip that opens in the middle of an excited crowd and then cuts to a calm studio portrait series.",
      "AI-assisted editing helps the two very different looks feel like one story, with consistent color, framing and rhythm.",
    ],
    challenge:
      "Handheld crowd footage and clean studio shots look nothing alike, so putting them together can feel jarring.",
    solution:
      "Matched color, smooth transitions and cuts timed to the energy of the scene tie both worlds into a single, confident edit.",
    features: [
      { title: "Smooth transitions", text: "A clear shift from busy crowd to quiet studio." },
      { title: "Matched look", text: "Skin tones and contrast kept consistent across shots." },
      { title: "Square format", text: "Framed for feeds and profile-style placements." },
      { title: "AI-assisted polish", text: "Faster cleanup and enhancement, with human taste on top." },
    ],
    gallery: [],

    videos: [
      { id: "ai-2", category: "ai", title: "AI Portrait & Crowd Edit", type: "file", src: video1, poster: video1_cover, ratio: "1 / 1" },
    ],

    timeline: [
      { title: "Footage review", date: "Oct 2026", state: "done", text: "Selected the strongest crowd and studio moments." },
      { title: "AI enhancement", date: "Oct 2026", state: "done", text: "Cleaned up and enhanced shots with AI tools." },
      { title: "Edit & color", date: "Nov 2026", state: "done", text: "Cut the sequence and matched the look." },
      { title: "Export", date: "Nov 2026", state: "done", text: "Delivered in a square social-ready format." },
    ],
  },

  {
    id: "ai-card-trick-vfx",
    title: "Card Trick VFX Edit",
    tag: "AI Video",
    color: "#ffe3a3",
    image: video3_cover,
    description:
      "A short magic-style clip where a simple card trick turns into a visual illusion, built with VFX and tight, funny timing.",
    role: "Video Editing & VFX",
    year: "2026",
    tools: ["After Effects", "Premiere Pro", "AI Video Tools"],   // replace with the tools you really used
    href: "",
    live: "",

    overview: [
      "A 12-second outdoor clip where a presenter shows a pair of playing cards, reacts, and sets up a surprise with a car in the background.",
      "The edit leans on reaction shots, quick cuts and VFX so the trick lands in the first few seconds and keeps people watching.",
    ],
    challenge:
      "Illusion clips only work when the effect feels believable and the timing is exact. A late cut or a visible seam ruins the surprise.",
    solution:
      "Frame-accurate cuts, tracked effects and expressive reaction shots make the moment feel real and fun to rewatch.",
    features: [
      { title: "Hook in seconds", text: "The trick starts immediately to hold attention." },
      { title: "Believable VFX", text: "Effects blended into the footage without obvious seams." },
      { title: "Reaction timing", text: "Cuts placed on the presenter's expressions." },
      { title: "Short-form ready", text: "Quick, punchy and made for reels and Shorts." },
    ],
    gallery: [],

    videos: [
      { id: "ai-3", category: "ai", title: "Card Trick VFX Edit", type: "file", src: video3, poster: video3_cover },
    ],

    timeline: [
      { title: "Shoot review", date: "Oct 2026", state: "done", text: "Picked the best takes and reactions." },
      { title: "Rough cut", date: "Oct 2026", state: "done", text: "Built the trick's timing and pacing." },
      { title: "VFX & polish", date: "Nov 2026", state: "done", text: "Added effects, color and sound." },
      { title: "Export", date: "Nov 2026", state: "done", text: "Delivered for social platforms." },
    ],
  },

  /* ===================== MOTION GRAPHICS ===================== */

  {
    id: "before-after-reel",
    title: "Before & After Reel Edit",
    tag: "Motion Graphics",
    color: "#ffe0f3",
    image: video4_cover,
    description:
      "A vertical talking-head reel that shows the raw footage next to the finished edit, with animated captions and cinematic color.",
    role: "Video Editing & Motion",
    year: "2026",
    tools: ["After Effects", "Premiere Pro", "DaVinci Resolve"],   // replace with the tools you really used
    href: "",
    live: "",

    overview: [
      "A vertical reel that puts the original footage next to the final version, so viewers can see what editing adds.",
      "Animated word-by-word captions, glowing Before and After labels and a warm sunset grade turn a plain talking-head clip into something that stands out.",
    ],
    challenge:
      "Talking-head videos are easy to scroll past. Flat color and plain subtitles do very little to hold attention.",
    solution:
      "Dynamic captions that highlight key words, a rich color grade and a clear before-and-after layout keep the eye moving and show the value of the edit.",
    features: [
      { title: "Animated captions", text: "Key words pop in color and size as they are spoken." },
      { title: "Before & after layout", text: "Raw and finished footage shown side by side." },
      { title: "Cinematic grade", text: "A warm, high-contrast look over a flat original." },
      { title: "Vertical first", text: "Built for Reels, Shorts and TikTok." },
    ],
    gallery: [],

    videos: [
      { id: "mg-1", category: "motion", title: "Before & After Reel", type: "file", src: video4, poster: video4_cover, ratio: "9 / 16" },
    ],

    timeline: [
      { title: "Raw footage review", date: "Oct 2026", state: "done", text: "Picked the best talking-head takes." },
      { title: "Captions & motion", date: "Oct 2026", state: "done", text: "Animated every caption and label." },
      { title: "Color grade", date: "Nov 2026", state: "done", text: "Graded the footage for a cinematic look." },
      { title: "Export", date: "Nov 2026", state: "done", text: "Delivered in vertical 9:16." },
    ],
  },

  {
    id: "app-promo-motion",
    title: "Trading App Promo Motion",
    tag: "Motion Graphics",
    color: "#d9f5ee",
    image: video5_cover,
    description:
      "A green, glossy app promo that walks through four steps with phone mockups, flowing lines and bold on-screen text.",
    role: "Motion Graphics Design",
    year: "2026",
    tools: ["After Effects", "Figma", "Premiere Pro"],   // replace with the tools you really used
    href: "",
    live: "",

    overview: [
      "A 14-second product video for a market-prediction app that explains the whole idea in four short steps: find the market, follow the money, get the alert and make the call.",
      "Animated phone screens, ripples and glowing lines on a deep green background keep it clear and energetic.",
    ],
    challenge:
      "App features are hard to explain in a few seconds, and static screenshots do not show how the product actually works.",
    solution:
      "Large step titles, animated UI and a consistent green palette present each feature clearly and keep a fast pace from start to finish.",
    features: [
      { title: "Four-step story", text: "One idea per scene with a clear title." },
      { title: "Animated UI", text: "App screens that move, scroll and respond to taps." },
      { title: "Consistent palette", text: "Deep greens and bright accents used across every scene." },
      { title: "Landscape ready", text: "Made for websites, ads and presentations." },
    ],
    gallery: [],

    videos: [
      { id: "mg-2", category: "motion", title: "Trading App Promo", type: "file", src: video5, poster: video5_cover },
    ],

    timeline: [
      { title: "Concept & script", date: "Oct 2026", state: "done", text: "Chose the four steps and the key messages." },
      { title: "UI animation", date: "Oct 2026", state: "done", text: "Animated the phone screens and transitions." },
      { title: "Typography & polish", date: "Nov 2026", state: "done", text: "Added titles, glow and timing." },
      { title: "Export", date: "Nov 2026", state: "done", text: "Delivered in 16:9 HD." },
    ],
  },

  {
    id: "hire-ai-promo-motion",
    title: "Hire.AI Promo Motion",
    tag: "Motion Graphics",
    color: "#e3f3ff",
    image: video6_cover,
    description:
      "A promo for an AI hiring tool that goes from a stressed job-search moment to a smart resume scan, ending on a clear call to action.",
    role: "Motion Graphics Design",
    year: "2026",
    tools: ["After Effects", "Figma", "Premiere Pro"],   // replace with the tools you really used
    href: "",
    live: "",

    overview: [
      "A 16-second promo that starts with a real, relatable problem and shows how an AI tool scans resumes and finds the best candidate.",
      "Glass-style cards, a live progress bar, an Instant Analysis screen and a final Try Now button explain the product without any extra narration.",
    ],
    challenge:
      "Hiring tools sound complicated. The video has to show the problem and the benefit quickly, before viewers lose interest.",
    solution:
      "A short story arc from problem to solution, clean glassmorphism UI and bold color changes make each step easy to follow.",
    features: [
      { title: "Problem to solution", text: "Opens on the pain point, then shows the fix." },
      { title: "Glass UI motion", text: "Soft, blurred cards and a live scanning bar." },
      { title: "Clear call to action", text: "Ends on a simple Try Now button." },
      { title: "Brand colors", text: "Green product scenes against a bright pink and white finale." },
    ],
    gallery: [],

    videos: [
      { id: "mg-3", category: "motion", title: "Hire.AI Promo", type: "file", src: video6, poster: video6_cover },
    ],

    timeline: [
      { title: "Script & storyboard", date: "Oct 2026", state: "done", text: "Mapped the problem, the scan and the CTA." },
      { title: "UI & motion design", date: "Oct 2026", state: "done", text: "Built and animated the app screens." },
      { title: "Color & finish", date: "Nov 2026", state: "done", text: "Added transitions, glow and sound." },
      { title: "Export", date: "Nov 2026", state: "done", text: "Delivered in 16:9 HD." },
    ],
  },
];

