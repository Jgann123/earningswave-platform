interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  url: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Earnings Calendar API: Your Gateway to Critical Financial Data",
    excerpt:
      "Explore the power of earnings calendar APIs in financial analysis and decision-making processes.",
    date: "October 7, 2024",
    category: "Finance",
    url: "earnings-calendar-api-your-gateway-to-critical-financial-data",
  },
  {
    id: 2,
    title:
      "Public Company Financial Data API: Empowering Financial Analysis and Decision Making",
    excerpt:
      "Discover how public company financial data APIs are revolutionizing access to crucial financial information.",
    date: "October 8, 2024",
    category: "Finance",
    url: "public-company-financial-data-api-empowering-financial-analysis-and-decision-making",
  },
];