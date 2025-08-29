'use client';

import { useState, useEffect, use } from 'react';
import { ArrowLeft, Building2, Users, Search, Filter, Download, Grid3x3, List } from 'lucide-react';
import Link from 'next/link';
import ClientCard from '@/components/ClientCard';
import SearchBar from '@/components/SearchBar';
import { Company, Client } from '@/types';

export default function CompanyPage({ params }: { params: Promise<{ fileName: string }> }) {
  const resolvedParams = use(params);
  const [company, setCompany] = useState<Company | null>(null);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedParams.fileName]);

  useEffect(() => {
    if (!company) return;
    
    let filtered = company.clients;
    
    if (searchTerm) {
      filtered = filtered.filter(client => 
        client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.fonction?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterActive !== 'all') {
      filtered = filtered.filter(client => {
        const isActive = client.actif === '1 - Oui';
        return filterActive === 'active' ? isActive : !isActive;
      });
    }
    
    setFilteredClients(filtered);
  }, [searchTerm, company, filterActive]);

  const fetchCompany = async () => {
    try {
      const response = await fetch(`/api/static-companies/${resolvedParams.fileName}`);
      const data = await response.json();
      setCompany(data);
      setFilteredClients(data.clients);
    } catch (error) {
      console.error('Error fetching company:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!company) return;
    
    const headers = ['No', 'Nombre', 'Apellido', 'Activo', 'Función', 'Teléfono', 'Móvil', 'Email'];
    const rows = filteredClients.map(client => [
      client.no,
      client.nom,
      client.prenom,
      client.actif,
      client.fonction,
      client.telephone,
      client.telPortable,
      client.email
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${company.name}_clientes.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">No se encontró la empresa</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const activeCount = company.clients.filter(c => c.actif === '1 - Oui').length;
  const inactiveCount = company.clients.length - activeCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver a empresas
          </Link>
          
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {company.name}
                </h1>
              </div>
              <p className="text-gray-600">
                Gestión de clientes y contactos
              </p>
            </div>
            
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Exportar CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{company.totalClients}</p>
                </div>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Activos</p>
                  <p className="text-2xl font-bold text-green-600">{activeCount}</p>
                </div>
                <div className="w-5 h-5 rounded-full bg-green-500"></div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Inactivos</p>
                  <p className="text-2xl font-bold text-red-600">{inactiveCount}</p>
                </div>
                <div className="w-5 h-5 rounded-full bg-red-500"></div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Mostrando</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredClients.length}</p>
                </div>
                <Filter className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por nombre, función o email..."
            />
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setFilterActive('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                    filterActive === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFilterActive('active')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    filterActive === 'active' 
                      ? 'bg-green-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Activos
                </button>
                <button
                  onClick={() => setFilterActive('inactive')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                    filterActive === 'inactive' 
                      ? 'bg-red-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Inactivos
                </button>
              </div>
              
              <div className="flex items-center bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-l-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-r-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              No se encontraron clientes con los criterios de búsqueda
            </p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
          }>
            {filteredClients.map((client, index) => (
              <ClientCard key={`${client.no}-${index}`} client={client} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}