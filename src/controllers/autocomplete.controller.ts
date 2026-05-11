import {
  Controller,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { AutocompleteService } from '../services/autocomplete.service';


@Controller('autocomplete')

export class AutocompleteController {
  constructor(private readonly autocompleteService: AutocompleteService) {}

  @Get()
  @ApiQuery({
    name: 'query',
    required: true,
    description: 'Search query for autocomplete suggestions',
  })
  @ApiQuery({
    name: 'metadata_key',
    required: true,
    description: 'Domain metadata key (e.g., ecom_ecommerce)',
  })
  @ApiQuery({
    name: 'user_id',
    required: true,
    description: 'User identifier (email or ID)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of suggestions to return',
    schema: { default: 10 },
  })
  async getAutocompleteSuggestions(
    @Query('query') query: string,
    @Query('metadata_key') metadataKey: string,
    @Query('user_id') userId: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.autocompleteService.getAutocompleteSuggestions(
      query,
      metadataKey,
      userId,
      limit,
    );
  }
}
