import { isDefined } from 'shared/utils';

export const dispatchBrowserEvent = <T>(eventName: string, detail?: T) => {
  if (isDefined(detail)) {
    window.dispatchEvent(new CustomEvent<T>(eventName, { detail }));
  } else {
    window.dispatchEvent(new CustomEvent(eventName));
  }
};
