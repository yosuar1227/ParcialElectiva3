import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { EventModule } from './event/event.module';
import { CommentModule } from './comment/comment.module';
import { CategoryModule } from './category/category.module';
import { LoqueseaModule } from './loquesea/loquesea.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type              : 'mysql',
      host              : 'localhost',
      database          : process.env.Database,
      username          : process.env.User,
      password          : process.env.Password,
      port              : 3306,
      autoLoadEntities  : true,
      synchronize       : true
    }),
    UserModule,
    CommonModule,
    EventModule,
    CommentModule,
    CategoryModule,
    LoqueseaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
