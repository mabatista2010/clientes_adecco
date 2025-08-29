import { NextResponse } from 'next/server';
import db from '@/lib/db';

interface CompanySummary {
  name: string;
  totalClients: number;
}

export async function GET() {
  try {
    const companies = db.prepare(`
      SELECT 
        SUBSTR(name, 1, INSTR(name, ' - ') - 1) as companyName,
        COUNT(*) as totalClients
      FROM clients
      WHERE name LIKE '% - %'
      GROUP BY companyName
      ORDER BY companyName
    `).all() as { companyName: string; totalClients: number }[];

    const companySummaries: CompanySummary[] = companies.map(c => ({
      name: c.companyName,
      totalClients: c.totalClients
    }));

    return NextResponse.json(companySummaries);
  } catch (error) {
    console.error('Error reading from database:', error);
    return NextResponse.json({ error: 'Failed to load companies' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const client = await request.json();
    
    const stmt = db.prepare(`
      INSERT INTO clients (id, name, email, phone, taxId, address, notes, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const now = new Date().toISOString();
    const id = `client_${Date.now()}`;
    
    stmt.run(
      id,
      client.name,
      client.email,
      client.phone || null,
      client.taxId || null,
      client.address || null,
      client.notes || null,
      now,
      now
    );
    
    return NextResponse.json({ id, ...client, createdAt: now, updatedAt: now });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}