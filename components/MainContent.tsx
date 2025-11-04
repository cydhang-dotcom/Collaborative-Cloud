import React, { useState, useRef, useEffect } from 'react';
import { Person, Step, IconName, Recipient, PageName } from '../types';
import { Icon } from './Icons';
import Stepper from './Stepper';
import DetailsModal from './DetailsModal';

const BusinessConfirmationPage: React.FC<{ onNext: () => void }> = ({ onNext }) => {
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
      { name: '徐露', id: '311322199612170031', phone: '15112106134', task: 'UI设计服务', bank: '中国银行', accountNumber: '6217850800019685732', laborRemuneration: 1500, businessIncome: 5100.60, soleProprietorIncome: 3400.40 },
      { name: '陈晨莉', id: '311681199111010031', phone: '15661974427', task: '后端开发', bank: '招商银行', accountNumber: '6214852114742441', laborRemuneration: 8000, businessIncome: 0, soleProprietorIncome: 4000 },
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
        { name: '创建订单', icon: 'documentAdd', status: 'completed' },
        { name: '业务确认', icon: 'clipboardCheck', status: 'current' },
        { name: '付款确认', icon: 'creditCard', status: 'upcoming' },
        { name: '完成', icon: 'checkCircle', status: 'upcoming' },
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
                <SummaryCard title="订单总金额" amount={totals.totalOrderAmount} icon="wallet" />
                <SummaryCard title="应发总金额" amount={totals.totalAmountDue} icon="documentText" />
                <SummaryCard title="总服务费" amount={totals.serviceFee} icon="briefcase" />
                <SummaryCard title="总税费" amount={totals.taxes} icon="scale" />
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
                    <button onClick={onNext} className="px-8 py-2 text-sm font-medium bg-teal-500 text-white rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-sm hover:shadow-md transition-shadow">下一步</button>
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

const SummaryCard: React.FC<{ title: string; amount: number; icon: IconName; }> = ({ title, amount, icon }) => (
    <div className="flex-1 bg-white p-5 border border-gray-200 rounded-xl flex items-center space-x-4 hover:shadow-md transition-shadow">
        <div className="p-3 bg-teal-50 rounded-full">
            <Icon name={icon} className="w-6 h-6 text-teal-500" />
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
      <Icon name="pencil" className="w-4 h-4 text-gray-400 ml-1 opacity-40 group-hover:opacity-100 transition-opacity" />
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
                    <th rowSpan={2} scope="col" className="px-4 py-3 align-middle text-left border-r border-gray-200">
                        <div className="flex items-center group relative">
                            <span>人员信息</span>
                            <Icon name="informationCircle" className="w-4 h-4 text-gray-400 ml-1" />
                            <div className="absolute left-0 bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                悬停下方单元格查看详细信息
                            </div>
                        </div>
                    </th>
                    <th colSpan={4} scope="colgroup" className="px-4 py-3 text-center border-x border-gray-200">个人所得明细</th>
                    <th colSpan={3} scope="colgroup" className="px-4 py-3 text-center border-x border-gray-200">平台及税务费用</th>
                    <th rowSpan={2} scope="col" className="px-4 py-3 text-right align-middle">
                        <div className="flex items-center justify-end group relative">
                            <span>税后总金额</span>
                            <span className="text-gray-400 ml-1">*</span>
                            <div className="absolute right-0 bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                此金额为试算结果
                            </div>
                        </div>
                    </th>
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

const Breadcrumbs: React.FC<{ items: string[] }> = ({ items }) => (
  <nav className="text-sm mb-4 text-gray-500" aria-label="Breadcrumb">
    <ol className="list-none p-0 inline-flex">
      {items.map((item, index) => (
        <li key={item} className="flex items-center">
          <a href="#" className={`hover:text-gray-700 ${index === items.length - 1 ? 'text-gray-800 font-medium' : ''}`}>{item}</a>
          {index < items.length - 1 && <span className="mx-2">/</span>}
        </li>
      ))}
    </ol>
  </nav>
);

const InfoItem: React.FC<{ title: string; value: string; unit: string; }> = ({ title, value, unit }) => (
    <div className="p-4">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold text-gray-900 mt-1">
            {value}
            <span className="text-base font-normal text-gray-500 ml-1">{unit}</span>
        </p>
    </div>
);

const IssuanceDetailsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const steps: Step[] = [
        { name: '业务确认', icon: 'paperAirplane', status: 'completed' },
        { name: '平台风控', icon: 'eye', status: 'completed' },
        { name: '确认发放', icon: 'checkCircle', status: 'current' },
        { name: '发放中', icon: 'checkCircle', status: 'upcoming' },
        { name: '发放完成', icon: 'checkCircle', status: 'upcoming' },
    ];

    const recipients: Recipient[] = [
      { name: '徐晨露', status: '正常', id: '320322199212170029', phone: '15002106134', task: '云才网络...', bank: '中国银行', accountNumber: '6217850800019685732', amountDue: 10000, actualAmount: 10000, orderAmount: 10636 },
      { name: '陈莉', status: '正常', id: '320681198911010085', phone: '15001974427', task: '云才网络...', bank: '招商银行', accountNumber: '6214852114742441', amountDue: 3000, actualAmount: 3000, orderAmount: 3190.8 }
    ];

    return (
        <div className="bg-white p-8 rounded-xl shadow-md">
            <Breadcrumbs items={['班步协作', '发放状态', '发放明细']} />
            
            <div className="my-8">
                <Stepper steps={steps} />
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800">发放内容: 2025-11 第1批 (“云才网络-UI设计服务”)
                  <span className="ml-3 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">经营所得</span>
                </h3>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg text-blue-800">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <Icon name="informationCircle" className="w-5 h-5 mr-3 text-blue-400" />
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold">此订单已经通过平台风控确认，可继续发放。</p>
                            <p>发放前，请确认余额是否充足，点击确认后，订单所对应的资金将被冻结，等待终端承揽者确认任务成果后发放。</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border rounded-lg bg-gray-50 mb-8">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800">订单信息</h3>
                    <div className="text-sm text-gray-600 space-y-1 mt-2">
                        <p>风控时间: 2025-11-04 13:25</p>
                        <p>提交时间: 2025-11-04 13:25</p>
                        <p>订单月: 2025-11</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 text-center divide-x divide-gray-200 border-t bg-white rounded-b-lg">
                    <InfoItem title="订单总额" value="13826.80" unit="元" />
                    <InfoItem title="应发总额" value="13000.00" unit="元" />
                    <InfoItem title="实发总额" value="13000.00" unit="元" />
                    <InfoItem title="服务费" value="0.00" unit="元" />
                </div>
            </div>
            
            <div className="mb-8">
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-sm text-left text-gray-500">
                      <thead className="text-xs text-gray-600 font-semibold bg-gray-50">
                          <tr>
                              <th className="px-4 py-3">姓名</th>
                              <th className="px-4 py-3">身份证号码</th>
                              <th className="px-4 py-3">手机号</th>
                              <th className="px-4 py-3">任务</th>
                              <th className="px-4 py-3">开户行</th>
                              <th className="px-4 py-3">收款方账号</th>
                              <th className="px-4 py-3 text-right">应发金额</th>
                              <th className="px-4 py-3 text-right">实发金额</th>
                              <th className="px-4 py-3 text-right">订单金额</th>
                          </tr>
                      </thead>
                      <tbody>
                          {recipients.map((p, i) => (
                              <tr key={i} className="bg-white border-b last:border-b-0 hover:bg-gray-50">
                                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                                      {p.name}
                                      <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">{p.status}</span>
                                  </td>
                                  <td className="px-4 py-3">{p.id}</td>
                                  <td className="px-4 py-3">{p.phone}</td>
                                  <td className="px-4 py-3">{p.task}</td>
                                  <td className="px-4 py-3">{p.bank}</td>
                                  <td className="px-4 py-3">{p.accountNumber}</td>
                                  <td className="px-4 py-3 text-right">{p.amountDue.toFixed(2)}</td>
                                  <td className="px-4 py-3 text-right">{p.actualAmount.toFixed(2)}</td>
                                  <td className="px-4 py-3 text-right">{p.orderAmount.toFixed(2)}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
              <div className="flex justify-between items-center mt-4 text-sm">
                  <p className="text-gray-600">共 {recipients.length} 条记录</p>
                  <div className="inline-flex items-center">
                    <span className="text-gray-600 mr-4">10 条/页</span>
                    <div className="flex items-center space-x-1">
                        <button className="p-2 text-gray-500 rounded-md hover:bg-gray-100 disabled:opacity-50" disabled>
                            <Icon name="chevronLeft" className="w-4 h-4" />
                        </button>
                        <button className="px-3 py-1 bg-teal-500 text-white rounded-md text-xs font-semibold">1</button>
                        <button className="p-2 text-gray-500 rounded-md hover:bg-gray-100 disabled:opacity-50" disabled>
                            <Icon name="chevronRight" className="w-4 h-4" />
                        </button>
                    </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 space-y-6">
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center text-sm">
                        <span className="text-gray-600">账户可用余额</span>
                        <strong className="text-lg font-bold text-gray-900 mx-2">0.00 元</strong>
                        <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
                            <Icon name="refresh" className="w-4 h-4" />
                        </button>
                        <span className="w-px h-4 bg-gray-300 mx-4"></span>
                        <span className="text-gray-600">还需充值</span>
                        <strong className="text-lg font-bold text-red-600 mx-2">13826.80 元</strong>
                    </div>
                    <button className="px-5 py-2 text-sm font-medium border border-teal-500 text-teal-600 rounded-lg hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400">充值</button>
                </div>

                <div className="flex justify-end items-center">
                    <div className="flex items-center space-x-3">
                        <button onClick={onBack} className="px-5 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">返回列表</button>
                        <button className="px-8 py-2 text-sm font-medium bg-teal-500 text-white rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-sm">确认发放</button>
                        <button className="px-5 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">下载付款通知书</button>
                        <button className="px-5 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">下载支付明细</button>
                        <button className="px-5 py-2 text-sm font-medium border border-red-500 text-red-600 rounded-lg hover:bg-red-50">作废</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface MainContentProps {
  page: PageName;
  setPage: (page: PageName) => void;
}

const MainContent: React.FC<MainContentProps> = ({ page, setPage }) => {
    if (page === 'issuance') {
        return <IssuanceDetailsPage onBack={() => setPage('confirmation')} />;
    }
    
    return <BusinessConfirmationPage onNext={() => setPage('issuance')} />;
};

export default MainContent;