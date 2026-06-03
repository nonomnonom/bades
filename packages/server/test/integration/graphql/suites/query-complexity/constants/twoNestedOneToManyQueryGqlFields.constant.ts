export const TWO_NESTED_ONE_TO_MANY_QUERY_GQL_FIELDS = `
  id
  taskTargets {
    edges {
      node {
        id
        attachments {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
`;
