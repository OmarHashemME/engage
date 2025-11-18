
import React, { useState, useEffect } from 'react';
import type { Quiz as QuizType } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface QuizProps {
  quizData: QuizType;
  onCorrect: () => void;
  isLessonCompleted: boolean;
}

const Quiz: React.FC<QuizProps> = ({ quizData, onCorrect, isLessonCompleted }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (isLessonCompleted) {
      setIsSubmitted(true);
      const correctIndex = quizData.options.findIndex(opt => opt.isCorrect);
      setSelectedOption(correctIndex);
      setIsCorrect(true);
    }
  }, [isLessonCompleted, quizData.options]);

  const handleOptionSelect = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
    setIsCorrect(null);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;

    const correct = quizData.options[selectedOption].isCorrect;
    setIsCorrect(correct);
    setIsSubmitted(true);
    if (correct) {
      onCorrect();
    }
  };

  return (
    <div>
      <p className="text-lg font-medium text-gray-700 mb-4">{quizData.question}</p>
      <div className="space-y-3">
        {quizData.options.map((option, index) => {
          const isSelected = selectedOption === index;
          let optionClasses = 'border-gray-300';
          let animationClass = '';

          if (isSubmitted) {
            if (option.isCorrect) {
              optionClasses = 'border-green-500 bg-green-50';
              animationClass = 'animate-pulse-correct';
            } else if (isSelected && !option.isCorrect) {
              optionClasses = 'border-red-500 bg-red-50';
              animationClass = 'animate-shake-incorrect';
            }
          } else if (isSelected) {
            optionClasses = 'border-indigo-500 bg-indigo-50';
          }

          return (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              disabled={isSubmitted}
              className={`w-full text-left p-4 border rounded-lg flex items-center transition-all duration-200 ${optionClasses} ${animationClass} disabled:cursor-not-allowed`}
            >
              <span className={`flex-1 text-gray-800 ${isSelected && !isSubmitted ? 'font-semibold' : ''}`}>
                {option.text}
              </span>
              {isSubmitted && option.isCorrect && <CheckCircleIcon className="h-6 w-6 text-green-500" />}
              {isSubmitted && isSelected && !option.isCorrect && <XCircleIcon className="h-6 w-6 text-red-500" />}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <button
          onClick={handleSubmit}
          disabled={selectedOption === null || isSubmitted}
          className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLessonCompleted ? 'Completed' : 'Check Answer'}
        </button>

        {isSubmitted && isCorrect !== null && (
          <div className={`mt-4 p-4 rounded-md flex items-start space-x-3 animate-fade-in ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isCorrect ? <CheckCircleIcon className="h-6 w-6 text-green-600" /> : <XCircleIcon className="h-6 w-6 text-red-600" />}
            <p className="font-medium">
              {isCorrect ? quizData.correctFeedback : quizData.incorrectFeedback}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;