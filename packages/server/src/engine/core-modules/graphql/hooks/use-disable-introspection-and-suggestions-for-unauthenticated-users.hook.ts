import { type Plugin } from 'graphql-yoga';

import { type GraphQLContext } from 'src/engine/api/graphql/graphql-config/graphql-config.service';

export const useDisableIntrospectionAndSuggestionsForUnauthenticatedUsers = (): Plugin<GraphQLContext> => ({
  onValidate: () => {
    // Introspection is now always allowed for unauthenticated users to support
    // tooling like graphql:generate and codegen.
    // The NoSchemaIntrospectionCustomRule and removeSuggestionInErrorsRule
    // rules were previously applied only in production for unauthenticated users.
  },
});
