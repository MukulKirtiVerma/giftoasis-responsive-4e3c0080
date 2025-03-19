
/**
 * Wishlist Cards Interaction
 * Manages hover effects, dropdown menus, and click actions for wishlist cards.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get all wishlist cards
    const wishlistCards = document.querySelectorAll('.wishlist-card');
    
    wishlistCards.forEach(card => {
        const viewButton = card.querySelector('.view-button');
        
        // Show view button on hover
        card.addEventListener('mouseenter', () => {
            if (viewButton) viewButton.classList.remove('hidden');
        });
        
        // Hide view button when not hovering
        card.addEventListener('mouseleave', () => {
            if (viewButton) viewButton.classList.add('hidden');
        });
        
        // Make the whole card clickable
        card.addEventListener('click', (e) => {
            // Only navigate if the click wasn't on the dropdown or its elements
            if (!e.target.closest('.dropdown-container')) {
                const viewLink = card.querySelector('.view-button');
                if (viewLink) {
                    window.location.href = viewLink.getAttribute('href');
                }
            }
        });
        
        // Initialize dropdown menu in bottom right corner
        const toggleBtn = card.querySelector('.dropdown-toggle');
        const dropdownMenu = card.querySelector('.dropdown-menu');
        
        if (toggleBtn && dropdownMenu) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click
                
                // Close all other open dropdowns first
                document.querySelectorAll('.dropdown-menu:not(.hidden)').forEach(menu => {
                    if (menu !== dropdownMenu) {
                        menu.classList.add('hidden');
                    }
                });
                
                // Toggle this dropdown
                dropdownMenu.classList.toggle('hidden');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!toggleBtn.contains(e.target)) {
                    dropdownMenu.classList.add('hidden');
                }
            });
            
            // Handle dropdown menu options
            setupDropdownActions(card);
        }
    });
});

/**
 * Sets up event handlers for dropdown menu actions
 */
function setupDropdownActions(card) {
    // Copy Link button
    const copyBtn = card.querySelector('.copy-link-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const wishlistId = copyBtn.getAttribute('data-wishlist-id');
            const link = window.location.origin + '/wishlists/' + wishlistId;
            
            navigator.clipboard.writeText(link)
                .then(() => {
                    alert('Link copied to clipboard!');
                    card.querySelector('.dropdown-menu').classList.add('hidden');
                })
                .catch(() => {
                    alert('Failed to copy link');
                });
        });
    }
    
    // Delete Wishlist button
    const deleteBtn = card.querySelector('.delete-wishlist-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const wishlistId = deleteBtn.getAttribute('data-wishlist-id');
            
            if (confirm('Are you sure you want to delete this wishlist?')) {
                window.location.href = '/wishlists/delete/' + wishlistId;
            }
        });
    }
    
    // Toggle Privacy button
    const privacyBtn = card.querySelector('.toggle-privacy-btn');
    if (privacyBtn) {
        privacyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const wishlistId = privacyBtn.getAttribute('data-wishlist-id');
            window.location.href = '/wishlists/' + wishlistId + '/toggle_privacy';
        });
    }
}
