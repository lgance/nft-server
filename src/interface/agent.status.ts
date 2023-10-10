




/**                  
 * 
 * tcp
 * * SYN-SENT - wait for ACK to SYN 
 * * SYN-RECEIVED - Receive syn send SYN + ACK 
 * * ESTABLISHED  - Receive SYN + ACK  , Send ACK 
 * * ESTABLISHED  - Receive ACK 
 * 
 * ? test_type = SEND , RECV
 * ? last_access = 마지막 작업 시간 
 * 
 * protocol port   status   status_code     last_access  test_type    src_ip    dst_ip
 * tcp      6500    false     SYN
 * tcp      8500    false     SYN_RECV
 * tcp      9500    false     SYN ACK
 * udp      9500    true      ''
 * tcp      8500    true      ESTABLISHED
 */

interface AgentStatus{
  protocol:string;
  port:string;
  status:string;
  status_code:string;
  last_access:string;
  test_type:'SEND'|'RECV';
  src_ip:string;
  dst_ip:string;
}
interface AgentDTO {
  [index:string]:AgentStatus[]
}


export interface AgentStatusDTO{
  senderAgent:AgentDTO
  receiverAgent:AgentDTO
}