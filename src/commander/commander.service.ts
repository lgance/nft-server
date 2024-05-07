import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { TransactionServerUtils } from "src/utils";

import { CommanderDto } from './dto/commander.dto';
@Injectable()
export class CommanderService {


  async commandTraffic(commanderDto:CommanderDto):Promise<any>{
      try {
        let { 
          srcIP,
          srcPort,
          dstIP,
          dstPort,
          protocol,
          is_check_tcp_state,
          is_negative,
          check_ip,
          is_ncp_services,
          testcase_name

        } = commanderDto;

        let utils = TransactionServerUtils.getInstance

          let requestURL = `http://${srcIP}:${srcPort}/sender`
          +`?dstIP=${dstIP}`
          +`&dstPort=${dstPort}`
          +`&protocol=${protocol}`
          +`&is_check_tcp_state=${is_check_tcp_state}`
          +`&is_negative=${is_negative}`
          +`&check_ip=${check_ip}`
          +`&is_ncp_services=${is_ncp_services}`
          +`&testcase_name=${testcase_name}`

          utils._LOG({
            message:'COMMANDER REQUEST ',
            type:"NORMAL",
            name:"COMMANDTRAFFIC"
          });
          let response = await axios.get(requestURL);
          return response.data;


        } catch (error) {
            console.warn(error.response.data);
            return false;
        }
    }
    

}
