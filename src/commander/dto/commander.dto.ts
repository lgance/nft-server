import { Transform } from "class-transformer";
import { IsOptional,IsString, IsNumber, IsBoolean, isString, IsObject } from "class-validator";
// import { AgentStatusDTO } from "../../interface/agent.status";

import { AgentStatusDTO } from "src/interface/agent.status";


export class CommanderDto{
  /**
   * 트래픽을 보낼 Agent 의 시작점 IP ( send server ) 를 입력합니다.
   * send_server
   */

  @IsString()
  readonly srcIP:string;

  // 왜 srcPort만 이짓을 해줘야하는지 아직 모르겠음;; dstPort는 상관없는데;
  @Transform(value => String(value.value))
  @IsString()
  readonly srcPort:string;

  /**
   * 트래픽을 보낼 대상의 IP 를 입력 합니다.
   * recv_server
   */
  @IsString()
  readonly dstIP:string;
  /**
   * port가 존재할 경우 입력합니다. 기본값은 6500 입니다. 
   */
  @IsOptional()
  @IsString()
  readonly dstPort:string;


  /**
   * 통신이 실패할 경우에 대한 케이스 확인 입니다. 
   * true 일 경우 통신이 안되어야 성공입니다.
   * dst IP 의 Inbound가 안되는걸 확인 하는 부분이며 해당 Agent에서 OutBound로 
   * 트래픽이 나간 부분은 TCP 3 Hand Shake 를 통해 확인 합니다.
   * A -> OutBound 성공   Inbound 실패 -> B 일 경우 
   * A는 dstIP:Port로 SYN_SENT  
   * && 
   * B는 srcIP:Port로 SYN_RECV 상태여야 성공 
   */
  @IsOptional()
  @IsString()
  @Transform((value)=>{
    return value.value ==='true' ? 'Y' : (value.value==='Y' ? 'Y' : 'N');
  })
  readonly is_negative :string;
  /**
   * 해당 IP로 들어오는지 체크 요청을 같이 합니다.
   * assertionIP = 1234일 경우
   * recv에서 assertionIP가있을 경우 1234 값을 같이 체크해서 result를 줍니다.
   */


  @IsOptional()
  readonly protocol:string;

  @IsOptional()
  readonly is_check_tcp_state:string;

  @IsOptional()
  readonly check_ip:string;

  @IsOptional()
  readonly is_ncp_services:string;

  @IsOptional()
  readonly testcase_message:string;

  @IsOptional()
  readonly testcase_name:string;


}


export class CommanderResDto {
  /**
   * 최종 테스트 결과를 알려줍니다.
   */
  @IsString()
  readonly mainResult:string;

  /**
   * Agent가 Command Server가 되어 A와 B의 테스트를 관장할 경우 
   * 해당 Sender Agent와 Receiver Agent의 상태를 같이 던져 줍니다.
   * 
   * Receiver와의 통신만을 결과 한다면 Receiver Agent만 채워서 나갑니다.
   */
  @IsOptional()
  @IsObject()
  readonly agentStatus:AgentStatusDTO;

}