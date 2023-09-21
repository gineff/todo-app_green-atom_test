/* eslint-disable no-unused-vars */
import Component from '../lib/component.js'

export class Header extends Component {
  constructor(props) {
    super(props)
    this.refs.input = this.element.querySelector('input')
  }
  getStateFromProps() {
    const { handleTaskAdd, lastTasksId, activeTag } = this.props

    const onKeyup = e => {
      const title = this.refs.input.value
      if (e.code === 'Enter' && title.trim().length > 0) {
        const id = +lastTasksId + 1
        const task = { title, id }
        handleTaskAdd(task)
      }
    }

    this.setState({ handleTaskAdd, activeTag, onKeyup })
  }
  render() {
    const { className } = this.state
    return `<div class="todo-app__header">
        <div class="active-tag">{{activeTag}}</div>
        <input />
      </div>`
  }
}
