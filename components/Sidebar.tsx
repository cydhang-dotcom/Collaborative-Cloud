
import React, { useState } from 'react';
import { Icon } from './Icons';

// FIX: Made the `icon` prop optional to support sub-links without icons.
const NavLink: React.FC<{ icon?: React.ReactNode; text: string; active?: boolean; hasNotification?: boolean }> = ({ icon, text, active = false, hasNotification = false }) => (
  <a href="#" className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors duration-200 ${active ? 'text-teal-500 bg-teal-50' : 'text-gray-600 hover:bg-gray-100'}`}>
    {icon}
    {/* FIX: Conditionally apply margin to the left of the text only if an icon is present. */}
    <span className={icon ? "ml-3" : ""}>{text}</span>
    {hasNotification && <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>}
  </a>
);

// FIX: Made the `children` prop optional to allow for collapsible links that don't have any sub-links yet.
const CollapsibleLink: React.FC<{ icon: React.ReactNode; text: string; children?: React.ReactNode; defaultOpen?: boolean; }> = ({ icon, text, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center w-full px-4 py-3 text-sm text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none">
        {icon}
        <span className="ml-3">{text}</span>
        <span className="ml-auto">
            {isOpen ? <Icon name="chevronUp" className="w-4 h-4" /> : <Icon name="chevronDown" className="w-4 h-4" />}
        </span>
      </button>
      {isOpen && (
        <div className="pl-8 space-y-1 mt-1">
          {children}
        </div>
      )}
    </div>
  );
};


const Sidebar: React.FC = () => {
  return (
    <aside className="w-60 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-800">班步协作 云平台</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        <NavLink icon={<Icon name="home" className="w-5 h-5" />} text="工作台" />
        <CollapsibleLink icon={<Icon name="dollar" className="w-5 h-5" />} text="业务订单" defaultOpen={true}>
            <NavLink text="业务确认" active={true} />
            <NavLink text="发放状态" hasNotification={true} />
            <NavLink text="发放流水" />
        </CollapsibleLink>
        <CollapsibleLink icon={<Icon name="grid" className="w-5 h-5" />} text="外包信息">
            {/* Add sub-links here if needed */}
        </CollapsibleLink>
        <CollapsibleLink icon={<Icon name="mail" className="w-5 h-5" />} text="合规信息">
            {/* Add sub-links here if needed */}
        </CollapsibleLink>
        <CollapsibleLink icon={<Icon name="userGroup" className="w-5 h-5" />} text="账户信息">
            {/* Add sub-links here if needed */}
        </CollapsibleLink>
      </nav>
      <div className="px-6 py-4 text-sm text-gray-500">
        上海云才-协作
      </div>
    </aside>
  );
};

export default Sidebar;