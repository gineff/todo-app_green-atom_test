/* eslint-disable no-unused-vars */
import Component from '../lib/component.js'
import { Tag } from './Tag.js'

export class Sidebar extends Component {
  constructor(props) {
    super({ ...props, Tag })
  }
  getStateFromProps() {
    const { children, list, activeTagIndex, handleTagSelect } = this.props
    this.state = { children, list, activeTagIndex, handleTagSelect }
  }
  render() {
    const { list, activeTagIndex } = this.state

    return `<div class="todo-app__sidebar tag-list">
      <ul>
        ${list
          .map(
            (item, index) =>
              `<li><Tag handleTagSelect={{handleTagSelect}} key="${index}" className="tag-list__item${
                index === activeTagIndex ? ' tag-list__item_active' : ''
              }">${item}</Tag></li>`
          )
          .join('\n')}
      </ul>
    </div>`
  }
}
