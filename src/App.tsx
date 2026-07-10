import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

import Home from './pages/Home';
import LivePage from './pages/LivePage';
import ListingDetail from './pages/ListingDetail';
import SellerDashboard from './pages/SellerDashboard';
import SellPage from './pages/SellPage';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live" element={<LivePage />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          
          {/* Protected Seller Routes */}
          <Route 
            path="/sell" 
            element={
              <ProtectedRoute requiredLevel="new">
                <SellPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requiredLevel="new">
                <SellerDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
