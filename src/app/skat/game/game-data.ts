export abstract class TurnType{
  static GRAND = {name: "grand"}
  static RAMSCH = {name: "ramsch"}
  static NULL = {name: "null"}
  static FARB = {name: "farb"}
}

export enum NullScores {
  NULL = 23,
  NULL_HAND = 35,
  NULL_OUVERT = 46,
  NULL_OUVERT_HAND = 59
}

export enum Farben {
  KREUZ = 12,
  PIK = 11,
  HERZ = 10,
  KARO = 9
}

