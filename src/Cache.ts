import Card from "./Card";

export default class Cache {
  hashMap: Map<
    String,
    Array<{
      id: string;
      currentPosition: number;
    }>
  >;

  jokerValidCards: Array<string>;

  constructor() {
    this.hashMap = new Map();
    this.jokerValidCards = [];
  }

  add = (card: Card) => {
    const key = card.getRank();
    const value = {
      id: card.getId(),
      currentPosition: card.getPosition()
    };
    if (this.hashMap.has(key)) {
      const values = this.hashMap.get(key);
      if (values && values.find((v) => v.id === card.getId())) {
        return;
      }
      values.push(value);
    } else {
      this.hashMap.set(key, [value]);
    }
  };

  remove = (card: Card) => {
    const key = card.getRank();
    const cardId = card.getId();
    if (this.hashMap.has(key)) {
      let values = this.hashMap.get(key);
      values = values.filter((v) => v.id !== cardId);
      if (values.length) {
        this.hashMap.set(key, values);
      } else {
        this.hashMap.delete(key);
      }
    }
  };

  setJokerValidCard = (card: Card) => {
    const key = card.getRank();
    this.jokerValidCards.push(key);
  };

  removeJokerValidCard = (card: Card) => {
    const key = card.getRank();
    const cards = this.jokerValidCards;
    const idx = cards.findIndex((c) => c === key);
    this.jokerValidCards = cards.splice(idx, 1);
  };

  getJokerDescKey = (card: Card) => {
    if (card.isJoker()) {
      if (this.jokerValidCards.length) {
        for (let index = 0; index < this.jokerValidCards.length; index++) {
          const tempKey = this.jokerValidCards[index];
          if (this.hashMap.has(tempKey)) {
            return tempKey;
          }
        }
      }
    }
    return undefined;
  };

  getSimilarCard = (card: Card) => {
    const cardId = card.getId();
    const key = this.getJokerDescKey(card) || card.getRank();

    // const jokerResolvanceKey = this.getJokerDescKey(card)
    // if(jokerResolvanceKey){

    // }

    if (this.hashMap.has(key)) {
      const values = this.hashMap.get(key);
      const similarCard = values.find((cv) => cv.id !== cardId);
      if (similarCard) {
        return similarCard.id;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  };

  getSimilarPairs() {
    for (const key of this.hashMap.keys()) {
      const values = this.hashMap.get(key);
      if (values && values?.length >= 2) {
        const result = [values[0].id, values[1].id];
        return result;
      }
    }
    return undefined;
  }
}
