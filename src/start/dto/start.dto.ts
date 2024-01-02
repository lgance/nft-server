import { IsString } from "class-validator";



export class StartDto{

  @IsString()
  readonly automation_type:string;


}


export class StartResDto{

  

}