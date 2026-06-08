import { useRequestFreshCaptchaToken } from '@/captcha/hooks/useRequestFreshCaptchaToken';
import { isCaptchaScriptLoadedState } from '@/captcha/states/isCaptchaScriptLoadedState';
import { getCaptchaUrlByProvider } from '@/captcha/utils/getCaptchaUrlByProvider';
import { isCaptchaRequiredForPath } from '@/captcha/utils/isCaptchaRequiredForPath';
import { useCaptcha } from '@/client-config/hooks/useCaptcha';
import { captchaState } from '@/client-config/states/captchaState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { assertIsDefinedOrThrow, isDefined } from 'shared/utils';
import { CaptchaDriverType } from '~/generated-metadata/graphql';

export const CaptchaProviderScriptLoaderEffect = () => {
  const captcha = useAtomStateValue(captchaState);
  const setIsCaptchaScriptLoaded = useSetAtomState(isCaptchaScriptLoadedState);
  const { isCaptchaScriptLoaded, isCaptchaConfigured } = useCaptcha();
  const { requestFreshCaptchaToken } = useRequestFreshCaptchaToken();
  const location = useLocation();
  const pathnameRef = useRef(location.pathname);

  pathnameRef.current = location.pathname;

  useEffect(() => {
    if (
      !captcha?.provider ||
      !captcha.siteKey ||
      !isCaptchaRequiredForPath(pathnameRef.current)
    ) {
      return;
    }

    const scriptUrl = getCaptchaUrlByProvider(
      captcha.provider,
      captcha.siteKey,
    );
    if (!scriptUrl) {
      return;
    }

    const scriptSelector =
      captcha.provider === CaptchaDriverType.TURNSTILE
        ? 'script[src*="challenges.cloudflare.com/turnstile/v0/api.js"]'
        : `script[src="${scriptUrl}"]`;

    let scriptElement: HTMLScriptElement | null =
      document.querySelector(scriptSelector);

    if (scriptElement !== null && scriptElement.src !== scriptUrl) {
      scriptElement.remove();
      scriptElement = null;
      setIsCaptchaScriptLoaded(false);
    }

    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.src = scriptUrl;
      if (captcha.provider === CaptchaDriverType.TURNSTILE) {
        // Script dinamis default-nya async; Turnstile explicit mode tidak boleh async/defer.
        scriptElement.async = false;
      }
      scriptElement.onload = () => {
        if (captcha.provider === CaptchaDriverType.GOOGLE_RECAPTCHA) {
          window.grecaptcha?.ready(() => {
            setIsCaptchaScriptLoaded(true);
          });
        } else {
          setIsCaptchaScriptLoaded(true);
        }
      };
      document.body.appendChild(scriptElement);
    } else if (
      captcha.provider === CaptchaDriverType.TURNSTILE &&
      isDefined(window.turnstile)
    ) {
      setIsCaptchaScriptLoaded(true);
    } else if (
      captcha.provider === CaptchaDriverType.GOOGLE_RECAPTCHA &&
      isDefined(window.grecaptcha)
    ) {
      window.grecaptcha.ready(() => {
        setIsCaptchaScriptLoaded(true);
      });
    }
  }, [
    captcha?.provider,
    captcha?.siteKey,
    setIsCaptchaScriptLoaded,
    location.pathname,
  ]);

  useEffect(() => {
    if (!isCaptchaConfigured || !isCaptchaScriptLoaded) {
      return;
    }

    assertIsDefinedOrThrow(captcha);

    let refreshInterval: NodeJS.Timeout;

    switch (captcha.provider) {
      case CaptchaDriverType.GOOGLE_RECAPTCHA:
        // Google reCAPTCHA tokens expire after 120 seconds, refresh at 110 seconds
        refreshInterval = setInterval(requestFreshCaptchaToken, 110 * 1000);
        break;
      case CaptchaDriverType.TURNSTILE:
        // Cloudflare Turnstile tokens expire after 300 seconds, refresh at 250 seconds
        refreshInterval = setInterval(requestFreshCaptchaToken, 250 * 1000);
        break;
      default:
        // Note: hCaptcha has a callback system for expiration that we're not implementing now
        return;
    }

    return () => clearInterval(refreshInterval);
  }, [
    captcha,
    captcha?.provider,
    isCaptchaConfigured,
    isCaptchaScriptLoaded,
    requestFreshCaptchaToken,
  ]);

  return <></>;
};
