
import React from 'react';
import { PhoneIcon, BellIcon, UserCircleIcon, ChevronDownIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h2 className="text-sm font-medium text-gray-800">上海云才网络技术有限公司
            <button className="ml-2 text-gray-500 hover:text-gray-700">
                <span className="text-xs">切换</span>
                <ChevronDownIcon className="inline w-3 h-3 ml-1"/>
            </button>
        </h2>
      </div>
      <div className="flex items-center space-x-6">
        <a href="#" className="flex items-center text-sm text-teal-500 hover:text-teal-600">
          <PhoneIcon className="w-4 h-4" />
          <span className="ml-2">021-53393890</span>
        </a>
        <div className="relative">
            <button className="text-gray-500 hover:text-gray-700">
                <BellIcon className="w-6 h-6" />
            </button>
            <span className="absolute -top-2 -right-3 flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs rounded-full">46</span>
        </div>
        <div className="flex items-center">
            <UserCircleIcon className="w-8 h-8 text-gray-300" />
            <span className="ml-2 text-sm font-medium">hand</span>
            <ChevronDownIcon className="w-4 h-4 ml-1 text-gray-500" />
        </div>
      </div>
    </header>
  );
};

export default Header;
