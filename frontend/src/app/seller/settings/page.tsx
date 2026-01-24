'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Save, Store, User, Mail, Phone, MapPin, Upload } from 'lucide-react';

export default function SellerSettingsPage() {
  const { user, setAuth, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
  });

  const [shopData, setShopData] = useState({
    name: '',
    description: '',
    logo: '',
    banner: '',
    categories: [] as string[],
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    phone: '',
    returnPolicy: '',
    shippingPolicy: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || 'France',
      });
    }
    fetchShop();
  }, [user, isAuthenticated]);

  const fetchShop = async () => {
    try {
      const shop = await api.getMyShop();
      if (shop) {
        setShopData({
          name: shop.name || '',
          description: shop.description || '',
          logo: shop.logo || '',
          banner: shop.banner || '',
          categories: shop.categories || [],
          address: shop.address || '',
          city: shop.city || '',
          postalCode: shop.postalCode || '',
          country: shop.country || 'France',
          phone: shop.phone || '',
          returnPolicy: shop.returnPolicy || '',
          shippingPolicy: shop.shippingPolicy || '',
        });
        if (shop.logo) setLogoPreview(shop.logo);
      }
    } catch (error) {
      console.error('Erreur chargement boutique:', error);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const updated = await api.updateProfile(profileData);
      const { accessToken, refreshToken } = useAuthStore.getState();
      setAuth(accessToken!, refreshToken!, updated);
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Erreur lors de la mise à jour',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Upload logo if changed
      if (logoFile) {
        const uploaded = await api.uploadShopLogo(logoFile);
        shopData.logo = uploaded.logo;
      }
      await api.updateShop(shopData);
      setMessage({ type: 'success', text: 'Boutique mise à jour avec succès' });
      await fetchShop();
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Erreur lors de la mise à jour',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen">
          <div className="p-6">
            <img src="/logo-soeurise/logo_soeurise.jpg" alt="Shop By Soeurise" className="h-8 mb-6" />
            <nav className="space-y-2">
              <a href="/seller/dashboard" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                📊 Dashboard
              </a>
              <a href="/seller/products" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                📦 Mes Produits
              </a>
              <a href="/seller/orders" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                🛒 Commandes
              </a>
              <a
                href="/seller/settings"
                className="block px-4 py-2 bg-pink-50 text-pink-600 rounded-lg font-medium"
              >
                ⚙️ Paramètres
              </a>
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Paramètres</h1>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-6 py-4 font-medium ${
                    activeTab === 'profile'
                      ? 'border-b-2 border-pink-500 text-pink-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <User className="w-5 h-5 inline mr-2" />
                  Mon Profil
                </button>
                <button
                  onClick={() => setActiveTab('shop')}
                  className={`px-6 py-4 font-medium ${
                    activeTab === 'shop'
                      ? 'border-b-2 border-pink-500 text-pink-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Store className="w-5 h-5 inline mr-2" />
                  Ma Boutique
                </button>
              </div>
            </div>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="max-w-2xl">
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) =>
                        setProfileData({ ...profileData, firstName: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Nom
                    </label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) =>
                        setProfileData({ ...profileData, lastName: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code postal
                    </label>
                    <input
                      type="text"
                      value={profileData.postalCode}
                      onChange={(e) =>
                        setProfileData({ ...profileData, postalCode: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                    <input
                      type="text"
                      value={profileData.country}
                      onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </div>
            </form>
          )}

          {/* Shop Tab */}
          {activeTab === 'shop' && (
            <form onSubmit={handleShopSubmit} className="max-w-2xl">
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                <h2 className="text-xl font-semibold mb-4">Informations de la boutique</h2>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Upload className="w-4 h-4 inline mr-1" />
                    Logo de la boutique
                  </label>
                  <div className="flex items-center gap-4">
                    {logoPreview && (
                      <div className="w-24 h-24 rounded-xl border-2 border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
                        <img src={logoPreview.startsWith('http') ? logoPreview : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1','')}${logoPreview}`} alt="Logo" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                      onChange={handleLogoChange}
                      className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Format: PNG, JPG, SVG (max 2MB)</p>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie principale *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-pink-500 transition-colors">
                      <input
                        type="checkbox"
                        checked={shopData.categories.includes('Mode')}
                        onChange={(e) => {
                          const cats = e.target.checked
                            ? [...shopData.categories, 'Mode']
                            : shopData.categories.filter((c) => c !== 'Mode');
                          setShopData({ ...shopData, categories: cats });
                        }}
                        className="w-4 h-4 text-pink-600"
                      />
                      <span className="font-medium">Mode</span>
                    </label>
                    <label className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-pink-500 transition-colors">
                      <input
                        type="checkbox"
                        checked={shopData.categories.includes('Cosmétiques')}
                        onChange={(e) => {
                          const cats = e.target.checked
                            ? [...shopData.categories, 'Cosmétiques']
                            : shopData.categories.filter((c) => c !== 'Cosmétiques');
                          setShopData({ ...shopData, categories: cats });
                        }}
                        className="w-4 h-4 text-pink-600"
                      />
                      <span className="font-medium">Cosmétiques</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la boutique *
                  </label>
                  <input
                    type="text"
                    value={shopData.name}
                    onChange={(e) => setShopData({ ...shopData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={shopData.description}
                    onChange={(e) => setShopData({ ...shopData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Téléphone de la boutique
                  </label>
                  <input
                    type="tel"
                    value={shopData.phone}
                    onChange={(e) => setShopData({ ...shopData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Politique de retour
                  </label>
                  <textarea
                    value={shopData.returnPolicy}
                    onChange={(e) => setShopData({ ...shopData, returnPolicy: e.target.value })}
                    rows={3}
                    placeholder="Ex: Retours acceptés sous 14 jours..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Politique de livraison
                  </label>
                  <textarea
                    value={shopData.shippingPolicy}
                    onChange={(e) => setShopData({ ...shopData, shippingPolicy: e.target.value })}
                    rows={3}
                    placeholder="Ex: Livraison sous 3-5 jours ouvrés..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
