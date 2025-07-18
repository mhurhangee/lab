import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { BackToButton } from '@/components/ui/back-to-button'

import { LabLayout } from '@/components/lab-layout'

import { FAQ } from '@/lib/faq'

import { MessageCircleQuestionMarkIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export default function FaqPage() {
  return (
    <LabLayout
      title="FAQ"
      icon={<MessageCircleQuestionMarkIcon />}
      actions={<BackToButton href="/" label="Home" />}
      description="Frequently Asked Questions"
    >
      <section>
        <Accordion
          type="multiple"
          className="mt-12 w-full"
          defaultValue={FAQ.map((_, index) => `item-${index}`)}
        >
          {FAQ.map((item, index) => (
            <AccordionItem value={`item-${index}`} className="w-full border-b-0" key={index}>
              <AccordionTrigger className="w-full justify-between py-4">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground prose prose-sm dark:prose-invert w-full">
                <ReactMarkdown>{item.answer}</ReactMarkdown>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </LabLayout>
  )
}
