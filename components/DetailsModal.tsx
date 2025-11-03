import React, { useState, useEffect } from 'react';
import { Person } from '../types';
import { XIcon } from './Icons';

type RawPerson = Omit<Person, 'totalAmountDue' | 'serviceFee' | 'personalIncomeTax' | 'vat' | 'totalOrderAmount'>;

// Financial calculation logic, can be shared with MainContent
const calculateFinancials = (person: RawPerson): Person => {
    const totalAmountDue = person.laborRemuneration + person.businessIncome + person.soleProprietorIncome;
    const serviceFee = totalAmountDue * 0.05; // 5% service fee
    const personalIncomeTax = person.laborRemuneration * 0.10; // 10% tax on labor
    const vat = (person.businessIncome + person.soleProprietorIncome) * 0.03; // 3% VAT on business/sole income
    const totalOrderAmount = totalAmountDue + serviceFee + personalIncomeTax + vat;
    
    return {
        ...person,
        totalAmountDue,
        serviceFee,
        personalIncomeTax,
        vat,
        totalOrderAmount,
    };
};

const InfoRow: React.FC<{ label: string; value: string; isBold?: boolean; className?: string }> = ({ label, value, isBold, className = '' }) => (
  <div className={`flex justify-between items-center py-1.5 ${className}`}>
    <span className="text-sm text-gray-500">{label}</span>
    <span className={`text-gray-800 text-sm ${isBold ? 'font-semibold' : ''}`}>{value}</span>
  </div>
);

const AmountInputGroup: React.FC<{ title: string; amount: number; serviceFee: number; tax: number; onAmountChange: (value: number) => void; }> = ({ title, amount, serviceFee, tax, onAmountChange }) => {
    const [inputValue, setInputValue] = useState(amount.toFixed(2));

    useEffect(() => {
        setInputValue(amount.toFixed(2));
    }, [amount]);

    const handleBlur = () => {
        const numericValue = parseFloat(inputValue);
        if (!isNaN(numericValue)) {
            onAmountChange(numericValue);
        } else {
            setInputValue(amount.toFixed(2));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
        } else if (e.key === 'Escape') {
            setInputValue(amount.toFixed(2));
            (e.target as HTMLInputElement).blur();
        }
    };

    return (
        <div className="p-4 border rounded-lg bg-gray-50/50">
            <h4 className="font-semibold text-gray-700 mb-3 text-sm">{title}</h4>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm text-gray-500">金额</label>
                    <input
                        type="number"
                        step="0.01"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        className="w-32 p-1.5 border border-gray-300 rounded-md text-right text-sm focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
                <InfoRow label="服务费" value={`¥ ${serviceFee.toFixed(2)}`} />
                <InfoRow label="税费" value={`¥ ${tax.toFixed(2)}`} />
            </div>
        </div>
    );
};

interface DetailsModalProps {
    isOpen: boolean;
    person: Person;
    onClose: () => void;
    onSave: (updatedPerson: Person) => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ isOpen, person, onClose, onSave }) => {
    const [editedPerson, setEditedPerson] = useState<Person>(person);

    useEffect(() => {
        setEditedPerson(person);
    }, [person]);

    const handleAmountChange = (field: 'laborRemuneration' | 'businessIncome' | 'soleProprietorIncome', value: number) => {
        const updatedRaw = { ...editedPerson, [field]: value };
        setEditedPerson(calculateFinancials(updatedRaw));
    };

    const handleSave = () => {
        onSave(editedPerson);
    };

    if (!isOpen) {
        return null;
    }

    const { laborRemuneration, businessIncome, soleProprietorIncome, serviceFee, personalIncomeTax, vat, totalOrderAmount, totalAmountDue } = editedPerson;

    return (
        <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50"
            id="my-modal"
            role="dialog"
            aria-modal="true"
        >
            <div className="relative mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-xl bg-white">
                <div className="flex justify-between items-start pb-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-900">
                        编辑金额 - <span className="text-teal-600">{person.name}</span>
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="my-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                     <AmountInputGroup 
                        title="劳务报酬部分"
                        amount={laborRemuneration}
                        serviceFee={laborRemuneration * 0.05}
                        tax={laborRemuneration * 0.10}
                        onAmountChange={(val) => handleAmountChange('laborRemuneration', val)}
                     />
                     <AmountInputGroup 
                        title="经营所得部分"
                        amount={businessIncome}
                        serviceFee={businessIncome * 0.05}
                        tax={businessIncome * 0.03}
                        onAmountChange={(val) => handleAmountChange('businessIncome', val)}
                     />
                     <AmountInputGroup 
                        title="个体户部分"
                        amount={soleProprietorIncome}
                        serviceFee={soleProprietorIncome * 0.05}
                        tax={soleProprietorIncome * 0.03}
                        onAmountChange={(val) => handleAmountChange('soleProprietorIncome', val)}
                     />
                </div>
                
                <div className="mt-6 p-4 rounded-lg bg-gray-50 border">
                    <h4 className="font-semibold text-gray-800 mb-2">费用合计</h4>
                    <div className="space-y-1">
                        <InfoRow label="应发总金额" value={`¥ ${totalAmountDue.toFixed(2)}`} isBold={true} />
                        <hr className="my-1"/>
                        <InfoRow label="总服务费" value={`¥ ${serviceFee.toFixed(2)}`} />
                        <InfoRow label="总税费 (个税+增值税)" value={`¥ ${(personalIncomeTax + vat).toFixed(2)}`} />
                        <InfoRow label="订单总金额" value={`¥ ${totalOrderAmount.toFixed(2)}`} isBold={true} className="text-lg pt-1" />
                    </div>
                </div>

                <div className="flex items-center justify-end pt-6 border-t mt-6 space-x-3">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        取消
                    </button>
                    <button onClick={handleSave} className="px-8 py-2 text-sm font-medium bg-teal-500 text-white rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-sm">
                        保存
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailsModal;