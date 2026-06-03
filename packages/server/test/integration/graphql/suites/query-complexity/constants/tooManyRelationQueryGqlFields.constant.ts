export const TOO_MANY_RELATION_QUERY_GQL_FIELDS = `
    id
    city
    jobTitle
    avatarUrl
    intro
    searchVector
    keluarga {
      id
      name
    }
    noteTargets {
      edges {
        node {
          id
          note {
            id
          }
        }
      }
    }
    taskTargets {
      edges {
        node {
          id
        }
      }
    }
    attachments {
      edges {
        node {
          id
        }
      }
    }
    messageParticipants {
      edges {
        node {
          id
        }
      }
    }
    calendarEventParticipants {
      edges {
        node {
          id
        }
      }
    }
    timelineActivities {
      edges {
        node {
          id
        }
      }
    }
`;
