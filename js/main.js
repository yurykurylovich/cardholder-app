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
      <button class="edit-card" id="editCard"><i class="fas fa-edit"></i></button>
      <button class="delete-card" id="deleteCard"><i class="fas fa-trash"></i></button>
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

    if (event.target.matches(".fa-trash")) {
      showDeleteModal(id, card)
    } else if (event.target.matches(".fa-edit")) {
      console.log("EDIT CARD PRESSED")
      showCardModal(id, card)
    }
  });

  return card;
}

function addCard(cardInfo = {}) {
  const cards = getCards();
  const cardObject = {
    id: Math.floor(Math.random() * 100000),
    content: cardInfo.title || '',
    cardNumber: cardInfo.number || '',
    cardDescription: cardInfo.description || '',
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


function showDeleteModal(id, card) {
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

    modal.querySelector(".delete__modal__bottom").appendChild(element);
  }
}

function showCardModal(id, card) {
  const modal = document.createElement("div");
  modal.classList.add("modal")
  modal.innerHTML = `
    <div class="card__modal__inner">
      <form id="card__form" class="form">
        <div class="form-control">
          <label for="title">Title</label>
          <input type="text" placeholder="Card title" id="title"/>
        </div>
        <div class="form-control">
          <label for="number">Card number</label>
          <input type="text" placeholder="Description" id="number"/>
          <small>Error message</small>
        </div>
        <div class="form-control">
          <label for="card-description">Description</label>
          <textarea type="text" placeholder="Description" id="card-description" maxlength="1024"></textarea>
        </div>
        <div class="card__modal__bottom"></div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  const form = document.getElementById('card__form');
  const title = document.getElementById('title');
  const number = document.getElementById('number');
  const description = document.getElementById('description');

  form.addEventListener('submit', e => {
    e.preventDefault();

    if(checkInputs() === true) {

    }
  });

  function checkInputs() {
    const titleValue = title.value.trim();
    const numberValue = number.value.trim();
    const descriptionValue = description.value.trim();

    if(!isCardNumber(numberValue)) {
      setErrorFor(number, 'Card number should contain 16 numbers');
      return false;
    }

    return true;
  }

  function setErrorFor(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');
    formControl.className = 'form-control error';
    small.innerText = message;
  }

  function isCardNumber(cardNumber) {
    return /^([0-9]{16})$/.test(cardNumber)
  }



  const buttons = [
    {
      label: "Cancel",
      onClick: (modal) => {
        document.body.removeChild(modal);
      },
    },
    {
      label: "Save",
      onClick: (modal) => {
        // deleteCard(id, card)
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

    modal.querySelector(".card__modal__bottom").appendChild(element);
  }

}
