export type QuestionType = 'essay' | 'choice' | 'extract';

export type Choice = {
  label: string;
  text: string;
};

export type Question = {
  id: string;
  materialId: 'milo' | 'science';
  materialTitle: string;
  number: number;
  page: string;
  line: string;
  type: QuestionType;
  title: string;
  question: string;
  modelAnswer: string;
  maxChars: number | null;
  choices?: Choice[];
  correctChoice?: string;
  explanation?: string;
};

export const questions: Question[] = [
  {
    id: 'milo-03',
    materialId: 'milo',
    materialTitle: 'ミロのヴィーナス',
    number: 3,
    page: '24',
    line: '3',
    type: 'choice',
    title: '問3',
    question: '「あずかり知らぬ」の意味として最も適当なものを、次のア～エから一つ選び、記号で答えよ。',
    choices: [
      { label: 'ア', text: '意図と逆の' },
      { label: 'イ', text: '希望に反した' },
      { label: 'ウ', text: '受け取っていない' },
      { label: 'エ', text: '関知しない' },
    ],
    correctChoice: 'エ',
    modelAnswer: 'エ',
    explanation: '「あずかり知らぬ」は、ここでは「関知しない」「関係していない」という意味。',
    maxChars: null,
  },
  {
    id: 'milo-05',
    materialId: 'milo',
    materialTitle: 'ミロのヴィーナス',
    number: 5,
    page: '24',
    line: '9',
    type: 'essay',
    title: '問5',
    question: '「よりよく国境を渡って行くために、そしてまた、よりよく時代を超えて行くために。」はどういうことか。次の語句をすべて用いて説明せよ。\n\nミロのヴィーナス　美　普遍的　意図　時間　一人歩き　空間　制作者　自身　輝き',
    modelAnswer: 'ミロのヴィーナスが制作者の意図や時間・空間を超えた普遍的な美の輝きをもって彼女自身で一人歩きを始めたこと。',
    maxChars: null,
  },
  {
    id: 'milo-09',
    materialId: 'milo',
    materialTitle: 'ミロのヴィーナス',
    number: 9,
    page: '26',
    line: '1',
    type: 'essay',
    title: '問9',
    question: '「逆説」とあるが、ここではどういうことか。四〇字以内で書け。',
    modelAnswer: 'ミロのヴィーナスが魅力的であるのは、両腕を失っているからこそだということ。',
    maxChars: 40,
  },
  {
    id: 'milo-13',
    materialId: 'milo',
    materialTitle: 'ミロのヴィーナス',
    number: 13,
    page: '26',
    line: '11',
    type: 'essay',
    title: '問13',
    question: '「そこに具体的な二本の腕が復活することを、ひそかに恐れる」とあるが、なぜ「恐れる」のか。その理由を「腕」「暗示」という二つの語句を用いて七〇字以内で説明せよ。',
    modelAnswer: '二本の腕が与えられたら、現在のミロのヴィーナスが持っている、存在すべき無数の腕への暗示という、ふしぎに心象的な表現が失われるから。',
    maxChars: 70,
  },
  {
    id: 'milo-21',
    materialId: 'milo',
    materialTitle: 'ミロのヴィーナス',
    number: 21,
    page: '28',
    line: '1',
    type: 'choice',
    title: '問21',
    question: '「失われていること以上の美しさを生みだすことができないのである」の理由として最も適当なものを、次のア～エから一つ選び、記号で答えよ。',
    choices: [
      { label: 'ア', text: '両腕が復元されることによって、生命の変幻自在な輝きが限定、固定化されてしまうから。' },
      { label: 'イ', text: '両腕がどんなに正確に復元されても、真の原形の美しさよりも勝るとは考えられないから。' },
      { label: 'ウ', text: '両腕が失われていることによって、人々はかえって両腕そのものの美しさを認識するから。' },
      { label: 'エ', text: '両腕が失われていることによって、人間の生活における両腕の重要さが再認識されるから。' },
    ],
    correctChoice: 'ア',
    modelAnswer: 'ア',
    explanation: '両腕の復元によって、失われた腕が生んでいた多様な可能性や生命の輝きが、具体的な形に限定されてしまうため。',
    maxChars: null,
  },
  {
    id: 'science-03',
    materialId: 'science',
    materialTitle: '科学は生きている',
    number: 3,
    page: '72',
    line: '11',
    type: 'choice',
    title: '問3',
    question: '「枚挙にいとまがない」の意味として最も適当なものを、次のア～エから一つ選び、記号で答えよ。',
    choices: [
      { label: 'ア', text: '批判されるべきでない' },
      { label: 'イ', text: '認めるほどではない' },
      { label: 'ウ', text: '仕方がないといえる' },
      { label: 'エ', text: '数え切れないほど多い' },
    ],
    correctChoice: 'エ',
    modelAnswer: 'エ',
    explanation: '「枚挙にいとまがない」は、一つ一つ数え上げる余裕がないほど多い、という意味。',
    maxChars: null,
  },
  {
    id: 'science-07',
    materialId: 'science',
    materialTitle: '科学は生きている',
    number: 7,
    page: '73',
    line: '13',
    type: 'essay',
    title: '問7',
    question: '「科学が教えるところは、すべて修正される可能性がある」とあるが、なぜか。「正しい」という言葉を使って四〇字以内で書け。',
    modelAnswer: '仮説を一〇〇％正しいと判定するプロセスが体系の中に用意されていないから。',
    maxChars: 40,
  },
  {
    id: 'science-10',
    materialId: 'science',
    materialTitle: '科学は生きている',
    number: 10,
    page: '74',
    line: '14',
    type: 'essay',
    title: '問10',
    question: '「『原理的に不完全な』科学的知見をどう捉えて、どのように使っていけばよいのだろうか。」とあるが、この問いに対する筆者の考えをまとめてみよう。',
    modelAnswer: '科学的知見の中には確度の高いものから低いものまで幅広く混在している。よりよい判断のため、それらの確度を正確に把握して峻別していくべきである。',
    maxChars: null,
  },
  {
    id: 'science-14',
    materialId: 'science',
    materialTitle: '科学は生きている',
    number: 14,
    page: '76',
    line: '9',
    type: 'choice',
    title: '問14',
    question: '「権威主義」とあるが、どのようなものか。最も適当なものを、次のア～エから一つ選び、記号で答えよ。',
    choices: [
      { label: 'ア', text: '専門家や実績のある立場の人が言うことは、その内容も正しいと信じてしまうこと。' },
      { label: 'イ', text: '専門家や実績のある立場の人が言うことを、自分の意見の科学的根拠とすること。' },
      { label: 'ウ', text: '専門家や実績のある立場の人が、科学的根拠もなく自分の意見を他人に押しつけること。' },
      { label: 'エ', text: '専門家や実績のある立場の人に恐縮して、その意見に反論することができなくなること。' },
    ],
    correctChoice: 'ア',
    modelAnswer: 'ア',
    explanation: 'ここでの権威主義は、権威の高さと情報の確度を同一視して判断する態度を指す。',
    maxChars: null,
  },
  {
    id: 'science-24',
    materialId: 'science',
    materialTitle: '科学は生きている',
    number: 24,
    page: '79',
    line: '7',
    type: 'choice',
    title: '問24',
    question: '「まったく正反対」とあるが、なぜそう言えるのか。理由として最も適当なものを次のア～オから一つ選び、記号で答えよ。',
    choices: [
      { label: 'ア', text: '権威主義が人の心が持つ弱点に忍び込もうとするのに対して、理性主義では不安な心理を否定し理性で解決しようとするから。' },
      { label: 'イ', text: '権威主義が専門家の意見を安易に受け入れるのに対して、理性主義では一〇〇％の真実にたどり着くまで仮説を認めないから。' },
      { label: 'ウ', text: '権威主義が権威に頼って安易に「正解」を得るのに対して、理性主義では自分の理性で物事の意味や仕組みを考えるから。' },
      { label: 'エ', text: '権威主義が自分の価値観に頑なにこだわるのに対して、理性主義では物事を客観的に捉えて専門家の意見を批判するから。' },
      { label: 'オ', text: '権威主義が科学を特別なものとして位置付けるのに対して、理性主義では非専門家でも物事の意味や仕組みを考えるから。' },
    ],
    correctChoice: 'ウ',
    modelAnswer: 'ウ',
    explanation: '権威主義は権威に頼って安易に正解を得ようとするが、理性主義は自分の理性で意味や仕組みを考えるため、精神性が正反対である。',
    maxChars: null,
  },
];

export const materials = [
  { id: 'milo', title: 'ミロのヴィーナス' },
  { id: 'science', title: '科学は生きている' },
] as const;
