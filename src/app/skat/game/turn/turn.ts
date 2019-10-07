import { TurnType, NullScores, Farben } from '../game-data';
import { TurnState } from './turn-state';
import { ReizModifiers, DEFAULT_REIZ_MODS, ResultModifiers, DEFAULT_RESULT_MODS } from './turn-modifiers'
import { Player } from '../../../player/player'
import { Subject } from 'rxjs'

export type TurnScores = Map<Player, number>

/** 
 * order:
 * DEALING -> REIZEN -> PLAYING -> SUMMARIZING -> COMPLETED
 * important setters:
 *  1. [[constructor]]
 *  2. [[spielMacher]]
 *  3. [[reizMods]]
 *  4. [[resultMods]]
 *  5. [[turnType]] ||  || 
 * 
 *  6. RAMSCH 
 *    1. (OPT) [[ramschScores]]
 *  6. FARB / GRAND / NULL
 *    1. (OPT) [[farbe]] || [[¢ardScores]]
 *    2. [[mitOhne]]
 *    3. (OPT) [[spielMacherStich()]] 
 */
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
  resultScores: TurnScores

  private _ramschScores: Map<Player, number>
  private _cardScores: { spielMacher: number, gegner: number }

  private _changeDetection = new Subject<any>()

  constructor(private _players: [Player, Player, Player],
    private _dealer?: Player, readonly turnNumber?: number) {
    this._changeDetection.subscribe(() => {
      this._runChangeDetection()
    })
  }

  private _runChangeDetection() {
    if (this._turnType && this._cardScores) {
      this._spielMacherHasWon = this._hasSpielMacherWon()
    }
    if (this._scoresAreCalculatable()) {
      this.resultScores = this._calculateResultScores()
    }
    if (this._state == TurnState.COMPLETED && this._onComplete) {
      this._onComplete()
    }
  }
  /**
   * DEALING -> REIZEN -> PLAYING -> SUMMARIZING -> COMPLETED
   */
  nextPhase() {
    this._state = this._state.next || TurnState.COMPLETED
    this._changeDetection.next()
  }
  isCompleted(): boolean {
    return this._state == TurnState.COMPLETED
  }
  private _onComplete
  onComplete(fn: () => any) {
    this._onComplete = fn
  }

  get state() {return this._state}

  get dealer(): Player { return this._dealer }
  set dealer(dealer: Player) {
    this._dealer = dealer
    this._changeDetection.next()
  }
  get spielMacher(): Player { return this._spielMacher }
  set spielMacher(spielMacher: Player) {
    this._spielMacher = spielMacher
    this._changeDetection.next()
  }
  get turnType(): TurnType { return this._turnType }
  set turnType(turnType: TurnType) {
    this._turnType = turnType
    this._changeDetection.next()
  }
  get farbe(): Farben { return this._farbe }
  set farbe(farbe: Farben) {
    this._turnType = TurnType.FARB
    this._farbe = farbe
    this._changeDetection.next()

  }
  get reizModifiers(): ReizModifiers { return this._reizMods }
  set reizMods(mods: ReizModifiers) {

    this._reizMods = { ...this._reizMods, ...mods }
    if ((this._reizMods.schneider || this._reizMods.schwarz)
      && this._state == TurnState.REIZEN) {
      this._reizMods.angesagt = true
    }
    this._changeDetection.next()

  }
  get resultModifiers(): ResultModifiers { return this._resultMods }
  set resultMods(mods: ResultModifiers) {

    this._resultMods = { ...this._resultMods, ...mods }
    if (this._resultMods.re) {
      this._resultMods.kontra = true
    }
    this._changeDetection.next()

  }
  get reizWert(): number { return this._reizWert }
  set reizWert(reizWert: number) {
    this._reizWert = reizWert
    this._changeDetection.next()
  }
  get scoringStrategy() { return this._scoringStrategy }
  set scoringStrategy(strat: 'all' | 'spielMacher') {
    this._scoringStrategy = strat
    this._changeDetection.next()
  }
  get ramschScores() { return this._ramschScores }
  set ramschWithScores(scores: Map<Player, number>) {
    this._turnType = TurnType.RAMSCH
    this._ramschScores = scores
    this._cardScores = { spielMacher: 0, gegner: 0 }
    this._changeDetection.next()
  }
  get cardScores() { return this._cardScores }
  set cardScores(scores: { spielMacher: number, gegner: number }) {
    if (scores.spielMacher + scores.gegner > 120) {
      throw Error("invalid scores")
    }
    this._cardScores = scores

    if (!this._reizMods.angesagt && this._turnType != TurnType.NULL) {
      if (scores.spielMacher >= 90) {
        this._reizMods.schneider = true
      }
      if (scores.spielMacher == 120) {
        this._reizMods.schwarz = true
      }
    } else if (this._turnType == TurnType.NULL) {
      if (scores.spielMacher > 0) {
        this._spielMacherStich = true
      }
    }
    this._changeDetection.next()

  }
  set überReizt(bool: boolean) {
    this._reizMods.überReizt = bool
    this._changeDetection.next()
  }
  get überReizt() { return this._reizMods.überReizt }

  set mitOhne(amount: 1 | 2 | 3 | 4) {
    this._reizMods.mitOhne = amount
    this._changeDetection.next()
  }
  get spielMacherHasWon(): boolean { return this._spielMacherHasWon }

  spielMacherSticht(): boolean {
    if (this.isCompleted) {
      return false
    } else {
      this._spielMacherStich = true
      this._changeDetection.next()
      return true
    }

  }
  spielMacherÜberreizt(updateReizMods?): boolean {
    let returnValue = this._reizWert > this._calculateMaxReiz()
    if (updateReizMods) {
      this.überReizt = returnValue
    }
    return returnValue
  }
  _calculateMaxReiz(): number {
    switch (this._turnType) {
      case (TurnType.RAMSCH): {
        return 0
      }
      case (TurnType.GRAND):
      case (TurnType.FARB): {
        let base = this._turnType == TurnType.GRAND ? 24 : this._farbe
        let { hand, ouvert, schneider, schwarz, angesagt } = this._reizMods
        let trueMults = [hand, ouvert, schneider, schwarz, angesagt].filter(value => value)
        return base * (trueMults.length + this._reizMods.mitOhne + 1)
      }
      case (TurnType.NULL): {
        if (this._reizMods.ouvert && this._reizMods.hand) {
          return NullScores.NULL_OUVERT_HAND
        } else if (this, this._reizMods.ouvert && !this._reizMods.hand) {
          return NullScores.NULL_OUVERT
        } else if (!this._reizMods.ouvert && this._reizMods.hand) {
          return NullScores.NULL_HAND
        } else {
          return NullScores.NULL
        }
      }
    }
  }

  private _hasSpielMacherWon(): boolean {
    if (this.überReizt) { return false }

    switch (this._turnType) {
      case (TurnType.GRAND):
      case (TurnType.FARB): {
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

  private _scoresAreCalculatable() {
    if (this._spielMacher == undefined || this._cardScores == undefined) {
      return false
    }

    if (this._turnType == TurnType.FARB || this._turnType == TurnType.GRAND) {
      return this._reizMods.mitOhne != undefined
    } else if (this._turnType == TurnType.NULL) {
      return true
    } else if (this._turnType == TurnType.RAMSCH) {
      return this._ramschScores != undefined
    }
    return false
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

    if (this._dealer && this._players.indexOf(this._dealer) == -1) {
      scores.set(this._dealer, 0)
    }
    return scores
  }
  private _allScoring(): Map<Player, number> {
    let scores = new Map()

    if (this._turnType == TurnType.RAMSCH) {
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
    if (this._dealer && this._players.indexOf(this._dealer) == -1) {
      scores.set(this._dealer, 0)
    }
    return scores
  }

  private _calculateResultScore(): number {
    let score: number = this._calculateMaxReiz()
    for (let resultMod in this._resultMods) {
      if (this._resultMods[resultMod]) {
        score *= 2
      }
    }
    return score
  }
}
