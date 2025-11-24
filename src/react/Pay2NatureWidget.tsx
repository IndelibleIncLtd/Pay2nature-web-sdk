/**
 * React Component Wrapper for Pay2Nature Widget
 */

import React, { useEffect, useRef } from 'react';
import { Pay2NatureWidget, Pay2NatureWidgetOptions, ContributionData } from '../core/Pay2NatureWidget';

export interface Pay2NatureWidgetProps {
  widgetToken: string;
  baseUrl: string;
  containerId?: string;
  onContribution?: (data: ContributionData) => void;
  onToggle?: (isEnabled: boolean) => void;
  onError?: (error: Error) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Pay2NatureWidgetComponent: React.FC<Pay2NatureWidgetProps> = ({
  widgetToken,
  baseUrl,
  containerId = 'pay2nature-widget',
  onContribution,
  onToggle,
  onError,
  className,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetInstanceRef = useRef<Pay2NatureWidget | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const options: Pay2NatureWidgetOptions = {
      widgetToken,
      baseUrl,
      container: containerRef.current,
      onContribution,
      onToggle,
      onError,
    };

    widgetInstanceRef.current = new Pay2NatureWidget(options);

    return () => {
      if (widgetInstanceRef.current) {
        widgetInstanceRef.current.destroy();
        widgetInstanceRef.current = null;
      }
    };
  }, [widgetToken, baseUrl, onContribution, onToggle, onError]);

  return (
    <div
      id={containerId}
      ref={containerRef}
      className={className}
      style={style}
    />
  );
};

export default Pay2NatureWidgetComponent;

