const cardToFilterMap = {
  Favorites: (cards) => cards.filter((card) => card.isFavorite).length,
  Watchlist: (cards) => cards.filter((card) => card.isWatchList).length,
  History: (cards) => cards.filter((card) => card.isWatch).length,
};

const generateFilter = (cards) => Object.entries(cardToFilterMap).map(([filterName, countCards]) => {
  return {
    name: filterName,
    count: countCards(cards),
    href: filterName.toLowerCase(),
  };
});


export {generateFilter};
