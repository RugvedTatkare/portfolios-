export const portfolio = {
  name: 'Rugved',
  role: 'Data Science · Design · Product',
  intro: 'I like building things that feel as good as they work.',
  about: 'A data science student with a designer’s eye and a builder’s mindset. I enjoy moving between analytical problems, visual systems and ambitious digital products.',
  location: 'Mumbai, India',
  currently: 'Exploring the space between data, design and business.',
  skills: [
    'Python', 'Data Science', 'SQL', 'Machine Learning',
    'React', 'UI / UX', 'Graphic Design', 'Blender',
  ],
  interests: [
    'Product thinking', 'Visual storytelling', 'Business',
    'Creative technology', 'Tennis', 'Entrepreneurship',
  ],
  projects: [
    {
      number: '01',
      title: 'Legal Aid Platform',
      type: 'Product · Full Stack',
      description: 'A two-sided platform concept connecting people who need legal support with pro-bono lawyers.',
    },
    {
      number: '02',
      title: 'Engrava',
      type: 'E-commerce · Product',
      description: 'A personalized gifting experience focused on customization, a clean storefront and a smooth cart flow.',
    },
    {
      number: '03',
      title: 'CloudRescue',
      type: 'Cloud · Simulation',
      description: 'A disaster-recovery simulator concept designed to make cloud resilience easier to understand and demonstrate.',
    },
  ],
  socials: {
    github: 'https://github.com/RugvedTatkare',
    linkedin: 'https://www.linkedin.com/',
    email: 'mailto:hello@rugved.dev',
  },
} as const;