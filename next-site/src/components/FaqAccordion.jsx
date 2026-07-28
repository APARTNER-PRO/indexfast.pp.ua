'use client';

import { useState } from 'react';

export default function FaqAccordion({ items }) {
  return (
    <div className="faq-list reveal">
      {items.map((item, index) => (
        <FaqItem key={index} question={item.q} answer={item.a} />
      ))}
    </div>
  );
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-q" aria-expanded={open} onClick={() => setOpen(!open)}>
        {question}
        <span className="faq-arrow">+</span>
      </button>
      <div className="faq-a" role="region">
        <p>{answer}</p>
      </div>
    </div>
  );
}
