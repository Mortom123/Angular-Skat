
export interface ReizModifiers {
  hand?: boolean,
  ouvert?: boolean,
  schneider?: boolean,
  schwarz?: boolean,
  angesagt?: boolean,
  mitOhne?: 1 | 2 | 3 | 4
  überReizt?: boolean
}

export const DEFAULT_REIZ_MODS: ReizModifiers = {
  hand: false,
  ouvert: false,
  schneider: false,
  schwarz: false,
  angesagt: false,
  mitOhne: 1,
  überReizt: false
}

export interface ResultModifiers {
  kontra?: boolean,
  re?: boolean,
  bock?: boolean,
}

export const DEFAULT_RESULT_MODS: ResultModifiers = {
  kontra: false,
  re: false,
  bock: false,
}
