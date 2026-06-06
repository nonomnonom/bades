import { captchaTokenState } from '@/captcha/states/captchaTokenState';
import { isRequestingCaptchaTokenState } from '@/captcha/states/isRequestingCaptchaTokenState';
import { isCaptchaRequiredForPath } from '@/captcha/utils/isCaptchaRequiredForPath';
import {
  getTurnstileWidgetId,
  setTurnstileWidgetId,
} from '@/captcha/utils/turnstileWidgetId';
import { captchaState } from '@/client-config/states/captchaState';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import { useCallback } from 'react';
import { assertIsDefinedOrThrow, isDefined } from 'shared/utils';
import { CaptchaDriverType } from '~/generated-metadata/graphql';
import { useStore } from 'jotai';

export const useRequestFreshCaptchaToken = () => {
  const store = useStore();
  const setCaptchaToken = useSetAtomState(captchaTokenState);
  const setIsRequestingCaptchaToken = useSetAtomState(
    isRequestingCaptchaTokenState,
  );

  const requestFreshCaptchaToken = useCallback(async () => {
    if (!isCaptchaRequiredForPath(window.location.pathname)) {
      return;
    }

    const captcha = store.get(captchaState.atom);

    if (!isDefined(captcha)) {
      return;
    }

    assertIsDefinedOrThrow(captcha);

    setIsRequestingCaptchaToken(true);

    switch (captcha.provider) {
      case CaptchaDriverType.GOOGLE_RECAPTCHA:
        window.grecaptcha
          .execute(captcha.siteKey, {
            action: 'submit',
          })
          .then((token: string) => {
            setCaptchaToken(token);
            setIsRequestingCaptchaToken(false);
          });
        break;
      case CaptchaDriverType.TURNSTILE:
        window.turnstile.ready(() => {
          const existingWidgetId = getTurnstileWidgetId();

          if (existingWidgetId === undefined) {
            const widgetId = window.turnstile.render('#captcha-widget', {
              sitekey: captcha.siteKey,
              size: 'invisible',
              callback: (token: string) => {
                setCaptchaToken(token);
                setIsRequestingCaptchaToken(false);
              },
              'error-callback': () => {
                setIsRequestingCaptchaToken(false);
              },
              'expired-callback': () => {
                setCaptchaToken(undefined);
              },
            });

            setTurnstileWidgetId(widgetId);
            return;
          }

          window.turnstile.reset(existingWidgetId);
          window.turnstile.execute(existingWidgetId);
        });
        break;
    }
  }, [setCaptchaToken, setIsRequestingCaptchaToken, store]);

  return { requestFreshCaptchaToken };
};
