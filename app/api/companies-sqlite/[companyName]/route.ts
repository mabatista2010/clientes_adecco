import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ companyName: string }> }
) {
  try {
    const resolvedParams = await params;
    const companyName = decodeURIComponent(resolvedParams.companyName);
    
    const clients = db.prepare(`
      SELECT * FROM clients
      WHERE name LIKE ? || ' - %'
      ORDER BY name
    `).all(companyName);
    
    return NextResponse.json({
      name: companyName,
      clients
    });
  } catch (error) {
    console.error('Error reading company data:', error);
    return NextResponse.json({ error: 'Failed to load company data' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  _context: { params: Promise<{ companyName: string }> }
) {
  try {
    const { clientId, ...updates } = await request.json();
    
    const setClause = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const stmt = db.prepare(`
      UPDATE clients
      SET ${setClause}, updatedAt = ?
      WHERE id = ?
    `);
    
    const values = [...Object.values(updates), new Date().toISOString(), clientId];
    stmt.run(...values);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  _context: { params: Promise<{ companyName: string }> }
) {
  try {
    const { clientId } = await request.json();
    
    const stmt = db.prepare('DELETE FROM clients WHERE id = ?');
    stmt.run(clientId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
  }
}