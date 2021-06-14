const GET_CALL = async (url) => {
  const res = await fetch(url);
  return res.json();
};

const CALL_BE = async (url, body, method) => {
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};
const POST_CALL = async (url, body, method = 'POST') => {
  return await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};

const checkAndHandleErrors = (elementId, errors) => {
  const elementParent = document.getElementById(elementId);
  let output = '';
  if (elementParent) {
    if (typeof errors === 'string') {
      output += `<div class="error">${errors}</div>`;
      elementParent.innerHTML = output;
      elementParent.style.display = 'block';
      return;
    }
    if (typeof errors === 'object') {
      Object.values(errors).map((error) => {
        output += `<div class="error">${error}</div>\n`;
      });
      elementParent.innerHTML = output;
      elementParent.style.display = 'block';
      return;
    }
    if (Array.isArray(errors) && errors.length > 0) {
      errors.map((error) => {
        output += `<span class="error">${error}</span>`;
      });
      elementParent.innerHTML = output;
      elementParent.style.display = 'block';
    }
    elementParent.innerHTML = `<div id=${elementId}/>`;
    elementParent.style.display = 'none';
  }
};
