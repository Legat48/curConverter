export default () => {
  // функция проверит все компоненты с классом tags
  const wrapArr = document.querySelectorAll('.tags')
  wrapArr.forEach((wrap) => {
    let notFit = false // флаг для режима "уже не помещается"
    const itemArr = wrap.querySelectorAll('.tags__item') // массив тегов
    // каждый раз проверяем помещаюстя ли элементы, для этого сначала пробуем их все разместить внутри родителя:
    itemArr.forEach((item) => {
      item.classList.remove('tags__item_deactive')
      if (item.previousSibling) {
        item.previousSibling.classList.remove('tags__icon-separator_deactive')
      }
    })
    // проверяем на то, что бы всё помещалось
    for (const item of itemArr) {
      if ((wrap.offsetLeft + wrap.offsetWidth - 4 < item.offsetLeft + item.offsetWidth &&
      !notFit) || notFit) {
        item.classList.add('tags__item_deactive')
        if (item.previousSibling) {
          item.previousSibling.classList.add('tags__icon-separator_deactive')
        }
        notFit = true
      } else if (item.classList.contains('tags__item') && !notFit) {
        item.classList.remove('tags__item_deactive')
      }
    }
  })
}
