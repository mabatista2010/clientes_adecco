'use client';

import { Building2, Users } from 'lucide-react';
import Link from 'next/link';
import { CompanySummary } from '@/types';

interface CompanyCardProps {
  company: CompanySummary;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/company/${encodeURIComponent(company.id || company.fileName || '')}`}>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-gray-200 hover:border-blue-400 transform hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">{company.totalClients}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {company.name}
        </h3>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">
            {company.totalClients} {company.totalClients === 1 ? 'cliente' : 'clientes'}
          </span>
          <span className="text-sm text-blue-600 font-medium">
            Ver detalles →
          </span>
        </div>
      </div>
    </Link>
  );
}