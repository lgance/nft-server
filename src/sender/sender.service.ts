import { Injectable } from '@nestjs/common';
import { SenderDto,SenderResDto } from './dto/sender.dto';

@Injectable()
export class SenderService {

    sendTraffic(sendDto:SenderDto):SenderResDto{
        
        return{
            mainResult:"pass",
            agentStatus:{
                senderAgent:{
                    "tcp":[{
                        "protocol":"",
                        "port":"6500",
                        "status":"",
                        "status_code":"",
                        "last_access":"",
                        "test_type":"SEND",
                        "src_ip":"",
                        "dst_ip":""
                    }]
                },
                receiverAgent:{
                   
                }
            }
        }
    }

}
