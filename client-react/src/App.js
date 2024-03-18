import logo from './css/logo2.svg';
import './css/App.css';
import MainComponent from "./components/MainComponent";

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <div className={"header-title"}><h1>Metoda Ścieżki Krytycznej (CPM)</h1></div>
          <img src={logo} className="App-logo" alt="logo" />
      </header>
        <MainComponent/>
    </div>
  );
}

export default App;
