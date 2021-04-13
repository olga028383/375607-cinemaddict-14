const cardToFilterMap = {
  Favorites: (cards) => cards.filter((card) => card.isFavorites).length,
  Watchlist: (cards) => cards.filter((card) => card.isWatchList).length,
  History: (cards) => cards.filter((card) => card.isWatched).length,
};

const generateFilter = (cards) => Object.entries(cardToFilterMap).map(([filterName, countCards]) => {
  return {
    name: filterName,
    count: countCards(cards),
    href: filterName.toLowerCase(),
  };
});


export {generateFilter};
