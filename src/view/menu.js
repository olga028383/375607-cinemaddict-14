const createFilterTemplate = (filters) => {
  return `<a href="#${filters.href}" class="main-navigation__item">${filters.name}<span class="main-navigation__item-count">${filters.count}</span></a>`;
};

const createFilterListTemplate = (filters) => {
  return filters.map((filter) => createFilterTemplate(filter)).join('');
};

const createMenuTemplate = (filters = {}) => {
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${createFilterListTemplate(filters)}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export {createMenuTemplate};
