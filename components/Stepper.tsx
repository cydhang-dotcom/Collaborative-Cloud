import React from 'react';
import { Step } from '../types';
import { Icon } from './Icons';

const Stepper: React.FC<{ steps: Step[] }> = ({ steps }) => {
  return (
    <div className="w-full">
      <div className="flex items-start">
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          const isUpcoming = step.status === 'upcoming';
          const isLastStep = index === steps.length - 1;

          const isActive = isCompleted || isCurrent;

          const circleClasses = isActive 
            ? 'bg-teal-500 text-white' 
            : 'bg-gray-200 text-gray-400';

          const textClasses = isActive 
            ? `text-gray-800 ${isCurrent ? 'font-bold' : 'font-medium'}`
            : 'text-gray-500';
          
          const lineClasses = isCompleted ? 'border-teal-500' : 'border-gray-200';

          return (
            <React.Fragment key={step.name}>
              <div className="flex flex-col items-center text-center w-28 md:w-36 flex-shrink-0">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-500 ${circleClasses}`}>
                   <Icon name={step.icon} className="w-5 h-5" />
                </div>
                <p className={`mt-2 text-sm ${textClasses}`}>
                  {step.name}
                </p>
              </div>

              {!isLastStep && (
                <div className={`flex-auto border-t-2 mt-5 transition-colors duration-500 mx-2 md:mx-4 ${lineClasses}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;