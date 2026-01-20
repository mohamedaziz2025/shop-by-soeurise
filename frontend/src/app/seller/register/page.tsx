'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';
import { Store, AlertCircle, CheckCircle, Upload, ArrowRight } from 'lucide-react';

export default function SellerRegisterPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [shopData, setShopData] = useState({
    name: '',
    description: '',
    category: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    returnPolicy: '',
    shippingPolicy: '',
    businessType: 'individual',
    siret: '',
  });

  const categories = [
    'Mode & Vêtements',
    'Accessoires',
    'Beauté & Cosmétiques',
    'Maison & Décoration',
    'Bijoux',
    'Artisanat',
    'Livres & Éducation',
    'Santé & Bien-être',
    'Enfants & Bébés',
    'Alimentaire',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.createShop(shopData);
      setSuccess(true);
      setTimeout(() => {
        router.push('/seller/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création de la boutique');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!shopData.name || !shopData.description || !shopData.category) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Connexion requise</h1>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour créer une boutique
          </p>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="flex-1 px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="flex-1 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-12 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Boutique créée !</h1>
          <p className="text-gray-600 mb-6">
            Votre boutique a été créée avec succès. Elle est en attente de validation par notre équipe.
          </p>
          <p className="text-sm text-gray-500">
            Redirection vers votre dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          ← Retour à l'accueil
        </Link>
        <div className="text-center">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-pink-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Devenir vendeuse sur Shop By Soeurise</h1>
          <p className="text-gray-600">
            Créez votre boutique et vendez vos produits à notre communauté
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-pink-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="hidden sm:inline font-medium">Informations</span>
            </div>
            <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-pink-500' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-pink-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="hidden sm:inline font-medium">Adresse</span>
            </div>
            <div className={`w-16 h-0.5 ${step >= 3 ? 'bg-pink-500' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-pink-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="hidden sm:inline font-medium">Politiques</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">Informations de base</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de votre boutique *
                </label>
                <input
                  type="text"
                  value={shopData.name}
                  onChange={(e) => setShopData({ ...shopData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Ex: Les Créations de Fatima"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Choisissez un nom unique et mémorable
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie principale *
                </label>
                <select
                  value={shopData.category}
                  onChange={(e) => setShopData({ ...shopData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description de votre boutique *
                </label>
                <textarea
                  value={shopData.description}
                  onChange={(e) => setShopData({ ...shopData, description: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Présentez votre boutique, vos produits, vos valeurs..."
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum 50 caractères
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'activité
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setShopData({ ...shopData, businessType: 'individual' })}
                    className={`p-4 border-2 rounded-lg text-left ${
                      shopData.businessType === 'individual'
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold mb-1">Particulier</div>
                    <div className="text-sm text-gray-600">Vente occasionnelle</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShopData({ ...shopData, businessType: 'professional' })}
                    className={`p-4 border-2 rounded-lg text-left ${
                      shopData.businessType === 'professional'
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold mb-1">Professionnel</div>
                    <div className="text-sm text-gray-600">Avec SIRET</div>
                  </button>
                </div>
              </div>

              {shopData.businessType === 'professional' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro SIRET
                  </label>
                  <input
                    type="text"
                    value={shopData.siret}
                    onChange={(e) => setShopData({ ...shopData, siret: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="123 456 789 00010"
                  />
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 flex items-center gap-2"
                >
                  Continuer
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Address */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">Coordonnées</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  value={shopData.phone}
                  onChange={(e) => setShopData({ ...shopData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="06 12 34 56 78"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse *
                </label>
                <input
                  type="text"
                  value={shopData.address}
                  onChange={(e) => setShopData({ ...shopData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Numéro et nom de rue"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    value={shopData.postalCode}
                    onChange={(e) => setShopData({ ...shopData, postalCode: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="75001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville *
                  </label>
                  <input
                    type="text"
                    value={shopData.city}
                    onChange={(e) => setShopData({ ...shopData, city: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Paris"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 px-8 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 flex items-center justify-center gap-2"
                >
                  Continuer
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Policies */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">Politiques de la boutique</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Politique de retour
                </label>
                <textarea
                  value={shopData.returnPolicy}
                  onChange={(e) => setShopData({ ...shopData, returnPolicy: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Ex: Retours acceptés sous 14 jours, produit non utilisé avec emballage d'origine..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Politique de livraison
                </label>
                <textarea
                  value={shopData.shippingPolicy}
                  onChange={(e) => setShopData({ ...shopData, shippingPolicy: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Ex: Expédition sous 1-3 jours ouvrés, livraison par Colissimo..."
                />
              </div>

              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Prochaines étapes</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                    <span>Votre boutique sera soumise à validation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                    <span>Vous recevrez une réponse sous 48-72h</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                    <span>Une fois approuvée, vous pourrez ajouter vos produits</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-8 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Créer ma boutique
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
