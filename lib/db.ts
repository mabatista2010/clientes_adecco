import Database from 'better-sqlite3';
import path from 'path';

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

export default db;