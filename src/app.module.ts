import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommanderController } from './commander/commander.controller';
import { CommanderService } from './commander/commander.service';
import { CommanderModule } from './commander/commander.module';

@Module({
  imports: [CommanderModule],
  controllers: [AppController, CommanderController],
  providers: [CommanderService],
})
export class AppModule {}
