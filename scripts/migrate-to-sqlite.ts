import Database from 'better-sqlite3';
import fs from 'fs/promises';
import path from 'path';
import { parseCSVContent, getCompanyNameFromFileName } from '../lib/csv-parser';

const CSV_DIR = '/Users/miguelangelbatistaruiz/Documents/Dossier MABR/Clients';

async function migrate() {
  console.log('Starting migration to SQLite...');
  
  const db = new Database(path.join(process.cwd(), 'clients.db'));
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      taxId TEXT,
      address TEXT,
      notes TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      clientId TEXT NOT NULL,
      invoiceNumber TEXT NOT NULL,
      date TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      items TEXT NOT NULL,
      subtotal REAL NOT NULL,
      tax REAL NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      paidAt TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE
    )
  `);

  try {
    const files = await fs.readdir(CSV_DIR);
    const csvFiles = files.filter(file => file.endsWith('.csv'));
    
    const insertClient = db.prepare(`
      INSERT OR REPLACE INTO clients (id, name, email, phone, taxId, address, notes, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    let totalClients = 0;
    
    for (const file of csvFiles) {
      const companyName = getCompanyNameFromFileName(file);
      if (!companyName) continue;
      
      console.log(`Processing ${companyName}...`);
      
      const filePath = path.join(CSV_DIR, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const clients = parseCSVContent(content);
      
      for (const client of clients) {
        const now = new Date().toISOString();
        const clientId = `${companyName.toLowerCase().replace(/\s+/g, '_')}_${client.no || totalClients}`;
        
        const fullName = `${companyName} - ${client.prenom} ${client.nom}`.trim();
        const email = client.mail || `client${totalClients}@example.com`;
        const phone = [client.telFix, client.telMobile].filter(Boolean).join(' / ') || null;
        const address = [client.adresse, client.codePostal, client.localite].filter(Boolean).join(', ') || null;
        const notes = client.actif === '1 - Oui' ? 'Active' : 'Inactive';
        
        insertClient.run(
          clientId,
          fullName,
          email,
          phone,
          null,
          address,
          notes,
          now,
          now
        );
        
        totalClients++;
      }
    }
    
    console.log(`Migration complete! Imported ${totalClients} clients.`);
    
    const count = db.prepare('SELECT COUNT(*) as count FROM clients').get() as { count: number };
    console.log(`Database now contains ${count.count} clients.`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

migrate();