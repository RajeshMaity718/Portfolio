/**
 * Sample Portfolios and Default State Presets
 */

const SAMPLE_PORTFOLIOS = {
  // Preset 1: Full-Stack Developer
  fullstack: {
    personal: {
      name: "Alex Morgan",
      title: "Senior Full-Stack Engineer & Cloud Architect",
      bio: "Crafting scalable web systems, intuitive developer tools, and high-performance cloud architectures. Obsessed with clean code, sub-millisecond latency, and delighting users.",
      email: "alex.morgan@example.com",
      phone: "+1 (555) 234-5678",
      location: "San Francisco, CA (Remote)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      availableForHire: true,
      statusText: "Available for new projects & full-time roles",
      ctaText: "Let's Build Something Great",
      social: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        website: "https://example.com",
        dribbble: "",
        youtube: ""
      }
    },
    about: {
      heading: "About Me",
      summary: "With over 7 years of experience building modern full-stack web applications, I specialize in architecting distributed systems with TypeScript, Next.js, Node.js, and Kubernetes. I've scaled platforms from 0 to 2M+ active users, led high-velocity engineering teams, and contributed to key open-source developer tooling.",
      highlights: [
        "Architected enterprise microservices handling 50k+ req/sec with 99.99% uptime",
        "Open-source maintainer with over 4,000+ GitHub stars across devtool packages",
        "Passionate mentor who has trained 15+ junior engineers into mid-level positions",
        "Speaker at TechConf 2024 on Serverless Next.js and Edge Computing"
      ]
    },
    skills: [
      { name: "TypeScript", category: "Languages", level: "Expert" },
      { name: "JavaScript / ESNext", category: "Languages", level: "Expert" },
      { name: "Go", category: "Languages", level: "Intermediate" },
      { name: "Python", category: "Languages", level: "Proficient" },
      { name: "React / Next.js", category: "Frameworks", level: "Expert" },
      { name: "Node.js / Express", category: "Frameworks", level: "Expert" },
      { name: "GraphQL & REST", category: "Frameworks", level: "Expert" },
      { name: "Tailwind CSS", category: "Frameworks", level: "Expert" },
      { name: "PostgreSQL & Redis", category: "Databases", level: "Expert" },
      { name: "Prisma / Drizzle ORM", category: "Databases", level: "Proficient" },
      { name: "Docker & Kubernetes", category: "Cloud & DevOps", level: "Proficient" },
      { name: "AWS (ECS, Lambda, S3)", category: "Cloud & DevOps", level: "Proficient" },
      { name: "CI/CD (GitHub Actions)", category: "Cloud & DevOps", level: "Expert" }
    ],
    projects: [
      {
        id: "p1",
        title: "CloudScale AI Platform",
        subtitle: "Autonomous Cloud Resource Optimization",
        description: "An intelligent cloud infrastructure optimizer that automatically scales compute clusters and cuts cloud spend by up to 42% using predictive ML telemetry.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
        tags: ["Next.js", "TypeScript", "Python", "FastAPI", "Tailwind CSS", "AWS ECS"],
        demoUrl: "https://example.com/demo",
        githubUrl: "https://github.com/example/cloudscale",
        featured: true
      },
      {
        id: "p2",
        title: "DevFlow Kanban Studio",
        subtitle: "Real-time Collaborative Engineering Workspace",
        description: "Real-time agile workflow management tool with sub-10ms synchronization, integrated Git pull-request tracking, and automated sprint analytics.",
        image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80",
        tags: ["React", "Node.js", "WebSockets", "Redis", "PostgreSQL", "Docker"],
        demoUrl: "https://example.com/devflow",
        githubUrl: "https://github.com/example/devflow",
        featured: true
      },
      {
        id: "p3",
        title: "Pulse Metrics APM",
        subtitle: "Lightweight Edge Monitoring & Logging",
        description: "Distributed telemetry agent collecting distributed traces and uptime metrics with zero runtime overhead on edge serverless functions.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
        tags: ["Go", "ClickHouse", "React", "Grafana API", "OpenTelemetry"],
        demoUrl: "https://example.com/pulse",
        githubUrl: "https://github.com/example/pulse-metrics",
        featured: false
      }
    ],
    experience: [
      {
        id: "e1",
        role: "Staff Full-Stack Engineer",
        company: "Vortex Labs",
        location: "San Francisco, CA",
        period: "2022 - Present",
        description: "Leading the core platform team building developer observability and edge computing infrastructure.",
        bullets: [
          "Redesigned the real-time pipeline processing 100M+ events/day, reducing server costs by 35%.",
          "Mentored 6 engineers and drove adoption of TypeScript and RFC design doc culture.",
          "Spearheaded Next.js SSR migration improving Core Web Vitals to 98+ score."
        ]
      },
      {
        id: "e2",
        role: "Senior Software Engineer",
        company: "Hyperion Systems",
        location: "Seattle, WA",
        period: "2019 - 2022",
        description: "Engineered scalable customer-facing SaaS dashboards and API microservices.",
        bullets: [
          "Built high-throughput payment and checkout engine integrating Stripe and PayPal.",
          "Implemented comprehensive end-to-end testing suite achieving 92% code coverage."
        ]
      },
      {
        id: "e3",
        role: "Full-Stack Developer",
        company: "Apex Digital Media",
        location: "Austin, TX",
        period: "2017 - 2019",
        description: "Developed custom interactive web portals and e-commerce web applications for global brands.",
        bullets: [
          "Delivered 14 client web applications on-time and within budget.",
          "Introduced React and modern CI/CD automation to the agency workflow."
        ]
      }
    ],
    education: [
      {
        id: "ed1",
        degree: "B.S. in Computer Science",
        institution: "University of California, Berkeley",
        period: "2013 - 2017",
        details: "Graduated with Honors. Focused on Distributed Systems, Algorithms, and Human-Computer Interaction."
      }
    ],
    customSections: [
      {
        id: "cs1",
        title: "Awards & Honors",
        items: [
          { title: "HackTech Global Winner", subtitle: "1st Place among 400+ teams (2023)" },
          { title: "AWS Certified Solutions Architect", subtitle: "Professional Level (2024)" }
        ]
      }
    ],
    theme: {
      template: "modern-tech",
      primaryColor: "#6366f1",
      mode: "dark",
      fontFamily: "Plus Jakarta Sans",
      borderRadius: "rounded-xl"
    }
  },

  // Preset 2: UI/UX & Product Designer
  designer: {
    personal: {
      name: "Elena Rostova",
      title: "Staff Product Designer & Design Systems Lead",
      bio: "Crafting delightful, human-centered digital experiences and scalable design systems that bridge the gap between creative vision and engineering execution.",
      email: "elena.design@example.com",
      phone: "+1 (555) 789-0123",
      location: "New York, NY",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      availableForHire: true,
      statusText: "Open to select freelance design consulting & design advisory",
      ctaText: "Explore Design Collaborations",
      social: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        website: "https://example.com",
        dribbble: "https://dribbble.com",
        youtube: ""
      }
    },
    about: {
      heading: "Design Philosophy",
      summary: "I believe great design is invisible—it removes friction, empowers the user, and evokes emotional resonance. With 8+ years of product design leadership across FinTech, HealthTech, and AI startups, I design experiences that convert, retain, and inspire.",
      highlights: [
        "Led product redesign resulting in a +64% lift in user onboarding conversion",
        "Built enterprise Design System adopted by 120+ engineers and designers",
        "Awwwards Site of the Day Winner & CSS Design Awards Judge (2023)",
        "Passionate advocate for accessible WCAG AAA inclusive digital interfaces"
      ]
    },
    skills: [
      { name: "Product Design", category: "Disciplines", level: "Expert" },
      { name: "Design Systems", category: "Disciplines", level: "Expert" },
      { name: "User Research & Usability Testing", category: "Disciplines", level: "Expert" },
      { name: "Interaction & Motion Design", category: "Disciplines", level: "Proficient" },
      { name: "Figma & FigJam", category: "Tools", level: "Expert" },
      { name: "Framer & Webflow", category: "Tools", level: "Expert" },
      { name: "Protopie & After Effects", category: "Tools", level: "Proficient" },
      { name: "HTML5 / CSS3 / Tailwind", category: "Code", level: "Proficient" },
      { name: "React Basics", category: "Code", level: "Intermediate" }
    ],
    projects: [
      {
        id: "pd1",
        title: "Aura FinTech Banking App",
        subtitle: "Next-Generation Wealth & Crypto Management",
        description: "End-to-end UX research and interface design for a mobile banking application serving 500,000+ high-net-worth investors.",
        image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
        tags: ["Figma", "Design System", "Mobile UX", "Prototyping", "FinTech"],
        demoUrl: "https://example.com/aura-case-study",
        githubUrl: "",
        featured: true
      },
      {
        id: "pd2",
        title: "Nova AI Design System",
        subtitle: "Comprehensive Design Tokens & Component Library",
        description: "Multi-brand design system with 200+ accessible Figma components, dark/light token architecture, and automated Storybook sync.",
        image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&auto=format&fit=crop&q=80",
        tags: ["Design Tokens", "Figma Auto-Layout", "Design Ops", "WCAG 2.1"],
        demoUrl: "https://example.com/nova-ds",
        githubUrl: "",
        featured: true
      },
      {
        id: "pd3",
        title: "HealthTrack Patient Portal",
        subtitle: "Accessible Telehealth & Care Coordination",
        description: "Empathetic patient dashboard reducing appointment scheduling friction by 45% for elder healthcare patients.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
        tags: ["User Research", "Wireframing", "Usability Testing", "Healthcare"],
        demoUrl: "https://example.com/healthtrack",
        githubUrl: "",
        featured: false
      }
    ],
    experience: [
      {
        id: "de1",
        role: "Lead Product Designer",
        company: "Starlight Digital",
        location: "New York, NY",
        period: "2021 - Present",
        description: "Leading end-to-end design for core web and mobile apps, overseeing design strategy and team of 5 UX designers.",
        bullets: [
          "Redesigned checkout funnel increasing quarterly ARR by $3.2M.",
          "Established weekly user testing cadences with 40+ user interviews conducted annually."
        ]
      },
      {
        id: "de2",
        role: "Senior UI/UX Designer",
        company: "Craft & Pixel Agency",
        location: "Brooklyn, NY",
        period: "2018 - 2021",
        description: "Designed bespoke digital products and brand identities for tech scale-ups.",
        bullets: [
          "Delivered 18 mobile and web design systems with 100% client satisfaction ratings.",
          "Co-authored agency design token framework for Figma to React handoff."
        ]
      }
    ],
    education: [
      {
        id: "ded1",
        degree: "B.F.A. in Interaction Design",
        institution: "Rhode Island School of Design (RISD)",
        period: "2014 - 2018",
        details: "Focus on Graphic Design, Human Factors, and Creative Coding."
      }
    ],
    customSections: [
      {
        id: "dcs1",
        title: "Industry Recognition",
        items: [
          { title: "Red Dot Best of the Best Design Award", subtitle: "Mobile UI Category (2023)" },
          { title: "Figma Community Creator Spotlight", subtitle: "15,000+ File Duplicates (2024)" }
        ]
      }
    ],
    theme: {
      template: "bento-grid",
      primaryColor: "#ec4899",
      mode: "dark",
      fontFamily: "Outfit",
      borderRadius: "rounded-2xl"
    }
  },

  // Preset 3: Data Scientist & ML Researcher
  datascientist: {
    personal: {
      name: "Dr. Marcus Chen",
      title: "Lead AI Researcher & Machine Learning Engineer",
      bio: "Pushing the boundaries of Large Language Models, Multi-Modal Transformers, and Scalable Neural Systems. Turning cutting-edge ML research into production-grade AI applications.",
      email: "marcus.chen@example.com",
      phone: "+1 (555) 345-6789",
      location: "Boston, MA",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      availableForHire: true,
      statusText: "Consulting on Enterprise LLM Fine-Tuning & AI Strategy",
      ctaText: "Discuss AI Collaboration",
      social: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        website: "https://example.com",
        dribbble: "",
        youtube: ""
      }
    },
    about: {
      heading: "Research & Engineering Background",
      summary: "I bridge the gap between academic machine learning breakthroughs and production enterprise AI. With a PhD from MIT and 6+ years in applied AI research, I specialize in fine-tuning foundation models, retrieval-augmented generation (RAG) pipelines, and low-latency inference on distributed GPU clusters.",
      highlights: [
        "Published 8 peer-reviewed papers at NeurIPS, ICML, and CVPR with 1,200+ citations",
        "Kaggle Grandmaster ranked in the top 0.05% worldwide across NLP & Tabular competitions",
        "Designed RAG engine handling 20M+ enterprise search queries daily",
        "Engineered custom quantized LLM inference reducing latency by 4.2x on Nvidia A100s"
      ]
    },
    skills: [
      { name: "Python", category: "Languages", level: "Expert" },
      { name: "C++", category: "Languages", level: "Proficient" },
      { name: "SQL & DuckDB", category: "Languages", level: "Expert" },
      { name: "PyTorch & JAX", category: "ML Frameworks", level: "Expert" },
      { name: "Transformers / Hugging Face", category: "ML Frameworks", level: "Expert" },
      { name: "LangChain & LlamaIndex", category: "ML Frameworks", level: "Expert" },
      { name: "vLLM & TensorRT-LLM", category: "ML Frameworks", level: "Proficient" },
      { name: "Milvus & Pinecone", category: "Vector DBs", level: "Expert" },
      { name: "Kubeflow & MLflow", category: "MLOps", level: "Proficient" },
      { name: "Nvidia Triton / CUDA", category: "MLOps", level: "Proficient" }
    ],
    projects: [
      {
        id: "ds1",
        title: "BioMed RAG Intelligence",
        subtitle: "Clinical Knowledge Synthesis over 30M+ Medical Papers",
        description: "A specialized retrieval-augmented generation system with biomedical entity linking, providing verified clinical citations with 99.2% factual precision.",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80",
        tags: ["PyTorch", "Hugging Face", "Vector Search", "FastAPI", "Docker"],
        demoUrl: "https://example.com/biomed-demo",
        githubUrl: "https://github.com/example/biomed-rag",
        featured: true
      },
      {
        id: "ds2",
        title: "VisionSense Real-time Detection",
        subtitle: "Sub-5ms Edge Vision Object Segmentation",
        description: "Custom lightweight vision transformer model trained for high-speed industrial defect detection operating on embedded Jetson devices.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
        tags: ["PyTorch", "ONNX Runtime", "CUDA", "TensorRT", "OpenCV"],
        demoUrl: "https://example.com/visionsense",
        githubUrl: "https://github.com/example/visionsense",
        featured: true
      }
    ],
    experience: [
      {
        id: "dse1",
        role: "Principal AI Scientist",
        company: "NeuralDynamics",
        location: "Cambridge, MA",
        period: "2021 - Present",
        description: "Directing the Foundation Model fine-tuning and retrieval algorithms for enterprise intelligence systems.",
        bullets: [
          "Built multi-modal embedding pipeline processing 500GB of scientific datasets daily.",
          "Managed GPU cluster scheduling (64x H100s) saving $180k monthly in spot instances."
        ]
      },
      {
        id: "dse2",
        role: "Senior Machine Learning Engineer",
        company: "Boston AI Labs",
        location: "Boston, MA",
        period: "2018 - 2021",
        description: "Developed deep learning models for NLP classification and automated document parsing.",
        bullets: [
          "Deployed 12 production ML models serving over 50M monthly API calls.",
          "Received company Innovation Award for patented Transformer quantization method."
        ]
      }
    ],
    education: [
      {
        id: "dsed1",
        degree: "Ph.D. in Computer Science (Artificial Intelligence)",
        institution: "Massachusetts Institute of Technology (MIT)",
        period: "2014 - 2018",
        details: "Dissertation on Multi-Task Representation Learning in Deep Neural Networks."
      }
    ],
    customSections: [
      {
        id: "dsec1",
        title: "Selected Publications",
        items: [
          { title: "Efficient Low-Rank Adaptation for Multi-Modal LLMs", subtitle: "NeurIPS 2023 (Oral Presentation)" },
          { title: "Hierarchical Graph Attention for Clinical NLP", subtitle: "ICML 2022" }
        ]
      }
    ],
    theme: {
      template: "developer-terminal",
      primaryColor: "#10b981",
      mode: "dark",
      fontFamily: "JetBrains Mono",
      borderRadius: "rounded-lg"
    }
  },

  // Blank Slate
  blank: {
    personal: {
      name: "Your Name",
      title: "Your Professional Title",
      bio: "A concise, impactful summary about yourself, what you love building, and what makes your work unique.",
      email: "your.email@example.com",
      phone: "+1 (555) 000-0000",
      location: "City, Country",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80",
      availableForHire: true,
      statusText: "Open to new opportunities",
      ctaText: "Get in Touch",
      social: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        website: "",
        dribbble: "",
        youtube: ""
      }
    },
    about: {
      heading: "About Me",
      summary: "Write a detailed narrative about your journey, passion, key achievements, and the problems you solve.",
      highlights: [
        "Key achievement or highlight number 1",
        "Key achievement or highlight number 2",
        "Key achievement or highlight number 3"
      ]
    },
    skills: [
      { name: "JavaScript", category: "Core", level: "Expert" },
      { name: "React", category: "Frontend", level: "Expert" },
      { name: "Node.js", category: "Backend", level: "Proficient" }
    ],
    projects: [
      {
        id: "bp1",
        title: "My Flagship Project",
        subtitle: "Project Subtitle / One-Liner",
        description: "Describe what problem this project solves, your architecture decisions, and the measurable impact.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
        tags: ["React", "Tailwind CSS", "Node.js"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: true
      }
    ],
    experience: [
      {
        id: "be1",
        role: "Software Developer",
        company: "Awesome Tech Inc.",
        location: "San Francisco, CA",
        period: "2022 - Present",
        description: "Summary of your primary responsibilities and the team you work with.",
        bullets: [
          "Developed and launched new customer-facing feature driving 25% user growth.",
          "Collaborated cross-functionally with design and product teams."
        ]
      }
    ],
    education: [
      {
        id: "bed1",
        degree: "B.S. in Computer Science or Related Field",
        institution: "Your University",
        period: "2018 - 2022",
        details: "Graduated with honors, relevant coursework, or leadership roles."
      }
    ],
    customSections: [],
    theme: {
      template: "modern-tech",
      primaryColor: "#6366f1",
      mode: "dark",
      fontFamily: "Plus Jakarta Sans",
      borderRadius: "rounded-xl"
    }
  }
};