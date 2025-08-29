'use client';

import { User, Phone, Mail, Calendar, Briefcase, CheckCircle, XCircle } from 'lucide-react';
import { Client } from '@/types';

interface ClientCardProps {
  client: Client;
}

export default function ClientCard({ client }: ClientCardProps) {
  const isActive = client.actif === '1 - Oui';
  
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {client.prenom} {client.nom}
            </h3>
            {client.fonction && (
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <Briefcase className="w-3 h-3 mr-1" />
                {client.fonction}
              </p>
            )}
          </div>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
          isActive 
            ? 'bg-green-100 text-green-600' 
            : 'bg-red-100 text-red-600'
        }`}>
          {isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          <span className="text-xs font-medium">{isActive ? 'Activo' : 'Inactivo'}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {client.telephone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            <span>{client.telephone}</span>
          </div>
        )}
        
        {client.telPortable && client.telPortable.trim() && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            <span>{client.telPortable} (Móvil)</span>
          </div>
        )}
        
        {client.email && client.email.trim() && (
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2 text-gray-400" />
            <a href={`mailto:${client.email}`} className="hover:text-blue-600 transition-colors">
              {client.email}
            </a>
          </div>
        )}
        
        {client.dateMutation && (
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>Última actualización: {client.dateMutation}</span>
          </div>
        )}
      </div>
      
      {client.no && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <span className="text-xs text-gray-500">ID: {client.no}</span>
        </div>
      )}
    </div>
  );
}