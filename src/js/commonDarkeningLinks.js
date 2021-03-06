export default function commonDarkeningLinks(linksElems, wrapper) {
  linksElems.forEach((link, index) => {
    link.addEventListener('mouseenter', () => {
      linksElems.forEach((elem, i) => {
        if (i !== index) {
          elem.classList.add('no-hover');
        } else {
          elem.classList.remove('no-hover');
        }
      })
    })
  })

  wrapper.addEventListener('mouseout', () => {
    linksElems.forEach(link => {
      link.classList.remove('no-hover');
    })
  })
}
