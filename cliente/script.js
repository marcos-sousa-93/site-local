/* ============================================================
   SCRIPT DO CLIENTE (NAVEGADOR)
   ============================================================
   Este arquivo roda EM CADA computador que abre o chat.
   Ele:
   1. Conecta ao servidor via Socket.IO
   2. Envia mensagens para o servidor
   3. Recebe mensagens do servidor e mostra na tela
   ============================================================ */

// ===== 1. CONECTA AO SERVIDOR =====
// O "io()" se conecta automaticamente ao servidor que serviu a página
const socket = io();

console.log('🔌 Tentando conectar ao servidor...');

// ===== 2. VARIÁVEIS GLOBAIS =====
let meuNome = '';  // Guarda o nome do usuário atual

// ===== 3. REFERÊNCIAS AOS ELEMENTOS DA PÁGINA =====
const telaLogin = document.getElementById('tela-login');
const telaChat = document.getElementById('tela-chat');
const inputNome = document.getElementById('input-nome');
const btnEntrar = document.getElementById('btn-entrar');
const nomeAtual = document.getElementById('nome-atual');
const mensagens = document.getElementById('mensagens');
const inputMensagem = document.getElementById('input-mensagem');
const formMensagem = document.getElementById('form-mensagem');
const listaUsuarios = document.getElementById('lista-usuarios');
const avisoDigitando = document.getElementById('aviso-digitando');

// ===== 4. EVENTOS DE CONEXÃO COM O SERVIDOR =====

// ✅ Quando conecta com sucesso
socket.on('connect', () => {
    console.log('✅ Conectado ao servidor! Meu ID:', socket.id);
});

// ❌ Quando perde a conexão
socket.on('disconnect', () => {
    console.log('❌ Desconectado do servidor');
    adicionarMensagemSistema('Você foi desconectado do servidor');
});

// ===== 5. ENTRAR NO CHAT =====
btnEntrar.addEventListener('click', entrarNoChat);

// Também permite entrar pressionando "Enter"
inputNome.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') entrarNoChat();
});

function entrarNoChat() {
    const nome = inputNome.value.trim();
    
    // Valida se o nome foi digitado
    if (nome === '') {
        alert('⚠️ Por favor, digite seu nome!');
        return;
    }
    
    // Guarda o nome
    meuNome = nome;
    
    // Avisa o servidor que entramos
    socket.emit('entrar', nome);
    
    // Troca de tela
    telaLogin.style.display = 'none';
    telaChat.style.display = 'flex';
    
    // Mostra o nome no cabeçalho
    nomeAtual.textContent = `👤 ${nome}`;
    
    // Foca no campo de mensagem
    inputMensagem.focus();
    
    console.log(`👤 Entrei como: ${nome}`);
}

// ===== 6. ENVIAR MENSAGEM =====
formMensagem.addEventListener('submit', (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    
    const texto = inputMensagem.value.trim();
    
    if (texto === '') return;
    
    // Envia a mensagem para o servidor
    // O servidor vai repassar para todos os clientes
    socket.emit('mensagem', texto);
    
    // Limpa o campo
    inputMensagem.value = '';
    inputMensagem.focus();
});

// ===== 7. AVISAR QUE ESTÁ DIGITANDO =====
inputMensagem.addEventListener('input', () => {
    socket.emit('digitando');
});

// ===== 8. RECEBER MENSAGENS DO SERVIDOR =====

// 💬 Nova mensagem recebida
socket.on('nova-mensagem', (msg) => {
    console.log(`💬 Mensagem de ${msg.autor}: ${msg.texto}`);
    
    // Verifica se a mensagem é minha ou de outro
    const ehMinha = msg.autor === meuNome;
    
    // Cria o elemento HTML da mensagem
    const div = document.createElement('div');
    div.className = `mensagem ${ehMinha ? 'minha' : 'outro'}`;
    
    div.innerHTML = `
        <div class="autor">${msg.autor}</div>
        <div class="texto">${escaparHTML(msg.texto)}</div>
        <div class="horario">${msg.horario}</div>
    `;
    
    mensagens.appendChild(div);
    
    // Rola para o final
    mensagens.scrollTop = mensagens.scrollHeight;
});

// ⚙️ Mensagem do sistema (entrou/saiu)
socket.on('mensagem-sistema', (texto) => {
    adicionarMensagemSistema(texto);
});

// 👥 Atualização da lista de usuários online
socket.on('lista-usuarios', (usuarios) => {
    listaUsuarios.innerHTML = '';
    usuarios.forEach((nome) => {
        const li = document.createElement('li');
        li.textContent = `🟢 ${nome}`;
        listaUsuarios.appendChild(li);
    });
});

// ✍️ Alguém está digitando
socket.on('usuario-digitando', (nome) => {
    avisoDigitando.textContent = `✍️ ${nome} está digitando...`;
    
    // Limpa o aviso depois de 2 segundos
    clearTimeout(avisoDigitando.timeoutId);
    avisoDigitando.timeoutId = setTimeout(() => {
        avisoDigitando.textContent = '';
    }, 2000);
});

// ===== 9. FUNÇÕES AUXILIARES =====

/**
 * Adiciona uma mensagem do sistema (centralizada)
 */
function adicionarMensagemSistema(texto) {
    const div = document.createElement('div');
    div.className = 'mensagem sistema';
    div.textContent = texto;
    mensagens.appendChild(div);
    mensagens.scrollTop = mensagens.scrollHeight;
}

/**
 * Escapa HTML para evitar injeção de código (segurança)
 */
function escaparHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// ===== 10. MENSAGEM DE BOAS-VINDAS =====
console.log(`
╔════════════════════════════════════════╗
║  💬 CHAT EM TEMPO REAL                 ║
║  Aguardando você entrar no chat...     ║
╚════════════════════════════════════════╝
`);
