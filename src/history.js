const paginationElement = document.getElementById('pagination');
const historyContainer = document.getElementById('list')

let currentPage = 1;
let rows = 20;

const displayList = (items, wrapper, rows, page) => {
  wrapper.innerHTML = '';

  page--;

  let start = rows * page;
  let end = start + rows;
  let paginatedItems = items.slice(start, end);

  for (let i = 0; i < paginatedItems.length; i++) {
    let item = paginatedItems[i];

    let itemElement = document.createElement('div');
    itemElement.classList.add('history-item');

    for (let content in item) {
      const itemContent = document.createElement('span');
      itemContent.textContent = `${content}: ${item[content]}` + ' ';

      itemElement.appendChild(itemContent);
    };

    const removeHistotyItem = document.createElement('button');
    removeHistotyItem.className = 'btn btn-primary'
    removeHistotyItem.textContent = 'X';

    itemElement.appendChild(removeHistotyItem)

    removeHistotyItem.addEventListener('click', event => {
      const clickedElementParent = event.target.parentElement.id;
      const id = itemElement.id;
      
      if (clickedElementParent === id) {
        itemElement.remove();
        items.splice(id, 1);

        localStorage.setItem('history', JSON.stringify(items));
      };
    });

    wrapper.appendChild(itemElement);
  };

  const historyList = document.createElement('div');
  historyList.className = 'history-items';
  
  historyContainer.appendChild(historyList);
};

const paginationButton = (page, items) => {
  let button = document.createElement('button');
  button.innerText = page;
  button.className = 'btn'

  if (currentPage === page) {
    button.classList.add('active');
  };

  button.addEventListener('click', function() {
    currentPage = page;
    displayList(items,historyContainer, rows, currentPage);

    let currentButton = document.querySelector('.page-numbers button.active');
    currentButton.classList.remove('active');

    button.classList.add('active');
  });

  return button;
}

const setupPagination = (items, wrapper, rows) => {
  wrapper.innerHTML = '';

  let pageCount = Math.ceil(items.length / rows);

  for (let i = 1; i < pageCount + 1; i++) {
    let button = paginationButton(i, items);

    wrapper.appendChild(button)
  };
}

const showHistory = () => {
  const getInfoFromLocalStorage = JSON.parse(localStorage.getItem('history'));

  displayList(getInfoFromLocalStorage, historyContainer, rows, currentPage);
  setupPagination(getInfoFromLocalStorage, paginationElement,rows)
};

showHistory();
