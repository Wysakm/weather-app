import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {routes.map(({ path, element: Element }) => (
            <Route
              key={path}
              path={path}
              element={<Element />}
            />
          ))}
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;

