import * as  path from "path";
import * as dayjs from 'dayjs';
import { access , readFile , readdir } from 'fs/promises';
import * as fs from 'fs'
import axios from "axios";
import { TransactionTestCaseDTO } from "src/interface/testcase.status";
import { fork ,ChildProcess } from 'node:child_process';


interface testCaseInfo {
  testCases:any[];
  testCaseInfoJSON:{}
}

export class TransactionServerUtils {

  private static instance:TransactionServerUtils;
  private testCount= 10 ;
  private testEndTime='';
  private testLock = false;
  private testWorker :ChildProcess;

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
        let testStartObject:any = {
          start_message:"empty",
          start_result:"block"
        }
        
        if(!!this.testLock){
            let testLockMessage = `This Server Test is working EndTime ${this.testEndTime}`;
           await this._LOG({message:testLockMessage,
            type:"INFO",
            name:"SET_TEST_LOCK"
           })
           testStartObject.start_message=testLockMessage;
           testStartObject.start_result="block";

           resolve(testStartObject);
        }
        else{
          await this._LOG(
            {
              message:`This is Test Start ${automation_type}`,
              type:"INFO",
              name:"NEW_TEST_START"
            }
            )

          switch(automation_type.toLowerCase()){
            case 'transaction':
              testStartObject = await this.startTransactionTest({testCases});
            break;
  
            default:
              testStartObject.start_message="";
              testStartObject.start_result="fail";
            break;
          }
          this.testWorker= fork(path.resolve(__dirname,'child_process_utils'));
          this.testWorker.on('message',(message:any)=>{
            if(message.type==='complete'){
              // console.warn(`[🔥 SERVER PROCESS] ON Complete Message`)
              // console.warn(message);
              testStartObject.processResult = message.result,
              resolve(testStartObject);
            }
            else if(message.type==='error'){
              testStartObject.processError = message.error;
              resolve(testStartObject);
            }

            else if(message.type==="transaction_complete"){
              this.setTestLock(false);
              testStartObject.processResult="테스트 종료 되었습니다."
              resolve(testStartObject);
            }
          });
  
          this.testWorker.send({
            // automation_type,
            type: 'startTransactionTest',
            testCases:testStartObject.start_testcase_gen
          });
  
          this.testLock=true;
        }

      
      } catch (error) {
        reject(error);
      }
    })
  }
  public async getTestCase(type:string):Promise<testCaseInfo>{
    await this._LOG({message:'getTestCase',type:"INFO",name:"GET_TEST_CASE_FN"});
    // get test case according to type 
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
        // serverURL 
        // http://localhost:3500/sender?

        let generatedCallURL = testCases.reduce((prev:any,curr:any,index:number)=>{
            let testURL = `?srcIP=${curr.src_server}`
            +`&srcPort=${curr.src_port}/`
            +`&dstIP=${curr.dst_server}`
            +`&dstPort=${curr.dst_port}`
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

        
        resolve({
          start_message:"transaction Test Start",
          start_result:"pass",
          start_testcase_origin:testCases,
          start_testcase_gen:generatedCallURL
        });
      } catch (error) {
        console.warn('start Transaction  Error');
        reject(error);
      }
    })
  }

  private setTestLock(testLock:boolean){
    console.warn(`[🔥 SERVER PROCESS][SET_TEST_LOCK_FN][BEFORE]`)
    console.warn(this.testLock);
    this.testLock = testLock;
    console.warn(`[🔥 SERVER PROCESS][SET_TEST_LOCK_FN][AFTER]`)
    console.warn(this.testLock);
  }


  public _LOG({
    message,
    type="NORMAL",
    name,
  }:{
    message:string,
    type:string, 
    name:string
  }){
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

        let logString:string = `[🔥 SERVER PROCESS][${name}][${current_time}][${type}] ${message}`
        

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