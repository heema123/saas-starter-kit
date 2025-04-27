import { useTranslation } from 'next-i18next';

const TestimonialsSection = () => {
  const { t } = useTranslation('common');

  const testimonials = [
    {
      quote: t('testimonial-1-quote'),
      author: t('testimonial-1-author'),
      position: t('testimonial-1-position'),
      company: t('testimonial-1-company'),
    },
    {
      quote: t('testimonial-2-quote'),
      author: t('testimonial-2-author'),
      position: t('testimonial-2-position'),
      company: t('testimonial-2-company'),
    },
    {
      quote: t('testimonial-3-quote'),
      author: t('testimonial-3-author'),
      position: t('testimonial-3-position'),
      company: t('testimonial-3-company'),
    },
  ];

  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
            {t('testimonials-title')}
          </h2>
          <p className="mb-12 text-lg text-muted-foreground">
            {t('testimonials-subtitle')}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative rounded-lg border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="absolute -top-4 left-6 text-4xl text-primary">"</div>
              <blockquote className="mb-6 pt-4">
                <p className="relative text-lg font-medium italic text-muted-foreground">
                  {testimonial.quote}
                </p>
              </blockquote>
              <div className="flex items-center">
                <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-primary/20">
                  <div className="flex h-full w-full items-center justify-center text-lg font-bold text-primary">
                    {testimonial.author.charAt(0)}
                  </div>
                </div>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.position}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 