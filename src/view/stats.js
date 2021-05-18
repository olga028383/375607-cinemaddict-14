import Smart from './smart.js';
import {Chart, ChartDataLabels, getTime, checkIncludeDataInPeriod} from '../lib.js';
import {makeItemsUnique, countFilmsByWatched, countTimeLengthWatch, getRankUser} from '../utils/stats.js';

import {PeriodValues, PeriodNames} from '../constants.js';

const getFilmGenres = (films) => {
  let filmGenres = [];

  films.forEach((film) => {
    filmGenres = filmGenres.concat(film.genres);
  });

  return filmGenres;
};

const renderChart = (films, element) => {
  const uniqueGenres = makeItemsUnique(getFilmGenres(films));
  const uniqueGenresCount = uniqueGenres.map((genre) => countFilmsByWatched(films, genre));
  const BAR_HEIGHT = 50;
  const statisticElement = element;

  statisticElement.height = BAR_HEIGHT * uniqueGenres.length;

  new Chart(statisticElement, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqueGenres,
      datasets: [{
        data: uniqueGenresCount,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createPeriods = (activeFilter) => {
  return Object.entries(PeriodValues).map((period) => {
    const checkedItem = activeFilter === period[1] ? 'checked' : '';
    return `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="${period[1]}" value="${period[1]}" ${checkedItem}>
      <label for="${period[1]}" class="statistic__filters-label">${PeriodNames[period[0]]}</label>`;
  }).join('');
};

const createFilmLength = (films) => films.length > 0 ? `${films.length} <span class="statistic__item-description">movies</span>` : 0;

const createTimeLength = (films) => films.length > 0 ? `${getTime(countTimeLengthWatch(films), 'H[<span class="statistic__item-description">h</span>] mm[<span class="statistic__item-description">m</span>]')}` : 0;

const createFilmGenres = (films) => {
  if (films.length === 0) {
    return '';
  }
  const uniqueGenres = makeItemsUnique(getFilmGenres(films));

  const dataGenres = {};
  uniqueGenres.forEach((genre) => {
    dataGenres[genre] = countFilmsByWatched(films, genre);
  });

  const dataGenresSort = Object.entries(dataGenres).slice().sort((a, b) => b[1] - a[1]);

  return `<li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${dataGenresSort[0][0]}</p>
      </li>`;
};

const createRankUser = (name) => {
  return name ? `<p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${name}</span>
    </p>` : '';
};

const createStatsTemplate = (data) => {
  const {films = [], activeFilter = '', rankName} = data;

  return `<section class="statistic">
    ${createRankUser(rankName)}

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
        ${createPeriods(activeFilter)}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${createFilmLength(films)}</p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${createTimeLength(films)}</p>
      </li>
      ${createFilmGenres(films)}
      
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class Stats extends Smart {
  constructor(films, activeFilter) {
    super();
    this._films = films;

    this._data = {
      rankName: getRankUser(this._films),
      films: this._films,
      activeFilter: activeFilter,
    };

    this._setChart();

    this._periodChangeHandler = this._periodChangeHandler.bind(this);
    this._setPeriodChangeHandler();
  }

  getTemplate() {
    return createStatsTemplate(this._data);
  }

  _setChart() {
    renderChart(this._data.films, this.getElement().querySelector('.statistic__chart'));
  }

  _setPeriodChangeHandler() {
    this.getElement().querySelectorAll('.statistic__filters-label').forEach((field) => {
      field.addEventListener('click', this._periodChangeHandler);
    });
  }

  _periodChangeHandler(evt) {
    evt.preventDefault();

    const value = evt.target.htmlFor;
    const films = (PeriodValues.ALL === value) ? this._films : this._films.slice().filter((film) => checkIncludeDataInPeriod(film.watchingDate, value));

    this.updateData({
      films: films,
      activeFilter: evt.target.htmlFor,
    });

    this._setPeriodChangeHandler();
    this._setChart();
  }
}
