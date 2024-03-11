import * as  path from "path";
import * as dayjs from 'dayjs';
import { access , readFile , readdir } from 'fs/promises';
import * as fs from 'fs'
import axios from "axios";
import { TransactionTestCaseDTO } from "src/interface/testcase.status";



interface testCaseInfo {
  testCases:any[];
  testCaseInfoJSON:{}
}
export class TransactionServerUtils {

  private static instance:TransactionServerUtils;

  // process.cwd() is project root absolute Path 
  private testCaseRootPath = path.resolve(process.cwd(),'testcase');

  private constructor(){
     TransactionServerUtils.instance = this;
  }

  // Utils Class is SignleTone Pattern 
  static get getInstance(){
    if(!TransactionServerUtils.instance){
      TransactionServerUtils.instance = new TransactionServerUtils();
    }

    return this.instance
  }
  public startTestCaseUsingChildProcess({
    automation_type,
    testCases
  }:{
    automation_type:string,
    testCases:any[]
  }):Promise<any>{
    return new Promise(async(resolve,reject)=>{
      try {
        await this._LOG(` This is Test Start ${automation_type}`)
        switch(automation_type.toLowerCase()){
          case 'transaction':
            await this.startTransactionTest({testCases});
              
          break;

          default:

          break;
        }
        resolve(true);

      } catch (error) {
        console.warn(error);
        reject(reject);
      }
    })
  }
  
  public async getTestCase(type:string):Promise<testCaseInfo>{


    await this._LOG('getTestCase');

    // find TestCase Root index CSV File
    let currentTestCaseRootPath = path.resolve(this.testCaseRootPath,type+'/index.json');
    const testCaseJSON:any = await import(currentTestCaseRootPath);
    // sequence Object Key is 
    /**
     * This is Transaction Test Case Type 
     * 
     * sendServer - send server
     * recvServer - recv Server
     * targetPort - dst server port 
     * protocol  -  test protocol 
     * checkIP  - test options added check IP 
     * isNCPServices - check is NCP Services ( Priority High ) 
     * ObjectStorage , SystemSecurityChecker ,  NTK .. etc
     */
    return {
      testCases :testCaseJSON.testCases,
      testCaseInfoJSON:testCaseJSON
    };
  }

/* 
   * This is Transaction Test Case Type 
   * 
   * sendServer - send server
   * recvServer - recv Server
   * targetPort - dst server port 
   * protocol  -  test protocol 
   * checkIP  - test options added check IP 
   * isNCPServices - check is NCP Services ( Priority High ) 
   * ObjectStorage , SystemSecurityChecker ,  NTK .. etc
 */
  private startTransactionTest({
    testCases
  }:{
    testCases:TransactionTestCaseDTO[]
  }):Promise<any>{
    return new Promise(async(resolve,reject)=>{
      try {

        // generated Transaction Test get call strings

        
        // Child Process 를 생성한다.

        // 해당 testCases 를 보낸다

        // 순서대로 Promise Call 을 비동기로 쏩니다. 
        // sendSererIP:PORT/?dstIP={dstIP}&targetPort={targetPort}
        let generatedCallURL = testCases.reduce((prev:any,curr:any,index:number)=>{
            let testURL = `${curr.send_server}:${curr.agent_port}/`
            +`?dstIP=${curr.recv_server}`
            +`&targetPort=${curr.target_port}`
            +`&protocol=${curr.protocol}`
            +`&is_check_tcp_state=${curr.is_check_tcp_state}`
            +`&is_negative=${curr.is_negative}`
            +`&check_ip=${curr.check_ip}`
            +`&is_ncp_services=${curr.is_ncp_services}`
            +`&testcase_name=${curr.testcase_name}`
            +`&testcase_message=${curr.testcase_message}`

            prev.push(testURL);

            return prev;
        },[]);

        await this._LOG('genrated CALL Complte',"INFO")

        console.warn(generatedCallURL);


        console.warn('Complete Transaction Test');
        resolve(true);
      } catch (error) {
        console.warn('start Transaction  Error');
        reject(error);
      }
    })
  }



  public _LOG(message:string,type:string ='NORMAL'){
    return new Promise(async(resolve,reject)=>{
      try {
        const Reset = "\x1b[0m"
        // Bright = "\x1b[1m"
        // Dim = "\x1b[2m"
        // Underscore = "\x1b[4m"
        // Blink = "\x1b[5m"
        // Reverse = "\x1b[7m"
        // Hidden = "\x1b[8m"

        // FgBlack = "\x1b[30m"
        // FgRed = "\x1b[31m"
        const FgGreen = "\x1b[32m"
        // FgYellow = "\x1b[33m"
        const FgBlue = "\x1b[34m"
        const FgMagenta = "\x1b[35m"
        const FgCyan = "\x1b[36m"
        // FgWhite = "\x1b[37m"
        // FgGray = "\x1b[90m"

        // BgBlack = "\x1b[40m"
        // BgRed = "\x1b[41m"
        // BgGreen = "\x1b[42m"
        // BgYellow = "\x1b[43m"
        // BgBlue = "\x1b[44m"
        // BgMagenta = "\x1b[45m"
        // BgCyan = "\x1b[46m"
        // BgWhite = "\x1b[47m"
        // BgGray = "\x1b[100m"

        let currentConsoleTheme = FgMagenta;
        let current_time = dayjs().format('YYYY-MM-DD HH:mm:ss');

        let logString:string = `[${current_time}][${type}] ${message}`

        if(type==='NORMAL'){
          console.warn(currentConsoleTheme,logString,Reset);
        }
        else if(type==='INFO'){
          currentConsoleTheme = FgBlue;
          console.warn(currentConsoleTheme,logString,Reset);
        }
        else{
          console.log('Is Not Type');
        }

        resolve(true);
      } catch (error) {
        console.error(error);
        reject(false);
      }
    })
  }

}