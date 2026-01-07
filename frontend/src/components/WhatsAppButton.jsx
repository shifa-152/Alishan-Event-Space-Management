export default function WhatsAppButton({ phone = '919999999999' }) {
  const msg = encodeURIComponent('Hello, I want to book Aalishan Hall for an event.');
  const href = `https://wa.me/${phone}?text=${msg}`;

  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="fixed bottom-6 right-6 z-50 rounded-full p-3 shadow-xl bg-[#25D366] text-white">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        {/* simple WA icon path */}
        <path d="M12 2C6.48 2 2 6.48 2 12c0 2.11.62 4.06 1.69 5.72L2 22l4.47-1.58C8.89 21.1 10.4 21.5 12 21.5 17.52 21.5 22 17.02 22 11.5 22 6 17.52 2 12 2zM7.2 9.5c.2-.6.9-1 1.5-.9.6.1 1.2.7 1.3 1.3.1.6-.1 1.2-.5 1.6-.4.4-1 .9-1.1 1.2-.1.3-.1.7.2.9.3.3.8.5 1.4.3.6-.2 2.4-1 3.1-1.7.7-.7 1.2-1.4 1.4-2 .2-.6 0-1.2-.5-1.7-.5-.5-1.2-.7-1.8-.7-.6 0-1.4.2-2.1.5-.7.3-1.5.8-1.9 1.1z" />
      </svg>
    </a>
  );
}
