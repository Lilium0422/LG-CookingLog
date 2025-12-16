'use client';

import React from 'react';
import css from '../css/CookingSurvey.module.css';
import { SurveyQuestion } from '../data/cookingSurvey';

export type SurveyAnswers = Record<string, string[]>;

interface CookingSurveyProps {
  questions: SurveyQuestion[];
  value: SurveyAnswers;
  onChange: (answers: SurveyAnswers) => void;
}

const CookingSurvey = ({
  questions,
  value,
  onChange,
}: CookingSurveyProps) => {
  const handleSelect = (
    question: SurveyQuestion,
    option: string
  ) => {
    const prev = value[question.id] || [];

    let next: string[];

    if (question.type === 'single') {
      next = [option];
    } else {
      next = prev.includes(option)
        ? prev.filter(v => v !== option)
        : [...prev, option];
    }

    onChange({
      ...value,
      [question.id]: next,
    });
  };

  return (
    <div className={css.container}>
      {questions.map(q => (
        <div key={q.id} className={css.questionBlock}>
          <h5 className={css.question}>{q.question}</h5>

          <div className={css.options}>
            {q.options.map(option => {
              const selected =
                value[q.id]?.includes(option) ?? false;

              return (
                <button
                  key={option}
                  type="button"
                  className={`${css.option} ${
                    selected ? css.active : ''
                  }`}
                  onClick={() => handleSelect(q, option)}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CookingSurvey;
