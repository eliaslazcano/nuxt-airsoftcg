export const nomeRules = [
  v => !!v && !!v.trim() || 'Insira seu nome e sobrenome',
  v => !!v && v.trim().split(' ').length > 1 || 'Falta o sobrenome'
]

export const passwordRules = [
  v => !!v && !!v.trim() || 'Insira sua nova senha',
  v => !!v && !!v.trim() && v.indexOf(' ') === -1 || 'Não pode usar espaços',
  v => !!v && v.length >= 4 || 'Precisa ter ao menos 4 caracteres'
]

export const msgRecursoRestrito = `É preciso ter uma conta no site para usar este recurso.<br/>
Faça login ou registre-se no botão abaixo, é grátis e livre para todos.<br/>
Se você já é membro, <a href="/login?next=/jogos" class="text-blue">clique aqui para entrar.</a>`;