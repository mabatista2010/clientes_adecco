import { NextRequest, NextResponse } from 'next/server';
import companiesIndex from '@/data/companies/index.json';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase() || '';
    
    if (!query) {
      return NextResponse.json(companiesIndex);
    }
    
    // Buscar en empresas y sus clientes
    const results = await Promise.all(
      companiesIndex.map(async (company) => {
        let matches = 0;
        let matchedClients: any[] = [];
        
        // Verificar si el nombre de la empresa coincide
        const companyNameMatch = company.name.toLowerCase().includes(query);
        if (companyNameMatch) {
          matches = company.totalClients; // Si la empresa coincide, todos sus clientes son relevantes
        } else {
          // Si no, buscar en los clientes
          try {
            const companyData = await import(`@/data/companies/${company.id}.json`);
            const clients = companyData.default.clients || [];
            
            matchedClients = clients.filter((client: any) => {
              const searchableText = [
                client.nom,
                client.prenom,
                client.fonction,
                client.email,
                client.telephone,
                client.telPortable
              ].filter(Boolean).join(' ').toLowerCase();
              
              return searchableText.includes(query);
            });
            
            matches = matchedClients.length;
          } catch (error) {
            // Si hay error al cargar los datos de la empresa, continuar
            console.error(`Error loading company ${company.id}:`, error);
          }
        }
        
        return {
          ...company,
          matches,
          matchedClients: matchedClients.slice(0, 3), // Mostrar máximo 3 clientes coincidentes
          relevance: companyNameMatch ? 2 : (matches > 0 ? 1 : 0)
        };
      })
    );
    
    // Filtrar empresas sin coincidencias y ordenar por relevancia
    const filteredResults = results
      .filter(company => company.matches > 0)
      .sort((a, b) => {
        // Primero por relevancia (nombre de empresa vs clientes)
        if (b.relevance !== a.relevance) return b.relevance - a.relevance;
        // Luego por número de coincidencias
        return b.matches - a.matches;
      });
    
    return NextResponse.json(filteredResults);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}