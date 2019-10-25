import { Injectable } from '@angular/core';
import { Player } from '../player';
import { PlayerDataBase } from '../player-database';

@Injectable({
  providedIn: 'root'
})
export class PlayerCreationService {

  constructor(private db: PlayerDataBase) { }

  createPlayer(name) {
    let newPlayer = new Player(name)
    this.db.players.put(newPlayer)

    this.db.players.toArray(console.table)
  }
}
