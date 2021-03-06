import Masonry from 'masonry-layout';
import window from 'inputmask/lib/global/window';

export default function commonCatalog(hostElem) {
  const GRID_GAP = 20;
  const RATIO_VIDEO = 0.5625 // 9/16
  const RATIO_VIDEO_LONG = 0.3745 // широкоформатн
  const RATIO_POSTER_VERTICAL = 1.38 // 690 / 500

  const catalogListElem = hostElem.querySelector('.gl-catalog__list');
  const catalogItems = hostElem.querySelectorAll('.gl-catalog__item');
  const catalogContentsElems = hostElem.querySelectorAll('.gl-catalog__content');

  const cardsTitlesNumber = hostElem.querySelectorAll('.gl-catalog__card-title-number');

  const sortBtns = Array.from(document.querySelectorAll('.header__sort-btn'));
  const sortValuesArr = [];
  sortBtns.map(btn => sortValuesArr.push(btn.value));

  const linkHeader = document.querySelector('.header__control.mod-link');

  let timeoutReload;

  let msnry;
  let currentSize; // 'desk' | 'mobile'
  let widthBlock;

  let arrBig = [];
  let arrSmall = [];
  let isNoPair = false;
  let lastBig = false;
  let start;

  let windowWidth = window.innerWidth;

  const onSort = (nameSort) => {
    let indexBtnActive;
    let nameQueryParam;
    let elemsShow;
    let elemsHideArr

    sortValuesArr.forEach((sortElem, index) => {
      if (nameSort === sortElem) {
        indexBtnActive = index;
        nameQueryParam = sortElem;
        elemsShow = hostElem.querySelectorAll(`.gl-catalog-${ sortElem }`);
        const elemsNameHideArr = sortValuesArr.filter(elem => elem !== sortElem);
        elemsHideArr = elemsNameHideArr.map(elemName => hostElem.querySelectorAll(`.gl-catalog-${ elemName }`));
      }
    })

    const currentQueryParamSort = window.location.href.split('?sort=')[1];
    if (currentQueryParamSort !== nameQueryParam) {
      window.history.pushState({}, '', `/?sort=${ nameQueryParam }`);
    }

    sortBtns.forEach((btn, index) => {
      linkHeader.classList.add('mod-no-active');
      if (index === indexBtnActive) {
        btn.classList.add('mod-active');
        btn.classList.remove('mod-no-active');
      } else {
        btn.classList.remove('mod-active');
        btn.classList.add('mod-no-active');
      }
    })

    elemsShow.forEach(elem => {
      elem.classList.remove('mod-anim-hide');
      setTimeout(() => {
        elem.classList.remove('mod-hide');
      }, 700)
    })

    elemsHideArr.forEach(elemsHide => {
      elemsHide.forEach(elem => {
          elem.classList.add('mod-anim-hide');
          setTimeout(() => {
            elem.classList.add('mod-hide');
            onUpdateCardsSort();
            mixDumElems();
            msnry.layout();
          }, 700)
        }
      )
    })
  }

  const querySort = window.location.href.split('?sort=')[1];

  if (querySort) {
    onSort(querySort);
  }

  cardsTitlesNumber.forEach((elem, i) => {
    if (i + 1 < 10) {
      elem.innerText = `0${ i + 1 }`;
    } else {
      elem.innerText = i + 1;
    }
  })

  const onResize = () => {
    switch (true) {
      case window.innerWidth > 1024:
        widthBlock = (catalogListElem.clientWidth - GRID_GAP * 2) / 3;
        break;

      case window.innerWidth > 576:
        widthBlock = (catalogListElem.clientWidth - GRID_GAP) / 2;
        break;

      default:
        widthBlock = catalogListElem.clientWidth;
    }

    let height;
    let width;
    let ratio;
    let columnLength;
    catalogItems.forEach((elem, i) => {
      switch (true) {
        case elem.className.includes('gl-catalog__item--poster-vertical'): // fixme постер
          if (window.innerWidth > 576) {
            columnLength = 1;
          } else {
            columnLength = 0.5;
          }
          ratio = RATIO_POSTER_VERTICAL;
          break;

        case elem.className.includes('gl-catalog__item--poster-square'): // fixme квадрат
          if (window.innerWidth > 576) {
            columnLength = 1;
          } else {
            columnLength = 0.5;
          }
          ratio = 0.57; // 2 / 3.5 (перудмали делать квадрат)
          break;

        case elem.className.includes('gl-catalog__item--video-small'): // fixme маленькое видео
          columnLength = 1;
          if (elem.className.includes('gl-catalog__item--long')) {
            ratio = RATIO_VIDEO_LONG;
          } else {
            ratio = RATIO_VIDEO; // 280 / 500;
          }
          break;

        case elem.className.includes('gl-catalog__item--video-medium'): // fixme среднее видео
          if (elem.className.includes('gl-catalog__item--long')) {
            ratio = RATIO_VIDEO_LONG;
          } else {
            ratio = RATIO_VIDEO; // 600 / 1020;
          }
          columnLength = window.innerWidth > 576 ? 2 : 1;
          break;

        case elem.className.includes('gl-catalog__item--video-large'): // fixme большое видео
          if (elem.className.includes('gl-catalog__item--long')) {
            ratio = RATIO_VIDEO_LONG;
          } else {
            ratio = RATIO_VIDEO; // 875 / 1540;
          }
          if (window.innerWidth > 1024) {
            columnLength = 3;
          } else if (window.innerWidth > 576) {
            columnLength = 2;
          } else {
            columnLength = 1;
          }
          break;
      }

      let gap = GRID_GAP * (columnLength - 1);

      if (columnLength === 1 / 2) {
        width = widthBlock * columnLength - GRID_GAP / 2;
      } else if (columnLength === 1) {
        width = widthBlock * columnLength;
      } else {
        width = widthBlock * columnLength + gap;
      }

      height = ((widthBlock * columnLength + gap) * ratio);
      catalogContentsElems[i].style.height = `${ height }px`;
      catalogContentsElems[i].style.width = `${ width }px`;
      elem.style.width = `${ width }px`;
    })
  }

  const onUpdateCardsSort = () => {
    arrSmall = [];
    arrBig = [];
    catalogItems.forEach(elem => {
      if (!elem.className.includes('mod-anim-hide') && !elem.className.includes('mod-hide')) {
        if (elem.className.includes('gl-catalog__item--poster')) {
          arrSmall.push(elem);
        } else {
          arrBig.push(elem);
        }
      }
    });

    order = 1;
    number = 1;
    start = 0;
  }

  let order;
  let number;

  const commonPush = arr => {
    const elem = arr[0];
    if (elem) {
      elem.style.order = order.toString();
      arr.shift();
      const cardNum = elem.querySelector('.gl-catalog__card-title-number');
      if (cardNum) {
        if (number < 10) {
          cardNum.innerText = `0${ number }`;
        } else {
          cardNum.innerText = number;
        }
        number++;
      }
      order++;
      return true;
    }
    return false;
  }

  const pushToBigArr = () => {
    if (!commonPush(arrBig)) {
      pushToSmallArr();
    } else {
      lastBig = true;
    }
  }

  const pushToSmallArr = () => {
    if (!commonPush(arrSmall)) {
      pushToBigArr();
    } else {
      lastBig = false;
      isNoPair = !isNoPair;
    }
  }

  const mixDumElems = () => {
    if (start < 2) {
      pushToBigArr();
      start++;
    } else {
      if (lastBig || isNoPair) {
        pushToSmallArr();
      } else {
        pushToBigArr();
      }
    }

    if (arrBig.length || arrSmall.length) {
      mixDumElems();
    }
  }

  sortBtns.forEach(btn => {
    btn.onclick = () => {
      onSort(btn.value);
    }
  })

  onResize();
  onUpdateCardsSort();
  mixDumElems();

  // initMasonry();

  if (window.innerWidth > 576) {
    msnry = new Masonry(catalogListElem, {
      itemSelector: '.gl-catalog__item',
      percentPosition: true,
      gutter: GRID_GAP,
      columnWidth: widthBlock
    });
  }

  window.addEventListener('resize', () => {
    clearTimeout(timeoutReload);
    onResize();
    if (window.innerWidth > 576 && currentSize === 'mobile') {
      currentSize = 'desk';
    } else if (window.innerWidth <= 576 && currentSize === 'desk') {
      currentSize = 'mobile';
      mixDumElems();
    }

    // todo костыль, вместо msnry.layout()
    timeoutReload = setTimeout(() => {
      // чтобы не обновлялось на мобилке при изменении высоты
      if (windowWidth !== window.innerWidth) {
        location.reload();
      }
    }, 500);
  });
}
