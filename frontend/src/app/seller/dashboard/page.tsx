'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { StatCard } from '@/components/CRMComponents';
import { 
  BarChart3, Package, ShoppingBag, Euro, Users, 
  Star, Download
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function SellerDashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return; // Wait for auth initialization

    if (!user) {
      return;
    }
    
    // Allow access if user is SELLER or has a shop
    const checkAccess = async () => {
      if (user.role === 'SELLER') {
        console.log('User is SELLER, fetching stats...');
        fetchStats();
        return;
      }
      
      // Check if user has a shop
      try {
        console.log('Checking if user has a shop...');
        const shop = await api.getMyShop().catch((error) => {
          console.error('Error fetching shop:', error);
          return null;
        });
        console.log('Shop data:', shop);
        if (shop && shop._id) {
          console.log('User has shop, fetching stats...');
          fetchStats();
        } else {
          console.log('User has no shop, redirecting...');
          router.push('/');
        }
      } catch (err) {
        console.error('Error in checkAccess:', err);
        router.push('/');
      }
    };
    
    checkAccess();
  }, [user, router, timeRange, isAuthenticated, isLoading]);

  const fetchStats = async () => {
    try {
      console.log('Fetching seller stats...');
      const data = await api.getSellerStats();
      console.log('Stats data received:', data);
      setStats(data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      // Set empty stats on error to prevent crashes
      setStats({
        revenue: 0,
        ordersCount: 0,
        pendingOrders: 0,
        activeProducts: 0,
        deliveredOrders: 0,
        inProgressOrders: 0,
        cancelledOrders: 0,
        totalCustomers: 0,
        returningCustomers: 0,
        recentOrders: [],
        topProducts: [],
        averageRating: 0,
        totalReviews: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!user) {
    return null;
  }


  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tableau de bord vendeur</h2>
        <p className="text-gray-600">Bienvenue sur votre espace vendeur</p>
      </div>
    </div>
  );
}
