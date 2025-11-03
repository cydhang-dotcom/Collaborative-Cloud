import React from 'react';

export interface Person {
  name: string;
  id: string;
  phone: string;
  task: string;
  bank: string;
  accountNumber: string;
  totalAmountDue: number;
  laborRemuneration: number;
  businessIncome: number;
  soleProprietorIncome: number;
  serviceFee: number;
  personalIncomeTax: number;
  vat: number;
  totalOrderAmount: number;
}

export interface Step {
  name:string;
  icon: React.FC<{ className?: string }>;
  status: 'completed' | 'current' | 'upcoming';
}
