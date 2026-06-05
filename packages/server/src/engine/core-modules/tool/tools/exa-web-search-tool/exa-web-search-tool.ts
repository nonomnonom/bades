import { Injectable } from '@nestjs/common';

import Exa from 'exa-js';

import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';
import { ExaWebSearchInputZodSchema } from 'src/engine/core-modules/tool/tools/exa-web-search-tool/exa-web-search-tool.schema';
import { type ToolInput } from 'src/engine/core-modules/tool/types/tool-input.type';
import { type ToolOutput } from 'src/engine/core-modules/tool/types/tool-output.type';
import { type ToolExecutionContext } from 'src/engine/core-modules/tool/types/tool-execution-context.type';
import { type Tool } from 'src/engine/core-modules/tool/types/tool.type';

export const EXA_WEB_SEARCH_TOOL_NAME = 'app_exa_web_search';

@Injectable()
export class ExaWebSearchTool implements Tool {
  description =
    'Search the web for current information using Exa neural search. Use for research, fact-checking, and finding external references.';

  inputSchema = ExaWebSearchInputZodSchema;

  constructor(private readonly badesConfigService: BadesConfigService) {}

  isEnabled(): boolean {
    return Boolean(this.badesConfigService.get('EXA_API_KEY'));
  }

  async execute(
    parameters: ToolInput,
    _context: ToolExecutionContext,
  ): Promise<ToolOutput> {
    const { query, numResults } = parameters;
    const apiKey = this.badesConfigService.get('EXA_API_KEY');

    if (!apiKey) {
      return {
        success: false,
        message: 'Pencarian web belum dikonfigurasi (EXA_API_KEY tidak ada).',
        error: 'EXA_API_KEY_NOT_CONFIGURED',
      };
    }

    try {
      const exa = new Exa(apiKey);
      const result = await exa.search(String(query), {
        numResults: typeof numResults === 'number' ? numResults : 5,
        contents: {
          text: { maxCharacters: 1500 },
          highlights: true,
        },
      });

      const items = result.results.map((item) => ({
        title: item.title,
        url: item.url,
        text: item.text,
        highlights: item.highlights,
        publishedDate: item.publishedDate,
      }));

      if (items.length === 0) {
        return {
          success: true,
          message: `Tidak ada hasil web untuk "${query}"`,
          result: [],
        };
      }

      return {
        success: true,
        message: `Ditemukan ${items.length} hasil web untuk "${query}"`,
        result: items,
      };
    } catch (error) {
      return {
        success: false,
        message: `Gagal mencari web untuk "${query}"`,
        error: error instanceof Error ? error.message : 'Pencarian web gagal',
      };
    }
  }
}
