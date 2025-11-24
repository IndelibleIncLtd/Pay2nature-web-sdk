<template>
  <div :id="containerId" ref="containerRef" :class="className" :style="style"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { Pay2NatureWidget, Pay2NatureWidgetOptions, ContributionData } from '../core/Pay2NatureWidget';

export default defineComponent({
  name: 'Pay2NatureWidget',
  props: {
    widgetToken: {
      type: String,
      required: true,
    },
    baseUrl: {
      type: String,
      required: true,
    },
    containerId: {
      type: String,
      default: 'pay2nature-widget',
    },
    onContribution: {
      type: Function as () => (data: ContributionData) => void,
      default: undefined,
    },
    onToggle: {
      type: Function as () => (isEnabled: boolean) => void,
      default: undefined,
    },
    onError: {
      type: Function as () => (error: Error) => void,
      default: undefined,
    },
    className: {
      type: String,
      default: '',
    },
    style: {
      type: Object as () => Record<string, string>,
      default: () => ({}),
    },
  },
  setup(props) {
    const containerRef = ref<HTMLElement | null>(null);
    let widgetInstance: Pay2NatureWidget | null = null;

    const initializeWidget = () => {
      if (!containerRef.value) return;

      const options: Pay2NatureWidgetOptions = {
        widgetToken: props.widgetToken,
        baseUrl: props.baseUrl,
        container: containerRef.value,
        onContribution: props.onContribution,
        onToggle: props.onToggle,
        onError: props.onError,
      };

      widgetInstance = new Pay2NatureWidget(options);
    };

    onMounted(() => {
      initializeWidget();
    });

    onBeforeUnmount(() => {
      if (widgetInstance) {
        widgetInstance.destroy();
        widgetInstance = null;
      }
    });

    watch(
      () => [props.widgetToken, props.baseUrl],
      () => {
        if (widgetInstance) {
          widgetInstance.destroy();
        }
        initializeWidget();
      }
    );

    return {
      containerRef,
    };
  },
});
</script>

