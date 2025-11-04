import React from 'react';

export type IconName =
  | 'home' | 'dollar' | 'grid' | 'mail' | 'userGroup' | 'chevronUp'
  | 'chevronDown' | 'phone' | 'bell' | 'userCircle' | 'pencil'
  | 'documentAdd' | 'clipboardCheck' | 'creditCard' | 'checkCircle'
  | 'wallet' | 'documentText' | 'briefcase' | 'scale' | 'checkCircleSolid'
  | 'x' | 'informationCircle';


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
  netAmount: number;
  totalOrderAmount: number;
}

export interface Step {
  name:string;
  icon: IconName;
  status: 'completed' | 'current' | 'upcoming';
}