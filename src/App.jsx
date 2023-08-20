import { Routes, Route } from 'react-router-dom';

import './App.css';
import Layout from './components/Layout';
import Main from './pages/Main';
import Admin from './pages/Admin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Main />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}

export default App;
