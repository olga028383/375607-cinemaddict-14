const ContentPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

const render = (container, template, place) => {
  switch (place) {
    case ContentPosition.AFTERBEGIN:
      container.prepend(template);
      break;
    case ContentPosition.BEFOREEND:
      container.append(template);
      break;
  }
};
export {
  render,
  ContentPosition
}
