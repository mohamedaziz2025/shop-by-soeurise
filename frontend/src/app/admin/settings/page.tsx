'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  Settings,
  Save,
  Mail,
  Shield,
  Database,
  Bell,
  Globe,
  CreditCard,
  Users,
  Store,
  Package,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface SettingsData {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    supportPhone: string;
    defaultCurrency: string;
    defaultLanguage: string;
  };
  security: {
    requireEmailVerification: boolean;
    enableTwoFactor: boolean;
    passwordMinLength: number;
    sessionTimeout: number;
    maxLoginAttempts: number;
  };
  notifications: {
    emailNotifications: boolean;
    newUserRegistration: boolean;
    newShopApplication: boolean;
    newProductApproval: boolean;
    orderNotifications: boolean;
    systemAlerts: boolean;
  };
  marketplace: {
    autoApproveShops: boolean;
    autoApproveProducts: boolean;
    commissionRate: number;
    minimumOrderAmount: number;
    freeShippingThreshold: number;
    allowGuestCheckout: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // TODO: Remplacer par l'appel API réel
      const mockSettings: SettingsData = {
        general: {
          siteName: 'Soeurise Marketplace',
          siteDescription: 'La marketplace des créatrices françaises',
          contactEmail: 'contact@soeurise.com',
          supportPhone: '+33123456789',
          defaultCurrency: 'EUR',
          defaultLanguage: 'fr'
        },
        security: {
          requireEmailVerification: true,
          enableTwoFactor: false,
          passwordMinLength: 8,
          sessionTimeout: 24,
          maxLoginAttempts: 5
        },
        notifications: {
          emailNotifications: true,
          newUserRegistration: true,
          newShopApplication: true,
          newProductApproval: true,
          orderNotifications: true,
          systemAlerts: true
        },
        marketplace: {
          autoApproveShops: false,
          autoApproveProducts: false,
          commissionRate: 5.0,
          minimumOrderAmount: 10.0,
          freeShippingThreshold: 50.0,
          allowGuestCheckout: false
        },
        email: {
          smtpHost: 'smtp.gmail.com',
          smtpPort: 587,
          smtpUser: 'noreply@soeurise.com',
          smtpPassword: '',
          fromEmail: 'noreply@soeurise.com',
          fromName: 'Soeurise'
        }
      };

      setSettings(mockSettings);
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setIsSaving(true);
    setSaveStatus('saving');

    try {
      // TODO: Implémenter l'appel API pour sauvegarder les paramètres
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (section: keyof SettingsData, field: string, value: any) => {
    if (!settings) return;

    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'general', name: 'Général', icon: Settings },
    { id: 'security', name: 'Sécurité', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'marketplace', name: 'Marketplace', icon: Store },
    { id: 'email', name: 'Email', icon: Mail }
  ];

  if (isLoading) {
    return (
      <AdminLayout title="Paramètres" subtitle="Configuration de la plateforme">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Paramètres" subtitle="Configuration de la plateforme">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Paramètres système</h2>
              <div className="flex items-center space-x-3">
                {saveStatus === 'saved' && (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Sauvegardé
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Erreur
                  </div>
                )}
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-200">
              <nav className="p-4 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-3" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              {/* General Settings */}
              {activeTab === 'general' && settings && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informations générales</h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nom du site</label>
                        <input
                          type="text"
                          value={settings.general.siteName}
                          onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          rows={3}
                          value={settings.general.siteDescription}
                          onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email de contact</label>
                          <input
                            type="email"
                            value={settings.general.contactEmail}
                            onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Téléphone support</label>
                          <input
                            type="tel"
                            value={settings.general.supportPhone}
                            onChange={(e) => updateSetting('general', 'supportPhone', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Devise par défaut</label>
                          <select
                            value={settings.general.defaultCurrency}
                            onChange={(e) => updateSetting('general', 'defaultCurrency', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="EUR">EUR (€)</option>
                            <option value="USD">USD ($)</option>
                            <option value="GBP">GBP (£)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Langue par défaut</label>
                          <select
                            value={settings.general.defaultLanguage}
                            onChange={(e) => updateSetting('general', 'defaultLanguage', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="fr">Français</option>
                            <option value="en">English</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && settings && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Paramètres de sécurité</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Vérification email obligatoire</label>
                          <p className="text-xs text-gray-500">Les nouveaux utilisateurs doivent vérifier leur email</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.security.requireEmailVerification}
                          onChange={(e) => updateSetting('security', 'requireEmailVerification', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Authentification à deux facteurs</label>
                          <p className="text-xs text-gray-500">Activer 2FA pour tous les comptes</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.security.enableTwoFactor}
                          onChange={(e) => updateSetting('security', 'enableTwoFactor', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Longueur min. mot de passe</label>
                          <input
                            type="number"
                            min="6"
                            max="20"
                            value={settings.security.passwordMinLength}
                            onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Timeout session (h)</label>
                          <input
                            type="number"
                            min="1"
                            max="168"
                            value={settings.security.sessionTimeout}
                            onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Tentatives max. connexion</label>
                          <input
                            type="number"
                            min="3"
                            max="10"
                            value={settings.security.maxLoginAttempts}
                            onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && settings && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Paramètres de notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Notifications par email</label>
                          <p className="text-xs text-gray-500">Activer les notifications par email</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailNotifications}
                          onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="space-y-3 ml-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Nouveau utilisateur</span>
                          <input
                            type="checkbox"
                            checked={settings.notifications.newUserRegistration}
                            onChange={(e) => updateSetting('notifications', 'newUserRegistration', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Nouvelle demande boutique</span>
                          <input
                            type="checkbox"
                            checked={settings.notifications.newShopApplication}
                            onChange={(e) => updateSetting('notifications', 'newShopApplication', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Nouveau produit à approuver</span>
                          <input
                            type="checkbox"
                            checked={settings.notifications.newProductApproval}
                            onChange={(e) => updateSetting('notifications', 'newProductApproval', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Nouvelles commandes</span>
                          <input
                            type="checkbox"
                            checked={settings.notifications.orderNotifications}
                            onChange={(e) => updateSetting('notifications', 'orderNotifications', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Alertes système</span>
                          <input
                            type="checkbox"
                            checked={settings.notifications.systemAlerts}
                            onChange={(e) => updateSetting('notifications', 'systemAlerts', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Marketplace Settings */}
              {activeTab === 'marketplace' && settings && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Paramètres marketplace</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Approbation automatique boutiques</label>
                          <p className="text-xs text-gray-500">Les nouvelles boutiques sont approuvées automatiquement</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.marketplace.autoApproveShops}
                          onChange={(e) => updateSetting('marketplace', 'autoApproveShops', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Approbation automatique produits</label>
                          <p className="text-xs text-gray-500">Les nouveaux produits sont approuvés automatiquement</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.marketplace.autoApproveProducts}
                          onChange={(e) => updateSetting('marketplace', 'autoApproveProducts', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Taux de commission (%)</label>
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.1"
                            value={settings.marketplace.commissionRate}
                            onChange={(e) => updateSetting('marketplace', 'commissionRate', parseFloat(e.target.value))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Montant minimum commande (€)</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={settings.marketplace.minimumOrderAmount}
                            onChange={(e) => updateSetting('marketplace', 'minimumOrderAmount', parseFloat(e.target.value))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Seuil livraison gratuite (€)</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={settings.marketplace.freeShippingThreshold}
                            onChange={(e) => updateSetting('marketplace', 'freeShippingThreshold', parseFloat(e.target.value))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.marketplace.allowGuestCheckout}
                            onChange={(e) => updateSetting('marketplace', 'allowGuestCheckout', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 text-sm font-medium text-gray-700">Commande sans compte</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {activeTab === 'email' && settings && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration SMTP</h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Serveur SMTP</label>
                          <input
                            type="text"
                            value={settings.email.smtpHost}
                            onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Port SMTP</label>
                          <input
                            type="number"
                            value={settings.email.smtpPort}
                            onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Utilisateur SMTP</label>
                        <input
                          type="text"
                          value={settings.email.smtpUser}
                          onChange={(e) => updateSetting('email', 'smtpUser', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Mot de passe SMTP</label>
                        <div className="mt-1 relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={settings.email.smtpPassword}
                            onChange={(e) => updateSetting('email', 'smtpPassword', e.target.value)}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email expéditeur</label>
                          <input
                            type="email"
                            value={settings.email.fromEmail}
                            onChange={(e) => updateSetting('email', 'fromEmail', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Nom expéditeur</label>
                          <input
                            type="text"
                            value={settings.email.fromName}
                            onChange={(e) => updateSetting('email', 'fromName', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}