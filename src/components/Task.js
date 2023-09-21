/* eslint-disable no-unused-vars */
import Component from '../lib/component.js'

export class Task extends Component {
  constructor(props) {
    super(props)
    this.refs.checkbox = this.element.querySelector('input')
    this.refs.basket = this.element.querySelector('.basket')
  }
  getStateFromProps() {
    const { task, className, handleTaskChange, handleTaskRemove } = this.props
    const { done } = task

    const handleClick = e => {
      if (e.target === this.refs.checkbox) {
        task.done = !done
        handleTaskChange(task)
      } else if (e.target === this.refs.basket) {
        handleTaskRemove(task)
      }
    }
    this.state = { task, className, onClick: handleClick }
  }
  render() {
    const {
      className,
      task: { id, title, tag, done },
    } = this.state
    return `<div class="task ${className}">
      <input class="done" type="checkbox" ${done ? 'checked' : ''}/>
      <div class="title">${title}</div>
      <div class="tag">${tag || 'Uncategoriezed'}</div>
      <div class="basket-wrapper"><div class="basket"></div></div>
    </div>`
  }
}
