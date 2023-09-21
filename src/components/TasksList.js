import Component from '../lib/component.js'
import { Task } from './Task.js'
import { setContext } from '../utils/index.js'

export class TasksList extends Component {
  constructor(props) {
    super({ ...props, Task })
  }
  getStateFromProps() {
    const { tasks, handleTaskChange, handleTaskRemove } = this.props
    this.state = { tasks, handleTaskChange, handleTaskRemove }
  }
  render() {
    const { tasks } = this.state

    return `<div class="todo-app__task-list {{className}}">
        <ul>
          ${tasks
            .map(
              (task, index) =>
                /*prettier-ignore */
                `<li class="${(index+1) % 2 === 0 ? 'even' : 'odd'}">
                  <Task handleTaskChange={{handleTaskChange}} handleTaskRemove={{handleTaskRemove}} task=context:${setContext(task)} />
                </li>`
            )
            .join('\n')}
        </ul>
      </div>`
  }
}
