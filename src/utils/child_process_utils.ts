// 메인 프로세스에서 메시지 수신
process.on('message', (message: { type: string; testCases: any[] }) => {
  console.warn('여기는 Child Process 메인 프로세스 입니다. ')
  console.warn(message);
  if (message.type === 'startTransactionTest') {
    externalProcessRunTransaction(message);
  }
});

function wait(time:number){
  return new Promise(async(resolve,reject)=>{
    setTimeout(()=>{
        resolve(true);
    },time)
  })
}

// 별도의 프로세스에서 실행될 함수
async function externalProcessRunTransaction({ testCases }) {
  // 여기서는 해당 함수를 실행하고 결과를 메인 프로세스로 보냅니다.
  // 예제에서는 실행만 시킵니다.
  let count = 0;
  let isCondition = 10 ;

  // http://localhost:3500/start?automation_type=transaction
  let serverURL = 'http://localhost:3500/start?'
  while(isCondition > count ){
    testCases.reduce(async(prev,curr,item,index)=>{
      try {
        let nextItem = await prev;
        
        let requestURL = serverURL.concat(curr);
        console.warn(requestURL);

        return nextItem;
      } catch (error) {
        console.warn(error);
      }
    },Promise.resolve())
    await wait(1000);
    process.send({ type: 'complete', result: `Transaction Test Complete Cnt ${count}` });  
    count++;

  }
  // 결과를 메인 프로세스로 보냅니다.
  process.send({ type: 'transaction_complete', result: 'Transaction Test Complete' });
}


console.warn('test');