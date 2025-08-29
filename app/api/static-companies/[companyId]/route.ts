import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const resolvedParams = await params;
    const companyId = resolvedParams.companyId;
    
    // Dynamically import the company data file
    const companyData = await import(`@/data/companies/${companyId}.json`);
    
    return NextResponse.json(companyData.default);
  } catch (error) {
    console.error('Error loading company data:', error);
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }
}