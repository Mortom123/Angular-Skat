import { TurnType, NullScores, Farben } from '../skatData';
import { TurnState } from './turn-state';
import { ReizModifiers, DEFAULT_REIZ_MODS, ResultModifiers, DEFAULT_RESULT_MODS } from './turn-modifiers'
import { Player } from '../player'
import { Subject } from 'rxjs'

export class Turn {
  private _state: TurnState = TurnState.DEALING

  private _spielMacher: Player // player that won reizen
  private _spielMacherHasWon: boolean
  private _spielMacherStich: boolean

  private _reizWert: number // number that got "reiz"ed
  private _reizMods: ReizModifiers = DEFAULT_REIZ_MODS // base turn parameters

  private _turnType: TurnType // farb/grand/...
  private _farbe: Farben // if farbSpiel

  private _scoringStrategy: 'all' | 'spielMacher' = 'spielMacher' // who gets scores
  private _resultMods: ResultModifiers = DEFAULT_RESULT_MODS // result modifiers
  resultScores: Map<Player, number>

  private _ramschScores: Map<Player, number>
  private _cardScores: { spielMacher: number, gegner: number }

  private _changeDetection = new Subject<any>()

  constructor(private _players: [Player, Player, Player],
    private _dealer: Player) {
    this._changeDetection.subscribe(() => {
      this._runChangeDetection()
    })
  }

  private _runChangeDetection() {
    if (this._turnType && this._cardScores) {
      this._spielMacherHasWon = this._hasSpielMacherWon()
    }

    if (this._turnType && this.spielMacher && this._cardScores) {
      this.resultScores = this._calculateResultScores()
    }

  }

  finish() {
    this._state = TurnState.COMPLETED
  }
  nextPhase() {
    this._state = this._state.next || TurnState.COMPLETED
    this._changeDetection.next()
  }
  isCompleted(): boolean {
    return this._state.next ? false : true
  }
  get dealer(): Player { return this._dealer }
  setDealer(dealer: Player): boolean {
    if (this.isCompleted) {
      return false
    } else {
      this._dealer = dealer
      this._changeDetection.next()
      return true
    }
  }
  get spielMacher(): Player { return this._spielMacher }
  setSpielMacher(spielMacher: Player): boolean {
    if (this.isCompleted) {
      return false
    } else {
      this._spielMacher = spielMacher
      this._changeDetection.next()
      return true
    }
  }
  get turnType(): TurnType { return this._turnType }
  setTurnType(turnType: TurnType, farbe?: Farben): boolean {
    if (this.isCompleted) {
      return false
    } else {
      this._turnType = turnType
      if (this._turnType == TurnType.FARB) {
        this._farbe = farbe
      }
      this._changeDetection.next()
      return true
    }
  }
  get farbe(): Farben { return this._farbe }
  setFarbe(farbe: Farben): boolean {
    if (this.isCompleted && this.turnType != TurnType.FARB) {
      return false
    } else {
      this._farbe = farbe
      this._changeDetection.next()
      return true
    }
  }
  get reizModifiers(): ReizModifiers { return this._reizMods }
  setReizMods(mods: ReizModifiers): boolean {
    if (this.isCompleted) {
      return false
    } else {
      this._reizMods = { ...this._reizMods, ...mods }
      if ((this._reizMods.schneider || this._reizMods.schwarz)
        && this._state == TurnState.REIZEN) {
        this._reizMods.angesagt = true
      }
      this._changeDetection.next()
      return true
    }
  }
  get resultModifiers(): ResultModifiers { return this._resultMods }
  setResultMods(mods: ResultModifiers): boolean {
    if (this.isCompleted) {
      return false
    } else {
      this._resultMods = { ...this._resultMods, ...mods }
      if (this._resultMods.re) {
        this._resultMods.kontra = true
      }
      this._changeDetection.next()
      return true
    }
  }
  get reizWert(): number { return this._reizWert }
  setReizWert(reizWert: number): boolean {
    if (this.isCompleted) {
      return false
    } else {
      this._reizWert = reizWert
      this._changeDetection.next()
      return true
    }
  }
  get scoringStrategy() { return this._scoringStrategy }
  setScoringStrategy(strat: 'all' | 'spielMacher'): boolean {
    if (this.isCompleted) {
      return false
    } else {
      this._scoringStrategy = strat
      this._changeDetection.next()
      return true
    }
  }
  get ramschScores() { return this._ramschScores }
  setRamschWithScores(scores: Map<Player, number>): boolean {
    if (this.isCompleted) {
      return false
    } else {
      this._turnType = TurnType.RAMSCH
      this._ramschScores = scores
      this._changeDetection.next()
      return true
    }
  }
  get cardScores() { return this._cardScores }
  setCardScores(scores: { spielMacher: number, gegner: number }): boolean {
    if (this.isCompleted) {
      return false
    } else {
      this._cardScores = scores
      this._changeDetection.next()
      return true
    }
  }
  set überReizt(bool: boolean) {
    this._reizMods.überReizt = bool, this._changeDetection.next()
  }
  get überReizt() { return this._reizMods.überReizt }
  spielMacherSticht(): boolean {
    if (this.isCompleted) {
      return false
    } else {
      this._spielMacherStich = true
      this._changeDetection.next()
      return true
    }

  }
  get spielMacherHasWon(): boolean { return this._spielMacherHasWon }

  private _hasSpielMacherWon(): boolean {
    if (this.überReizt) { return false }

    switch (this._turnType) {
      case (TurnType.FARB || TurnType.GRAND): {
        return this.cardScores.spielMacher > this.cardScores.gegner ? true : false
      }
      case (TurnType.NULL): {
        return this._spielMacherStich ? false : true
      }
      default: {
        return false
      }
    }
  }


  private _calculateResultScores(): Map<Player, number> {
    if (this._scoringStrategy == 'spielMacher') {
      return this._spielMacherScoring()
    } else {
      return this._allScoring()
    }
  }
  private _spielMacherScoring(): Map<Player, number> {
    let scores = new Map()
    if (this.turnType == TurnType.RAMSCH) {
      scores = this._ramschScores ? this._ramschScores : new Map()
    } else {
      this._players.forEach(player => scores.set(player, 0))
      let resultScore = this._calculateResultScore()
      scores.set(this.spielMacher, this._spielMacherHasWon ? +resultScore : -2 * resultScore)
    }

    if (this._players.indexOf(this._dealer) == -1) {
      scores.set(this._dealer, 0)
    }
    return scores
  }
  private _allScoring(): Map<Player, number> {
    let scores = new Map()

    if (this.turnType == TurnType.RAMSCH) {
      scores = this._ramschScores ? this._ramschScores : new Map()
    } else {
      let resultScore = this._calculateResultScore()
      this._players.forEach(player => {
        if (player == this._spielMacher) {
          scores.set(player, this._spielMacherHasWon ? +2 * resultScore : -2 * resultScore)
        } else {
          scores.set(player, this._spielMacherHasWon ? +resultScore : -resultScore)
        }
      })
    }
    if (this._players.indexOf(this._dealer) == -1) {
      scores.set(this._dealer, 0)
    }
    return scores
  }
  private _calculateResultScore(): number {
    let score: number = 0
    let base: number
    switch (this._turnType) {
      case (TurnType.FARB): {
        base = this._farbe
      }
      case (TurnType.GRAND): {
        base = TurnType.GRAND
      }
      case (TurnType.GRAND || TurnType.FARB): {
        let { hand, ouvert, schneider, schwarz, angesagt } = this._reizMods
        let trueMults = [hand, ouvert, schneider, schwarz, angesagt].filter(value => value)
        score = base * (trueMults.length + this._reizMods.mitOhne + 1)
        break;
      }

      case (TurnType.NULL): {
        if (this._reizMods.ouvert && this._reizMods.hand) {
          score = NullScores.NULL_OUVERT_HAND
        } else if (this, this._reizMods.ouvert && !this._reizMods.hand) {
          score = NullScores.NULL_OUVERT
        } else if (!this._reizMods.ouvert && this._reizMods.hand) {
          score = NullScores.NULL_HAND
        } else {
          score = NullScores.NULL
        }
        break;
      }
    }
    for (let resultMod in this._resultMods) {
      if (this._resultMods[resultMod]) {
        score *= score
      }
    }
    return score
  }
}
