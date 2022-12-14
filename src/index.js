const countries = document.getElementById('countries');
const btnCountry = document.getElementById('btn-country');
const cities = document.getElementById('cities');
const btnCity = document.getElementById('btn-city');

const getCountries = fetch('https://namaztimes.kz/ru/api/country')
  .then(response => response.json())
  .then(result => showCountry(result));

const getState = async (chosenCountryId) => {
  const response = await fetch(`https://namaztimes.kz/ru/api/states?id=${chosenCountryId}`);
  const result = await response.json();

  return getCities(result);
};

const getCities = async (state) => {
  const cities = [];

  for (const states of Object.keys(state)) {
    const response = await fetch(`https://namaztimes.kz/ru/api/cities?id=${states}&type=json`);
    const result = await response.json();

    cities.push(result);
  };

  return showCity(cities);
};

const showCountry = (place) => {
  for (const  countryName of Object.values(place)) {
    const elemCountry = document.createElement('option');

    elemCountry.innerHTML = countryName;
    elemCountry.value = countryName;

    countries.appendChild(elemCountry);
  };

  countries.addEventListener('click', event => {
    const chosenCountryId = event.target.selectedIndex;

    getState(chosenCountryId);
    
    while (cities.firstChild) {
      cities.removeChild(cities.firstChild);
    };
  });
};

const showCity = (place) => {
  for (const city of Object.values(place)) {
    for (const cityName of Object.values(city)) {
      const elemCity = document.createElement('option');

      elemCity.innerHTML = cityName;

      cities.appendChild(elemCity);
    };
  };
};

const startDateInFlights = document.getElementById('startDate1');
const endDateInFlights = document.getElementById('endDate1');
const startDateInHotels = document.getElementById('startDate2');
const endDateInHotels = document.getElementById('endDate2');
const startDateInCars = document.getElementById('startDate3');
const endDateInCars = document.getElementById('endDate3');

const currentDate = new Date().setHours(3, 0, 0 ,0);

const checkStartDate = (chosenDate, current) => () => {
  const start = new Date(chosenDate.value).getTime();

  return current <= start ? chosenDate.value : chosenDate.value = '';
};

const checkEndDate = (start, end) => () => {
  const startDate = new Date(start.value).getTime();
  const endDate = new Date(end.value).getTime();

  return startDate <= endDate ? end.value : end.value = '';
};

startDateInFlights.addEventListener('change', checkStartDate(startDateInFlights, currentDate));
startDateInHotels.addEventListener('change', checkStartDate(startDateInHotels, currentDate));
startDateInCars.addEventListener('change', checkStartDate(startDateInCars, currentDate));

endDateInFlights.addEventListener('change', checkEndDate(startDateInFlights, endDateInFlights));
endDateInHotels.addEventListener('change', checkEndDate(startDateInHotels, endDateInHotels));
endDateInCars.addEventListener('change', checkEndDate(startDateInCars, endDateInCars));

const isFormFilled = () => {
  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    const btn = form.querySelector('button[type="submit"]');

    form.addEventListener('change', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      else {
        btn.disabled = false;
      };

    }, false);

    btn.addEventListener('click', event => {
      event.preventDefault();
      getDataFromSubmitForm(form);
    });
  })
}
isFormFilled();

const getDataFromSubmitForm = (form) => {
  let history = JSON.parse(localStorage.getItem('history')) || [];

  const inputFormsData = form.querySelectorAll('input');
  const selectFormsData = form.querySelectorAll('select');
  
  let data = {};

  for (let input of inputFormsData) {
    data[input.dataset.key] = input.value;
  };

  for (let select of selectFormsData) {
    data[select.dataset.key] = select.value;
  };

  history.push(data);

  localStorage.setItem('history', JSON.stringify(history));
};
