import React from 'react';

export interface SimpleStepData {
  label: string;
  content?: React.ReactNode;
}

interface SimpleStepperProps {
  steps: SimpleStepData[];
  activeStep: number;
  expandedSteps: number[];
  onStepClick: (index: number) => void;
  className?: string;
}

const SimpleStepper: React.FC<SimpleStepperProps> = ({
  steps,
  activeStep,
  expandedSteps,
  onStepClick,
  className = ''
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {/* Progress steps */}
      <div className="flex mb-4 relative w-full overflow-x-auto pb-4">
        {/* Progress line */}
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
        
        {/* Container for evenly spaced steps */}
        <div className={`grid w-full gap-1`} style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
          {steps.map((step, index) => (
            <div 
              key={step.label} 
              className="flex flex-col items-center cursor-pointer px-1"
              onClick={() => onStepClick(index)}
            >
              {/* Circle indicator */}
              <div 
                className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center mb-1 md:mb-2
                  ${index <= activeStep 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }
                  ${index < activeStep ? 'ring-2 ring-indigo-300' : ''}
                `}
              >
                {index + 1}
              </div>
              
              {/* Step label */}
              <span className={`text-[10px] md:text-xs text-center ${index <= activeStep ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Step content */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[150px]">
        {steps.map((step, index) => (
          expandedSteps.includes(index) && (
            <div key={`step-content-${index}`}>
              {step.content}
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default SimpleStepper;
