import { NextResponse } from 'next/server';
import { getAllCompanies } from '@/data/companies/index';

export async function GET() {
  try {
    const companies = getAllCompanies();
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error loading companies:', error);
    return NextResponse.json({ error: 'Failed to load companies' }, { status: 500 });
  }
}