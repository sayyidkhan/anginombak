import React from 'react';

interface StepperProps {
  currentStep: number;
  steps: {
    label: string;
    description?: string;
  }[];
}

const Stepper: React.FC<StepperProps> = ({ currentStep, steps }) => {
  return (
    <div className="mb-6">
      <div className="relative flex items-center justify-between py-4">
        {/* Horizontal line */}
        <div className="absolute h-0.5 bg-gray-300 left-0 right-0"></div>
        
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center z-10">
            {index === 0 || index === steps.length - 1 || index === currentStep - 1 ? (
              // Larger circle for first, last, and current step
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 ${
                index < currentStep ? 'bg-cyan-500 text-white' : 'bg-white border-2 border-gray-300'
              }`}>
                {index === 0 ? (
                  // First step icon (person)
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ) : index === steps.length - 1 ? (
                  // Last step icon (checkmark)
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  // Current step number
                  <span className="text-lg font-medium">{index + 1}</span>
                )}
              </div>
            ) : (
              // Smaller circle for other steps
              <div className={`w-6 h-6 rounded-full mb-1 ${
                index < currentStep ? 'bg-cyan-500' : 'bg-white border-2 border-gray-300'
              }`}></div>
            )}
            <div className={`text-center text-sm font-medium ${
              index === currentStep - 1 ? 'text-cyan-600' : 'text-gray-500'
            }`}>
              {step.label}
            </div>
            {step.description && (
              <div className="text-center text-xs text-gray-500">{step.description}</div>
            )}
            {index > 0 && index < steps.length - 1 && (
              <div className="text-xs mt-1 text-gray-400">Step {index + 1}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
