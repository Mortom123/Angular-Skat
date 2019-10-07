import { Turn } from './game/turn/turn'
import { Player } from '../player/player'
import { TurnType, Farben } from './game/game-data'
import { ReizModifiers, ResultModifiers } from './game/turn/turn-modifiers'


export class Skat {
    constructor() {
        
        let papa = new Player('Mario')
        let martin= new Player('Martin')
        let mama = new Player('Kerstin')
        
        let players: [Player, Player, Player] = [papa, martin, mama]

        let turn = new Turn(players, mama)

        turn.spielMacher = papa
        turn.farbe =  Farben.HERZ
        turn.turnType = TurnType.NULL
        let mods: ReizModifiers = {
           hand: true,
        }
        turn.reizMods = mods
        let resultMods: ResultModifiers = { }
        turn.resultMods = resultMods
        
        turn.cardScores = {spielMacher: 90 , gegner: 30}
        console.log("mitohne")
        turn.mitOhne = 1
        if (turn.spielMacherÜberreizt) {
            console.warn("Achtung, Schlawiner")
        }
        console.log("scores")
        console.log(turn.resultScores)
        
    }
}
