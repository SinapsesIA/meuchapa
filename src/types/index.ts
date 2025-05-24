
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface Receipt {
  id: string;
  imageUrl: string;
  ocrText: string;
  processedAt: Date;
  paymentStatus: "pending" | "paid" | "contested";
  
  // Extracted fields
  companyName?: string;
  companyDocument?: string;
  companyAddress?: string;
  documentDate?: string;
  receiptNumber?: string;
  supplierName?: string;
  supplierDocument?: string;
  supplierAddress?: string;
  serviceType?: string;
  itemCount?: number;
  unit?: string;
  totalWeight?: number;
  totalVolume?: number;
  unitPrice?: number;
  serviceTotal?: number;
  additionalValue?: number;
  discountValue?: number;
  totalAmount?: number;
  returnAmount?: number;
  vehiclePlate?: string;
  responsible?: string;
  paymentMethod?: string;
  pixKey?: string;
  email?: string;
  notes?: string;
  cityState?: string;
}

export interface FilterOptions {
  dateRange?: { start: Date; end: Date };
  supplier?: string;
  location?: string;
  serviceType?: string;
  vehiclePlate?: string;
}

export interface ChartData {
  labels: string[];
  values: number[];
}

// Database entity interfaces
export interface Supplier {
  id: string;
  name: string;
  document: string; 
  city: string;
  contact: string;
  created_at?: string;
  updated_at?: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  type: string;
  capacity: string;
  supplier: string;
  created_at?: string;
  updated_at?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  created_at?: string;
  updated_at?: string;
}

// Generic database item type
export type DatabaseItem = Supplier | Vehicle | Location | Service;
