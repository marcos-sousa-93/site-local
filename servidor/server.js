/* ============================================================
   SERVIDOR DE CHAT EM TEMPO REAL
   ============================================================
   Este arquivo é o "cérebro" do sistema.
   Ele:
   1. Serve os arquivos do cliente (HTML, CSS, JS)
   2. Recebe mensagens dos clientes
   3. Repassa as mensagens para TODOS os clientes conectados
   ============================================================ */

// ===== 1. IMPORTA AS BIBLIOTECAS =====
const express = require('express');        // Para servir arquivos web
const http = require('http');              // Para criar o servidor HTTP
const { Server } = require('socket.io');   // Para comunicação em tempo real
const path = require('path');              // Para lidar com caminhos de arquivos

// ===== 2. CRIA A APLICAÇÃO E O SERVIDOR =====
const app = express();                     // Cria a aplicação Express
const servidor = http.createServer(app);   // Cria o servidor HTTP
const io = new Server(servidor);           // Anexa o Socket.IO ao servidor

// ===== 3. SERVE OS ARQUIVOS DO CLIENTE =====
// Qualquer arquivo dentro da pasta "cliente" fica acessível
app.use(express.static(path.join(__dirname, '..', 'cliente')));

// ===== 4. VARIÁVEIS DE CONTROLE =====
// Aqui guardamos informações dos usuários conectados
const usuariosConectados = {};  // { socketId: nomeDoUsuario }

console.log('🚀 Servidor iniciado. Aguardando conexões...');

// ===== 5. EVENTOS DO SOCKET.IO =====
// Este bloco é executado CADA VEZ que um novo cliente se conecta
io.on('connection', (socket) => {
    
    // ---------- LOG: Novo cliente conectou ----------
    console.log(`🔌 Novo cliente conectado! ID: ${socket.id}`);
    
    // ---------- EVENTO: Cliente entrou com um nome ----------
    // Quando o cliente envia "entrar" com seu nome, guardamos
    socket.on('entrar', (nomeUsuario) => {
        usuariosConectados[socket.id] = nomeUsuario;
        
        console.log(`👤 ${nomeUsuario} entrou no chat!`);
        console.log(`📊 Total de usuários online: ${Object.keys(usuariosConectados).length}`);
        
        // Avisa TODOS os clientes que alguém entrou
        io.emit('mensagem-sistema', `${nomeUsuario} entrou no chat 👋`);
        
        // Atualiza a lista de usuários online para todos
        io.emit('lista-usuarios', Object.values(usuariosConectados));
    });
    
    // ---------- EVENTO: Cliente enviou uma mensagem ----------
    // Quando o cliente envia "mensagem", recebemos o texto
    socket.on('mensagem', (texto) => {
        const nomeUsuario = usuariosConectados[socket.id] || 'Anônimo';
        
        console.log(`💬 ${nomeUsuario}: ${texto}`);
        
        // Monta o objeto da mensagem
        const mensagemCompleta = {
            autor: nomeUsuario,
            texto: texto,
            horario: new Date().toLocaleTimeString('pt-BR'),
            idSocket: socket.id
        };
        
        // Envia para TODOS os clientes (inclusive quem enviou)
        io.emit('nova-mensagem', mensagemCompleta);
    });
    
    // ---------- EVENTO: Cliente está digitando ----------
    // Avisa os outros que alguém está digitando (opcional, mas legal)
    socket.on('digitando', () => {
        const nomeUsuario = usuariosConectados[socket.id];
        if (nomeUsuario) {
            // Envia para todos EXCETO quem está digitando
            socket.broadcast.emit('usuario-digitando', nomeUsuario);
        }
    });
    
    // ---------- EVENTO: Cliente desconectou ----------
    // Executado quando o usuário fecha a aba ou perde conexão
    socket.on('disconnect', () => {
        const nomeUsuario = usuariosConectados[socket.id];
        
        if (nomeUsuario) {
            console.log(`❌ ${nomeUsuario} saiu do chat.`);
            
            // Remove da lista
            delete usuariosConectados[socket.id];
            
            // Avisa todos
            io.emit('mensagem-sistema', `${nomeUsuario} saiu do chat 🚪`);
            io.emit('lista-usuarios', Object.values(usuariosConectados));
        } else {
            console.log(`❌ Cliente desconectado (sem nome): ${socket.id}`);
        }
    });
});

// ===== 6. INICIA O SERVIDOR =====
const PORTA = 3000;

servidor.listen(PORTA, '0.0.0.0', () => {
    console.log('');
    console.log('╔═══════════════════════════════════════════════╗');
    console.log('║  ✅ SERVIDOR DE CHAT RODANDO!                 ║');
    console.log('╠═══════════════════════════════════════════════╣');
    console.log(`║  🌐 Local:  http://localhost:${PORTA}            ║`);
    console.log(`║  📡 Rede:   http://SEU_IP_LOCAL:${PORTA}        ║`);
    console.log('║                                               ║');
    console.log('║  💡 Descubra seu IP com: ipconfig (Windows)   ║');
    console.log('║     ou ifconfig (Linux/Mac)                   ║');
    console.log('╚═══════════════════════════════════════════════╝');
    console.log('');
});
