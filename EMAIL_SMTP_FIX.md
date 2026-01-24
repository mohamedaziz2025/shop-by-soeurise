# Configuration SMTP - Corrections

## Problèmes identifiés et corrigés

### 1. Erreur de propriété `requireTLS`
**Problème**: La propriété `requireTLS` n'existe pas dans la configuration nodemailer.
**Solution**: Remplacement par `tls: { rejectUnauthorized: false }` pour accepter les certificats auto-signés.

### 2. Envoi d'email de réinitialisation de mot de passe manquant
**Problème**: La fonction `forgotPassword` ne contenait qu'un TODO et n'envoyait pas d'email.
**Solution**: 
- Création de la méthode privée `sendPasswordResetEmail()`
- Implémentation de l'envoi d'email dans `forgotPassword()`

### 3. Page de réinitialisation de mot de passe manquante
**Problème**: Pas de page frontend pour réinitialiser le mot de passe.
**Solution**: Création de `/frontend/src/app/reset-password/page.tsx`

### 4. Méthode API manquante
**Problème**: Pas de méthode `resetPassword()` dans l'API frontend.
**Solution**: Ajout de la méthode dans `/frontend/src/lib/api.ts`

## Fichiers modifiés

### Backend
1. `/backend/src/auth/auth.service.ts`
   - Correction de la configuration SMTP (remplacement de `requireTLS`)
   - Création de `createEmailTransporter()` pour éviter la duplication de code
   - Ajout de `sendPasswordResetEmail()` pour l'envoi d'email de réinitialisation
   - Mise à jour de `forgotPassword()` pour envoyer l'email

2. `/backend/scripts/test-email.ts` (nouveau)
   - Script de test pour vérifier la configuration SMTP
   - Permet de tester l'envoi d'email avant de l'utiliser en production

### Frontend
1. `/frontend/src/app/reset-password/page.tsx` (nouveau)
   - Page complète de réinitialisation de mot de passe
   - Validation des mots de passe
   - Gestion des erreurs et messages de succès
   - Redirection automatique vers la page de connexion après succès

2. `/frontend/src/lib/api.ts`
   - Ajout de la méthode `resetPassword(token, newPassword)`

## Configuration SMTP actuelle

```env
MAIL_HOST=mail.shippertrip.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_TLS=true
MAIL_USER=verifier@shippertrip.com
MAIL_PASSWORD=VERIFYmail
MAIL_FROM=Soeurise <verifier@shippertrip.com>
```

## Comment tester

### Test manuel de la configuration SMTP
```bash
cd backend
npm run test:email
```

Ou avec ts-node:
```bash
cd backend
npx ts-node scripts/test-email.ts
```

### Test du flux complet

1. **Inscription d'un utilisateur**
   - Accéder à `/register`
   - Créer un compte
   - Vérifier la réception de l'email de vérification

2. **Réinitialisation de mot de passe**
   - Accéder à `/forgot-password`
   - Entrer votre email
   - Vérifier la réception de l'email de réinitialisation
   - Cliquer sur le lien dans l'email
   - Entrer un nouveau mot de passe sur la page `/reset-password`
   - Se connecter avec le nouveau mot de passe

## Configuration nodemailer correcte

La configuration SMTP correcte pour nodemailer est:

```typescript
nodemailer.createTransport({
  host: 'mail.shippertrip.com',
  port: 587,
  secure: false, // false pour le port 587, true pour le port 465
  tls: {
    rejectUnauthorized: false, // Accepter les certificats auto-signés
  },
  auth: {
    user: 'verifier@shippertrip.com',
    pass: 'VERIFYmail',
  },
});
```

### Propriétés importantes:
- `secure`: doit être `false` pour le port 587 (STARTTLS), `true` pour le port 465 (SSL/TLS)
- `tls.rejectUnauthorized`: à `false` pour accepter les certificats auto-signés (développement)
- ~~`requireTLS`~~: Cette propriété n'existe pas dans nodemailer

## Emails envoyés par l'application

### 1. Email de vérification de compte
- Endpoint: `POST /auth/register`
- Template: Email avec bouton de vérification
- Token: `emailVerificationToken` (24h de validité)
- Lien: `http://72.62.71.97:3000/verify-email?token=XXX`

### 2. Email de réinitialisation de mot de passe
- Endpoint: `POST /auth/forgot-password`
- Template: Email avec bouton de réinitialisation
- Token: `passwordResetToken` (1h de validité)
- Lien: `http://72.62.71.97:3000/reset-password?token=XXX`

## Logs de debug

Les logs suivants sont disponibles pour le débogage:
- Configuration SMTP au démarrage
- Connexion au serveur SMTP
- Envoi réussi d'un email
- Erreurs lors de l'envoi

Pour activer les logs de débogage dans nodemailer:
```typescript
const transporter = nodemailer.createTransport({
  // ... config
  debug: true, // Active les logs de débogage
  logger: true, // Active tous les logs
});
```

## Problèmes courants

### 1. Connexion refusée
- Vérifier que le port 587 n'est pas bloqué par le firewall
- Vérifier que le serveur SMTP accepte les connexions

### 2. Authentification échouée
- Vérifier MAIL_USER et MAIL_PASSWORD
- Vérifier que le compte n'est pas bloqué

### 3. Email non reçu
- Vérifier le dossier spam
- Vérifier les logs du serveur SMTP
- Utiliser le script de test pour valider la configuration

## Recommandations

1. **En production**: 
   - Utiliser un service d'email transactionnel (SendGrid, Mailgun, AWS SES)
   - Activer `rejectUnauthorized: true` pour vérifier les certificats SSL

2. **Sécurité**:
   - Ne jamais commiter les credentials SMTP
   - Utiliser des variables d'environnement
   - Changer régulièrement les mots de passe

3. **Performance**:
   - Envisager une file d'attente pour les emails (Bull, Bee-Queue)
   - Implémenter des retries en cas d'échec
   - Logger tous les envois pour le suivi

4. **Templates**:
   - Utiliser un moteur de template (Handlebars, EJS)
   - Créer des templates réutilisables
   - Ajouter un footer avec lien de désinscription
