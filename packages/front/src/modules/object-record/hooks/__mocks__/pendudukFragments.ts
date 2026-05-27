// Intermediate state: fragment ini mencerminkan field aktual yang masih ada di
// `mock-objects-metadata.ts` (warisan schema Penduduk). Saat seed Bades
// SID lengkap (NIK, KK, nama lengkap, alamat, RT/RW, dst.) sudah selesai, mock
// metadata akan diregenerasi via `packages/front/scripts/generate-mock-data.ts`
// dan file ini ikut diperbarui dari field SID resmi.
export const PENDUDUK_FRAGMENT_WITH_DEPTH_ZERO_RELATIONS = `
      __typename
      avatarFile {
        fileId
        label
        extension
        url
      }
      avatarUrl
      city
      createdAt
      createdBy {
        source
        workspaceMemberId
        name
        context
      }
      deletedAt
      emails {
        primaryEmail
        additionalEmails
      }
      id
      intro
      jobTitle
      keluargaId
      linkedinLink {
        primaryLinkUrl
        primaryLinkLabel
        secondaryLinks
      }
      name {
        firstName
        lastName
      }
      performanceRating
      phones {
        primaryPhoneNumber
        primaryPhoneCountryCode
        primaryPhoneCallingCode
        additionalPhones
      }
      position
      updatedAt
      updatedBy {
        source
        workspaceMemberId
        name
        context
      }
      whatsapp {
        primaryPhoneNumber
        primaryPhoneCountryCode
        primaryPhoneCallingCode
        additionalPhones
      }
      workPreference
      xLink {
        primaryLinkUrl
        primaryLinkLabel
        secondaryLinks
      }
`;

export const PENDUDUK_FRAGMENT_WITH_DEPTH_ONE_RELATIONS = `
      __typename
      attachments {
        edges {
          node {
            __typename
            id
            name
          }
        }
      }
      avatarFile {
        fileId
        label
        extension
        url
      }
      avatarUrl
      calendarEventParticipants {
        edges {
          node {
            __typename
            handle
            id
          }
        }
      }
      caredForPets {
        edges {
          node {
            __typename
            id
            pet {
              __typename
              id
              name
            }
          }
        }
      }
      city
      createdAt
      createdBy {
        source
        workspaceMemberId
        name
        context
      }
      deletedAt
      emails {
        primaryEmail
        additionalEmails
      }
      id
      intro
      jobTitle
      keluarga {
        __typename
        id
        name
      }
      keluargaId
      linkedinLink {
        primaryLinkUrl
        primaryLinkLabel
        secondaryLinks
      }
      messageParticipants {
        edges {
          node {
            __typename
            handle
            id
          }
        }
      }
      name {
        firstName
        lastName
      }
      noteTargets {
        edges {
          node {
            __typename
            id
            note {
              __typename
              id
              title
            }
          }
        }
      }
      performanceRating
      phones {
        primaryPhoneNumber
        primaryPhoneCountryCode
        primaryPhoneCallingCode
        additionalPhones
      }
      pointOfContactForOpportunities {
        edges {
          node {
            __typename
            id
            name
          }
        }
      }
      position
      previousCompanies {
        edges {
          node {
            __typename
            id
            keluarga {
              __typename
              id
              name
            }
          }
        }
      }
      taskTargets {
        edges {
          node {
            __typename
            id
            task {
              __typename
              id
              title
            }
          }
        }
      }
      timelineActivities {
        edges {
          node {
            __typename
            id
            name
          }
        }
      }
      updatedAt
      updatedBy {
        source
        workspaceMemberId
        name
        context
      }
      whatsapp {
        primaryPhoneNumber
        primaryPhoneCountryCode
        primaryPhoneCallingCode
        additionalPhones
      }
      workPreference
      xLink {
        primaryLinkUrl
        primaryLinkLabel
        secondaryLinks
      }
`;
