export class Card {
  answer: string;
  category: number;
  hints: string[];

  constructor(card: { answer: string; category: number; hints: string[] }) {
    this.answer = card.answer;
    this.category = card.category;
    this.hints = card.hints;
  }
}
