import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './Layout';
import Upload from './pages/Upload';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="upload" element={<Upload />} />
      </Route>
    </Routes>
  );
}