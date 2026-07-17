'use strict';
/* ================================================
   SEACET Nexus — Motivational Quotes
   ================================================ */
const QuotesManager = (() => {
  const quotes = [
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
    { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Your limitation—it's only your imagination.", author: "Unknown" },
    { text: "Dream big. Start small. Act now.", author: "Robin Sharma" },
    { text: "Engineering is the closest thing to magic that exists in the world.", author: "Elon Musk" },
    { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "F.D. Roosevelt" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
    { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
    { text: "The science of today is the technology of tomorrow.", author: "Edward Teller" },
    { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
    { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Knowledge is power. Information is liberating.", author: "Kofi Annan" },
    { text: "Genius is one percent inspiration and ninety-nine percent perspiration.", author: "Thomas Edison" },
    { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
    { text: "What we know is a drop, what we don't know is an ocean.", author: "Isaac Newton" },
    { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
    { text: "Logic will get you from A to B. Imagination will take you everywhere.", author: "Albert Einstein" },
    { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
    { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  ];

  let currentIndex = -1;
  let intervalId = null;

  const getRandomQuote = () => {
    let idx;
    do { idx = Math.floor(Math.random() * quotes.length); } while (idx === currentIndex && quotes.length > 1);
    currentIndex = idx;
    return quotes[idx];
  };

  const display = () => {
    const el = document.getElementById('dailyQuote');
    const heroEl = document.getElementById('heroQuote');
    if (!el && !heroEl) return;
    const quote = getRandomQuote();
    const fullText = `"${quote.text}" — ${quote.author}`;
    const shortText = `"${quote.text.substring(0, 60)}${quote.text.length > 60 ? '…' : ''}"`;
    if (el) {
      el.style.opacity = '0';
      setTimeout(() => {
        el.textContent = fullText;
        el.style.opacity = '1';
      }, 300);
    }
    if (heroEl) heroEl.textContent = shortText;
  };

  const init = () => {
    display();
    intervalId = setInterval(display, 30000);
  };

  return { init, display, getRandomQuote };
})();
