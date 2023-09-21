class Dom {
  constructor(htmlString) {
    this.root = document.createElement('div')
    this.root.classList.add('root')
    this.root.innerHTML = htmlString
  }

  querySelector(selector) {
    return this.root.querySelector(selector)
  }

  getElement() {
    return this.root.firstChild
  }
}

export const useDom = htmlString => {
  return new Dom(htmlString)
}
