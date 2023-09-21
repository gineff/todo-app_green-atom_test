import App from './components/App.js'

const app = new App()
const root = document.getElementById('root')

if (root) {
  root.innerHTML = ''
  root.append(app.getContent())
}
