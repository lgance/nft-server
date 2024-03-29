import { Controller, Get, Query } from "@nestjs/common";
import { StartDto } from "./dto/start.dto";
import { StartService } from "./start.service";


@Controller('start')
export class StartController{

  constructor(private readonly startService:StartService){}


  @Get()
  testStart(@Query() startDto:StartDto){
    console.warn('start controller Test');
    return this.startService.testStart(startDto);
  }

}