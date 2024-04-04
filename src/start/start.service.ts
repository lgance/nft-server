
import { Injectable } from "@nestjs/common";

import { StartDto , StartResDto} from "./dto/start.dto";
import { TransactionServerUtils } from "src/utils";
import * as dayjs from 'dayjs'

@Injectable()
export class StartService {

  
  async testStart(startDto:StartDto):Promise<any>{

    let {  automation_type } = startDto;
    // let current_time = dayjs['default']().format('YYYY-MM-DD HH:mm:ss')
    // 와이파이 돌아오면 현재 시간 넣어서 테스트 

    // get CSV File and TestCase Check 
    let utils = TransactionServerUtils.getInstance
    let tcJSON = await utils.getTestCase(automation_type);
    let testCases = tcJSON.testCases;

    let startTestCaseObject = await utils.startTestCaseUsingChildProcess({
      automation_type,
      testCases
    });

    console.warn('테스트 ');
    console.warn(startTestCaseObject);

    return {
      startStatus:startTestCaseObject,
      automation_type,
      start_time:dayjs().format(`YYYY-MM-DD-HH:mm:ss [SSS]_SSS A`),
      
    }
  }

}