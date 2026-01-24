import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function testEmail() {
  console.log('🧪 Test de configuration SMTP...\n');

  console.log('Configuration:');
  console.log(`  MAIL_HOST: ${process.env.MAIL_HOST}`);
  console.log(`  MAIL_PORT: ${process.env.MAIL_PORT}`);
  console.log(`  MAIL_USER: ${process.env.MAIL_USER}`);
  console.log(`  MAIL_FROM: ${process.env.MAIL_FROM}`);
  console.log(`  MAIL_SECURE: ${process.env.MAIL_SECURE}\n`);

  // Créer le transporteur
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || '587'),
    secure: process.env.MAIL_SECURE === 'true',
    tls: {
      rejectUnauthorized: false, // Accepter les certificats auto-signés
    },
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  // Vérifier la connexion
  console.log('📡 Vérification de la connexion SMTP...');
  try {
    await transporter.verify();
    console.log('✅ Connexion SMTP réussie!\n');
  } catch (error) {
    console.error('❌ Erreur de connexion SMTP:', error);
    return;
  }

  // Envoyer un email de test
  console.log('📧 Envoi d\'un email de test...');
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_USER, // Envoyer à soi-même pour le test
      subject: 'Test SMTP - Soeurise',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Test SMTP Réussi! 🎉</h2>
          <p>Si vous recevez cet email, la configuration SMTP fonctionne correctement.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">Soeurise - Marketplace communautaire</p>
        </div>
      `,
    });

    console.log('✅ Email envoyé avec succès!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Response: ${info.response}`);
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
  }
}

// Exécuter le test
testEmail()
  .then(() => {
    console.log('\n✅ Test terminé');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur:', error);
    process.exit(1);
  });
