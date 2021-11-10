const cardsContainer = document.getElementById("app");
const addCardButton = document.getElementById("addCard")

getCards().forEach((card) => {
  const cardElement = createCardElement(card.id, card.content);
  cardsContainer.appendChild(cardElement)
});

addCardButton.addEventListener("click", () => addCard());

function getCards() {
  return JSON.parse(localStorage.getItem("bank-cards") || "[]");
}

function saveCards(cards) {
  localStorage.setItem("bank-cards", JSON.stringify(cards));
}

function createCardElement(id, content) {
  const element = document.createElement("textarea");

  element.classList.add("card");
  element.value = content;
  element.placeholder = "Empty Sticky card";

  element.addEventListener("change", () => {
    updateCard(id, element.value);
  });

  element.addEventListener("dblclick", () => {
    const doDelete = confirm(
      "Are you sure you wish to delete this sticky card?"
    );

    if (doDelete) {
      deleteCard(id, element);
    }
  });

  return element;
}

function addCard() {
  const cards = getCards();
  const cardObject = {
    id: Math.floor(Math.random() * 100000),
    content: ""
  };

  const cardElement = createCardElement(cardObject.id, cardObject.content);
  cardsContainer.appendChild(cardElement)

  cards.push(cardObject);
  saveCards(cards);
}


function updateCard(id, newContent) {
  const cards = getCards();
  const targetCard = cards.filter((card) => card.id === id)[0];

  targetCard.content = newContent;
  saveCards(cards);
}


function deleteCard(id, element) {
  const cards = getCards().filter((card) => card.id !== id);

  saveCards(cards);
  cardsContainer.removeChild(element);
}



function showDeleteModal(id, element) {
  const modal = document.createElement("div");

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
        deleteCard(id, element)
        document.body.removeChild(modal);
      },
    }
  ];

  modal.classList.add("modal")
  modal.innerHTML = `
    <div class="modal__inner">
      <div class="modal__content">Are you sure you want to delete this card?</div>
      <div class="modal__bottom"></div>
    </div>
  `;
  for (const button of buttons) {
    const element = document.createElement("button");

    element.setAttribute("type", "button");
    element.classList.add("modal__button");
    element.textContent = button.label;
    element.addEventListener("click", () => {
      button.onClick(modal);
    });

    modal.querySelector(".modal__bottom").appendChild(element);
  }
}
