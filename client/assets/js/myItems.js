const tokenLogin = sessionStorage.getItem('tokenLogin');
const btnAddItem = document.getElementById('addItem');
let addPostModal = document.getElementById('addPostModal');
let closeAddPost = document.getElementById('closeAddPost');
let addItemForm = document.getElementById('addPost-form');
let myOffers = document.getElementById('myOffers');
let downloadCSV = document.getElementById('downloadCSV');
let itemsForCurrentUser = [];

const generateHTMLForItems = (data = []) => {
  let output = '';
  let completeOptions = ``;
  let inProgressOptions = ``;
  if (data.length > 0) {
    data.forEach(({ _id, title, currency, budget, options, status, category }) => {
      const element = `<div class="offer-wrapper">
        <article >
            <a href="/views/item.html?id=${_id}">
                <div class="offer-container">
                    <h2 class="heading">${title}</h2>
                    <span class="itemsAdded">
                        <i class="fas fa-shopping-basket"></i> ${options.length}
                    </span>
                    <span class="itemsAdded">
                        <i class="fas fa-shopping-basket"></i> ${category}
                    </span>
                    
                    
                    <span class="itemsAdded">
                        <i class="fas fa-tag"></i> ${budget} ${
        currency ? currency : 'RON'
      }
                    </span>
                </div>
            </a>
        </article>
      </div>`;

      if (status.toLowerCase() === 'complete') {
        completeOptions += element;
      } else {
        inProgressOptions += element;
      }
    });
  } else {
    output += `<div class="offer-wrapper">Nici o achizitie momentan!</div>`;
  }

  if (inProgressOptions) {
    output += `
    <span> Achizitii in progres</span>
    ${inProgressOptions}
    `;
  }
  if (completeOptions) {
    output += `
    <span> Achizitii complete</span>
    ${completeOptions}
    `;
  }

  return output;
};

const renderUserItems = async (id) => {
  try {
    // Make fetch from API and saved it to sessionStorage
    const url = `${API_URL}/itemsbyuser/${id}`;
    const items = await GET_CALL(url);

    const { status, payload, error, csv } = items;
    if (status === 'ERROR') {
      checkAndHandleErrors('errorsMyItemsModal', error);
      return;
    }
    itemsForCurrentUser = payload.filter((item) => item.userId === id);
    myOffers.innerHTML = generateHTMLForItems(itemsForCurrentUser);

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    if (downloadCSV.download !== undefined) {
      var url2 = URL.createObjectURL(blob);
      downloadCSV.setAttribute('href', url2);
      downloadCSV.setAttribute('download', 'file_data.csv');
    }
    return;
  } catch (err) {
    console.log(err);
  }
};

btnAddItem.onclick = function () {
  addPostModal.style.display = 'block';
};
closeAddPost.onclick = function () {
  addPostModal.style.display = 'none';
};

window.onclick = function (event) {
  switch (event.target) {
    case addPostModal:
      addPostModal.style.display = 'none';

    default:
      break;
  }
};

const handleAddItemToBuy = async (e) => {
  e.preventDefault();
  const form = document.forms['addPost-form'];
  const title = form['title'].value;
  const price = form['price'].value;
  const description = form['description'].value;
  const currency = form['currency'].value;
  const category = form['category'].value;
  const privacy = form['privacy'].value;
  const { id: userId } = JSON.parse(tokenLogin);

  try {
    // Make fetch from API
    const url = `${API_URL}/items`;
    const body = {
      userId,
      title,
      budget: price,
      description,
      currency,
      category,
      privacy
    };

    const res = await POST_CALL(url, body);
    const { status, payload, error, csv } = await res.json();

    if (status === 'ERROR') {
      checkAndHandleErrors('errorsMyItemsModal', error);
      return;
    }

    // adding to existing items
    itemsForCurrentUser.push(payload);

    //regenerate html
    myOffers.innerHTML = generateHTMLForItems(itemsForCurrentUser);

    // hide modal
    addPostModal.style.display = 'none';
    return;
  } catch (err) {
    alert('handle catch add items');
    checkAndHandleErrors('errorsMyItemsModal', err);
  }
};

(function () {
  if (tokenLogin && tokenLogin !== 'undefined') {
    const { id } = JSON.parse(tokenLogin);

    renderUserItems(id);
  }
  addItemForm.addEventListener('submit', handleAddItemToBuy);
})();
