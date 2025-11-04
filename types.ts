import React from 'react';

export type PageName = 'confirmation' | 'issuance';

export type IconName =
  | 'home' | 'dollar' | 'grid' | 'mail' | 'userGroup' | 'chevronUp'
  | 'chevronDown' | 'phone' | 'bell' | 'userCircle' | 'pencil'
  | 'documentAdd' | 'clipboardCheck' | 'creditCard' | 'checkCircle'
  | 'wallet' | 'documentText' | 'briefcase' | 'scale' | 'checkCircleSolid'
  | 'x' | 'informationCircle' | 'paperAirplane' | 'eye'
  | 'refresh' | 'chevronLeft' | 'chevronRight';


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

export interface Recipient {
  name: string;
  status: '正常';
  id: string;
  phone: string;
  task: string;
  bank: string;
  accountNumber: string;
  amountDue: number;
  actualAmount: number;
  orderAmount: number;
}


export interface Step {
  name:string;
  icon: IconName;
  status: 'completed' | 'current' | 'upcoming';
}