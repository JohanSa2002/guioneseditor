import axios from 'axios';

async function testGeneration() {
  try {
    const res = await axios.post('http://localhost:3001/api/generar', {
      niche: 'Marketing',
      tema: 'Cómo vender más por Instagram',
      audiencia: 'Emprendedores',
      plataforma: 'reels'
    });
    console.log('Respuesta:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}

testGeneration();
