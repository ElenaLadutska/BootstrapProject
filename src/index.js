const countries = document.getElementById('countries');
const btnCountry = document.getElementById('btn-country');
const cities = document.getElementById('cities');
const btnCity = document.getElementById('btn-city');

const getCountries = fetch('https://namaztimes.kz/ru/api/country')
  .then(response => response.json())
  .then(result => showCountry(result));

const getState = async (countryId) => {
  const response = await fetch(`https://namaztimes.kz/ru/api/states?id=${countryId}`);
  const result = await response.json();

  return getCities(result);
}

const getCities = async (state) => {
  const cities = [];

  for (const states of Object.keys(state)) {
    const response = await fetch(`https://namaztimes.kz/ru/api/cities?id=${states}&type=json`);
    const result = await response.json();

    cities.push(result);
  };

  return showCity(cities);
} 

const showCountry = (place) => {
  for (const [countryId, countryName] of Object.entries(place)) {
    const elemCountry = document.createElement('option');

    elemCountry.innerHTML = countryName;
    elemCountry.value = countryId;

    countries.appendChild(elemCountry);
  };

  countries.addEventListener('change', event => {
    const countryId = event.target.value;

    getState(countryId);
    
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
    form.addEventListener('change', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      else {
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = false;
        btn.addEventListener('click', () => alert('Form sent'))
      }
    }, false);
  })
}
isFormFilled();
