import React, { useState, useRef, useEffect } from 'react';
import { Person, Step } from '../types';
import { DocumentAddIcon, ClipboardCheckIcon, CreditCardIcon, CheckCircleIcon, WalletIcon, DocumentTextIcon, BriefcaseIcon, ScaleIcon, PencilIcon } from './Icons';
import Stepper from './Stepper';
import DetailsModal from './DetailsModal';

const SummaryCard: React.FC<{ title: string; amount: number; icon: React.FC<{ className?: string }>; }> = ({ title, amount, icon: Icon }) => (
    <div className="flex-1 bg-white p-5 border border-gray-200 rounded-xl flex items-center space-x-4 hover:shadow-md transition-shadow">
        <div className="p-3 bg-teal-50 rounded-full">
            <Icon className="w-6 h-6 text-teal-500" />
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
                {amount.toFixed(2)}
                <span className="text-base font-normal text-gray-500 ml-1">元</span>
            </p>
        </div>
    </div>
);

const UserInfoCell: React.FC<{ person: Person }> = ({ person }) => {
  return (
    <div className="relative group py-4">
      <span className="cursor-help text-gray-600 border-b border-dotted border-gray-400 pb-0.5">{`**** **** ${person.accountNumber.slice(-4)}`}</span>
      <div className="absolute left-0 bottom-full mb-2 w-max max-w-sm p-3 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
        <p className="font-semibold">详细信息</p>
        <hr className="border-gray-600 my-1" />
        <p><strong>身份证:</strong> {person.id}</p>
        <p><strong>手机号:</strong> {person.phone}</p>
        <p><strong>任务:</strong> {person.task}</p>
        <p><strong>开户行:</strong> {person.bank}</p>
        <p><strong>收款账号:</strong> {person.accountNumber}</p>
      </div>
    </div>
  );
};

const EditableAmountCell: React.FC<{ initialValue: number; onSave: (newValue: number) => void; }> = ({ initialValue, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue.toFixed(2));
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setValue(initialValue.toFixed(2));
    }, [initialValue]);
    
    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    const handleSave = () => {
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue) && numericValue !== initialValue) {
            onSave(numericValue);
        } else {
            setValue(initialValue.toFixed(2)); // Revert if invalid or unchanged
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setValue(initialValue.toFixed(2));
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <input
                ref={inputRef}
                type="number"
                step="0.01"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="w-full px-1 py-0.5 border border-teal-300 rounded-md text-right text-sm bg-white focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
            />
        );
    }

    return (
        <div 
            onClick={() => setIsEditing(true)} 
            className="w-full h-full p-1 rounded-md cursor-pointer text-right flex items-center justify-end space-x-2"
        >
            <span className="pb-0.5 border-b border-dashed border-gray-400 transition-colors">
                {initialValue.toFixed(2)}
            </span>
            <PencilIcon className="w-3.5 h-3.5 text-gray-400 transition-opacity" />
        </div>
    );
};

const DataTable: React.FC<{ 
    data: Person[];
    onOpenDetails: (index: number) => void;
    onAmountChange: (personIndex: number, field: keyof Person, value: number) => void;
}> = ({ data, onOpenDetails, onAmountChange }) => (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-600 font-semibold bg-gray-50">
                <tr>
                    <th rowSpan={2} scope="col" className="px-4 py-3 align-middle text-left">姓名</th>
                    <th rowSpan={2} scope="col" className="px-4 py-3 align-middle text-left border-r border-gray-200">人员信息</th>
                    <th colSpan={4} scope="colgroup" className="px-4 py-3 text-center border-x border-gray-200">个人所得明细</th>
                    <th colSpan={3} scope="colgroup" className="px-4 py-3 text-center border-x border-gray-200">平台及税务费用</th>
                    <th rowSpan={2} scope="col" className="px-4 py-3 text-right align-middle bg-gray-100 border-x border-gray-200">订单总金额</th>
                    <th rowSpan={2} scope="col" className="px-4 py-3 text-center align-middle border-l border-gray-200">操作</th>
                </tr>
                <tr>
                    <th scope="col" className="px-4 py-3 text-right border-l border-gray-200">劳务报酬部分</th>
                    <th scope="col" className="px-4 py-3 text-right">经营所得部分</th>
                    <th scope="col" className="px-4 py-3 text-right">个体户部分</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-right bg-gray-100 border-x border-gray-200">应发总金额</th>

                    <th scope="col" className="px-4 py-3 text-right">服务费</th>
                    <th scope="col" className="px-4 py-3 text-right">个税</th>
                    <th scope="col" className="px-4 py-3 text-right border-r border-gray-200">增值税</th>
                </tr>
            </thead>
            <tbody>
                {data.map((person, index) => (
                    <tr key={index} className="bg-white border-b last:border-b-0 hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">{person.name}</td>
                        <td className="px-4 py-0 border-r border-gray-200"><UserInfoCell person={person} /></td>
                        
                        {/* 个人所得明细 Group */}
                        <td className="px-2 py-1 align-middle text-right border-l border-gray-200">
                           <EditableAmountCell 
                                initialValue={person.laborRemuneration}
                                onSave={(newValue) => onAmountChange(index, 'laborRemuneration', newValue)}
                           />
                        </td>
                        <td className="px-2 py-1 align-middle text-right">
                           <EditableAmountCell 
                                initialValue={person.businessIncome}
                                onSave={(newValue) => onAmountChange(index, 'businessIncome', newValue)}
                           />
                        </td>
                        <td className="px-2 py-1 align-middle text-right">
                            <EditableAmountCell 
                                initialValue={person.soleProprietorIncome}
                                onSave={(newValue) => onAmountChange(index, 'soleProprietorIncome', newValue)}
                            />
                        </td>
                        <td className="px-4 py-2 align-middle text-right font-semibold text-gray-800 bg-gray-50 border-x border-gray-200">{person.totalAmountDue.toFixed(2)}</td>

                        {/* 平台及税务费用 Group */}
                        <td className="px-4 py-2 align-middle text-right">{person.serviceFee.toFixed(2)}</td>
                        <td className="px-4 py-2 align-middle text-right">{person.personalIncomeTax.toFixed(2)}</td>
                        <td className="px-4 py-2 align-middle text-right border-r border-gray-200">{person.vat.toFixed(2)}</td>
                        
                        <td className="px-4 py-2 align-middle text-right font-bold text-gray-900 bg-gray-100 border-x border-gray-200">{person.totalOrderAmount.toFixed(2)}</td>

                        <td className="px-4 py-2 align-middle text-center border-l border-gray-200">
                            <a href="#" onClick={(e) => { e.preventDefault(); onOpenDetails(index); }} className="font-medium text-teal-600 hover:underline">详细</a>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


const MainContent: React.FC = () => {
    type RawPerson = Omit<Person, 'totalAmountDue' | 'serviceFee' | 'personalIncomeTax' | 'vat' | 'totalOrderAmount'>

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

    const initialDataRaw: RawPerson[] = [
      { name: '徐晨露', id: '320322199212170029', phone: '15002106134', task: 'UI设计服务', bank: '中国银行', accountNumber: '6217850800019685732', laborRemuneration: 1500, businessIncome: 5100.60, soleProprietorIncome: 3400.40 },
      { name: '陈莉', id: '320681198911010085', phone: '15001974427', task: '后端开发', bank: '招商银行', accountNumber: '6214852114742441', laborRemuneration: 8000, businessIncome: 0, soleProprietorIncome: 4000 },
    ];
    
    const [tableData, setTableData] = useState<Person[]>(initialDataRaw.map(calculateFinancials));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPersonIndex, setSelectedPersonIndex] = useState<number | null>(null);

    const handleOpenModal = (index: number) => {
        setSelectedPersonIndex(index);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPersonIndex(null);
    };

    const handleTableCellChange = (personIndex: number, field: keyof Person, value: number) => {
        setTableData(prevData => {
            const newData = [...prevData];
            const personToUpdate = { ...newData[personIndex] };
            (personToUpdate as any)[field] = value;
            newData[personIndex] = calculateFinancials(personToUpdate);
            return newData;
        });
    };
    
    const handleSaveModal = (updatedPerson: Person) => {
        if (selectedPersonIndex !== null) {
            setTableData(prevData => {
                const newData = [...prevData];
                // Recalculate just in case, to ensure consistency
                newData[selectedPersonIndex] = calculateFinancials(updatedPerson);
                return newData;
            });
        }
        handleCloseModal();
    };
    
    const totals = tableData.reduce((acc, person) => {
        acc.totalOrderAmount += person.totalOrderAmount;
        acc.totalAmountDue += person.totalAmountDue;
        acc.serviceFee += person.serviceFee;
        acc.taxes += person.personalIncomeTax + person.vat;
        return acc;
    }, { totalOrderAmount: 0, totalAmountDue: 0, serviceFee: 0, taxes: 0 });

    const steps: Step[] = [
        { name: '创建订单', icon: DocumentAddIcon, status: 'completed' },
        { name: '业务确认', icon: ClipboardCheckIcon, status: 'current' },
        { name: '付款确认', icon: CreditCardIcon, status: 'upcoming' },
        { name: '完成', icon: CheckCircleIcon, status: 'upcoming' },
    ];

    return (
        <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="mb-8">
              <Stepper steps={steps} />
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">业务确认</h2>
                     <div className="flex items-center space-x-6 text-sm text-gray-500 mt-2">
                        <span>订单月: 2025-11</span>
                        <div className="flex items-center">
                            <span>结算任务:</span>
                            <span className="ml-2 bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-semibold">云才网络-UI设计服务</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <SummaryCard title="订单总金额" amount={totals.totalOrderAmount} icon={WalletIcon} />
                <SummaryCard title="应发总金额" amount={totals.totalAmountDue} icon={DocumentTextIcon} />
                <SummaryCard title="总服务费" amount={totals.serviceFee} icon={BriefcaseIcon} />
                <SummaryCard title="总税费" amount={totals.taxes} icon={ScaleIcon} />
            </div>
            
            <DataTable 
                data={tableData} 
                onOpenDetails={handleOpenModal}
                onAmountChange={handleTableCellChange}
            />

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">批量操作</button>
                    <button className="px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">下载支付明细</button>
                    <button className="px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50">作废订单</button>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-5 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">上一步</button>
                    <button className="px-8 py-2 text-sm font-medium bg-teal-500 text-white rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-sm hover:shadow-md transition-shadow">下一步</button>
                </div>
            </div>
            
            {isModalOpen && selectedPersonIndex !== null && (
                <DetailsModal
                    isOpen={isModalOpen}
                    person={tableData[selectedPersonIndex]}
                    onClose={handleCloseModal}
                    onSave={handleSaveModal}
                />
            )}
        </div>
    );
};

export default MainContent;