import Post from "../components/Post";
import "./Feed.css"

export default function Feed() {
    const users = [
        ["Ana", "@ana.dev"],
        ["Bruno", "@bruno_js"],
        ["Carlos", "@carlos.codes"],
        ["Daniela", "@daniela.ui"],
        ["Eduardo", "@eduardo.tech"],
        ["Fernanda", "@fernanda.dev"],
        ["Gabriel", "@gabriel.js"],
        ["Helena", "@helena.design"],
        ["Igor", "@igor.dev"],
        ["Juliana", "@juliana.codes"]
    ];


    const posts = [
        "Só passando pra dizer: hoje foi um bom dia.",

        "Café feito, ideias anotadas e aquela sensação de que algo bom vem aí.",

        "Tem dias em que tudo parece corrido demais. A cabeça não para, as tarefas acumulam e o tempo parece escapar. Nesses momentos, respirar fundo e dar um passo de cada vez faz toda a diferença.",

        "Aprender nem sempre é confortável, mas quase sempre vale a pena.",

        "Entre erros, tentativas e recomeços, sigo construindo algo que faça sentido pra mim. Não é sobre velocidade, é sobre constância.",

        "Silêncio também é resposta.",

        "Passei boa parte do dia organizando ideias, refatorando planos e repensando prioridades. Às vezes, desacelerar é a forma mais rápida de avançar.",

        "Um passo hoje já é progresso.",

        "Nem tudo precisa ser perfeito para estar pronto. Às vezes, só precisa existir, ser testado e melhorado com o tempo.",

        "Finalizando o dia com aquela sensação de dever cumprido — mesmo sabendo que amanhã tudo recomeça."
    ];

  return (
    <div>
        {Array.from({ length: 10 }).map((_, i) => {
            const user = users[i];
            const content = posts[i];

            return (
            <Post
                key={i}
                authorName={user[0]}
                username={user[1]}
                content={content}
            />
            );
        })}
    </div>
  );
}
