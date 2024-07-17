
document.addEventListener('DOMContentLoaded', () => {
    const searchField = document.querySelector('#searchField');
    const submit = document.querySelector('#submit');
    const row = document.querySelector('.row');


    const url = 'https://api.weatherapi.com/v1';
    const apiKey = 'f039bb73fcf44560a7a42718241607';
    const countriesUrl = 'https://restcountries.com/v3.1/all';

    let countries = [];

    fetch(countriesUrl)
        .then(res => res.json())
        .then(data => {
            countries = data;
            displayCountries(countries);
        })


    const displayCountries = (countries) => {
        row.innerHTML = countries.map(country => {
            return `
                <div class="col-4 card-container">
                    <div class="card" data-capital="${country.capital}" data-flag="${country.flags.png}">
                        <div class="card-front">
                            <img src="${country.flags.png}" class="card-img-top" alt="Country flag">
                            <div class="card-body">
                                <h3 class="card-title">Страна: ${country.translations.rus?.official || country.name.common}</h3>
                                <p>Регион: ${country.region}</p>
                                <p class="card-text">Столица: ${country.capital}</p>
                                 
                            </div>
                        </div>
                        <div class="card-back">
                            <p>Loading weather...</p>
                            
                        </div>
                    </div>
                </div>`;
        }).join('');

        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('flip');
                const capital = card.dataset.capital;
                const flag = card.dataset.flag;

                fetch(`${url}/current.json?key=${apiKey}&q=${capital}`)
                    .then(res => res.json())
                    .then(data => {
                        const back = card.querySelector('.card-back');
                        back.innerHTML = `
                                <img src="${flag}" class="card-img-top" alt="Country flag">
                                <div class="title-weather">
                                    <h3 class="card-title">Weather in ${capital}</h3>
                                    <img class="img-weather" src="${data.current.condition.icon}" alt="Weather icon">
                                </div>
                                <p>Temperature: ${data.current.temp_c}°C</p>
                                <p>Last updated: ${data.current.last_updated}</p>
                                <p>Condition: ${data.current.condition.text}</p>
                                  <p>Cloudiness: ${data.current.cloud}%</p>
                            <p>Wind kph: ${data.current.wind_kph}</p>`;

                    })
            });
        });
    };





    searchField.addEventListener('input', (e) => {
        const searchValue = e.target.value.toLowerCase();
        const filteredCountries = countries.filter(country => country.capital && country.capital[0].toLowerCase().includes(searchValue));


        submit.addEventListener('click',()=>{
            displayCountries(filteredCountries);
        })

    });

});
