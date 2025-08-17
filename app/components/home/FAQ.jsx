import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";

export default function FAQ({ t }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight mb-4">{t('faq.heading')}</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="q1">
          <AccordionTrigger>{t('faq.q1.question')}</AccordionTrigger>
          <AccordionContent>{t('faq.q1.answer')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="q2">
          <AccordionTrigger>{t('faq.q2.question')}</AccordionTrigger>
          <AccordionContent>{t('faq.q2.answer')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="q3">
          <AccordionTrigger>{t('faq.q3.question')}</AccordionTrigger>
          <AccordionContent>{t('faq.q3.answer')}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}