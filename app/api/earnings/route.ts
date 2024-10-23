// // app/api/earnings/route.ts
// import { NextResponse } from "next/server";
// import prisma from "@/lib/prismadb";

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const startDate = searchParams.get('startDate');
//     const endDate = searchParams.get('endDate');
//     const ticker = searchParams.get('ticker');
//     const view = searchParams.get('view') || 'month';

//     if (!startDate || !endDate) {
//       return new NextResponse("Start and end dates are required", { status: 400 });
//     }

//     const whereClause = {
//       date: {
//         gte: new Date(startDate),
//         lte: new Date(endDate),
//       },
//       ...(ticker && { company: { ticker: ticker } }),
//     };

//     const earnings = await prisma.earnings.findMany({
//       where: whereClause,
//       include: {
//         company: true,
//         transcript: {
//           select: {
//             href: true,
//           },
//         },
//       },
//       orderBy: {
//         date: 'asc',
//       },
//     });

//     // Group earnings by date for calendar view
//     const groupedEarnings = earnings.reduce((acc, earning) => {
//       const dateKey = earning.date.toISOString().split('T')[0];
//       if (!acc[dateKey]) {
//         acc[dateKey] = [];
//       }
//       acc[dateKey].push({
//         id: earning.id,
//         companyId: earning.companyId,
//         companyName: earning.company.name,
//         ticker: earning.company.ticker,
//         logoUrl: earning.company.logoUrl ||
//           `https://logo.clearbit.com/${earning.company.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}.com`,
//         callTime: earning.callTime,
//         epsEstimate: earning.epsEstimate,
//         epsActual: earning.epsActual,
//         transcriptUrl: earning.transcript?.href,
//       });
//       return acc;
//     }, {} as Record<string, any[]>);

//     return NextResponse.json(groupedEarnings);

//   } catch (error) {
//     console.error("[EARNINGS_GET_ERROR]", error);

//     if (error instanceof Error) {
//       return new NextResponse(error.message, { status: 400 });
//     }

//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }

// // Error handling types
// interface ApiError {
//   message: string;
//   status: number;
//   code?: string;
// }

// class EarningsApiError extends Error implements ApiError {
//   status: number;
//   code?: string;

//   constructor(message: string, status: number = 500, code?: string) {
//     super(message);
//     this.name = 'EarningsApiError';
//     this.status = status;
//     this.code = code;
//   }
// }

// // Utility function for error responses
// function handleApiError(error: unknown): NextResponse {
//   console.error('[API_ERROR]', error);

//   if (error instanceof EarningsApiError) {
//     return new NextResponse(error.message, {
//       status: error.status,
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
//   }

//   if (error instanceof Error) {
//     return new NextResponse(error.message, {
//       status: 400,
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
//   }

//   return new NextResponse('Internal Server Error', {
//     status: 500,
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   });
// }

//TODO: //prigma migration for earnings
