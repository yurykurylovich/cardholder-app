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

  const card = document.createElement("div");
  card.classList.add("bank-card");
  card.innerHTML = `
    <div class="card-buttons">
      <button class="edit-card" id="editCard">Edit</button>
      <button class="delete-card" id="deleteCard">Delete</button>
    </div>
    <div class="card-title">Card Title</div>
    <div class="card-number">
      <span>XXXXXXXXXXXX</span>
      <div>Bank Image</div>
    </div>
    <div class="card-description">${content}</div>
  `;


  // element.addEventListener("change", () => {
  //   updateCard(id, element.value);
  // });
  // const deleteCardButton = document.getElementById("deleteCard")
  // console.log(deleteCardButton)
  // deleteCardButton.addEventListener('click', () => {
  //
  // })

  card.addEventListener("click", (event) => {
    // const doDelete = confirm(
    //   "Are you sure you wish to delete this sticky card?"
    // );
    //
    // if (doDelete) {
    //   deleteCard(id, element);
    // }
    console.log("Clicked")

    if (event.target.matches(".delete-card")) {
      console.log("Delete card")
      showDeleteModal(id, card)
    }
  });

  // card.addEventListener("dblclick", () => {
  //   console.log("Double Clicked")
  //   showDeleteModal(id, element)
  // })

  return card;
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
  console.log("Delete card")
  const cards = getCards().filter((card) => card.id !== id);

  saveCards(cards);
  cardsContainer.removeChild(element);
}


function showDeleteModal(id, card) {
  const modal = document.createElement("div");

  modal.classList.add("modal")
  modal.innerHTML = `
    <div class="modal__inner">
      <div class="modal__content">Are you sure you want to delete this card?</div>
      <div class="modal__bottom"></div>
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
        deleteCard(id, card)
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

    modal.querySelector(".modal__bottom").appendChild(element);
  }
}
