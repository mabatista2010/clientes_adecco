'use client';

import { useState, useEffect } from 'react';
import { Building2, Search, Users, TrendingUp } from 'lucide-react';
import CompanyCard from '@/components/CompanyCard';
import SearchBar from '@/components/SearchBar';
import { CompanySummary } from '@/types';

export default function Home() {
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanySummary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    const filtered = companies.filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [searchTerm, companies]);

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
              placeholder="Buscar empresa..."
            />
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              {searchTerm ? 'No se encontraron empresas con ese término de búsqueda' : 'No hay empresas disponibles'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.fileName} company={company} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}