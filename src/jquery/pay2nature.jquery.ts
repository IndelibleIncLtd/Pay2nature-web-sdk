/**
 * jQuery Plugin Wrapper for Pay2Nature Widget
 */

import { Pay2NatureWidget, Pay2NatureWidgetOptions, ContributionData } from '../core/Pay2NatureWidget';

declare global {
  interface JQuery {
    pay2nature(options: Pay2NatureWidgetOptions): JQuery;
    pay2nature(method: 'destroy'): JQuery;
  }
}

(function ($: any) {
  'use strict';

  const PLUGIN_NAME = 'pay2nature';
  const DATA_KEY = `plugin_${PLUGIN_NAME}`;

  interface Pay2NaturePluginData {
    instance: Pay2NatureWidget;
  }

  $.fn[PLUGIN_NAME] = function (
    optionsOrMethod: Pay2NatureWidgetOptions | string,
    ...args: any[]
  ): JQuery {
    return this.each(function () {
      const $element = $(this);
      let data = $element.data(DATA_KEY) as Pay2NaturePluginData | undefined;

      // Handle method calls
      if (typeof optionsOrMethod === 'string') {
        const method = optionsOrMethod;
        if (method === 'destroy') {
          if (data && data.instance) {
            data.instance.destroy();
            $element.removeData(DATA_KEY);
          }
        }
        return;
      }

      // Handle initialization
      const options = optionsOrMethod as Pay2NatureWidgetOptions;

      // Destroy existing instance if any
      if (data && data.instance) {
        data.instance.destroy();
      }

      // Create new instance
      const instance = new Pay2NatureWidget({
        ...options,
        container: this as HTMLElement,
      });

      // Store instance
      $element.data(DATA_KEY, { instance });
    });
  };
})(typeof window !== 'undefined' && (window as any).jQuery);

