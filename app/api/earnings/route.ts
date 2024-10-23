// import { NextResponse } from "next/server";
// import { EarningsScraper } from "@/lib/scraper";

// export async function POST(req: Request) {
//   try {
//     const { startDate, endDate } = await req.json();
//     const scraper = new EarningsScraper();

//     await scraper.initialize();
//     const earnings = await scraper.scrapeEarningsCalendar(
//       new Date(startDate),
//       new Date(endDate)
//     );
//     await scraper.cleanup();

//     // Store in database
//     for (const earning of earnings) {
//       const company = await prisma.company.upsert({
//         where: { ticker: earning.ticker },
//         create: {
//           ticker: earning.ticker,
//           name: earning.companyName,
//         },
//         update: {
//           name: earning.companyName,
//         },
//       });

//       await prisma.earnings.create({
//         data: {
//           companyId: company.id,
//           date: earning.date,
//           callTime: earning.callTime,
//           epsEstimate: earning.epsEstimate,
//           quarter: Math.floor(earning.date.getMonth() / 3) + 1,
//           year: earning.date.getFullYear(),
//         },
//       });
//     }

//     return NextResponse.json({ success: true, count: earnings.length });

//   } catch (error) {
//     console.error('[SCRAPE_ERROR]', error);
//     return new NextResponse("Scraping failed", { status: 500 });
//   }
// }
