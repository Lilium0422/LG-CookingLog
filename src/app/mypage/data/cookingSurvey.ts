export type SurveyType = 'single' | 'multiple';

export interface SurveyQuestion {
  id: string;
  question: string;
  type: SurveyType;
  options: string[];
}

export const COOKING_SURVEY: SurveyQuestion[] = [
  {
    id: 'level',
    question: '1. 요리 실력은 어느 정도인가요?',
    type: 'single',
    options: ['입문', '취미', '준전문가', '전문가'],
  },
  {
    id: 'interest',
    question: '2. 관심 있는 요리 분야를 선택해 주세요. (중복 선택 가능)',
    type: 'multiple',
    options: ['한식', '양식', '중식', '일식', '베이킹'],
  },
  {
    id: 'frequency',
    question: '3. 요리를 얼마나 자주 하시나요?',
    type: 'single',
    options: ['거의 안 함', '주 1~2회', '주 3~4회', '거의 매일'],
  },
  {
    id: 'ingredient',
    question: '4. 요리할 때 어떤 재료를 주로 사용하시나요?',
    type: 'multiple',
    options: [
      '소고기', '돼지고기', '닭고기', '채소', '해물', 
      '생선', '버섯', '계란', '유제품', '두부', '기타'
    ],
  },
];
