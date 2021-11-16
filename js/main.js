const cardsContainer = document.getElementById("app");
const addCardButton = document.getElementById("addCard")

getCards().forEach((card) => {
  const cardElement = createCardElement(card);
  cardsContainer.appendChild(cardElement)
});

addCardButton.addEventListener("click", () => showCardModal());

function getCards() {
  return JSON.parse(localStorage.getItem("bank-cards") || "[]");
}

function saveCards(cards) {
  localStorage.setItem("bank-cards", JSON.stringify(cards));
}

function createCardElement(cardObj) {
  const card = document.createElement("div");
  card.classList.add("bank-card");
  card.innerHTML = `
    <div class="card-buttons">
      <button class="delete-card" id="deleteCard"><i class="fas fa-trash"></i></button>
    </div>
    <div class="card-title">${cardObj.cardTitle}</div>
    <div class="card-number">
      <div id="card__number">**** **** **** ${cardObj.cardNumber.slice(-4)}</div>
      <i class="fab fa-cc-${cardObj.paymentSystem}"></i>
    </div>
    <div class="card-description">${cardObj.cardDescription}</div>
  `;

  card.addEventListener("click", (event) => {
    if (event.target.matches(".fa-trash")) {
      showDeleteModal(card)
    }
  });

  return card;
}

function addCard(cardObject = {}) {
  const cards = getCards();
  cards.push(cardObject);
  saveCards(cards);

  const cardElement = createCardElement(cardObject);
  cardsContainer.appendChild(cardElement)
}

function deleteCard(element) {
  const cards = getCards().filter((card) => card.id !== element.id);

  saveCards(cards);
  cardsContainer.removeChild(element);
}

function showDeleteModal(card) {
  const modal = document.createElement("div");

  modal.classList.add("modal")
  modal.innerHTML = `
    <div class="delete__modal__inner">
      <div class="delete__modal__content">Are you sure you want to delete this card?</div>
      <div class="delete__modal__bottom"></div>
    </div>
  `;
  document.body.appendChild(modal)

  const buttons = [
    {
      label: "Cancel",
      onClick: (modal) => {
        document.body.removeChild(modal);
      },
    },
    {
      label: "Delete",
      onClick: (modal) => {
        deleteCard(card)
        document.body.removeChild(modal);
      },
    }
  ];

  for (const button of buttons) {
    const element = document.createElement("button");

    element.setAttribute("type", "button");
    element.classList.add("modal__button");
    element.textContent = button.label;
    element.addEventListener("click", () => {
      button.onClick(modal);
    });

    modal.querySelector(".delete__modal__bottom").appendChild(element);
  }
}

function showCardModal() {

  const modal = document.createElement("div");
  modal.classList.add("modal")
  modal.innerHTML = `
    <div class="card__modal__inner">
      <form id="card__form" class="form">
        <div class="form-control">
          <label for="title">Title</label>
          <input type="text" placeholder="Card title" id="title">
        </div>
        <div class="form-control">
          <label for="number">Card number</label>
          <input type="text" id="number"/>
          <small>Error message</small>
        </div>
        <div class="form-control">
          <select name="payment_system" id="payment_system">
            <option disabled selected value >Choose payment system</option>
            <option value="visa">Visa</option>
            <option value="mastercard">Mastercard</option>
          </select>
          <small>Error message</small>
        </div>
        <div class="form-control">
          <label for="card-description">Description</label>
          <textarea type="text" placeholder="Description" id="description" maxlength="1024"></textarea>
        </div>
        <div class="card__modal__bottom">
          <button id="cancel_btn" type="button" class="modal__button">Cancel</button>
          <button id="add_btn" type="submit" class="modal__button">Add Card</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  const form = document.getElementById('card__form');
  const titleField = document.getElementById('title');
  const numberField = document.getElementById('number');
  const descriptionField = document.getElementById('description');
  const paymentSystemField = document.getElementById('payment_system')

  form.addEventListener('submit', e => {
    e.preventDefault();

    const cardId = setCardId();
    const cardTitle = titleField.value === '' ? 'Card Title' : titleField.value.trim();
    const cardNumber = numberField.value.trim();
    const cardDescription = descriptionField.value === '' ? 'Description' : descriptionField.value.trim();
    const paymentSystem = paymentSystemField.options[paymentSystemField.selectedIndex].value;

    if (!isCardNumber(cardNumber)) {
      setErrorFor(numberField, 'Card number should contain 16 numbers');
    } else if (paymentSystem === '') {
      setErrorFor(paymentSystemField, 'Choose your payment system');
    } else {
      addCard({cardId, cardTitle, cardNumber, cardDescription, paymentSystem})
      document.body.removeChild(modal);
    }
  });

  function setErrorFor(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');
    formControl.className = 'form-control error';
    small.innerText = message;
  }

  const cancelButton = document.getElementById("cancel_btn");
  cancelButton.addEventListener("click", () => {
    document.body.removeChild(modal);
  })
}

// helper methods
function isCardNumber(cardNumber) {
  return /^([0-9]{16})$/.test(cardNumber)
}

function setCardId() {
  return Math.floor(Math.random() * 1000000);
}
