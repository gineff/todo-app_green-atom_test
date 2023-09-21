/* eslint-disable no-unused-vars */
import { getContext, setContext, uid } from '../utils/index.js'
import { useDom } from '../hooks/useDom.js'

export const reComponent =
  /<([A-Z][A-Za-z0-9._]+)\s*([^>]*)\s*\/>|<(?<tag>[A-Z][A-Za-z0-9._]+)\s*([^>]*)\s*>(.*?)<\/\k<tag>\s?>|context:(\d+)/
const ternaryOperatorRe =
  /\{\{\s*([^}]*)\s*\?\s+([\s\S]*?)\s*:\s+([\s\S]*?)\s*\}\}/gm
const propsRegexp =
  /([\w\d-]+)\s*=\s*((?<quote>["'`])([\s\S]*?)\k<quote>|context:(\d+))|(\w+)/g
const components = new Map()

function getValue(path, obj) {
  const keys = path.trim().split('.')
  let result = obj

  try {
    for (const key of keys) {
      const match = key.match(/^(\w+)\[(\d+)\]$/)
      if (match) {
        result = result[match[1]][match[2]]
      } else {
        result = result[key]
      }
    }
    return result
  } catch (e) {
    return undefined
  }
}

function parsePropsFromString(str) {
  let props = {}
  const matches = str.matchAll(propsRegexp)

  for (const match of matches) {
    const [, key, , , value, contextId, attribute] = match

    if (attribute) {
      props = { ...props, attribute }
    } else if (contextId) {
      const context = getContext(Number(contextId))
      if (context.isComponent) {
        continue
      }
      props = { ...props, [key]: context }
    } else {
      props = { ...props, [key]: value }
    }
  }
  return props
}

function parseProps(str) {
  return str ? parsePropsFromString(str) : null
}

function isComponent(element) {
  return Object.getPrototypeOf(element) === Component
}

function isPrimitive(element) {
  return Object(element) !== element
}

function registerComponent(key, value) {
  components.set(key, value)
}

export default class Component {
  id = uid()
  template = '<div>{{children}}</div>'
  element = document.createElement('div')
  state = {}
  props = {}
  static isComponent = true
  refs = {}

  constructor(props) {
    for (const key in props) {
      const value = props[key]

      if (typeof value === 'function' && 'isComponent' in value) {
        registerComponent(key, value)
      } else {
        this.props[key] = value
      }
    }

    this.getStateFromProps()
    this._render()
  }

  setState = nextState => {
    if (!nextState) {
      return
    }
    Object.assign(this.state || ((this.state = {}), this.state), nextState)
  }

  _compile(template) {
    if (!template) console.error(this.constructor.name, ' отсутствует шаблон')

    template = template.replace(
      /\{\{\s*([A-Za-z0-9._-]+)\s*\}\}/g,
      (_match, key) => {
        const value = getValue(key, this.state)
        if (!value == undefined || value == null) {
          return ' '
        }
        if (isPrimitive(value)) {
          return String(value)
        }
        return `context:${setContext(value)}`
      }
    )
    template = template.replace(
      ternaryOperatorRe,
      (_match, condition, value1, value2) => {
        const result = new Function(`return ${condition}`).call(this.state)
          ? value1
          : value2
        return result.replace(/null|undefined/g, '')
      }
    )
    return template
  }

  defineElement(newElement) {
    this.element.replaceWith(newElement)
    this.element = newElement
  }

  decomposeBlock(block) {
    let match
    const collection = []

    while ((match = block.match(reComponent))) {
      const [
        found,
        singleTag,
        singleTagProps,
        pairedTag,
        pairedTagProps,
        children,
        context,
      ] = match

      let component

      if (context) {
        component = getContext(Number(context))
      } else {
        const props = parseProps(singleTagProps || pairedTagProps)
        component = new (components.get(singleTag || pairedTag))({
          ...props,
          children,
        })
      }

      if (!component) continue

      const id =
        collection.push(Array.isArray(component) ? component : [component]) - 1
      block = block.replace(found, `<div component-id="${id}" ></div>`)
    }

    const response = [block, collection]
    return response
  }

  getStateFromProps() {
    if (
      Object.keys(this.state).length === 0 &&
      Object.keys(this.props).length > 0
    ) {
      this.state = { ...this.props }
    }
  }

  render() {
    return this.template
  }

  _render() {
    const block = this._compile(this.render()).replace(/\n|\s{2}/g, '')
    this.block = block
    const [htmlTree, nestedComponents] = this.decomposeBlock(block)
    //console.log(htmlTree, nestedComponents)
    const dom = useDom(htmlTree)
    nestedComponents.forEach((nested, id) => {
      const stub = dom.querySelector(`[component-id="${id}"]`)
      if (!stub) return
      stub.replaceWith(
        ...nested.map(comp => {
          return comp.getContent()
        })
      )
    })
    this.defineElement(dom.getElement())
    this.addEventHandler(this.element, this.state)
  }

  addEventHandler(element, props) {
    for (const key in props) {
      const handler = props[key]
      if (typeof handler !== 'function') continue
      let match
      if ((match = key.match(/^on(\w+)/))) {
        const eventKey = match[1].toLowerCase()
        element.addEventListener(eventKey, handler, { capture: true })
      }
    }
  }

  getContent() {
    return this.element
  }

  show() {
    const content = this.getContent()
    if (content instanceof HTMLElement) {
      content.style.display = 'block'
    }
  }

  hide() {
    const content = this.getContent()
    if (content instanceof HTMLElement) {
      content.style.display = 'none'
    }
  }
}
