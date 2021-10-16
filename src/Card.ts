export type cardStates = {
  UNMATCHED: "UNMATCHED";
  MATCHED: "MATCHED";
};

export default class Card {
  static jokerId = 0;

  id: string;
  rank: string;
  suite: string | undefined;
  currentPosition: number;
  currentState: keyof cardStates;

  constructor(cardInfo: any) {
    const { currentPosition } = cardInfo;
    if (cardInfo?.suite) {
      const { rank, suite } = cardInfo;
      this.rank = rank;
      this.suite = suite;
      this.id = `${this.rank}_${this.suite}`;
    } else {
      this.rank = "Joker";
      this.id = `${this.rank}_${Card.jokerId++}`;
    }
    this.currentPosition = currentPosition;
    this.currentState = "UNMATCHED";
  }

  setPosition = (position: number) => {
    this.currentPosition = position;
  };

  setCurrentState = (state: keyof cardStates) => {
    this.currentState = state;
  };

  getRank() {
    return this.rank;
  }

  getId() {
    return this.id;
  }

  getPosition() {
    return this.currentPosition;
  }

  isJoker() {
    return this.getRank() === "Joker";
  }

  isEqualTo(card: Card) {
    if (!this.isJoker() && !card.isJoker()) {
      return this.getRank() === card.getRank();
    }
    return true;
  }

  isSame(card: Card) {
    return this.getId() === card.getId();
  }
}
