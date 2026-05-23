import { Injectable } from '@nestjs/common';

import { isAxiosError } from 'axios';

import { SecureHttpClientService } from 'src/engine/core-modules/secure-http-client/secure-http-client.service';
import { SearchHelpCenterInputZodSchema } from 'src/engine/core-modules/tool/tools/search-help-center-tool/search-help-center-tool.schema';
import { type ToolInput } from 'src/engine/core-modules/tool/types/tool-input.type';
import { type ToolOutput } from 'src/engine/core-modules/tool/types/tool-output.type';
import { type ToolExecutionContext } from 'src/engine/core-modules/tool/types/tool-execution-context.type';
import { type Tool } from 'src/engine/core-modules/tool/types/tool.type';
import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';

@Injectable()
export class SearchHelpCenterTool implements Tool {
  description =
    'Search Bades documentation and help center to find information about features, setup, usage, and troubleshooting.';
  inputSchema = SearchHelpCenterInputZodSchema;

  constructor(
    private readonly badesConfigService: BadesConfigService,
    private readonly secureHttpClientService: SecureHttpClientService,
  ) {}

  async execute(
    parameters: ToolInput,
    _context: ToolExecutionContext,
  ): Promise<ToolOutput> {
    const { query } = parameters;

    try {
      const MINTLIFY_API_KEY = this.badesConfigService.get('MINTLIFY_API_KEY');
      const MINTLIFY_SUBDOMAIN =
        this.badesConfigService.get('MINTLIFY_SUBDOMAIN');

      if (!MINTLIFY_API_KEY || !MINTLIFY_SUBDOMAIN) {
        return {
          success: true,
          message: `Pencarian pusat bantuan belum dikonfigurasi.`,
          result: [],
        };
      }

      const endpoint = `https://api-dsc.mintlify.com/v1/search/${MINTLIFY_SUBDOMAIN}`;

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MINTLIFY_API_KEY}`,
      };

      const httpClient = this.secureHttpClientService.getHttpClient();

      const response = await httpClient.post(
        endpoint,
        { query, pageSize: 10 },
        { headers },
      );

      const results = response.data;

      if (results.length === 0) {
        return {
          success: true,
          message: `Tidak ada artikel pusat bantuan yang ditemukan untuk "${query}"`,
          result: [],
        };
      }

      return {
        success: true,
        message: `Ditemukan ${results.length} artikel pusat bantuan yang relevan untuk "${query}"`,
        result: results,
      };
    } catch (error) {
      const errorDetail = isAxiosError(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error
          ? error.message
          : 'Pencarian pusat bantuan gagal';

      return {
        success: false,
        message: `Gagal mencari pusat bantuan untuk "${query}"`,
        error: errorDetail,
      };
    }
  }
}
