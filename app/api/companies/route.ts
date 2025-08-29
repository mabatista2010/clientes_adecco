import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { parseCSVContent, getCompanyNameFromFileName } from '@/lib/csv-parser';
import { CompanySummary } from '@/types';

const CSV_DIR = '/Users/miguelangelbatistaruiz/Documents/Dossier MABR/Clients';

export async function GET() {
  try {
    const files = await fs.readdir(CSV_DIR);
    const csvFiles = files.filter(file => file.endsWith('.csv'));
    
    const companies: CompanySummary[] = [];
    
    for (const file of csvFiles) {
      const companyName = getCompanyNameFromFileName(file);
      if (!companyName) continue;
      
      const filePath = path.join(CSV_DIR, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const clients = parseCSVContent(content);
      
      companies.push({
        name: companyName,
        fileName: file,
        totalClients: clients.length
      });
    }
    
    companies.sort((a, b) => a.name.localeCompare(b.name));
    
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error reading CSV files:', error);
    return NextResponse.json({ error: 'Failed to load companies' }, { status: 500 });
  }
}