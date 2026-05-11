import { Module, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MsAuthGuard } from './auth/ms-auth.guard';
import { ChatGateway } from './gateways/chat.gateway';
import { WebSocketDocsController } from './controllers/websockets-docs.controller';
import { MetaDataService } from './services/metadata.service';
import { MetaDataController } from './controllers/metadata.controller';
import { WorkFlowController } from './controllers/workflow.controller';
import { WorkFlowService } from './services/workflow.service';
import { DomainController } from './controllers/domain.controller';
import { DomainService } from './services/domain.service';
import { ConversationsGatewayController } from './controllers/conversation.controller';
import { ConversationService } from './services/conversations.service';
import { ReviewService } from './services/review.service';
import { ReviewController } from './controllers/review.controller';
import { DashbaordService } from './services/dashboard.service';
import { DashboardController } from './controllers/dashboard.controller';
import { SchedulerController } from './controllers/scheduler.controller';
import { SchedulerService } from './services/scheduler.service';
import { CountriesController } from './controllers/countries.controller';
import { CountriesService } from './services/countries.service';
import { AutocompleteController } from './controllers/autocomplete.controller';
import { AutocompleteService } from './services/autocomplete.service';
import { CpanelController } from './controllers/cpanel.controller';
import { CpanelService } from './services/cpanel.service';
//import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Carga automáticamente las variables del .env
  ],
  controllers: [
    WorkFlowController,
    WebSocketDocsController,
    MetaDataController,
    DomainController,
    ConversationsGatewayController,
    ReviewController,
    DashboardController,
    SchedulerController,
    CountriesController,
    AutocompleteController,
    CpanelController
  ],
  providers: [
    WorkFlowService, ChatGateway, MetaDataService, DomainService, ConversationService, ReviewService, DashbaordService, SchedulerService, CountriesService, AutocompleteService, CpanelService,
    { provide: APP_GUARD, useClass: MsAuthGuard },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    //consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
