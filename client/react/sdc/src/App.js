import CalendarList from './components/CalendarList';
import Calendar from './components/Calendar';
// import Navbar from './components/Navbar';
import NotFound from './components/NotFound';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export default function App() {
  console.log("Loading App");
  return (
    <div className="App">

      <Router>
        <Routes>
          {/* <Route exact path="/diario/" element={<CalendarList />} /> */}
          <Route exact path="/calendar/" element={<Calendar />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>


    </div>

  );
}
