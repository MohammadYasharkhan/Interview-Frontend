import logo from './logo.svg';
import './App.css';
import Form from './components/FormCompo/Form';
import { UserProvider } from './Context/StoreContext';
import ListUser from './components/ListUserCompo/ListUser';

function App() {
  return (
    <div className="App">
      <UserProvider>
        <Form/>
        <ListUser/>
      </UserProvider>
      
    </div>
  );
}

export default App;
