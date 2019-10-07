export class TurnState {
  readonly name: 'dealing' | 'reizen' | 'playing' | 'summarizing' | 'completed'
  readonly next?: TurnState

  static COMPLETED: TurnState = {
    name: 'completed',
  }

  static SUMMARIZING: TurnState = {
    name: 'summarizing',
    next: TurnState.COMPLETED
  }

  static PLAYING: TurnState = {
    name: 'playing',
    next: TurnState.SUMMARIZING
  }

  static REIZEN: TurnState = {
    name: 'reizen',
    next: TurnState.PLAYING
  }

  static DEALING: TurnState = {
    name: "dealing",
    next: TurnState.REIZEN
  }

}
