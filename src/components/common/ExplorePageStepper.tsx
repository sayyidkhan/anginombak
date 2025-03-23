import React, { useEffect, useRef } from 'react';
import { Timeline } from 'primereact/timeline';

export interface CheckpointData {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  timestamp: string;
  location: string;
  media?: string[];
  mediaNames?: string[];
}

export interface StepData {
  label: string;
  content?: React.ReactNode;
}

interface ExplorePageStepperProps {
  steps: StepData[] | CheckpointData[];
  activeStep: number;
  expandedSteps: number[];
  onStepClick: (index: number) => void;
  renderStepContent?: (item: any, index: number, isExpanded: boolean, isActive: boolean) => React.ReactNode;
  renderStepMarker?: (item: any, index: number, isActive: boolean) => React.ReactNode;
  className?: string;
  isCheckpointData?: boolean;
}

const ExplorePageStepper: React.FC<ExplorePageStepperProps> = ({
  steps,
  activeStep,
  expandedSteps,
  onStepClick,
  renderStepContent,
  renderStepMarker,
  className = '',
  isCheckpointData = false
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);

  // Add custom CSS for the timeline
  useEffect(() => {
    // Add custom styles to make timeline take full width
    const style = document.createElement('style');
    style.textContent = `
      .custom-timeline .p-timeline-event-content {
        width: 100%;
        max-width: 100%;
      }
      .custom-timeline .p-timeline-event {
        width: 100%;
        display: flex;
      }
      .p-timeline .p-timeline-event-opposite {
        flex: 0;
        padding: 0 1rem;
      }
      .p-timeline .p-timeline-event-content {
        flex: 1;
      }
      
      /* Force the timeline to display properly with the first item at the top */
      .p-timeline {
        display: flex;
        flex-direction: column;
      }
      
      /* Ensure the first step is visible at the top */
      .p-timeline-event:first-child {
        margin-top: 0 !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Scroll to active step when component mounts or activeStep changes
  useEffect(() => {
    if (timelineRef.current) {
      // First, scroll to the top of the timeline to ensure we start from the beginning
      timelineRef.current.scrollTop = 0;
      
      // Then, if the active step is not the first one, scroll to it
      if (activeStep > 0) {
        const timelineItems = timelineRef.current.querySelectorAll('.p-timeline-event');
        if (timelineItems.length > 0 && activeStep < timelineItems.length) {
          const activeItem = timelineItems[activeStep] as HTMLElement;
          if (activeItem) {
            setTimeout(() => {
              activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300); // Small delay to ensure DOM is ready
          }
        }
      }
    }
  }, [activeStep, steps]);

  // Default step content renderer
  const defaultStepContentRenderer = (item: any, index: number, isExpanded: boolean, isActive: boolean) => {
    return (
      <div className={`p-4 border rounded-lg w-full ${
        isCheckpointData && (item as CheckpointData).completed ? 'bg-green-50 border-green-200' : 
        (isActive ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200')
      }`}>
        <div 
          className="w-full cursor-pointer"
          onClick={() => onStepClick(index)}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">
              {isCheckpointData ? (item as CheckpointData).title : (item as StepData).label}
            </h3>
            {isCheckpointData && (item as CheckpointData).completed && (
              <span className="text-sm text-green-600 flex items-center">
                <i className="pi pi-check-circle mr-1"></i>
                Completed at {formatDate((item as CheckpointData).timestamp)}
              </span>
            )}
            <i className={`pi ${isExpanded ? 'pi-chevron-up' : 'pi-chevron-down'} text-gray-500`}></i>
          </div>
          
          {isCheckpointData && (
            <div className="text-sm text-gray-500">
              <i className="pi pi-map-marker mr-1"></i>
              {(item as CheckpointData).location}
            </div>
          )}
        </div>
        
        {isExpanded && (
          <div className="mt-3 w-full">
            {isCheckpointData ? (
              <p className="text-gray-600 mb-2">{(item as CheckpointData).description}</p>
            ) : (
              (item as StepData).content
            )}
          </div>
        )}
      </div>
    );
  };

  // Default marker renderer
  const defaultMarkerRenderer = (item: any, index: number, isActive: boolean) => {
    if (isCheckpointData) {
      const checkpoint = item as CheckpointData;
      return (
        <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
          checkpoint.completed ? 'bg-green-500 text-white' : 
          (isActive ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-600')
        }`}>
          {checkpoint.id}
        </span>
      );
    } else {
      return (
        <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
          index <= activeStep ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-600'
        }`}>
          {index + 1}
        </span>
      );
    }
  };

  // Format date for display
  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Custom timeline item template
  const timelineItemTemplate = (item: any, index: number) => {
    const isExpanded = expandedSteps.includes(index);
    const isActive = index === activeStep;
    
    return renderStepContent 
      ? renderStepContent(item, index, isExpanded, isActive)
      : defaultStepContentRenderer(item, index, isExpanded, isActive);
  };
  
  // Custom timeline marker template
  const timelineMarkerTemplate = (item: any, index: number) => {
    const isActive = index === activeStep;
    
    return renderStepMarker
      ? renderStepMarker(item, index, isActive)
      : defaultMarkerRenderer(item, index, isActive);
  };

  return (
    <div className={`w-full ${className}`} ref={timelineRef}>
      <Timeline 
        value={steps} 
        content={(item, index) => timelineItemTemplate(item, index as number)}
        marker={(item, index) => timelineMarkerTemplate(item, index as number)}
        className="custom-timeline w-full"
      />
    </div>
  );
};

export default ExplorePageStepper;
