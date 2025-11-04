import React, { useState, useEffect, useMemo } from 'react';
import { Person } from '../types';
import { XIcon } from './Icons';

const DetailRowInput: React.FC<{ label: string; value: number; onChange: (value: number) => void }> = ({ label, value, onChange }) => (
    <div className="flex justify-between items-center py-2">
        <span className="text-gray-600 font-medium">{label}</span>
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            className="w-32 p-1 border rounded bg-white text-right shadow-inner focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
        />
    </div>
);

const DetailRowDisplay: React.FC<{ label: string; value: number; }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-1">
        <span className="text-gray-500">{label}</span>
        <span className="text-gray-800">{value.toFixed(2)}</span>
    </div>
);

const DetailsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedAmounts: { laborRemuneration: number; businessIncome: number; soleProprietorIncome: number; }) => void;
    person: Person | null;
}> = ({ isOpen, onClose, onSave, person }) => {
    const [labor, setLabor] = useState(0);
    const [business, setBusiness] = useState(0);
    const [sole, setSole] = useState(0);

    useEffect(() => {
        if (person) {
            setLabor(person.laborRemuneration);
            setBusiness(person.businessIncome);
            setSole(person.soleProprietorIncome);
        }
    }, [person]);

    const calculations = useMemo(() => {
        const laborServiceFee = labor * 0.05;
        const laborTax = labor * 0.10;
        const laborVat = 0;

        const businessServiceFee = business * 0.05;
        const businessTax = 0;
        const businessVat = business * 0.03;

        const soleServiceFee = sole * 0.05;
        const soleTax = 0;
        const soleVat = sole * 0.03;

        const totalAmountDue = labor + business + sole;
        const totalServiceFee = totalAmountDue * 0.05;
        const totalPersonalIncomeTax = laborTax;
        const totalVat = businessVat + soleVat;
        const netAmount = totalAmountDue - totalServiceFee - totalPersonalIncomeTax - totalVat;
        const totalOrderAmount = totalAmountDue + totalServiceFee - totalPersonalIncomeTax - totalVat;

        return {
            laborServiceFee, laborTax, laborVat,
            businessServiceFee, businessTax, businessVat,
            soleServiceFee, soleTax, soleVat,
            netAmount, totalOrderAmount
        };
    }, [labor, business, sole]);
    
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
           window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    if (!isOpen || !person) return null;

    const handleSaveClick = () => {
        onSave({
            laborRemuneration: labor,
            businessIncome: business,
            soleProprietorIncome: sole
        });
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50" onClick={onClose} role="dialog" aria-modal="true">
            <div className="relative mx-auto p-8 border w-full max-w-2xl shadow-lg rounded-xl bg-white" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">详细费用明细 - {person.name}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="space-y-6">
                    {/* Sections */}
                    <div className="p-4 border rounded-lg bg-gray-50">
                        <h4 className="font-semibold text-gray-700 mb-2">劳务报酬部分</h4>
                        <DetailRowInput label="金额" value={labor} onChange={setLabor} />
                        <DetailRowDisplay label="服务费" value={calculations.laborServiceFee} />
                        <DetailRowDisplay label="个税" value={calculations.laborTax} />
                        <DetailRowDisplay label="增值税" value={calculations.laborVat} />
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-50">
                        <h4 className="font-semibold text-gray-700 mb-2">经营所得部分</h4>
                        <DetailRowInput label="金额" value={business} onChange={setBusiness} />
                        <DetailRowDisplay label="服务费" value={calculations.businessServiceFee} />
                        <DetailRowDisplay label="个税" value={calculations.businessTax} />
                        <DetailRowDisplay label="增值税" value={calculations.businessVat} />
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-50">
                        <h4 className="font-semibold text-gray-700 mb-2">个体户部分</h4>
                        <DetailRowInput label="金额" value={sole} onChange={setSole} />
                        <DetailRowDisplay label="服务费" value={calculations.soleServiceFee} />
                        <DetailRowDisplay label="个税" value={calculations.soleTax} />
                        <DetailRowDisplay label="增值税" value={calculations.soleVat} />
                    </div>

                    {/* Summary */}
                    <div className="mt-6 pt-4 border-t">
                        <div className="flex justify-between items-center text-lg font-semibold">
                            <span className="text-gray-600">税后总金额</span>
                            <span className="text-teal-600">{calculations.netAmount.toFixed(2)} 元</span>
                        </div>
                         <div className="flex justify-between items-center text-lg font-bold mt-2">
                            <span className="text-gray-800">订单总金额</span>
                            <span className="text-gray-900">{calculations.totalOrderAmount.toFixed(2)} 元</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end items-center mt-8 space-x-3">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">取消</button>
                    <button onClick={handleSaveClick} className="px-8 py-2 text-sm font-medium bg-teal-500 text-white rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">保存</button>
                </div>
            </div>
        </div>
    );
};

export default DetailsModal;
