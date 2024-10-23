// import puppeteer from 'puppeteer';
// import { EarningsData } from './types';
// import prisma from '@/lib/prismadb';

// export class EarningsScraper {
//   private browser: puppeteer.Browser | null = null;

//   async initialize() {
//     this.browser = await puppeteer.launch({
//       headless: "new",
//       args: ['--no-sandbox', '--disable-setuid-sandbox']
//     });
//   }

//   async cleanup() {
//     if (this.browser) {
//       await this.browser!.close();
//       this.browser = null;
//     }
//   }

//   private async getPage() {
//     if (!this.browser) await this.initialize();
//     const page = await this.browser!.newPage();

//     // Set a realistic user agent
//     await page.setUserAgent(
//       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
//     );

//     // Basic anti-bot detection evasion
//     await page.setExtraHTTPHeaders({
//       'Accept-Language': 'en-US,en;q=0.9',
//       'Accept-Encoding': 'gzip, deflate, br',
//       'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
//     });

//     return page;
//   }

//   async scrapeEarningsCalendar(startDate: Date, endDate: Date) {
//     const results: EarningsData[] = [];
//     const page = await this.getPage();

//     try {
//       // Example using Yahoo Finance earnings calendar
//       const formattedDate = startDate.toISOString().split('T')[0];
//       const url = `https://finance.yahoo.com/calendar/earnings?day=${formattedDate}`;

//       await page.goto(url, { waitUntil: 'networkidle0' });

//       // Handle cookie consent if present
//       const cookieButton = await page.$('[data-cookiebanner="accept_button"]');
//       if (cookieButton) await cookieButton.click();

//       // Wait for the earnings table to load
//       await page.waitForSelector('table[data-test="earn-cal-table"]');

//       // Extract earnings data
//       const dayResults = await page.evaluate(() => {
//         const rows = Array.from(document.querySelectorAll('table[data-test="earn-cal-table"] tbody tr'));
//         return rows.map(row => {
//           const cells = Array.from(row.querySelectorAll('td'));
//           return {
//             ticker: cells[0]?.textContent?.trim() || '',
//             companyName: cells[1]?.textContent?.trim() || '',
//             callTime: cells[2]?.textContent?.trim() || '',
//             epsEstimate: parseFloat(cells[3]?.textContent?.replace(/[^0-9.-]/g, '') || 'NaN'),
//             date: document.querySelector('[data-test="earn-cal-date"]')?.textContent || '',
//           };
//         });
//       });

//       results.push(...dayResults.map(r => ({
//         ...r,
//         date: new Date(r.date),
//         epsEstimate: isNaN(r.epsEstimate) ? undefined : r.epsEstimate
//       })));

//       // Respectful delay between requests
//       await new Promise(r => setTimeout(r, 2000));

//     } catch (error) {
//       console.error('Scraping error:', error);
//       throw error;
//     } finally {
//       await page.close();
//     }

//     return results;
//   }

//   async scrapeTranscript(url: string): Promise<{
//     fullText: string;
//     sections: any;
//     participants: string[];
//   }> {
//     const page = await this.getPage();

//     try {
//       await page.goto(url, { waitUntil: 'networkidle0' });

//       // Extract transcript data (customize selectors based on the source)
//       const transcriptData = await page.evaluate(() => {
//         const fullText = document.querySelector('.transcript-body')?.textContent || '';
//         const sections = Array.from(document.querySelectorAll('.transcript-section')).map(section => ({
//           title: section.querySelector('.section-title')?.textContent || '',
//           content: section.querySelector('.section-content')?.textContent || ''
//         }));
//         const participants = Array.from(document.querySelectorAll('.participant')).map(p =>
//           p.textContent?.trim() || ''
//         );

//         return { fullText, sections, participants };
//       });

//       return transcriptData;

//     } catch (error) {
//       console.error('Transcript scraping error:', error);
//       throw error;
//     } finally {
//       await page.close();
//     }
//   }
// }
