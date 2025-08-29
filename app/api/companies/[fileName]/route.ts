import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { parseCSVContent, getCompanyNameFromFileName } from '@/lib/csv-parser';
import { Company } from '@/types';

const CSV_DIR = '/Users/miguelangelbatistaruiz/Documents/Dossier MABR/Clients';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ fileName: string }> }
) {
  try {
    const { fileName } = await params;
    const decodedFileName = decodeURIComponent(fileName);
    const filePath = path.join(CSV_DIR, decodedFileName);
    
    const content = await fs.readFile(filePath, 'utf-8');
    const clients = parseCSVContent(content);
    const companyName = getCompanyNameFromFileName(decodedFileName);
    
    const company: Company = {
      name: companyName,
      fileName: decodedFileName,
      clients: clients,
      totalClients: clients.length
    };
    
    return NextResponse.json(company);
  } catch (error) {
    console.error('Error reading CSV file:', error);
    return NextResponse.json({ error: 'Failed to load company data' }, { status: 500 });
  }
}