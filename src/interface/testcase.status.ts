


export interface TransactionTestCaseDTO{
 testcase_name:string;
 send_server:string;
 recv_server:string;
 agent_port:string;
 target_port:string;
 protocol:string;
 is_check_tcp_state?:string;
 is_negative?:boolean;
 check_ip?:string;
 is_ncp_services?:string;
 testcase_message?:string; 
}