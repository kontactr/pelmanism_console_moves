import Card from "./Card";

export const suites = ["Hearts", "Diamonds", "Spades", "Clubs"] as const;
export const ranks = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "Jack",
  "Queen",
  "King",
  "Ace"
] as const;

export default class Deck {
  uiCards: Array<Card>;
  cards: Array<Card>;
  stats: Map<typeof ranks | "Joker", number>;
  totalCards: number;
  private indexGen: number;

  constructor() {
    this.uiCards = [];
    this.cards = [];
    this.stats = new Map();
    this.totalCards = 0;
    this.indexGen = 0;
    this.cardGeneration();
    this.jokersGeneration();
    this.shuffleDeck();
    this.initUiCards();
    //console.log(new Map(this.stats), 29);
  }

  initUiCards = () => {
    this.uiCards = [...this.cards];
  };

  configureStats = (key: typeof ranks) => {
    if (this.stats.has(key)) {
      this.stats.set(key, (this.stats.get(key) || 0) + 1);
    } else {
      this.stats.set(key, 1);
    }
  };

  removeStats = (key: typeof ranks) => {
    if (this.stats.has(key)) {
      const value = (this.stats.get(key) || 0) - 1;
      if (value < 1) {
        this.stats.delete(key);
      } else {
        this.stats.set(key, value);
      }
    }
  };

  addCardTotal = () => {
    this.totalCards += 1;
  };

  deleteCardTotal = () => {
    this.totalCards -= 1;
  };

  cardGeneration = () => {
    for (let rank of ranks) {
      for (let suite of suites) {
        this.cards.push(
          new Card({ rank, suite, currentPosition: this.indexGen++ })
        );
        this.configureStats(rank);
        this.addCardTotal();
      }
    }
  };

  jokersGeneration = () => {
    for (let index = 0; index < 2; index++) {
      this.cards.push(
        new Card({
          currentPosition: this.indexGen++
        })
      );
      this.configureStats("Joker");
      this.addCardTotal();
    }
    //this.cards.push(new Card(undefined));
  };

  shuffleDeck() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = temp;

      this.cards[i].setPosition(i);
      this.cards[j].setPosition(j);
    }
  }

  removeCard = (card: Card) => {
    const cardId = card.getId();
    this.cards = this.cards.filter((cv) => {
      return cv.getId() !== cardId;
    });
    card.setCurrentState("MATCHED");
    this.removeStats(card.getRank());
    this.deleteCardTotal();
  };

  canWePlayFurther = () => {
    if (this.stats.has("Joker")) {
      return true;
    }

    for (let index = 0; index < ranks.length; index++) {
      const key = ranks[index];
      const value = this.stats.get(key);
      if (value > 1) {
        return true;
      }
    }

    return false;
  };

  getCurrentLength = () => {
    return this.totalCards;
    //return this.cards.length; //this.cards.length;
  };

  getCardById = (id: string) => {
    return this.cards.find((card) => card.getId() === id);
  };

  private getRandomNumber = () => {
    return Math.floor(Math.random() * this.getCurrentLength());
  };

  getRandomCard = () => {
    return this.cards[this.getRandomNumber()];
  };
}
