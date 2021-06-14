let url = new URL(location.href);
let viewItemsContainer = document.getElementById('viewItems');
const btnAddPostItem = document.getElementById('addItemOption');
let addPostItemModal = document.getElementById('addPostItemModal');
let closeAddPostItem = document.getElementById('closeAddPostItem');
let addPostItemForm = document.getElementById('addPostItem-form');
let addCommentForm = document.getElementById('addComment-form');
let currentItem = null;
let itemId = url.searchParams.get('id');

let currentUser = null;

// Check if user is logged and save to value the token
const checkAuthAndCurrentUser = () => {
  const tokenFromStorage = sessionStorage.getItem('tokenLogin');
  if(tokenFromStorage){
    currentUser = JSON.parse(tokenFromStorage);
    if(currentItem){
      currentUser.isOwner = currentItem.userId === currentUser.id
    }
  }
}


// Add avent to each accordion-title to make dropdown
const addEventToToggles = () => {
  const acc = document.getElementsByClassName('accordion-title');
  for (let index = 0; index < acc.length; index++) {
    const element = acc[index];
    element.addEventListener('click', function (e) {
      this.classList.toggle('active');
    });
  }
}

// Toggle accordion title dropdown
const toggleContent = function (event) {
  event.target.classList.toggle('active');
};

// Create Output for Images
const renderHTMLImages = (images) => {
  let output = '';
  images.forEach((image) => {
    output += `
    <a href=${image} target="_blank">
    <img 
          class="image-small" 
          src=${image}
          alt="someimage"
        />
    </a>
        
      `;
  });

  return output;
};



btnAddPostItem.onclick = function () {
  addPostItemModal.style.display = 'block';
};
closeAddPostItem.onclick = function () {
  addPostItemModal.style.display = 'none';
};

window.onclick = function (event) {
  switch (event.target) {
    case addPostItemModal:
      addPostItemModal.style.display = 'none';

    default:
      break;
  }
};



const renderHTMLComments = (
  comments,
  parentID,
  isCommentFromOptions = true,
  title = 'Comentarii'
) => {
  let output = '';

  if (comments && comments.length > 0) {
    comments.forEach(({ _id, name, grade, comment, createdAt }) => {
      output += `
        <li>
          <article>
            <header class="mt-10">
            <div class="flex space-between">
              <div>
                <span class="itemsAdded"><i class="fas fa-user"></i>${name.toUpperCase()}</span>
                <span class="itemsAdded"><i class="far fa-clock"></i>${new Date(createdAt).toLocaleDateString()}</span>
                <span class="itemsAdded"><i class="fas fa-graduation-cap"></i>${grade}</span>
              </div>
              ${
                currentUser?.isOwner ? (
                `<div>
                  <button onclick='removeComment("${_id}","${parentID}", ${isCommentFromOptions})' class="removeButton btn red round space inline-block">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>`
                ):(``)
              }
              
            </div>
            
            </header>
            <p class="mt-10" >${comment}</p>
          </article>
        </li>
      `;
    });

    return `
      <p class="mb-10" >${title}</p>
      <div id="comments">
        <ul>
          ${output}
        </ul>
      </div>
    `;
  }
  return `<div class="itemsAdded inline-block mb-10 mt-10">Nici un comentariu</div>`;
};

const renderHTMLCommentForm = (_id, isCommentForOption = true) => {
  return `
  <div class="comments ml-10 mt-10 mr-15">
    <form onsubmit='addComment(event, "${_id}", "${isCommentForOption}")'  name="addComment-form-${_id}" class="login-form">
      <span>Adauga Comentariu</span>
      <input
        value="${_id}"
        name="id"
        style="display:none"
        hidden
        />
      <div class="flex">

        <input
        class="mr-10"
          type="text"
          name="name"
          autocomplete="name"
          required
          placeholder="Name*"
          minlength="3"
        />
        <input
          type="number"
          name="grade"
          autocomplete="grade"
          step="0.01"
          max="10"
          placeholder="Grade*"
          required
        />
      </div>
      <textarea
      class="mb-10"
      name="comment"
      autocomplete="description"
      required
      placeholder="Descriere*"
      ></textarea>
      
      <div>
        <button class="btn green inline-block" type="submit">Add Comment</button>
        <button class="btn red inline-block" type="reset">Reset</button>
      </div>

    </form>
  </div>
  
  `;
};

const renderHTMLForOptions = (options) => {
  let output = '';
  options.forEach((element) => {
    const { _id, title, description, link, price, images, comments, currency } =
      element;
    output += `
    <div class="accordion-item">
      <div class="accordion-title" onClick="toggleContent(event)"> ${title}
      </div>
      <div class="accordion-content">
        <div class="flex">
        <div>
        <span class="itemsAdded">
            <i class="fas fa-comments"></i> ${comments.length} 
            </span>
            <span class="itemsAdded">
                <i class="fas fa-tag"></i> ${price}  ${currency} 
            </span>
            <a href="${link}" target="_blank">
              <span class="itemsAdded">
              <i class="fas fa-link"></i> View Site
              </span>
            </a>
        </div>
        ${
          currentUser?.isOwner ? (
          ` <div>
              <button onClick='removeOption("${_id}")' class="removeButton btn round red space inline-block">
              <i class="fas fa-trash-alt"></i>
              </button>
          </div>`
          ):(``)
        }

        </div>
        <p class="mb-10">${description}</p>
        
        ${renderHTMLImages(images)}
        <div style="min-height: 50px"></div>
        <hr/>
        ${renderHTMLCommentForm(_id)}
        ${renderHTMLComments(comments, _id)}
      </div>
    </div>
`;
  });

  return output;
};

const addComment = async (e, _id, isCommentForOption = true) => {
  e.preventDefault();
  const currentForm = document.forms[`addComment-form-${_id}`];
  const name = currentForm['name'].value;
  const grade = currentForm['grade'].value;
  const comment = currentForm['comment'].value;
  const idForItem = currentForm['id'].value;
  if (isCommentForOption === 'false') isCommentForOption = false;
  if (isCommentForOption === 'true') isCommentForOption = true;

  try {
    // Make fetch from API
    const url = `${API_URL}/items/${itemId}`;
    const newComment = {
      name,
      grade,
      comment,
    };
    let body = {};

    if (isCommentForOption) {
      const options = currentItem.options.map((option) => {
        if (option._id === idForItem) {
          option.comments.push(newComment);
        }
        return option;
      });

      body = { options };
    } else {
      const comments = [...currentItem.comments, newComment];
      body = { comments };
    }

    const res = await POST_CALL(url, body, 'PATCH');
    const { status, error } = await res.json();

    if (status === 'ERROR') {
      checkAndHandleErrors('errors', error);
      return;
    }
    location.reload();
  } catch (err) {
    checkAndHandleErrors('errors', err);
  }
};

// ID = comment ID, parentID = element where the comment is
const removeComment = async (ID, parentID, isCommentFromOptions = true) => {
  if (isCommentFromOptions === 'false') isCommentFromOptions = false;
  if (isCommentFromOptions === 'true') isCommentFromOptions = true;

  try {
    const url = `${API_URL}/items/${itemId}`;
    let body = {};

    if (isCommentFromOptions) {
      currentItem.options = currentItem.options.map((option) => {
        if (option._id === parentID) {
          option.comments = option.comments.filter(
            (comment) => comment._id !== ID
          );
        }
        return option;
      });

      body = {
        options: currentItem.options,
      };
    } else {
      currentItem.comments = currentItem.comments.filter(
        (comment) => comment._id !== ID
      );
      body = {
        comments: currentItem.comments,
      };
    }

    const res = await POST_CALL(url, body, 'PATCH');
    const { status, error } = await res.json();

    if (status === 'ERROR') {
      checkAndHandleErrors('errors', error);
      return;
    }

    location.reload();
  } catch (err) {
    checkAndHandleErrors('errors', err);
  }
};

const removeOption = async (ID) => {
  try {
    // Make fetch from API
    const url = `${API_URL}/items/${itemId}`;
    const options = currentItem.options.filter((option) => option._id !== ID);

    const res = await POST_CALL(url, { options }, 'PATCH');
    const { status, error } = await res.json();

    if (status === 'ERROR') {
      checkAndHandleErrors('errors', error);
      return;
    }

    location.reload();
  } catch (err) {
    checkAndHandleErrors('errors', err);
  }
};

const renderHTMLForItem = (data) => {
  const {
    _id,
    userId,
    title,
    budget,
    category = '',
    description,
    status,
    options,
    currency,
    comments = [],
  } = data;
  const isComplete =
    status === 'Complete'
      ? ''
      : ` <button
          onClick='onClickComplete("${_id}")'
          title="Set To Complete"
          class='btn inline-block round green space'
        >
          <i class='far fa-check-square'></i>
        </button>
      `;

  const output = `
        <div id='aa222' class="offer-wrapper">
            <article>
            <h2 class="heading ml-10"> ${title} </h2>
              <div class="flex">
                <div>
                  <span class="itemsAdded">
                    <i class="fas fa-shopping-basket"></i> ${options.length} 
                  </span>
                  <span class="itemsAdded">
                  <i class="fas fa-tag"></i> ${budget} ${currency}
                  </span>
                  <span class="itemsAdded">
                  <i class="fas fa-tag"></i> ${status}
                  </span>
                  <span class="itemsAdded">
                  <i class="fas fa-tag"></i> ${category}
                  </span>
                  <span class="itemsAdded">
                  <i class="fas fa-tag"></i> ${_id}
                  </span>
                </div>
                <div>
                  ${isComplete}
                  ${
                    currentUser?.isOwner ? (
                      `
                        <button onClick='removeItem("${_id}")' class="removeButton btn inline-block  round red space">
                          <i class="fas fa-trash-alt"></i>
                        </button>
                      `
                    ) : (``)
                  }
                  
                </div>
                
              </div>
              <div class="itemsAdded inline-block mb-10 ml-10">
              ${description}
              </div>
              ${
                options.length > 1 ?(
`
<select class="ml-10 inline-block"  id="select-${_id}" onchange="filterItems('${_id}');">
                <option value="date_asc" >Filtreaza</option>
                <option value="date_desc" >Cele mai recente</option>
                <option value="comments_desc" >Cele mai multe comentarii</option>
                <option value="title_asc" >Alfabetic A-Z</option>
                <option value="title_desc" >Alfabetic Z-A</option>
                <option value="grade_asc" >Cea mai mica medie a notelor</option>
                <option value="grade_desc" >Cea mai mare medie a notelor</option>
              </select>
`
                ):(``)
              }
              

              <div id="option-${_id}"  class="accordion ml-10">
                ${renderHTMLForOptions(options)}
              </div>
              <div style="min-height: 100px"></div>
              ${renderHTMLCommentForm(_id, false)}
              ${renderHTMLComments(comments, _id, false)}
            </article>
          </div>

  `;

  return output;
};

const averageNumbers = array => {
  if(!array || array.length < 1) return 0;
  return array.reduce((acc, current) => acc + current, 0) / array.length
}

const filterItems = (ID) => {
  const sortItem = document.getElementById(`select-${ID}`).value;
  const { options } = currentItem;

  if(!options || options.length < 1)
    return ;

  switch(sortItem){
    case 'date_desc':
      options.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'title_asc':
      options.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))

      break;
    case 'title_desc':
      options.sort((a,b) => (a.title < b.title) ? 1 : ((b.title < a.title) ? -1 : 0))
      break;
    case 'grade_asc':
      options.sort((a,b) => {
        const averageA = averageNumbers(a.comments.map(el => el.grade))
        const averageB = averageNumbers(b.comments.map(el => el.grade))
        return averageA > averageB ? 1 : (averageB > averageA ? -1 : 0)
      })
      break;
    case 'grade_desc':
      options.sort((a,b) => {
        const averageA = averageNumbers(a.comments.map(el => el.grade))
        const averageB = averageNumbers(b.comments.map(el => el.grade))
        return averageA < averageB ? 1 : (averageB < averageA ? -1 : 0)
      });
      break;
    case 'comments_desc':
      options.sort((a, b) => b.comments.length - a.comments.length);
      break;
    default:
      break;
  }
  document.getElementById(`option-${ID}`).innerHTML = renderHTMLForOptions(options)
};

const removeItem = async (ID) => {
  try {
    // Make fetch from API
    const url = `${API_URL}/items/${ID}`;

    const res = await POST_CALL(url, {}, 'DELETE');
    const { status, error } = await res.json();

    if (status === 'ERROR') {
      checkAndHandleErrors('errors', error);
      return;
    }

    location.href = '/views/items.html';
  } catch (err) {
    checkAndHandleErrors('errors', err);
  }
};

const onClickComplete = async (ID) => {
  try {
    // Make fetch from API
    const url = `${API_URL}/items/${ID}`;
    const body = {
      status: 'Complete',
    };

    const res = await POST_CALL(url, body, 'PATCH');
    const { status, payload, error } = await res.json();

    if (status === 'ERROR') {
      checkAndHandleErrors('errors', error);
      return;
    }

    location.reload();
  } catch (err) {
    checkAndHandleErrors('errors', err);
  }
};

const renderItem = async (ID) => {
  try {
    const url = `${API_URL}/items/${ID}`;
    const item = await GET_CALL(url);

    const { status, payload, error } = item;

    if (status === 'ERROR') {
      checkAndHandleErrors('errorsMyItemsModal', error);
      return;
    }

    // Save current item
    currentItem = payload;
    // set currentUser and check to see if is owner
    checkAuthAndCurrentUser();
    btnAddPostItem.style.display = currentUser?.isOwner  ? 'block':'none';

    
    viewItemsContainer.innerHTML = renderHTMLForItem(payload);

    return;
  } catch (err) {
    checkAndHandleErrors('errorsMyItemsModal', err);
  }
};

const handleSubmitPostItemForm = async (e) => {
  e.preventDefault();
  const registerForm = document.forms['addPostItem-form'];
  const title = registerForm['title'].value;
  const price = registerForm['price'].value;
  const urlLink = registerForm['urlLink'].value;
  const description = registerForm['description'].value;
  const currency = registerForm['currency'].value;
  const images = registerForm['image-offer'];
  const arrOfImages = [];

  images.forEach((element) => {
    if (element.value) arrOfImages.push(element.value);
  });

  try {
    // Make fetch from API
    const url = `${API_URL}/items/${itemId}`;
    const body = {
      title,
      price,
      link: urlLink,
      description,
      images: arrOfImages,
      currency,
    };
    const options = [...currentItem.options, body];
    currentItem.options.push(body);

    const res = await POST_CALL(url, { options }, 'PATCH');
    const { status, error } = await res.json();

    if (status === 'ERROR') {
      checkAndHandleErrors('errors', error);
      return;
    }

    location.reload();
  } catch (err) {
    checkAndHandleErrors('errors', err);
  }
};


(function () {
  addEventToToggles();
  
  if (itemId) {
    renderItem(itemId);
  }
  addPostItemForm.addEventListener('submit', handleSubmitPostItemForm);
})();
