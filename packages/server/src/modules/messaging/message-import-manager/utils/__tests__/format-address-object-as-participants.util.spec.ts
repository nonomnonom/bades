import { MessageParticipantRole } from 'shared/types';

import { formatAddressObjectAsParticipants } from 'src/modules/messaging/message-import-manager/utils/format-address-object-as-participants.util';

describe('formatAddressObjectAsParticipants', () => {
  it('should format address object as participants', () => {
    const addresses = [
      { name: 'Budi Santoso', address: 'budi.santoso @bades.id' },
      { name: 'Siti Maryam', address: 'siti.maryam@bades.id ' },
    ];

    const result = formatAddressObjectAsParticipants(
      addresses,
      MessageParticipantRole.FROM,
    );

    expect(result).toEqual([
      {
        role: MessageParticipantRole.FROM,
        handle: 'budi.santoso@bades.id',
        displayName: 'Budi Santoso',
      },
      {
        role: MessageParticipantRole.FROM,
        handle: 'siti.maryam@bades.id',
        displayName: 'Siti Maryam',
      },
    ]);
  });

  it('should return an empty array if address object handle has no @', () => {
    const addressObject = {
      name: 'Budi Santoso',
      address: 'budi.santoso',
    };

    const result = formatAddressObjectAsParticipants(
      [addressObject],
      MessageParticipantRole.TO,
    );

    expect(result).toEqual([]);
  });

  it('should return an empty array if address object handle is empty', () => {
    const addressObject = {
      name: 'Budi Santoso',
      address: '',
    };

    const result = formatAddressObjectAsParticipants(
      [addressObject],
      MessageParticipantRole.TO,
    );

    expect(result).toEqual([]);
  });

  it('should return a lowewrcase handle if the handle is not lowercase', () => {
    const addressObject = {
      name: 'Budi Santoso',
      address: 'Budi.Santoso@bades.id',
    };

    const result = formatAddressObjectAsParticipants(
      [addressObject],
      MessageParticipantRole.TO,
    );

    expect(result).toEqual([
      {
        role: MessageParticipantRole.TO,
        handle: 'budi.santoso@bades.id',
        displayName: 'Budi Santoso',
      },
    ]);
  });
});
