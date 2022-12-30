import '../styles/index.css';
import '../node_modules/bootstrap/dist/js/bootstrap.js'

const countries = document.getElementById('countries');
const cities = document.getElementById('cities');

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

const startDateInFlights = document.getElementById('flightStartDate');
const endDateInFlights = document.getElementById('flightsEndDate');
const startDateInHotels = document.getElementById('hotelStartDate');
const endDateInHotels = document.getElementById('hotelEndDate');
const startDateInCars = document.getElementById('carStartDate');
const endDateInCars = document.getElementById('carEndDate');

const currentDate = new Date().setHours(3, 0, 0 ,0);

const checkDate = (startSearchingDate, endSearchingDate, startOrEnd) => () =>{
  const start = new Date(startSearchingDate.value).getTime();
  const end = new Date(endSearchingDate.value).getTime();

  if (startOrEnd === 'start') {

    return endSearchingDate <= start ? startSearchingDate.value : startSearchingDate.value = '';
  } 
  else {
    
    return start <= end ? endSearchingDate.value : endSearchingDate.value = '';
  }
};

startDateInFlights.addEventListener('change', checkDate(startDateInFlights, currentDate, 'start'));
startDateInHotels.addEventListener('change', checkDate(startDateInHotels, currentDate, 'start'));
startDateInCars.addEventListener('change', checkDate(startDateInCars, currentDate, 'start'));

endDateInFlights.addEventListener('change', checkDate(startDateInFlights, endDateInFlights, 'end'));
endDateInHotels.addEventListener('change', checkDate(startDateInHotels, endDateInHotels, 'end'));
endDateInCars.addEventListener('change', checkDate(startDateInCars, endDateInCars, 'end'));

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
  const history = JSON.parse(localStorage.getItem('history')) || [];

  const inputFormsData = form.querySelectorAll('input');
  const selectFormsData = form.querySelectorAll('select');
  
  let data = {};

  for (let input of inputFormsData) {
    data[input.dataset.key] = input.value;
  };

  for (let select of selectFormsData) {
    data[select.dataset.key] = select.value;
  };

  if (form.parentElement.className === 'flight') {
    data.type = 'flights';
    history.push(data);
  };

  if (form.parentElement.className === 'hotels') {
    data.type = 'hotels';
    history.push(data);
  };

  if (form.parentElement.className === 'cars') {
    data.type = 'cars';
    history.push(data);
  };

  localStorage.setItem('history', JSON.stringify(history));
};
