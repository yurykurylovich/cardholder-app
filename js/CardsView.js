export default class CardsView {
  constructor(root, {onCardSelect, onCardAdd, onCardEdit, onCardDelete} = {}) {
    this.root = root;
    this.onCardSelect = onCardSelect;
    this.onCardAdd = onCardAdd;
    this.onCardEdit = onCardEdit;
    this.onCardDelete = onCardDelete;
    this.root.innerHTML = `
      <header>
        <h2>Cardholder App</h2>
        <button id="addCard" class="add-card" type="button">+</button>
      </header>
      <div id="app"></div>
    `

    const btnAddCard = this.root.querySelector(".add-card");

    btnAddCard.addEventListener("click", () => {
      this.onCardAdd();
    })
  }
}
