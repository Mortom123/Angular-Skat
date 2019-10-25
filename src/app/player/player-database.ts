import Dexie from 'dexie';
import { Player } from './player';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PlayerDataBase extends Dexie {
    players: Dexie.Table<Player, number>
    
    constructor() {
        super("PlayerDatabase")
        this.version(1).stores({
            players: 'id, name'
        })
        this.players = this.table("players")
    }
}