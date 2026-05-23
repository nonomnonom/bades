import { Injectable } from '@nestjs/common';

import { USER_SIGNUP_EVENT_NAME } from 'src/engine/api/graphql/workspace-query-runner/constants/user-signup-event-name.constants';
import { TelemetryEventType } from 'src/engine/core-modules/telemetry/telemetry-event.type';

type TelemetrySignUpEvent = {
  action: typeof USER_SIGNUP_EVENT_NAME;
  events: TelemetryEventType[];
};

type TelemetryEventPayload = TelemetrySignUpEvent;

@Injectable()
export class TelemetryService {
  // Telemetry remote eksternal sengaja dilumpuhkan di Bades.
  // Bades adalah SaaS swasta terkelola — tidak mengirim event ke endpoint
  // self-hosting upstream. Service ini sengaja jadi no-op agar pemanggil
  // existing (USER_SIGNUP_EVENT_NAME dll) tetap aman tanpa side effect.
  async publish(_payload: TelemetryEventPayload) {
    return { success: true };
  }
}
