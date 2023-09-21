import Component from '../lib/component.js'
import { TasksList } from './TasksList.js'
import { Sidebar } from './Sidebar.js'
import { loadTasks, saveTasks } from '../controllers/taskController.js'
import { Header } from './Header.js'
import { Panel } from './Panel.js'

const initialState = {
  tasks: [],
  activeTag: 'All',
  markOdd: false,
  markEven: false,
}

export default class App extends Component {
  constructor(props) {
    super({ ...props, Sidebar, TasksList, Header, Panel })
    /** rerender on state change with js Proxy */
    this.state = new Proxy(this.state, {
      set: (target, prop, value) => {
        if (prop === 'tasks') {
          value = value.sort((a, b) => !b.done - !a.done || a.id - b.id)
          saveTasks(value)
        }
        target[prop] = value
        this._render()
        return true
      },
    })
    const tasks = loadTasks()
    if (tasks) {
      this.setState({ tasks })
    }
  }
  getStateFromProps() {
    const handleTagSelect = activeTag => this.setState({ activeTag })
    const handleTaskAdd = task =>
      this.setState({ tasks: [...this.state.tasks, task] })
    const handleTaskRemove = ({ id }) =>
      this.setState({
        tasks: this.state.tasks.filter(item => item.id !== id),
      })
    const handleTaskChange = task =>
      this.setState({
        tasks: this.state.tasks.map(item =>
          item.id === task.id ? task : item
        ),
      })

    const toggleEvenRows = () =>
      this.setState({ markEven: !this.state.markEven })
    const toggleOddRows = () => this.setState({ markOdd: !this.state.markOdd })
    const removeFirst = () =>
      this.setState({
        tasks: [...(this.state.tasks.shift(), this.state.tasks)],
      })
    const removeLast = () =>
      this.setState({ tasks: [...(this.state.tasks.pop(), this.state.tasks)] })

    this.state = {
      handleTaskAdd,
      handleTaskRemove,
      handleTaskChange,
      handleTagSelect,
      toggleEvenRows,
      toggleOddRows,
      removeFirst,
      removeLast,
      ...initialState,
    }
  }
  render() {
    const { markEven, markOdd } = this.state
    const lastTasksId = this.state.tasks.length
      ? Math.max(...this.state.tasks.map(item => item.id))
      : 0
    console.log('lastTasksId', lastTasksId)
    /*prettier-ignore */
    return `<div class="todo-app${markEven ? ' markEven' : ''}${markOdd ? ' markOdd' : ''}">
      <Sidebar tasks={{tasks}} activeTag="{{activeTag}}" handleTagSelect={{handleTagSelect}} />
      <section>
        <Header handleTaskAdd={{handleTaskAdd}} lastTasksId="${lastTasksId}" activeTag="{{activeTag}}" />   
        <TasksList tasks={{tasks}} handleTaskChange={{handleTaskChange}} handleTaskRemove={{handleTaskRemove}}/>
        <Panel toggleEvenRows={{toggleEvenRows}}  toggleOddRows={{toggleOddRows}} removeFirst={{removeFirst}} removeLast={{removeLast}}/>
      </section>
    </div>`
  }
}
