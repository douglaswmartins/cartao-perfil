import type { Card } from "@/util/model/card";
import axios from "axios";

const systemPrompt = `
Você será meu fornecedor de dicas para o jogo "Perfil", criado pela Grow. A versão mais recente é o Perfil 7.

Regras do Jogo:

1. O jogador designado como mediador pega uma cartela da pilha e anuncia a categoria (coisa, lugar, pessoa, ano ou digital), colocando a ficha amarela sobre a casa correspondente no tabuleiro.
1. O jogador à esquerda do mediador escolhe um número de 1 a 20 e coloca uma ficha vermelha sobre a casa correspondente no tabuleiro. O mediador, então, lê a dica correspondente ao número escolhido.
1. Após ouvir a dica, o jogador que escolheu o número pode dar um palpite sobre a identidade da cartela ou passar a vez ao jogador à esquerda.

Categorias:

- PESSOA (código = 1): Seres humanos conhecidos (vivos ou mortos, reais ou fictícios), profissionais, ou grupos de pessoas.
- LUGAR (código = 2): Criados pela natureza (rios, mares, planetas) ou feitos pelo homem (monumentos, cidades). Inclui lugares fictícios.
- COISA (código = 3): Seres não vivos, itens, ou conceitos abstratos.
- ANO (código = 4): Anos relacionados a eventos históricos importantes.
- DIGITAL (código = 5): Relacionado ao mundo virtual e digital, com termos que não existem no mundo físico.

Instruções para Criar as Dicas:

- As dicas podem variar entre fáceis, medianas e difíceis, sem revelar diretamente a resposta.
- Não se deve repetir dicas de uma carta para outra.
- As dicas devem ser 100% verídicas e relacionadas ao perfil.

Requisitos para as Cartas:

- O nome do perfil, com a categoria definida aleatoriamente.
- As 17 dicas. Seguindo as instruções passadas na seção "Instruções para Criar as Dicas".

Você sempre responde em formato JSON.

O retorno será preenchido da seguinte forma:

{
	answer: {perfil},
	category: {código da categoria},
	hints: Array[] // 17 Dicas
}

Importante:
As dicas devem ser verídicas e não repetidas.
O formato de cada carta deve ser exatamente como o exemplo, sem introduções ou textos adicionais.

Exemplo de retornos:

{
	answer: 'ESTÁBULO',
	category: 2,
	hints: [
		"Funcionários cuidam de mim e de meus hóspedes.",
		"Tenho a função de abrigar.",
		"Possuo cocheiras.",
		"Sou o local onde se alojam os cavalos.",
		"Nos EUA, normalmente, sou vermelho.",
		"Normalmente, tenho ração e feno armazenados.",
		"Também posso abrigar bovinos.",
		"Uma grande fazenda certamente tem um.",
		"Posso ser encontrado em clubes de hipismo.",
		"Possuo pequenos alojamentos.",
		"Meu cheiro não é muito agradável.",
		"Algumas das minhas portas são cortadas ao meio, na horizontal.",
		"Normalmente minha estrutura é de madeira.",
		"Minhas dependências mais modernas são feitas de alvenaria.",
		"Andaluz, Appaloosa e Árabe são algumas raças de meus hóspedes.",
		"Os cavalos domésticos necessitam de mim.",
		"Recebo a visita de um veterinário com frequência.",
	],
};

Requisitos Adicionais:
- Lembre-se: as dicas devem ser variadas e verídicas.
- Sempre envie apenas o JSON no formato correto.
- Propriedades como answer, category, e hints agora estão entre aspas duplas (").
- O JSON precisa ter aspas duplas para as chaves e os valores (exceto quando o valor for um número ou null, que pode ser sem aspas).
- o numero de hints (Dicas) tem que ser exatos 17`;

const openaiClient = axios.create({
  baseURL: "https://api.openai.com",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
  },
});

export async function getCardHints() {
  try {
    const response = await openaiClient.post("/v1/chat/completions", {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: "Me envie um novo perfil",
        },
      ],
    });
    const result = JSON.parse(response.data.choices[0].message.content);

    return result as Card;
  } catch (error) {
    console.error("Erro na API:", error);
    throw new Error("Erro ao obter resposta");
  }
}

export async function getCardHintsMock() {
  try {
    const response = await mockResult();
    return response as Card;
  } catch (error) {
    console.error("Erro na API:", error);
    return new Error("Erro ao obter resposta");
  }
}

function mockResult(error = false) {
  return new Promise<Card>((resolve, reject) => {
    const card: Card = {
      answer: "NAPOLEÃO BONAPARTE",
      category: 1,
      hints: [
        "Nasci no século XVIII.",
        "Fui um líder militar e político.",
        "Nasci na ilha de Córsega.",
        "Tornei-me imperador da França.",
        "Fui exilado duas vezes.",
        "Minha primeira esposa foi Josefina.",
        "Comandei tropas em batalhas famosas.",
        "Fui derrotado na Batalha de Waterloo.",
        "Fui um dos maiores estrategistas militares da história.",
        "Meu reinado trouxe reformas importantes na Europa.",
        "Sou associado ao Código Civil que leva meu nome.",
        "Meu título oficial era 'Imperador dos Franceses'.",
        "Minha primeira abdicação ocorreu em 1814.",
        "Meu segundo exílio foi na ilha de Santa Helena.",
        "Morri em 1821.",
        "Minha estatura física foi objeto de debate histórico.",
        "Meu nome tornou-se sinônimo de ambição e liderança.",
      ],
    };
    if (!error) {
      resolve(card);
    } else {
      reject("Erro carai");
    }
  });
}
