'use client';

import { useState, useEffect, useCallback } from 'react';
import { Building2, Search, Users, TrendingUp } from 'lucide-react';
import CompanyCard from '@/components/CompanyCard';
import SearchBar from '@/components/SearchBar';
import { CompanySummary } from '@/types';

interface SearchResult extends CompanySummary {
  matches?: number;
  matchedClients?: any[];
  relevance?: number;
}

export default function Home() {
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<SearchResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setFilteredCompanies(companies);
      return;
    }
    
    setSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setFilteredCompanies(data);
    } catch (error) {
      console.error('Search error:', error);
      // Fallback a búsqueda local
      const filtered = companies.filter(company =>
        company.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCompanies(filtered);
    } finally {
      setSearching(false);
    }
  }, [companies]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, performSearch]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/static-companies');
      const data = await response.json();
      setCompanies(data);
      setFilteredCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalClients = companies.reduce((sum, company) => sum + company.totalClients, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Gestión de Clientes
              </h1>
              <p className="text-gray-600">
                Organiza y gestiona los datos de tus clientes por empresa
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Empresas</p>
                  <p className="text-3xl font-bold text-gray-900">{companies.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Clientes</p>
                  <p className="text-3xl font-bold text-gray-900">{totalClients}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Promedio por Empresa</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {companies.length > 0 ? Math.round(totalClients / companies.length) : 0}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar empresa o cliente..."
            />
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : searching ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Buscando en empresas y clientes...</p>
            </div>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              {searchTerm ? 'No se encontraron coincidencias en empresas o clientes' : 'No hay empresas disponibles'}
            </p>
          </div>
        ) : (
          <div>
            {searchTerm && (
              <div className="mb-6 text-sm text-gray-600">
                <p>Mostrando {filteredCompanies.length} empresa{filteredCompanies.length !== 1 ? 's' : ''} con coincidencias</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCompanies.map((company) => (
                <div key={company.id || company.fileName}>
                  <CompanyCard company={company} />
                  {searchTerm && company.matchedClients && company.matchedClients.length > 0 && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs font-medium text-blue-900 mb-1">
                        {company.matches} cliente{company.matches !== 1 ? 's' : ''} coincidente{company.matches !== 1 ? 's' : ''}:
                      </p>
                      <div className="space-y-1">
                        {company.matchedClients.map((client, idx) => (
                          <p key={idx} className="text-xs text-blue-700">
                            • {client.prenom} {client.nom}
                            {client.fonction && ` - ${client.fonction}`}
                          </p>
                        ))}
                        {company.matches > 3 && (
                          <p className="text-xs text-blue-600 italic">
                            y {company.matches - 3} más...
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}