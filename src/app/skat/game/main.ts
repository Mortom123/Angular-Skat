import { Player } from "../../player/player"
import * as uuid from "uuid"
import { Turn, TurnScores } from "./turn/turn"
import { TurnState } from "./turn/turn-state"


export type GameScores = Map<number, TurnScores>

export type SkatPlayers = {
    0: Player,
    1: Player,
    2: Player,
} & Array<Player>


export class SkatGame{
    
    private _gameId: string = uuid()
    private _scores: GameScores = new Map()
    private _currentTurnNumber = 1
    private _currentTurn: Turn
    private _specifiedTurns = -1

    constructor(private _players: SkatPlayers) { 

    }

    setupTurn() {
        this._currentTurn = new Turn(this._determineNextPlayers(), this._determineNextDealer(), this._currentTurnNumber)
        let turnScores = new Map()
        this._players.forEach(player => turnScores.set(player, 0))
        this._scores.set(this._currentTurnNumber, turnScores)
        this._currentTurn.nextPhase()
    }

    private _startingPlayerIndex: number = 0
    private _determineNextPlayers(): [Player, Player, Player] {
        let players: [Player, Player, Player]
        let ring = this._players.length
        players = [
            this._players[this._startingPlayerIndex % ring], 
            this._players[(this._startingPlayerIndex+1) % ring], 
            this._players[(this._startingPlayerIndex+2) % ring]
        ]
        this._startingPlayerIndex+=1
        return players
    }

    private _determineNextDealer(): Player{
        return this._players[(this._startingPlayerIndex + 3)% this._players.length]
    }

    reizenDone() {
        if (this._currentTurn.state == TurnState.REIZEN) {
            this._currentTurn.nextPhase()
        }
    }

}


