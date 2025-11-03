
import React from 'react';
import { Step } from '../types';
import { CheckCircleIconSolid } from './Icons';

const Stepper: React.FC<{ steps: Step[] }> = ({ steps }) => {
  return (
    <div className="w-full">
      <div className="flex items-start">
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          const isLastStep = index === steps.length - 1;

          return (
            <React.Fragment key={step.name}>
              <div className="flex flex-col items-center text-center w-28 flex-shrink-0">
                {isCompleted ? (
                    <CheckCircleIconSolid className="w-10 h-10 text-teal-500" />
                ) : (
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                        isCurrent ? 'border-teal-500 text-teal-500' : 'border-gray-300 text-gray-400'
                    }`}>
                        <step.icon className="w-5 h-5" />
                    </div>
                )}
                <p className={`mt-2 text-sm font-medium ${
                    isCurrent ? 'text-teal-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </p>
              </div>

              {!isLastStep && (
                <div className={`flex-auto border-t-2 mt-5 transition-colors duration-500 mx-4 ${
                    isCompleted ? 'border-teal-500' : 'border-gray-300'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
