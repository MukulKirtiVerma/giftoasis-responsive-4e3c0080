
// Initialize the page functionality for wishlists
document.addEventListener('DOMContentLoaded', () => {
  // Handle wishlist card clicks
  const wishlistCards = document.querySelectorAll('.wishlist-card');
  wishlistCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.item-dropdown-menu') && !e.target.closest('[data-dropdown]')) {
        const wishlistId = card.dataset.wishlistId;
        window.location.href = `/wishlists/${wishlistId}`;
      }
    });
  });

  // Initialize new wishlist button
  const newWishlistBtn = document.querySelector('#new-wishlist-btn');
  if (newWishlistBtn) {
    newWishlistBtn.addEventListener('click', () => {
      window.location.href = '/wishlists/new';
    });
  }

  // Initialize new expert list button
  const newExpertListBtn = document.querySelector('#new-expert-list-btn');
  if (newExpertListBtn) {
    newExpertListBtn.addEventListener('click', () => {
      window.location.href = '/wishlists/new?expert=true';
    });
  }
});
