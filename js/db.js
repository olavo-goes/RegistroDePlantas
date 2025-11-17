import { openDB } from 'idb';

let db;

async function createDB() {
  try {
    db = await openDB('registro-plantas-db', 1, {
      upgrade(db, oldVersion) {
        switch (oldVersion) {
          case 0:
          case 1:
            const store = db.createObjectStore('plantas', {
              keyPath: 'nome'
            });
            store.createIndex('id', 'id');
            showResult('Banco de dados de plantas criado!');
        }
      }
    });
    showResult('Banco de dados aberto.');
  } catch (e) {
    showResult('Erro ao criar o banco de dados: ' + e.message);
  }
}

async function addData(nome, imagem) {
  const tx = await db.transaction('plantas', 'readwrite');
  const store = tx.objectStore('plantas');
  await store.add({ nome: nome, imagem: imagem });
  await tx.done;
  showResult('Planta registrada com sucesso!');
}

async function getData() {
  if (!db) {
    showResult('O banco de dados está fechado');
    return;
  }

  const tx = await db.transaction('plantas', 'readonly');
  const store = tx.objectStore('plantas');
  const value = await store.getAll();

  if (value && value.length > 0) {
    const html = value
      .map(
        planta => `
        <div style="margin-bottom: 1rem;">
          <strong>${planta.nome}</strong><br>
          <img src="${planta.imagem}" width="100" style="border-radius: 6px;" />
        </div>`
      )
      .join('');
    showResult(html);
  } else {
    showResult('Não há nenhuma planta registrada!');
  }
}

function showResult(text) {
  document.querySelector('output').innerHTML = text;
}

window.addEventListener('DOMContentLoaded', () => {
  createDB();
  document.getElementById('btnSalvar').addEventListener('click', () => {
    const nome = document.getElementById('inputNome').value;
    const imagem = document.querySelector('#foto-preview img')?.src;
    if (nome && imagem) {
      addData(nome, imagem);
      document.getElementById('inputNome').value = '';
    } else {
      showResult('Preencha o nome e tire uma foto antes de salvar.');
    }
  });

  document.getElementById('btnListar').addEventListener('click', getData);
});