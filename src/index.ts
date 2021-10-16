import Deck from "./Deck";
import Cache from "./Cache";

const main = () => {
  const deck = new Deck();
  const cache = new Cache();
  let counter = 0;
  while (deck.canWePlayFurther() && deck.getCurrentLength() > 0) {
    //console.log(deck.getCurrentLength());
    let firstCard;
    let secondCard;
    let isJokerCardByChoice = true;
    const arePairsAvailable = cache.getSimilarPairs();
    //console.log(arePairsAvailable, 13333);
    if (arePairsAvailable) {
      firstCard = deck.getCardById(arePairsAvailable[0]);
      secondCard = deck.getCardById(arePairsAvailable[1]);
    } else {
      firstCard = deck.getRandomCard();
      const similarCard = cache.getSimilarCard(firstCard);

      if (firstCard.isJoker() && similarCard) {
        isJokerCardByChoice = false;
      }

      if (similarCard) {
        secondCard = deck.getCardById(similarCard);
      } else {
        secondCard = deck.getRandomCard();

        while (firstCard.isSame(secondCard)) {
          secondCard = deck.getRandomCard();
        }
      }
    }

    if (firstCard.isEqualTo(secondCard)) {
      console.log("MATCHED", firstCard.getId(), secondCard?.getId());
      deck.removeCard(firstCard);
      deck.removeCard(secondCard);
      cache.remove(firstCard);
      cache.remove(secondCard);

      if (firstCard?.isJoker() || secondCard?.isJoker()) {
        if (isJokerCardByChoice) {
          const otherCard = firstCard?.isJoker() ? secondCard : firstCard;
          cache.setJokerValidCard(otherCard);
        } else {
          cache.removeJokerValidCard(secondCard);
        }
        //console.log([...cache.jokerValidCards], 52);
      }
    } else {
      console.log("ADDED", firstCard.getId(), secondCard?.getId());
      counter += 1;
      cache.add(firstCard);
      cache.add(secondCard);
    }
  }

  if (deck.getCurrentLength() === 0) console.log("FINISHED", counter);
  else console.log("NOT MOVABLE", counter, deck.stats);
};

main();
