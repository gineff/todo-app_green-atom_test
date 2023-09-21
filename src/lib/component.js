/* eslint-disable no-unused-vars */
import { getContext, setContext, nextId } from '../utils/index.js'
import { useDom } from '../hooks/useDom.js'

const re =
  /<([A-Z][A-Za-z0-9._]+)\s*([^>]*)\/>|<(?<tag>[A-Z][A-Za-z0-9._]+)\s*([^>]*)>(.*?)<\/\k<tag>\s?>|context:(\d+)/
const ternaryOperatorRe = /\{\{\s*([^}]*)\?(?!\.)\s*(.*?)\s*:\s*(.*?)\s*\}\}/g
const propsRegexp =
  /(\w+)\s*=\s*((?<quote>["'`])(.*?)\k<quote>|context:(\d+))|(\w+)/g
const components = new Map()

const eventMap = {
  onClick: 'click',
  onBlur: 'blur',
  onChange: 'change',
}

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
  if (str === undefined) return undefined
  if (str === '') return ''

  const props = {}
  const matches = str.matchAll(propsRegexp)

  for (const match of matches) {
    const [, key, , , value, contextId, attribute] = match
    props[attribute || key] =
      attribute || (contextId ? getContext(contextId) : value)
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

function parseNestedComponents(block) {
  let match
  const collection = {}

  while ((match = block.match(re))) {
    const [
      found,
      singleTag,
      singleTagProps,
      pairedTag,
      pairedTagProps,
      children,
      context,
    ] = match
    const id = nextId()
    block = block.replace(
      found,
      `<div component-id="${id}">${children || ''}</div>`
    )

    if (context) {
      collection[id] = getContext(context)
    } else {
      const props = parseProps(singleTagProps || pairedTagProps)
      try {
        collection[id] = new (components.get(singleTag || pairedTag))({
          ...props,
        })
      } catch (e) {
        console.log(e)
        console.error(
          singleTag || pairedTag,
          components,
          '-------',
          components.get(singleTag || pairedTag)
        )
      }
    }
  }

  return [block, collection]
}

export default class Component {
  constructor(props) {
    this.element = document.createElement('div')

    Object.entries(props).forEach(([key, value]) => {
      if (value && isComponent(value)) {
        components.set(key, value)
      } else {
        this.props[key] = typeof value === 'function' ? value.bind(this) : value
      }
    })

    this.getStateFromProps()
  }

  isComponent = true
  props = {}
  state = {}

  setState(key, value) {
    this.state[key] = value
  }

  _compile(template) {
    if (!template) console.error(this.constructor.name, 'отсутствует шаблон')

    template = template.replace(
      ternaryOperatorRe,
      (_match, condition, value1, value2) => {
        const result = new Function(`return ${condition}`).call(this.state)
          ? value1
          : value2
        return result.replace(/null|undefined/g, '')
      }
    )

    return template.replace(/\{\{([A-Za-z0-9._-]+)\}\}/g, (_match, key) => {
      const value = getValue(key, this.state)

      if (value == undefined || value == null) {
        return ' '
      }
      if (isPrimitive(value)) {
        return value
      }
      return `context:${setContext(value)}`
    })
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
    const newElement = this._render()
    this.element.replaceWith(newElement)
    this.element = newElement
    this.addEventHandler(this.element, this.state)
    return this.element
  }

  _render() {
    const block = this._compile(this.template).replace(/\n|\s{2}/g, '')
    this.block = block

    const [htmlTree, nestedComponents] = parseNestedComponents(block)

    const dom = useDom(htmlTree)

    Object.entries(nestedComponents).forEach(([id, componentOrChildNode]) => {
      const domElement = dom.querySelector(`[component-id="${id}"]`)

      if (domElement.childNodes.length > 0) {
        componentOrChildNode.state = {
          ...componentOrChildNode.state,
          children: [...domElement.childNodes],
        }
      }

      if (componentOrChildNode.isComponent) {
        domElement.replaceWith(componentOrChildNode.render())
      } else {
        if (componentOrChildNode[0] && componentOrChildNode[0].isComponent) {
          domElement.replaceWith(
            ...componentOrChildNode.map(comp => comp.render())
          )
        } else {
          domElement.replaceWith(...componentOrChildNode)
        }
      }
    })

    return dom.getElement()
  }

  addEventHandler(element, props) {
    Object.entries(props).forEach(([key, handler]) => {
      if (typeof handler !== 'function') return
      const eventName = eventMap[key]
      if (eventName) {
        element.addEventListener(eventName, handler, { capture: true })
      }
    })
  }
}
