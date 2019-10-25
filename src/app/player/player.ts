import * as uuid from "uuid"

export class Player {  

  constructor(readonly name: string, readonly id = uuid()){}
}


