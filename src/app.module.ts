import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommanderController } from './commander/commander.controller';
import { CommanderService } from './commander/commander.service';
import { CommanderModule } from './commander/commander.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { StartModule } from './start/start.module';


@Module({
  imports: [CommanderModule, StartModule,   
    ServeStaticModule.forRoot({
      rootPath:join(__dirname,'..','server_static'),
      serveRoot:"/"
    })],
  controllers: [AppController, CommanderController],
  providers: [CommanderService],
})
export class AppModule {}
