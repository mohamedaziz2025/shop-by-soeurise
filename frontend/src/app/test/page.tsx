export default function TestPage() {
  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif'
    }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: '2rem'
      }}>
        Test des Couleurs - Shop By Soeurise
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        <div style={{
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #f3f4f6',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '5rem',
            height: '5rem',
            borderRadius: '1rem',
            background: 'linear-gradient(to bottom right, #d1fae5, #dcfce7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <span style={{ fontSize: '2.5rem' }}>✨</span>
          </div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.75rem',
            textAlign: 'center'
          }}>
            Vert Émeraude
          </h3>
          <p style={{
            color: '#6b7280',
            textAlign: 'center',
            lineHeight: '1.625'
          }}>
            Couleur principale de Shop By Soeurise
          </p>
        </div>

        <div style={{
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #f3f4f6',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '5rem',
            height: '5rem',
            borderRadius: '1rem',
            background: 'linear-gradient(to bottom right, #fce7f3, #fecdd3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <span style={{ fontSize: '2.5rem' }}>💖</span>
          </div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.75rem',
            textAlign: 'center'
          }}>
            Rose Magenta
          </h3>
          <p style={{
            color: '#6b7280',
            textAlign: 'center',
            lineHeight: '1.625'
          }}>
            Couleur secondaire pour la communauté
          </p>
        </div>

        <div style={{
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #f3f4f6',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '5rem',
            height: '5rem',
            borderRadius: '1rem',
            background: 'linear-gradient(to bottom right, #dbeafe, #e0e7ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <span style={{ fontSize: '2.5rem' }}>🛒</span>
          </div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.75rem',
            textAlign: 'center'
          }}>
            Bleu Indigo
          </h3>
          <p style={{
            color: '#6b7280',
            textAlign: 'center',
            lineHeight: '1.625'
          }}>
            Couleur pour la sécurité et le shopping
          </p>
        </div>
      </div>

      <div style={{
        textAlign: 'center',
        padding: '2rem',
        background: 'linear-gradient(to bottom right, #111827, #1f2937)',
        color: 'white',
        borderRadius: '1rem'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#34d399'
        }}>
          Footer Style
        </h2>
        <p style={{ color: '#d1d5db' }}>
          Si vous voyez ces couleurs, le design fonctionne correctement !
        </p>
      </div>
    </div>
  );
}