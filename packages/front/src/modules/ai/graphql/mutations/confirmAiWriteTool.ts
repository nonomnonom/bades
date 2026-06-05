import { gql } from '@apollo/client';

export const CONFIRM_AI_WRITE_TOOL = gql`
  mutation ConfirmAiWriteTool($toolName: String!, $arguments: JSON!) {
    confirmAiWriteTool(toolName: $toolName, arguments: $arguments)
  }
`;
