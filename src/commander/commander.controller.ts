import { Controller, Query , Get } from '@nestjs/common';

import { CommanderService } from './commander.service';
import { CommanderDto } from './dto/commander.dto';



@Controller('commander')
export class CommanderController {


  constructor(private readonly commanderService:CommanderService){}


  @Get()
  commandTraffic(@Query() commanderDto:CommanderDto){
    return this.commanderService.commandTraffic(commanderDto);
  }

}
