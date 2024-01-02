
import { Injectable } from "@nestjs/common";

import { StartDto , StartResDto} from "./dto/start.dto";
import { TransactionServerUtils } from "src/utils";

@Injectable()
export class StartService {

  
  async testStart(startDto:StartDto):Promise<any>{

    let {  automation_type } = startDto;
    // let current_time = dayjs['default']().format('YYYY-MM-DD HH:mm:ss')
    // 와이파이 돌아오면 현재 시간 넣어서 테스트 

    // get CSV File and TestCase Check 
    let utils = TransactionServerUtils.getInstance
    let testCases = await utils.getTestCase(automation_type);

    await utils.startTestCaseUsingChildProcess({
      automation_type,
      testCases
    });

    return {
      result:"pass",
      automation_type,
      start_time:new Date() 
    }
  }

}