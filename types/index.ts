export interface Client {
  no: string;
  nom: string;
  prenom: string;
  actif: string;
  fonction: string;
  telephone: string;
  telPortable: string;
  email: string;
  accesEasyMission: string;
  editeurMutation: string;
  dateMutation: string;
}

export interface Company {
  id?: string;
  name: string;
  fileName?: string;
  clients: Client[];
  totalClients: number;
}

export interface CompanySummary {
  id?: string;
  name: string;
  fileName?: string;
  totalClients: number;
}