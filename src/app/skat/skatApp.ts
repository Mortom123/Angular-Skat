import { Turn } from './turn/turn'
import { Player } from './player'

let papa: Player = { name: 'Mario' }
let martin: Player = { name: 'Martin' }
let mama: Player = { name: 'Kerstin' }

let players: [Player, Player, Player] = [papa, martin, mama]

let turn = new Turn(players, mama)
