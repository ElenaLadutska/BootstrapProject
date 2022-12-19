const paginationElement = document.getElementById('pagination');
const historyContainer = document.getElementById('list');

let currentPage = 1;
let rows = 20;

const displayList = (pagination, wrapper, rows, page) => {
  wrapper.innerHTML = '';

  page--;

  let start = rows * page;
  let end = start + rows;
  let paginatedItems = pagination.slice(start, end);

  for (let i = 0; i < paginatedItems.length; i++) {
    let item = paginatedItems[i];

    let itemElement = document.createElement('div');
    itemElement.classList.add('history-item');

    const icon = document.createElement('i');
    if (item.type === 'flights') {
      icon.className = "bi bi-airplane-fill";
      };

    if (item.type === 'cars') {
      icon.className = "bi bi-car-front-fill";
    };

    if (item.type === 'hotels') {
      icon.className = "fa-solid fa-bed";
    };

    itemElement.appendChild(icon);

    for (let content in item) {
      const itemContent = document.createElement('span');
      if (content !== 'type') {
        itemContent.textContent = `${content}: ${item[content]}` + ' ';
      };

      const containerItems = Array.from(historyContainer.children);
      containerItems.forEach((elem, id) => elem.id = id++);

      itemElement.appendChild(itemContent);
      wrapper.appendChild(itemElement)
    };
    
    const removeHistotyItem = document.createElement('button');

      removeHistotyItem.className = 'btn btn-primary'
      removeHistotyItem.textContent = 'X';

      itemElement.appendChild(removeHistotyItem);

      removeHistotyItem.addEventListener('click', event => {
        const clickedElementParent = event.target.parentElement;
        const id = clickedElementParent.id;
        
        if (id === itemElement.id){
          itemElement.remove();
          paginatedItems.splice(id, 1);

          console.log(paginatedItems)
          localStorage.setItem('history', JSON.stringify(paginatedItems));
        };
      });
  };
};

const showHistory = () => {
  const getInfoFromLS = JSON.parse(localStorage.getItem('history'));

  const paginationButton = (page) => {
    let button = document.createElement('button');
    button.innerText = page;
    button.className = 'btn'
  
    if (currentPage === page) {
      button.classList.add('active');
    };
  
    button.addEventListener('click', function() {
      currentPage = page;
      displayList(itemsForPagination, historyContainer, rows, currentPage);
  
      let currentButton = document.querySelector('.page-numbers button.active');
      currentButton.classList.remove('active');
  
      button.classList.add('active');
    });
  
    return button;
  };
  
  const setupPagination = (items, wrapper, rows) => {
    wrapper.innerHTML = '';
  
    let pageCount = Math.ceil(items.length / rows);
  
    for (let i = 1; i < pageCount + 1; i++) {
      let button = paginationButton(i, items);
  
      wrapper.appendChild(button);
    };
  }

  displayList(getInfoFromLS, historyContainer, rows, currentPage);
  setupPagination(getInfoFromLS, paginationElement,rows)
};

window.addEventListener('load', showHistory);

