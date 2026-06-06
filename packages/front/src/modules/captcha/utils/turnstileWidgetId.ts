let turnstileWidgetId: string | undefined;

export const getTurnstileWidgetId = () => turnstileWidgetId;

export const setTurnstileWidgetId = (widgetId: string | undefined) => {
  turnstileWidgetId = widgetId;
};

export const resetTurnstileWidgetIdForTests = () => {
  turnstileWidgetId = undefined;
};
