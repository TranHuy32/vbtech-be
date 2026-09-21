import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseOptions } from '@app/core';
import { RequestIdMiddleware } from '@app/core/middleware/requestId.middleware';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UploadsModule } from './uploads/uploads.module';
import { ArticlesModule } from './articles/articles.module';
import { TelegramModule } from './telegram/telegram.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseOptions,
    }),
    EventEmitterModule.forRoot(),
    CategoriesModule,
    ProductsModule,
    AuthModule,
    UploadsModule,
    ArticlesModule,
    ProjectsModule,
    TelegramModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
