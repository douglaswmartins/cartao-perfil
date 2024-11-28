const instructions = [
  "Avance :rndNum.",
  "Volte :rndNum.",
  "Escolha um jogador para avançar :rndNum.",
  "Escolha um jogador para voltar :rndNum.",
];

const shuffleArray = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getRandomNumber = (min = 0, max = 100) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomInstruction = (index: number) => {
  const curInstruction = instructions[index];
  const rndSpaces = getRandomNumber(1, 3);
  const textInstruction = `${rndSpaces} casa${rndSpaces > 1 ? "s" : ""}`;
  const result = curInstruction.replace(/:rndNum/g, textInstruction);
  return result;
};

export const populateInstructions = (hints: string[]) => {
  let instructionsToAdd = [
    "Perca sua vez.",
    getRandomInstruction(getRandomNumber(0, instructions.length)),
  ];

  const hasGuessAnytime = Math.random() < 0.5;

  if (hasGuessAnytime) {
    instructionsToAdd = [...instructionsToAdd, "Um palpite a qualquer hora."];
  } else {
    instructionsToAdd = [
      ...instructionsToAdd,
      getRandomInstruction(getRandomNumber(0, instructions.length)),
    ];
  }

  return shuffleArray([...hints, ...instructionsToAdd]);
};
