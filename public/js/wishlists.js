
// Initialize the page functionality for wishlists
document.addEventListener('DOMContentLoaded', () => {
  // Handle wishlist card clicks - navigate to wishlist detail page
  const wishlistCards = document.querySelectorAll('.wishlist-card');
  wishlistCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Only navigate if the click wasn't on a dropdown or other interactive element
      if (!e.target.closest('[data-dropdown]') && 
          !e.target.closest('a') && 
          !e.target.closest('button')) {
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
