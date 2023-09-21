import Component from '../lib/component.js'
import { ToDoList } from './ToDoList.js'
import { Sidebar } from './Sidebar.js'
//import { Header } from './Header.js'

const initialState = {
  tasks: [],
  counter: 0,
}

export default class App extends Component {
  constructor(props) {
    super({ ...props, ToDoList, Sidebar })
    /* rerender on state change with js Proxy */

    this.state = new Proxy(this.state, {
      set: (target, prop, value) => {
        target[prop] = value
        this._render()
        return true
      },
    })
  }
  getStateFromProps() {
    const OnTagClick = i => console.log(i)
    const handleTagSelect = () => {
      this.setState({ counter: this.state.counter + 1 })
    }
    const handleTagChange = i => console.log(i)

    const handleTaskAdd = task =>
      this.state.setState({ tasks: [...this.state.tasks, task] })
    const handleTaskChange = task =>
      this.state.setState({
        tasks: this.state.tasks.map(item =>
          item.id === task.id ? task : item
        ),
      })

    this.state = {
      tags: ['Active'],
      activeTagIndex: 0,
      OnTagClick,
      handleTaskAdd,
      handleTaskChange,
      handleTagSelect,
      handleTagChange,
      ...initialState,
    }
  }
  render() {
    return `<div class="todo-app">
      <Sidebar list={{tags}} activeTagIndex={{activeTagIndex}} handleTagSelect={{handleTagSelect}} />
      <section>${this.state.counter}     </section>
    </div>`
  }
}
