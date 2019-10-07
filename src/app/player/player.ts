export class Player {  

  // string references game uuid and number total score
  readonly scores: Map<string, number> = new Map()

  constructor(readonly name: string){}
}


