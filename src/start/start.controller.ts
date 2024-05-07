import { Controller, Get, Query, UseFilters } from "@nestjs/common";
import { StartDto } from "./dto/start.dto";
import { StartService } from "./start.service";
import { HttpExceptionFilter } from "src/exception/http-exception-filter";


@Controller('start')
@UseFilters(HttpExceptionFilter)
export class StartController{

  constructor(private readonly startService:StartService){}


  @Get()
  testStart(@Query() startDto:StartDto){
    return this.startService.testStart(startDto);
  }

}