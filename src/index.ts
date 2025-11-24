/**
 * Pay2Nature Widget SDK
 * Universal SDK for integrating Pay2Nature widgets into any web application
 */

// Core widget class
export { Pay2NatureWidget } from './core/Pay2NatureWidget';
export type {
  Pay2NatureWidgetOptions,
  ContributionData,
  WidgetConfig,
} from './core/Pay2NatureWidget';

// React component
export { Pay2NatureWidgetComponent } from './react/Pay2NatureWidget';
export type { Pay2NatureWidgetProps } from './react/Pay2NatureWidget';

// jQuery plugin is available via separate import
// Import '@pay2nature/widget-sdk/jquery' to register the plugin

// Default export for convenience
import { Pay2NatureWidget } from './core/Pay2NatureWidget';
export default Pay2NatureWidget;

