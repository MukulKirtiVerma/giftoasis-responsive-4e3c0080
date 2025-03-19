
// Initialize dropdown menus when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeDropdownMenus();
});

// Function to initialize all dropdown menus on the page
function initializeDropdownMenus() {
  const dropdownContainers = document.querySelectorAll('[data-dropdown="item-menu"]');
  
  dropdownContainers.forEach(container => {
    const type = container.dataset.type; // 'wishlist' or 'gift'
    const itemId = container.dataset.itemId;
    const isPrivate = container.dataset.isPrivate === 'true';
    
    // Create dropdown button
    const dropdownButton = document.createElement('button');
    dropdownButton.className = 'h-8 w-8 bg-gray-200 hover:bg-gray-300 border border-gray-300 rounded-full flex items-center justify-center';
    dropdownButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-more-vertical">
        <circle cx="12" cy="12" r="1"/>
        <circle cx="12" cy="5" r="1"/>
        <circle cx="12" cy="19" r="1"/>
      </svg>
      <span class="sr-only">Open menu</span>
    `;
    
    // Create dropdown menu content
    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md border border-gray-200 z-[100] hidden';
    
    // Add menu items
    dropdownContent.innerHTML = `
      <div class="py-1">
        <a href="/wishlists/${itemId}" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          View ${type === 'wishlist' ? 'Wishlist' : 'Gift'}
        </a>
        
        ${type === 'wishlist' ? `
        <a href="/wishlists/${itemId}/add_gift" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
          Add Gift
        </a>
        ` : ''}
        
        <a href="${type === 'wishlist' ? `/wishlists/edit/${itemId}` : `/gifts/${itemId}/edit`}" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Edit ${type === 'wishlist' ? 'Wishlist' : 'Gift'}
        </a>
        
        <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-action="copy-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy Link
        </a>
        
        ${type === 'wishlist' ? `
        <a href="/wishlists/${itemId}/share" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          Share Wishlist
        </a>
        ` : ''}
        
        ${type === 'gift' ? `
        <hr class="my-1 border-gray-200">
        <a href="/gifts/${itemId}/move" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
            <path d="M5 9l7 7 7-7"></path>
          </svg>
          Move to Wish List
        </a>
        <a href="/gifts/${itemId}/move_to_new" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          Move to New Wish List
        </a>
        ` : ''}
        
        ${type === 'wishlist' ? `
        <hr class="my-1 border-gray-200">
        <a href="/wishlists/${itemId}/toggle_privacy" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          ${isPrivate ? `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          Make Public
          ` : `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Make Private
          `}
        </a>
        ` : ''}
        
        <hr class="my-1 border-gray-200">
        <a href="${type === 'wishlist' ? `/wishlists/delete/${itemId}` : `/gifts/delete/${itemId}`}" class="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
          Delete ${type === 'wishlist' ? 'Wishlist' : 'Gift'}
        </a>
      </div>
    `;
    
    // Append elements to container
    container.appendChild(dropdownButton);
    container.appendChild(dropdownContent);
    
    // Toggle dropdown on button click
    dropdownButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Close all other dropdowns first
      document.querySelectorAll('[data-dropdown="item-menu"] > div:not(.hidden)').forEach(menu => {
        if (menu !== dropdownContent) {
          menu.classList.add('hidden');
        }
      });
      
      // Toggle current dropdown
      dropdownContent.classList.toggle('hidden');
    });
    
    // Handle copy link action
    const copyLinkButton = dropdownContent.querySelector('[data-action="copy-link"]');
    if (copyLinkButton) {
      copyLinkButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Generate a shareable link based on item type and ID
        const baseUrl = window.location.origin;
        const link = type === 'wishlist' 
          ? `${baseUrl}/wishlists/${itemId}` 
          : `${baseUrl}/gifts/${itemId}`;
          
        // Copy to clipboard
        navigator.clipboard.writeText(link)
          .then(() => {
            alert("Link copied to clipboard!");
          })
          .catch(() => {
            alert("Failed to copy link");
          });
          
        // Hide dropdown after action
        dropdownContent.classList.add('hidden');
      });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        dropdownContent.classList.add('hidden');
      }
    });
  });
}
