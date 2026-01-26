'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, FileText, Shield, Scale } from 'lucide-react';
import ModernLayout from '@/components/ModernLayout';

export default function TermsPage() {
  return (
    <ModernLayout showFooter={true}>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à l'accueil
            </Link>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-[18px] flex items-center justify-center shadow-xl mx-auto mb-6">
                <FileText className="text-white w-8 h-8" />
              </div>
              <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
                Conditions Générales d'Utilisation
              </h1>
              <p className="text-gray-600 text-lg">
                Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8 space-y-8"
          >
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-pink-600" />
                1. Acceptation des Conditions
              </h2>
              <p className="text-gray-700 leading-relaxed">
                En accédant et en utilisant Shop By Soeurise, vous acceptez et vous engagez à respecter
                les présentes conditions générales d'utilisation. Si vous n'acceptez pas ces conditions,
                veuillez ne pas utiliser notre plateforme.
              </p>
            </section>

            {/* Services */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Scale className="w-6 h-6 text-pink-600" />
                2. Description des Services
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Shop By Soeurise est une marketplace communautaire dédiée aux femmes musulmanes engagées,
                offrant une plateforme pour :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>La vente de produits éthiques et de qualité</li>
                <li>La connexion entre vendeuses et acheteuses partageant les mêmes valeurs</li>
                <li>Un espace sécurisé et bienveillant pour le commerce électronique</li>
                <li>La promotion de l'entrepreneuriat féminin musulman</li>
              </ul>
            </section>

            {/* Utilisation */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Conditions d'Utilisation</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3.1 Éligibilité</h3>
                  <p className="text-gray-700">
                    Pour utiliser nos services, vous devez être âgé d'au moins 18 ans et avoir la capacité
                    juridique de contracter.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3.2 Comptes Utilisateur</h3>
                  <p className="text-gray-700">
                    Vous êtes responsable de maintenir la confidentialité de votre compte et mot de passe.
                    Vous acceptez d'être responsable de toutes les activités qui se produisent sous votre compte.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3.3 Comportement</h3>
                  <p className="text-gray-700">
                    Vous vous engagez à utiliser la plateforme de manière respectueuse et à ne pas violer
                    les droits d'autrui ou les lois applicables.
                  </p>
                </div>
              </div>
            </section>

            {/* Propriété Intellectuelle */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Propriété Intellectuelle</h2>
              <p className="text-gray-700 leading-relaxed">
                Tous les contenus présents sur Shop By Soeurise (textes, images, logos, etc.) sont la
                propriété de Shop By Soeurise ou de ses partenaires. Vous ne pouvez pas reproduire,
                distribuer ou utiliser ces contenus sans autorisation préalable.
              </p>
            </section>

            {/* Responsabilités */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitations de Responsabilité</h2>
              <p className="text-gray-700 leading-relaxed">
                Shop By Soeurise s'efforce de fournir un service de qualité, mais ne peut garantir
                l'absence d'erreurs ou d'interruptions. Nous ne sommes pas responsables des dommages
                indirects ou consécutifs découlant de l'utilisation de notre plateforme.
              </p>
            </section>

            {/* Modifications */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Modifications des Conditions</h2>
              <p className="text-gray-700 leading-relaxed">
                Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications
                prendront effet dès leur publication sur la plateforme. Votre utilisation continue de
                nos services constitue l'acceptation des conditions modifiées.
              </p>
            </section>

            {/* Contact */}
            <section className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact</h2>
              <p className="text-gray-700 leading-relaxed">
                Pour toute question concernant ces conditions générales d'utilisation, vous pouvez
                nous contacter à l'adresse email : contact@shopbysoeurise.com
              </p>
            </section>
          </motion.div>
        </div>
      </div>
    </ModernLayout>
  );
}