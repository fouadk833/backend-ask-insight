import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CpanelService } from '../services/cpanel.service';


@ApiTags('Cpanel')
@Controller('cpanel')
export class CpanelController {
  constructor(private readonly cpanelService: CpanelService) {}

  @Get('domains')
  @ApiOperation({ summary: 'Get domain list for a user' })
  @ApiQuery({ name: 'user_id', type: String, required: true, description: 'User email (e.g. user@domain.com)' })
  async getDomains(@Query('user_id') userId: string) {
    return this.cpanelService.getDomains(userId);
  }

  @Get('domains/byemail')
  @ApiOperation({ summary: 'Get domain list for a user by email from FastAPI' })
  @ApiQuery({ name: 'email', type: String, required: true, description: 'User email' })
  async getDomainsByEmail(@Query('email') email: string) {
    return this.cpanelService.getDomainsByEmail(email);
  }

  @Get('domains/:domain_id/history')
  @ApiOperation({ summary: 'Get history for a domain' })
  @ApiQuery({ name: 'user_id', type: String, required: true, description: 'User email (e.g. user@domain.com)' })
  async getDomainHistory(@Param('domain_id') domainId: string, @Query('user_id') userId: string) {
    return this.cpanelService.getDomainHistory(domainId, userId);
  }

  @Post('domains/:domain_id/rollback')
  @ApiOperation({ summary: 'Rollback a domain to a previous version' })
  @ApiQuery({ name: 'user_id', type: String, required: true, description: 'User email (e.g. user@domain.com)' })
  async rollbackDomain(@Param('domain_id') domainId: string, @Query('user_id') userId: string, @Body() body: any) {
    return this.cpanelService.rollbackDomain(domainId, userId, body);
  }

  @Get('domains/:domain_id')
  @ApiOperation({ summary: 'Get a domain by ID for a user' })
  @ApiQuery({ name: 'user_id', type: String, required: true, description: 'User email (e.g. user@domain.com)' })
  async getDomainById(@Param('domain_id') domainId: string, @Query('user_id') userId: string) {
    return this.cpanelService.getDomainById(domainId, userId);
  }

  @Get('users/all')
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'user_id', type: String, required: true, description: 'User email (e.g. user@domain.com)' })
  async getAllUsers(@Query('user_id') userId: string) {
    return this.cpanelService.getAllUsers(userId);
  }

  @Put('domains/:domain_id')
  @ApiOperation({ summary: 'Update a domain by ID' })
  @ApiQuery({ name: 'user_id', type: String, required: true, description: 'User email (e.g. user@domain.com)' })
  async updateDomain(@Param('domain_id') domainId: string, @Query('user_id') userId: string, @Body() body: any) {
    return this.cpanelService.updateDomain(domainId, userId, body);
  }

  @Put('domains/:domain_id/content')
  @ApiOperation({ summary: 'Update content for a domain' })
  @ApiQuery({ name: 'user_id', type: String, required: true, description: 'User email (e.g. user@domain.com)' })
  async updateDomainContent(@Param('domain_id') domainId: string, @Query('user_id') userId: string, @Body() body: any) {
    return this.cpanelService.updateDomainContent(domainId, userId, body);
  }

  @Delete('domains/:domain_id')
  @ApiOperation({ summary: 'Delete a domain by ID' })
  @ApiQuery({ name: 'user_id', type: String, required: true, description: 'User email (e.g. user@domain.com)' })
  async deleteDomain(@Param('domain_id') domainId: string, @Query('user_id') userId: string) {
    return this.cpanelService.deleteDomain(domainId, userId);
  }

  @Post('domains')
  @ApiOperation({ summary: 'Create a domain for a user' })
  @ApiQuery({ name: 'user_id', type: String, required: true, description: 'User email (e.g. user@domain.com)' })
  async createDomain(@Query('user_id') userId: string, @Body() body: any) {
    return this.cpanelService.createDomain(userId, body);
  }

  @Get('drafts')
  @ApiOperation({ summary: 'Get drafts for a user' })
  @ApiQuery({ name: 'user_id', type: String, required: true, description: 'User email (e.g. user@domain.com)' })
  async getDraftsByDomain(@Query('user_id') userId: string) {
    return this.cpanelService.getDraftsByDomain(userId);
  }

  @Post('drafts/:draft_id/approve')
  @ApiOperation({ summary: 'Approve a draft' })
  @ApiQuery({ name: 'user_id', type: String, required: true, description: 'User email (e.g. user@domain.com)' })
  async approveDraft(@Param('draft_id') draftId: string, @Query('user_id') userId: string) {
    return this.cpanelService.approveDraft(draftId, userId);
  }

  @Post('drafts/:draft_id/reject')
  @ApiOperation({ summary: 'Reject a draft' })
  @ApiQuery({ name: 'user_id', type: String, required: true, description: 'User email (e.g. user@domain.com)' })
  async rejectDraft(@Param('draft_id') draftId: string, @Query('user_id') userId: string) {
    return this.cpanelService.rejectDraft(draftId, userId);
  }

  @Get('categories/metadata')
  @ApiOperation({ summary: 'Get categories metadata' })
  @ApiQuery({ name: 'user_id', type: String, required: true })
  async getCategoriesMetadata(@Query('user_id') userId: string) {
    return this.cpanelService.getCategoriesMetadata(userId);
  }

  @Get('categories/metadata/:category_key/template')
  @ApiOperation({ summary: 'Get metadata template for a category' })
  @ApiQuery({ name: 'user_id', type: String, required: true })
  @ApiQuery({ name: 'category_key', type: String, required: true })
  async getCategoryMetadataTemplate(
    @Param('category_key') categoryKey: string,
    @Query('user_id') userId: string,
  ) {
    return this.cpanelService.getCategoryMetadataTemplate(categoryKey, userId);
  }

  @Get('categories/metadata/:category_key/content')
  @ApiOperation({ summary: 'Get metadata content for a category and domain' })
  @ApiQuery({ name: 'user_id', type: String, required: true })
  @ApiQuery({ name: 'domain_id', type: String, required: true })
  @ApiQuery({ name: 'category_key', type: String, required: true })
  async getCategoryMetadataContent(
    @Param('category_key') categoryKey: string,
    @Query('domain_id') domainId: string,
    @Query('user_id') userId: string,
  ) {
    return this.cpanelService.getCategoryMetadataContent(categoryKey, domainId, userId);
  }

  @Put('categories/metadata/:category_key/content')
  @ApiOperation({ summary: 'Update metadata content for a category and domain' })
  @ApiQuery({ name: 'user_id', type: String, required: true })
  @ApiQuery({ name: 'domain_id', type: String, required: true })
  @ApiQuery({ name: 'category_key', type: String, required: true })
  async updateCategoryMetadataContent(
    @Param('category_key') categoryKey: string,
    @Query('domain_id') domainId: string,
    @Query('user_id') userId: string,
    @Body() body: any,
  ) {
    return this.cpanelService.updateCategoryMetadataContent(categoryKey, domainId, userId, body);
  }

  @Get('categories/prompt')
  @ApiOperation({ summary: 'Get categories prompt' })
  @ApiQuery({ name: 'user_id', type: String, required: true })
  async getCategoriesPrompt(@Query('user_id') userId: string) {
    return this.cpanelService.getCategoriesPrompt(userId);
  }

  @Get('categories/prompt/:category_key/template')
  @ApiOperation({ summary: 'Get prompt template for a category' })
  @ApiQuery({ name: 'user_id', type: String, required: true })
  @ApiQuery({ name: 'category_key', type: String, required: true })
  async getCategoryPromptTemplate(
    @Param('category_key') categoryKey: string,
    @Query('user_id') userId: string,
  ) {
    return this.cpanelService.getCategoryPromptTemplate(categoryKey, userId);
  }

  @Get('categories/prompt/:category_key/content')
  @ApiOperation({ summary: 'Get prompt content for a category and domain' })
  @ApiQuery({ name: 'user_id', type: String, required: true })
  @ApiQuery({ name: 'domain_id', type: String, required: true })
  @ApiQuery({ name: 'category_key', type: String, required: true })
  async getCategoryPromptContent(
    @Param('category_key') categoryKey: string,
    @Query('domain_id') domainId: string,
    @Query('user_id') userId: string,
  ) {
    return this.cpanelService.getCategoryPromptContent(categoryKey, domainId, userId);
  }

  @Put('categories/prompt/:category_key/content')
  @ApiOperation({ summary: 'Update prompt content for a category and domain' })
  @ApiQuery({ name: 'user_id', type: String, required: true })
  @ApiQuery({ name: 'domain_id', type: String, required: true })
  @ApiQuery({ name: 'category_key', type: String, required: true })
  async updateCategoryPromptContent(
    @Param('category_key') categoryKey: string,
    @Query('domain_id') domainId: string,
    @Query('user_id') userId: string,
    @Body() body: any,
  ) {
    return this.cpanelService.updateCategoryPromptContent(categoryKey, domainId, userId, body);
  }

  @Post('deployment/promote')
  @ApiOperation({ summary: 'Promote a deployment' })
  @ApiQuery({ name: 'user_id', type: String, required: true, description: 'User email (e.g. user@domain.com)' })
  async promoteDeployment(@Query('user_id') userId: string, @Body() body: any) {
    return this.cpanelService.promoteDeployment(userId, body);
  }

  @Post('user-roles/assign')
  @ApiOperation({ summary: 'Assign a role to a user' })
  @ApiQuery({ name: 'user_id', type: String, required: true, description: 'User email (e.g. user@domain.com)' })
  async assignUserRole(@Query('user_id') userId: string, @Body() body: any) {
    return this.cpanelService.assignUserRole(userId, body);
  }

  @Post('user-roles/revoke')
  @ApiOperation({ summary: 'Revoke a role from a user' })
  @ApiQuery({ name: 'user_id', type: String, required: true, description: 'User email (e.g. user@domain.com)' })
  async revokeUserRole(@Query('user_id') userId: string, @Body() body: any) {
    return this.cpanelService.revokeUserRole(userId, body);
  }
}
