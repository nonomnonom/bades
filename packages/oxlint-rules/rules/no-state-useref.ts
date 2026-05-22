import { defineRule } from '@oxlint/plugins';

export const RULE_NAME = 'bades/no-state-useref';

export const rule = defineRule({
  meta: {
    docs: {
      description: "Don't use useRef for state management",
    },
    messages: {
      test: 'test',
      noStateUseRef:
        "Jangan gunakan useRef untuk mengelola state. Lihat https://bades.id/docs/frontend/best-practices#do-not-use-useref-to-store-state untuk detailnya.",
    },
    type: 'suggestion',
    schema: [],
  },
  create: (context) => {
    return {
      CallExpression: (node: any) => {
        if (
          node.callee?.type !== 'Identifier' ||
          node.callee.name !== 'useRef'
        )
          return;

        const typeParam = node.typeArguments?.params[0];

        if (
          !typeParam ||
          typeParam.type !== 'TSTypeReference' ||
          typeParam.typeName?.type !== 'Identifier' ||
          !typeParam.typeName.name.match(/^(HTML.*Element|Element)$/)
        ) {
          context.report({
            node,
            messageId: 'noStateUseRef',
          });
          return;
        }
      },
    };
  },
});
