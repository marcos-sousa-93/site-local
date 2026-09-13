# 🎬 Passo 1: Instalar o Node.js
Baixe e instale em: https://nodejs.org

(Para verificar se instalou, abra o terminal e digite node --version)

<hr>

# 🎬 Passo 2: Baixar as Bibliotecas do Servidor
Abra o terminal na pasta `servidor/` e execute:

```bash
cd servidor
```

`C:\Users\Nome\Documents\site\servidor>`

```bash
npm install
```

Isso vai baixar o express e o socket.io automaticamente.

<hr>

# 🎬 Passo 3: Iniciar o Servidor
Ainda no terminal, dentro da pasta servidor/, execute:

```bash
node server.js
```

Você deve ver algo assim:

```text
╔═══════════════════════════════════════════════╗
║  ✅ SERVIDOR DE CHAT RODANDO!                 ║
╠═══════════════════════════════════════════════╣
║  🌐 Local:  http://localhost:3000             ║
║  📡 Rede:   http://SEU_IP_LOCAL:3000          ║
╚═══════════════════════════════════════════════╝
```

# 🎬 Passo 4: Descobrir o IP do Servidor
Abra outro terminal (não feche o do servidor!) e digite:

### No Windows:

```bash
ipconfig
```

### No Linux/Mac:

```bash
ifconfig
```

Procure por algo como IPv4 ou inet e anote. Geralmente algo como:

```text
192.168.1.10
192.168.0.15
10.0.0.5
```

# 🎬 Passo 5: Abrir os 2 Clientes
### 💻 Computador 1 (o próprio servidor):

Abra o navegador e acesse: http://localhost:3000

### 💻 Computador 2 (outro dispositivo na mesma rede):

Abra o navegador e acesse: http://192.168.1.10:3000

(troque pelo IP que você descobriu)

📱 Ou até mesmo um celular na mesma rede Wi-Fi!

# 🎬 Passo 6: Testar o Chat
No Computador 1: Digite "João" e clique em "Entrar no Chat"

No Computador 2: Digite "Maria" e clique em "Entrar no Chat"

Agora escreva mensagens! Elas aparecem instantaneamente nos 2 computadores 🎉

# 🧠 ENTENDENDO O QUE ACONTECE
### 🔄 Fluxo de uma mensagem:

```text
1. João (Cliente 1) digita "Olá!" e aperta Enter
   
   └──> socket.emit('mensagem', 'Olá!')
   
2. O servidor recebe o evento 'mensagem'
   
   └──> socket.on('mensagem', (texto) => { ... })
   
3. O servidor repassa para TODOS os clientes
   
   └──> io.emit('nova-mensagem', {autor: 'João', texto: 'Olá!', ...})
   
4. Todos os clientes (incluindo Maria) recebem e mostram
   
   └──> socket.on('nova-mensagem', (msg) => { ... })
```

# 📊 Tabela de Eventos (Resumo)
| Evento | Quem envia	| Quem recebe	| O que faz |
|-----|-----|-----|-----|
| `entrar` | Cliente |	Servidor	| Avisa que o usuário entrou |
| `mensagem`	| Cliente	| Servidor	| Envia uma mensagem |
| `digitando`	| Cliente	| Servidor	| Avisa que está digitando |
| `nova-mensagem` |	Servidor	|Todos	| Repassa a mensagem |
| `lista-usuarios`	| Servidor	| Todos	| Atualiza lista de online |
| `mensagem-sistema`	| Servidor	| Todos	| Avisa que alguém entrou/saiu |
| `usuario-digitando`	| Servidor	| Outros	| Avisa quem está digitando |

# ⚠️ PROBLEMAS COMUNS E SOLUÇÕES
### ❌ "Não consigo acessar de outro computador"
Causa: Firewall bloqueando a porta 3000.

Solução Windows:

Abra "Firewall do Windows Defender"

Clique em "Permitir um aplicativo"

Adicione o Node.js

Ou libere a porta pelo PowerShell (como administrador):

```powershell
New-NetFirewallRule -DisplayName "Node.js Chat" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

### ❌ "Module not found: express"
Solução: Você esqueceu de rodar npm install na pasta `servidor/`.

### ❌ "EADDRINUSE: address already in use"
Solução: Já tem um servidor rodando na porta 3000. Feche ele ou mude a porta no server.js:

```javascript
const PORTA = 3001; // Muda para outra porta
```

### ❌ "ERR_CONNECTION_REFUSED" no celular
Solução: Verifique se:

O celular está no mesmo Wi-Fi do servidor

Você digitou o IP correto (não localhost, mas o IP local)

O servidor está rodando no terminal

# 🎓 O QUE VOCÊ APRENDEU
✅ Como criar um servidor Node.js que fala com múltiplos clientes

✅ Como usar Socket.IO para comunicação bidirecional em tempo real

✅ Como servir arquivos HTML/CSS/JS pelo servidor

✅ Como descobrir e usar o IP local para acesso na rede

✅ Diferença entre localhost (só sua máquina) e IP local (rede toda)

✅ Como tratar eventos como entrar, mensagem, disconnect

✅ Diferença entre io.emit() (todos) e socket.broadcast.emit() (exceto você)

# 🚀 PRÓXIMOS PASSOS (Ideias para evoluir)
Depois que entender esse chat, você pode:

Adicionar salas (múltiplas conversas separadas)

Enviar arquivos junto com mensagens

Mensagens privadas (clicar em um usuário e falar só com ele)

Salvar histórico em um banco de dados SQLite

Adicionar "digitando..." com timeout mais longo

Notificações sonoras ao receber mensagem

Emojis e formatação de texto

Agora você tem a base de qualquer aplicação em tempo real! Esse mesmo padrão é usado em WhatsApp Web, Discord, Slack, jogos online... 🎯
