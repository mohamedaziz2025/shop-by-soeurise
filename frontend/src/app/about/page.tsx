'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ModernLayout from '@/components/ModernLayout';
import { Heart, Shield, Users, Sparkles, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Confiance',
      description: 'Chaque vendeuse est vérifiée. Chaque produit est contrôlé pour garantir la qualité et l\'authenticité.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Users,
      title: 'Communauté',
      description: 'Plus qu\'une marketplace, nous construisons une communauté solidaire qui s\'entraide et grandit ensemble.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Sparkles,
      title: 'Excellence',
      description: 'Nous sélectionnons avec soin des produits de qualité qui respectent nos standards élevés.',
      color: 'from-rose-500 to-pink-500',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Membres actives' },
    { number: '500+', label: 'Vendeuses partenaires' },
    { number: '50K+', label: 'Produits vendus' },
    { number: '98%', label: 'Satisfaction client' },
  ];

  const team = [
    { name: 'Amina B.', role: 'Fondatrice & CEO', image: 'https://source.unsplash.com/400x400/?hijab,portrait,professional' },
    { name: 'Khadija M.', role: 'Directrice Produit', image: 'https://source.unsplash.com/400x400/?hijab,businesswoman' },
    { name: 'Fatima S.', role: 'Head of Community', image: 'https://source.unsplash.com/400x400/?hijab,woman,smile' },
  ];

  return (
    <ModernLayout>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 opacity-60" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 bg-white border border-pink-100 px-4 py-2 rounded-full text-xs font-bold text-pink-600 mb-6 shadow-sm">
                <Heart className="w-4 h-4" />
                NOTRE HISTOIRE
              </span>
              <h1 className="text-7xl md:text-8xl font-black text-gray-900 mb-8 tracking-tighter leading-[0.9]">
                Bienvenue chez{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500">
                  SHOP BY SOEURISE
                </span>
              </h1>
              <p className="text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-medium">
                Une marketplace dédiée aux femmes musulmanes, créée avec amour pour célébrer notre communauté, nos valeurs et notre créativité.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">Notre Mission</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative h-[500px] rounded-[40px] overflow-hidden shadow-2xl"
              >
                <Image
                  src="https://source.unsplash.com/1000x1200/?hijab,woman,entrepreneur"
                  alt="Mission Shop By Soeurise"
                  fill
                  className="object-cover"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <p className="text-xl text-gray-700 leading-relaxed">
                  Shop By Soeurise est née d'une vision simple mais puissante : créer un espace où les femmes musulmanes peuvent acheter et vendre des produits qui correspondent à leurs valeurs et leur identité.
                </p>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Nous croyons en l'autonomisation économique des femmes, en la qualité des produits, et en la construction d'une communauté bienveillante et solidaire.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  {[
                    'Autonomisation féminine',
                    'Produits éthiques',
                    'Commerce équitable',
                    'Made with love'
                  ].map((tag, i) => (
                    <span key={i} className="px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-gray-950 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl md:text-6xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-semibold tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">Nos Valeurs</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Les piliers qui guident chacune de nos actions et décisions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[32px] p-10 shadow-xl border border-pink-50 group cursor-pointer"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${value.color} rounded-[20px] flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <value.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">L'Équipe</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Les femmes passionnées qui donnent vie à Shop By Soeurise
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[32px] overflow-hidden shadow-xl group"
              >
                <div className="relative h-80">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-black text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-pink-600 font-semibold">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-pink-600 via-rose-600 to-amber-500 rounded-[48px] p-16 text-center text-white shadow-2xl"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
              Rejoignez l'aventure
            </h2>
            <p className="text-2xl mb-10 opacity-90 max-w-2xl mx-auto">
              Que vous soyez acheteuse ou vendeuse, vous avez votre place dans notre communauté
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link
                href="/marketplace"
                className="px-10 py-5 bg-white text-pink-600 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-xl"
              >
                Explorer la marketplace
              </Link>
              <Link
                href="/seller/register"
                className="px-10 py-5 border-3 border-white text-white rounded-full font-black text-lg hover:bg-white hover:text-pink-600 transition-all"
              >
                Devenir vendeuse <ArrowRight className="inline w-6 h-6 ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </ModernLayout>
  );
}
