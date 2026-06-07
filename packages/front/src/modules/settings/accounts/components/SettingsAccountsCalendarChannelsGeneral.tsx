import { CalendarMonthCard } from '@/activities/calendar/components/CalendarMonthCard';
import { CalendarContext } from '@/activities/calendar/contexts/CalendarContext';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { SettingsAccountsCalendarDisplaySettings } from '@/settings/accounts/components/SettingsAccountsCalendarDisplaySettings';
import { styled } from '@linaria/react';
import { Section } from '@react-email/components';
import { addMinutes, endOfDay, min, startOfDay } from 'date-fns';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { H2Title } from 'ui/display';
import { themeCssVariables } from 'ui/theme-constants';
import { CalendarChannelVisibility } from '@/accounts/types/CalendarChannel';
import { type TimelineCalendarEvent } from '@/activities/calendar/types/TimelineCalendarEvent';

const StyledGeneralContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[6]};
  padding-top: ${themeCssVariables.spacing[6]};
`;

export const SettingsAccountsCalendarChannelsGeneral = () => {
  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);

  const exampleStartDate = new Date();
  const exampleEndDate = min([
    addMinutes(exampleStartDate, 30),
    endOfDay(exampleStartDate),
  ]);
  const exampleDayTime = startOfDay(exampleStartDate).getTime();
  const exampleCalendarEvent: TimelineCalendarEvent = {
    id: '',
    participants: [
      {
        firstName: currentWorkspaceMember?.name.firstName || '',
        lastName: currentWorkspaceMember?.name.lastName || '',
        displayName: currentWorkspaceMember
          ? [
              currentWorkspaceMember.name.firstName,
              currentWorkspaceMember.name.lastName,
            ].join(' ')
          : '',
        avatarUrl: currentWorkspaceMember?.avatarUrl || '',
        handle: '',
        personId: '',
        workspaceMemberId: currentWorkspaceMember?.id || '',
      },
    ],
    endsAt: exampleEndDate.toISOString(),
    isFullDay: false,
    startsAt: exampleStartDate.toISOString(),
    conferenceSolution: '',
    conferenceLink: {
      primaryLinkLabel: '',
      primaryLinkUrl: '',
    },
    description: '',
    isCanceled: false,
    location: '',
    title: `Rapat orientasi`,
    visibility: CalendarChannelVisibility.SHARE_EVERYTHING,
  };

  return (
    <StyledGeneralContainer>
      <Section>
        <H2Title
          title={`Tampilan`}
          description={`Atur bagaimana acara Anda ditampilkan di kalender`}
        />
        <SettingsAccountsCalendarDisplaySettings />
      </Section>
      <Section>
        <H2Title
          title={`Kode warna`}
          description={`Acara yang Anda ikuti ditampilkan dengan warna merah.`}
        />
        <CalendarContext.Provider
          value={{
            calendarEventsByDayTime: {
              [exampleDayTime]: [exampleCalendarEvent],
            },
          }}
        >
          <CalendarMonthCard dayTimes={[exampleDayTime]} />
        </CalendarContext.Provider>
      </Section>
    </StyledGeneralContainer>
  );
};
