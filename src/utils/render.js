import AbstractView from '../view/abstract-view.js';

const ContentPosition = {
  AFTERBEGIN: 'afterBegin',
  BEFOREEND: 'beforeEnd',
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

const replace = (newChild, oldChild) => {
  if (oldChild instanceof AbstractView) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof AbstractView) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;
  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }
  parent.replaceChild(newChild, oldChild);
};

const remove = (component) => {
  if (!component) {
    return;
  }

  if (!(component instanceof AbstractView)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

export {render, remove, replace, ContentPosition};
