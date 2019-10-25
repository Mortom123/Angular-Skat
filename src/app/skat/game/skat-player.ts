import { Player } from "src/app/player/player";

export class SkatPlayer {
    // string references game uuid and number total score
  readonly scores: Map<string, number> = new Map()

  constructor(public player: Player) {}
  
}

