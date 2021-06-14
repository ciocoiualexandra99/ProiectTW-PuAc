const tokenLogin = sessionStorage.getItem("tokenLogin");
const btnAddItem = document.getElementById("addItem");
let addPostModal = document.getElementById("addPostModal");
let closeAddPost = document.getElementById("closeAddPost");
let addItemForm = document.getElementById("addPost-form");
let myOffers = document.getElementById("myOffers");
let downloadCSV = document.getElementById("downloadCSV");
let itemsForCurrentUser = [];
let filteredItems = [];
let allFilters = {
  filterByCategory: {
    automobile: true,
    imobiliare: true,
    others: true,
  },
  filterByStatus: {
    inProgress: true,
    complete: true,
  },
};

const generateHTMLForItems = (data = []) => {
  let output = "";
  let completeOptions = ``;
  let inProgressOptions = ``;
  if (data.length > 0) {
    data.forEach(
      ({ _id, title, currency, budget, options, status, category }) => {
        const element = `<div class="offer-wrapper">
          <article >
              <a href="/views/item.html?id=${_id}">
                  <div class="offer-container">
                      <h2 class="heading">${title}</h2>
                      <span class="itemsAdded">
                          <i class="fas fa-shopping-basket"></i> ${
                            options.length
                          }
                      </span>
                      <span class="itemsAdded">
                          <i class="fas fa-shopping-basket"></i> ${category}
                      </span>
                      
                      
                      <span class="itemsAdded">
                          <i class="fas fa-tag"></i> ${budget} ${
          currency ? currency : "RON"
        }
                      </span>
                  </div>
              </a>
          </article>
        </div>`;

        if (status.toLowerCase() === "complete") {
          completeOptions += element;
        } else {
          inProgressOptions += element;
        }
      }
    );
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

const handleCheckboxInput = ({ target: { name, checked, value } }) => {
  filteredItems = itemsForCurrentUser;
  allFilters[name][value] = checked;

  const {
    filterByStatus: { inProgress, complete },
    filterByCategory: { automobile, imobiliare, others },
  } = allFilters;

  if (!inProgress) {
    filteredItems = filteredItems.filter(
      (item) => item.status !== "In Progress"
    );
  }
  if (!complete) {
    filteredItems = filteredItems.filter(
      (item) => item.status.toLowerCase() !== "complete"
    );
  }
  if (!automobile) {
    filteredItems = filteredItems.filter(
      (item) => item.category.toLowerCase() !== "automobile"
    );
  }
  if (!imobiliare) {
    filteredItems = filteredItems.filter(
      (item) => item.category.toLowerCase() !== "imobiliare"
    );
  }
  if (!others) {
    filteredItems = filteredItems.filter(
      (item) =>
        item.category.toLowerCase() === "automobile" ||
        item.category.toLowerCase() === "imobiliare"
    );
  }

  myOffers.innerHTML = generateHTMLForItems(filteredItems);
};

const renderItems = async (id) => {
  try {
    // Make fetch from API and saved it to sessionStorage
    const url = `${API_URL}/items`;
    const items = await GET_CALL(url);

    const { status, payload, error, csv } = items;
    if (status === "ERROR") {
      checkAndHandleErrors("errorsMyItemsModal", error);
      return;
    }
    itemsForCurrentUser = payload.filter((item) => item.privacy === "public");

    myOffers.innerHTML = generateHTMLForItems(itemsForCurrentUser);

    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    if (downloadCSV.download !== undefined) {
      var url2 = URL.createObjectURL(blob);
      downloadCSV.setAttribute("href", url2);
      downloadCSV.setAttribute("download", "file_data.csv");
    }
    return;
  } catch (err) {
    console.log(err);
  }
};

(function () {
  renderItems();
})();
