function bookingApprovedTemplate(booking) {
  return `
    <h2>Your Booking is Approved 🎉</h2>
    <p>Dear ${booking.name},</p>
    <p>Your booking for <strong>${booking.eventType}</strong> on <strong>${booking.date}</strong> is approved.</p>
    <p>We look forward to hosting you!</p>
  `;
}

module.exports = { bookingApprovedTemplate };
