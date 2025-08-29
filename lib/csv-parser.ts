import Papa from 'papaparse';
import { Client } from '@/types';

export function parseCSVContent(content: string): Client[] {
  const result = Papa.parse(content, {
    delimiter: ';',
    header: false,
    skipEmptyLines: true,
    encoding: 'UTF-8'
  });

  if (!result.data || result.data.length <= 1) {
    return [];
  }

  const clients: Client[] = [];
  const headers = result.data[0] as string[];
  
  // Detectar el formato del archivo basándose en las cabeceras
  // Formato 1: "No";"Nom";"Prénom";"Actif"... (original)
  // Formato 2: "Actif";"No";"Nom";"Prénom"... (nuevo)
  
  let columnMap: { [key: string]: number } = {};
  
  // Mapear las columnas basándose en los headers
  headers.forEach((header, index) => {
    const cleanHeader = header.toLowerCase().replace(/[^a-z]/g, '');
    
    if (cleanHeader.includes('no') && !cleanHeader.includes('nom')) {
      columnMap['no'] = index;
    } else if (cleanHeader.includes('nom') && !cleanHeader.includes('prnom')) {
      columnMap['nom'] = index;
    } else if (cleanHeader.includes('prnom')) {
      columnMap['prenom'] = index;
    } else if (cleanHeader.includes('actif')) {
      columnMap['actif'] = index;
    } else if (cleanHeader.includes('fonction')) {
      columnMap['fonction'] = index;
    } else if (cleanHeader.includes('tlphone') && !cleanHeader.includes('portable')) {
      columnMap['telephone'] = index;
    } else if (cleanHeader.includes('portable')) {
      columnMap['telPortable'] = index;
    } else if (cleanHeader.includes('email')) {
      columnMap['email'] = index;
    } else if (cleanHeader.includes('accseasy')) {
      columnMap['accesEasyMission'] = index;
    } else if (cleanHeader.includes('editeur')) {
      columnMap['editeurMutation'] = index;
    } else if (cleanHeader.includes('date')) {
      columnMap['dateMutation'] = index;
    }
  });

  // Si no encontramos las columnas esenciales, usar el mapeo por posición
  if (!columnMap.no || !columnMap.nom) {
    // Intentar formato 1 (original)
    if (headers[0]?.includes('No')) {
      columnMap = {
        no: 0,
        nom: 1,
        prenom: 2,
        actif: 3,
        fonction: 4,
        telephone: 5,
        telPortable: 6,
        email: 7,
        accesEasyMission: 8,
        editeurMutation: 9,
        dateMutation: 10
      };
    } 
    // Intentar formato 2 (nuevo)
    else if (headers[0]?.includes('Actif')) {
      columnMap = {
        actif: 0,
        no: 1,
        nom: 2,
        prenom: 3,
        fonction: 4,
        telephone: 5,
        telPortable: 6,
        email: 7,
        accesEasyMission: 8,
        editeurMutation: 9,
        dateMutation: 10
      };
    }
  }
  
  // Procesar las filas de datos
  for (let i = 1; i < result.data.length; i++) {
    const row = result.data[i] as string[];
    
    // Saltar filas vacías o incompletas
    if (row.length < 3) continue;
    
    const client: Client = {
      no: row[columnMap.no] || '',
      nom: row[columnMap.nom] || '',
      prenom: row[columnMap.prenom] || '',
      actif: row[columnMap.actif] || '',
      fonction: row[columnMap.fonction] || '',
      telephone: row[columnMap.telephone] || '',
      telPortable: row[columnMap.telPortable] || '',
      email: row[columnMap.email] || '',
      accesEasyMission: row[columnMap.accesEasyMission] || '',
      editeurMutation: row[columnMap.editeurMutation] || '',
      dateMutation: row[columnMap.dateMutation] || ''
    };
    
    // Solo agregar clientes que tengan al menos un nombre
    if (client.nom || client.prenom) {
      clients.push(client);
    }
  }

  return clients;
}

export function getCompanyNameFromFileName(fileName: string): string {
  const name = fileName.replace('.csv', '');
  
  const skipFiles = ['Clients-', 'cllients Adecco-'];
  for (const skip of skipFiles) {
    if (name.includes(skip)) {
      return '';
    }
  }
  
  return name;
}