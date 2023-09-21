/* eslint-disable no-unused-vars */
import Component from '../lib/component.js'
import { Tag } from './Tag.js'

export class Sidebar extends Component {
  constructor(props) {
    super({ ...props, Tag })
  }
  getStateFromProps() {
    const { tasks, activeTag, handleTagSelect } = this.props

    const tags = [
      'All',
      ...new Set(tasks.map(item => item.tag).filter(item => !!item)),
    ]
    this.state = { tags, activeTag, handleTagSelect }
  }
  render() {
    const { tags, activeTag } = this.state

    return `<div class="todo-app__sidebar tag-list">
      <ul>
        ${tags
          .map(
            (item, index) =>
              `<Tag handleTagSelect={{handleTagSelect}} key="${index}" className="tag-list__item${
                item === activeTag ? ' tag-list__item_active' : ''
              }">${item}</Tag>`
          )
          .join('\n')}
      </ul>
    </div>`
  }
}
