import fs from 'fs/promises';
import path from 'path';
import { parseCSVContent, getCompanyNameFromFileName } from '../lib/csv-parser';

const CSV_DIR = '/Users/miguelangelbatistaruiz/Documents/Dossier MABR/Clients';
const OUTPUT_DIR = path.join(process.cwd(), 'data', 'companies');

async function generateStaticData() {
  console.log('Generating static data files...');
  
  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  
  try {
    const files = await fs.readdir(CSV_DIR);
    const csvFiles = files.filter(file => file.endsWith('.csv'));
    
    const companiesIndex: Array<{
      id: string;
      name: string;
      totalClients: number;
    }> = [];
    
    for (const file of csvFiles) {
      const companyName = getCompanyNameFromFileName(file);
      if (!companyName) continue;
      
      console.log(`Processing ${companyName}...`);
      
      const filePath = path.join(CSV_DIR, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const clients = parseCSVContent(content);
      
      // Create safe filename
      const companyId = companyName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Add to index
      companiesIndex.push({
        id: companyId,
        name: companyName,
        totalClients: clients.length
      });
      
      // Write individual company data file
      const companyData = {
        id: companyId,
        name: companyName,
        clients: clients.map((client, index) => ({
          id: `${companyId}_${index}`,
          no: client.no,
          nom: client.nom,
          prenom: client.prenom,
          actif: client.actif,
          mail: client.email,
          telFix: client.telephone,
          telMobile: client.telPortable,
          adresse: (client as any).adresse || '',
          codePostal: (client as any).codePostal || '',
          localite: (client as any).localite || ''
        }))
      };
      
      await fs.writeFile(
        path.join(OUTPUT_DIR, `${companyId}.json`),
        JSON.stringify(companyData, null, 2)
      );
    }
    
    // Write companies index
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'index.json'),
      JSON.stringify(companiesIndex, null, 2)
    );
    
    // Generate TypeScript index file for easy imports
    const tsIndex = `// Auto-generated file - DO NOT EDIT
// Generated on ${new Date().toISOString()}

export interface Client {
  id: string;
  no: string;
  nom: string;
  prenom: string;
  actif: string;
  mail: string;
  telFix: string;
  telMobile: string;
  adresse: string;
  codePostal: string;
  localite: string;
}

export interface Company {
  id: string;
  name: string;
  clients: Client[];
}

export interface CompanySummary {
  id: string;
  name: string;
  totalClients: number;
}

// Companies index
export const companiesIndex: CompanySummary[] = ${JSON.stringify(companiesIndex, null, 2)};

// Lazy load company data
export async function getCompanyData(companyId: string): Promise<Company | null> {
  try {
    const data = await import(\`./\${companyId}.json\`);
    return data.default as Company;
  } catch {
    return null;
  }
}

// Get all companies
export function getAllCompanies(): CompanySummary[] {
  return companiesIndex;
}
`;
    
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'index.ts'),
      tsIndex
    );
    
    console.log(`✅ Generated ${companiesIndex.length} company data files`);
    console.log(`📁 Output directory: ${OUTPUT_DIR}`);
    
  } catch (error) {
    console.error('Failed to generate static data:', error);
    process.exit(1);
  }
}

generateStaticData();