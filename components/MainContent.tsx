import React, { useState, useRef, useEffect } from 'react';
import { Person, Step } from '../types';
import { PencilIcon, DocumentAddIcon, ClipboardCheckIcon, CreditCardIcon, CheckCircleIcon, WalletIcon, DocumentTextIcon, BriefcaseIcon, ScaleIcon } from './Icons';
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
      <span className="cursor-pointer text-gray-600">{`**** **** ${person.accountNumber.slice(-4)}`}</span>
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

const EditableAmountCell: React.FC<{ value: number; onSave: (newValue: number) => void; }> = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value.toFixed(2));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);
  
  useEffect(() => {
    setCurrentValue(value.toFixed(2));
  }, [value]);

  const handleBlur = () => {
    const numericValue = parseFloat(currentValue);
    if (!isNaN(numericValue)) {
      onSave(numericValue);
    } else {
        setCurrentValue(value.toFixed(2));
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setCurrentValue(value.toFixed(2));
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="number"
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-24 p-1 border rounded bg-white text-right shadow-inner"
      />
    );
  }

  return (
    <div onClick={() => setIsEditing(true)} className="cursor-pointer flex items-center justify-end group h-full">
      <span>{value.toFixed(2)}</span>
      <PencilIcon className="w-3 h-3 text-gray-400 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};


const DataTable: React.FC<{ 
    data: Person[];
    onAmountChange: (index: number, field: 'laborRemuneration' | 'businessIncome' | 'soleProprietorIncome', value: number) => void;
    onTotalAmountChange: (index: number, value: number) => void;
    onDetailsClick: (index: number) => void;
}> = ({ data, onAmountChange, onTotalAmountChange, onDetailsClick }) => (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-600 font-semibold bg-gray-50">
                <tr>
                    <th rowSpan={2} scope="col" className="px-4 py-3 align-middle text-left">姓名</th>
                    <th rowSpan={2} scope="col" className="px-4 py-3 align-middle text-left border-r border-gray-200">人员信息</th>
                    <th colSpan={4} scope="colgroup" className="px-4 py-3 text-center border-x border-gray-200">个人所得明细</th>
                    <th colSpan={3} scope="colgroup" className="px-4 py-3 text-center border-x border-gray-200">平台及税务费用</th>
                    <th rowSpan={2} scope="col" className="px-4 py-3 text-right align-middle">税后总金额</th>
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
                        <td className="px-4 py-2 text-right border-l border-gray-200">
                           <EditableAmountCell value={person.laborRemuneration} onSave={(val) => onAmountChange(index, 'laborRemuneration', val)} />
                        </td>
                        <td className="px-4 py-2 text-right">
                           <EditableAmountCell value={person.businessIncome} onSave={(val) => onAmountChange(index, 'businessIncome', val)} />
                        </td>
                        <td className="px-4 py-2 text-right">
                           <EditableAmountCell value={person.soleProprietorIncome} onSave={(val) => onAmountChange(index, 'soleProprietorIncome', val)} />
                        </td>
                        <td className="px-4 py-2 text-right bg-gray-50 border-x border-gray-200">
                            <EditableAmountCell value={person.totalAmountDue} onSave={(val) => onTotalAmountChange(index, val)} />
                        </td>

                        {/* 平台及税务费用 Group */}
                        <td className="px-4 py-2 text-right">{person.serviceFee.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right">{person.personalIncomeTax.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right border-r border-gray-200">{person.vat.toFixed(2)}</td>
                        
                        <td className="px-4 py-2 text-right font-medium text-teal-600">{person.netAmount.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right font-bold text-gray-900 bg-gray-100 border-x border-gray-200">{person.totalOrderAmount.toFixed(2)}</td>

                        <td className="px-4 py-2 text-center border-l border-gray-200">
                            <button onClick={() => onDetailsClick(index)} className="font-medium text-teal-600 hover:underline">详细</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


const MainContent: React.FC = () => {
    type RawPerson = Omit<Person, 'totalAmountDue' | 'serviceFee' | 'personalIncomeTax' | 'vat' | 'totalOrderAmount' | 'netAmount'>

    const calculateFinancials = (person: RawPerson): Person => {
        const totalAmountDue = person.laborRemuneration + person.businessIncome + person.soleProprietorIncome;
        const serviceFee = totalAmountDue * 0.05; // 5% service fee
        const personalIncomeTax = person.laborRemuneration * 0.10; // 10% tax on labor
        const vat = (person.businessIncome + person.soleProprietorIncome) * 0.03; // 3% VAT on business/sole income
        const netAmount = totalAmountDue - serviceFee - personalIncomeTax - vat;
        const totalOrderAmount = totalAmountDue + serviceFee + personalIncomeTax + vat;
        
        return {
            ...person,
            totalAmountDue,
            serviceFee,
            personalIncomeTax,
            vat,
            netAmount,
            totalOrderAmount,
        };
    };

    const initialDataRaw: RawPerson[] = [
      { name: '徐晨露', id: '320322199212170029', phone: '15002106134', task: 'UI设计服务', bank: '中国银行', accountNumber: '6217850800019685732', laborRemuneration: 1500, businessIncome: 5100.60, soleProprietorIncome: 3400.40 },
      { name: '陈莉', id: '320681198911010085', phone: '15001974427', task: '后端开发', bank: '招商银行', accountNumber: '6214852114742441', laborRemuneration: 8000, businessIncome: 0, soleProprietorIncome: 4000 },
    ];
    
    const initialDataRef = useRef(initialDataRaw.map(calculateFinancials));

    const [tableData, setTableData] = useState<Person[]>(initialDataRaw.map(calculateFinancials));
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPersonIndex, setSelectedPersonIndex] = useState<number | null>(null);

    const handleOpenDetails = (index: number) => {
        setSelectedPersonIndex(index);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPersonIndex(null);
    };

    const handleSaveChangesFromModal = (updatedAmounts: { laborRemuneration: number; businessIncome: number; soleProprietorIncome: number; }) => {
        if (selectedPersonIndex === null) return;
        
        setTableData(prevData => {
            const newData = [...prevData];
            const personToUpdate = newData[selectedPersonIndex];
            
            const updatedPersonRaw: RawPerson = {
                ...personToUpdate,
                laborRemuneration: updatedAmounts.laborRemuneration,
                businessIncome: updatedAmounts.businessIncome,
                soleProprietorIncome: updatedAmounts.soleProprietorIncome,
            };
            
            newData[selectedPersonIndex] = calculateFinancials(updatedPersonRaw);
            return newData;
        });
    
        handleCloseModal();
    };

    const handleAmountChange = (index: number, field: 'laborRemuneration' | 'businessIncome' | 'soleProprietorIncome', value: number) => {
        setTableData(prevData => {
            const newData = [...prevData];
            const updatedPersonRaw = { ...newData[index], [field]: value };
            newData[index] = calculateFinancials(updatedPersonRaw);
            return newData;
        });
    };

    const handleTotalAmountChange = (index: number, newTotal: number) => {
        setTableData(prevData => {
            const newData = [...prevData];
            const person = newData[index];
            const initialPerson = initialDataRef.current[index];

            const newLabor = Math.min(newTotal, 1500);
            const remainder = Math.max(0, newTotal - newLabor);

            let newBusiness = 0;
            let newSole = 0;

            const currentBusiness = person.businessIncome;
            const currentSole = person.soleProprietorIncome;
            let totalSub = currentBusiness + currentSole;

            if (totalSub > 0) {
                const businessRatio = currentBusiness / totalSub;
                newBusiness = remainder * businessRatio;
                newSole = remainder * (1 - businessRatio);
            } else {
                const initialBusiness = initialPerson.businessIncome;
                const initialSole = initialPerson.soleProprietorIncome;
                totalSub = initialBusiness + initialSole;

                if (totalSub > 0) {
                    const businessRatio = initialBusiness / totalSub;
                    newBusiness = remainder * businessRatio;
                    newSole = remainder * (1 - businessRatio);
                } else {
                    newBusiness = remainder;
                }
            }
            
            const updatedPersonRaw: RawPerson = {
                ...person,
                laborRemuneration: newLabor,
                businessIncome: newBusiness,
                soleProprietorIncome: newSole,
            };
            
            newData[index] = calculateFinancials(updatedPersonRaw);
            return newData;
        });
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

    const selectedPerson = selectedPersonIndex !== null ? tableData[selectedPersonIndex] : null;

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
            
            <DataTable data={tableData} onAmountChange={handleAmountChange} onTotalAmountChange={handleTotalAmountChange} onDetailsClick={handleOpenDetails} />

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
            <DetailsModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveChangesFromModal}
                person={selectedPerson}
            />
        </div>
    );
};

export default MainContent;