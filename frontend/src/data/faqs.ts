export interface FAQItem {
  id: string;
  category: "appointments" | "billing" | "services" | "general";
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    id: "schedule-appointment",
    category: "appointments",
    question: "How do I schedule an appointment?",
    answer: "You can schedule an appointment by clicking the 'Book Appointment' button at the top of the page, calling our support line, or using the patient portal.",
  },
  {
    id: "cancellation-policy",
    category: "appointments",
    question: "What is your cancellation policy?",
    answer: "We require a 24-hour notice for cancellations. Missed appointments without prior notice may be subject to a cancellation fee. Please call or message us as soon as possible if you need to reschedule.",
  },
  {
    id: "insurance-accepted",
    category: "billing",
    question: "What insurance plans do you accept?",
    answer: "We accept most major health insurance providers, including Blue Cross, Aetna, and Medicare. Please contact our billing department or check with your insurance provider to confirm specific coverage details.",
  },
  {
    id: "pay-bill-online",
    category: "billing",
    question: "How can I pay my bill online?",
    answer: "You can pay your bill securely through our Patient Portal. Simply log in, navigate to the 'Billing' section, and follow the prompts to submit your payment using a credit card or bank transfer.",
  },
  {
    id: "same-day-slots",
    category: "services",
    question: "Do you offer same-day appointments?",
    answer: "Yes, we offer same-day appointments for urgent, non-emergency concerns. Please check slot availability via our Book Appointment form or call our care coordinators directly.",
  },
  {
    id: "first-checkup-checklist",
    category: "services",
    question: "What should I bring to my first checkup?",
    answer: "Please bring a valid photo ID, your insurance card, a list of any current medications you are taking, and any relevant medical records from previous providers.",
  },
  {
    id: "clinic-location",
    category: "general",
    question: "Where is LuminaHealth Clinic located?",
    answer: "Our main campus is located in the Wellness District at 123 Healing Way, Wellness District, CA 90210. Detailed driving and parking directions are available on our Contact Us page.",
  },
  {
    id: "access-medical-records",
    category: "general",
    question: "How can I access my medical records?",
    answer: "You can view and download your laboratory reports, immunizations, and clinical notes securely at any time through our electronic Patient Portal.",
  },
];
