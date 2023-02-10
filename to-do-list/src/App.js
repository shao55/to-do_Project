import './App.css';
import Title from './Components/1. Title';
import TodoList from './Components/2. Main/index.js';
import Footer from './Components/3. Footer';

function App() {
  return (
    <div className="App">
      <Title/>
      <TodoList/>
      <Footer/>
    </div>
  );
}

export default App;
