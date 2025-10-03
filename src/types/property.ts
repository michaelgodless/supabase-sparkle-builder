// Типы для справочников
export interface PropertyActionCategory {
  id: string;
  name: string;
  code: string;
}

export interface PropertyCategory {
  id: string;
  name: string;
  code: string;
}

export interface PropertySubcategory {
  id: string;
  category_id: string;
  name: string;
  code: string;
}

export interface PropertyArea {
  id: string;
  parent_id: string | null;
  name: string;
  full_name: string | null;
  level: number;
}

export interface PropertyProposal {
  id: string;
  name: string;
  code: string;
}

export interface PropertyCondition {
  id: string;
  name: string;
  code: string;
  applicable_to: string[];
}

export interface PropertyStatus {
  id: string;
  name: string;
  code: string;
  description: string | null;
}

export interface PaymentType {
  id: string;
  name: string;
  code: string;
}

export interface DocumentType {
  id: string;
  name: string;
  code: string;
}

export interface CommunicationType {
  id: string;
  name: string;
  code: string;
}

export interface FurnitureType {
  id: string;
  name: string;
  code: string;
}

// Типы комнат
export const ROOM_OPTIONS = [
  { value: 'studio', label: 'Студия' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5+', label: '5+' },
] as const;

// Этажи (1-30+)
export const generateFloorOptions = () => {
  const floors = [];
  for (let i = 1; i <= 30; i++) {
    floors.push({ value: i.toString(), label: i.toString() });
  }
  floors.push({ value: '30+', label: '30+' });
  return floors;
};
