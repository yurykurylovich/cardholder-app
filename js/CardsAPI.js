export default class CardsAPI {
  static getAllCards() {
    const notes = JSON.parse(localStorage.getItem("bank-cards") || "[]");
    return notes;
  }

  static saveCard(cardToSave) {
    const cards = CardsAPI.getAllCards();
    const existing = cards.find((card) => card.id === cardToSave.id);
    // Edit/Update
    if (existing) {
      existing.title = cardToSave.title;
      existing.cardNumber = cardToSave.cardNumber;
      existing.description = cardToSave.description;
    } else {
      cardToSave.id = cards.slice(-1).id + 1;
      cards.push(cardToSave);
    }
    localStorage.setItem("bank-cards", JSON.stringify(cards));
  }

  static deleteCard(id) {
    const cards = CardsAPI.getAllCards();
    const newCards = cards.filter(card => card.id !== id);

    localStorage.setItem("bank-cards", JSON.stringify(newCards));
  }
}
