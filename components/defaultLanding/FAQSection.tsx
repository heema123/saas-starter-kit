import { useTranslation } from 'next-i18next';
import { useState } from 'react';

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b">
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 text-left text-lg font-medium focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <svg
          className={`h-5 w-5 text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 pb-4' : 'max-h-0'
        }`}
      >
        <p className="text-muted-foreground">{answer}</p>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const { t } = useTranslation('common');

  const faqs = [
    {
      question: t('faq-1-question'),
      answer: t('faq-1-answer'),
    },
    {
      question: t('faq-2-question'),
      answer: t('faq-2-answer'),
    },
    {
      question: t('faq-3-question'),
      answer: t('faq-3-answer'),
    },
    {
      question: t('faq-4-question'),
      answer: t('faq-4-answer'),
    },
    {
      question: t('faq-5-question'),
      answer: t('faq-5-answer'),
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
            {t('frequently-asked')}
          </h2>
          <p className="mb-12 text-lg text-muted-foreground">
            {t('faq-subtitle')}
          </p>
        </div>
        
        <div className="mx-auto max-w-3xl divide-y rounded-lg border bg-card shadow-sm">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
