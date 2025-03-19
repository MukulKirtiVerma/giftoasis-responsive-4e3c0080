
// Define the dropdown menu options based on type
const getDropdownOptions = (type, isPrivate = false) => {
  const baseOptions = [
    { icon: "ExternalLink", label: `View ${type === 'wishlist' ? 'Wishlist' : 'Gift'}`, action: "view" },
    { icon: "Edit", label: `Edit ${type === 'wishlist' ? 'Wishlist' : 'Gift'}`, action: "edit" },
    { icon: "Copy", label: "Copy Link", action: "copyLink" },
  ];
  
  // Add wishlist-specific options
  if (type === 'wishlist') {
    baseOptions.splice(1, 0, { icon: "Plus", label: "Add Gift", action: "addGift" });
    baseOptions.push({ icon: "Share", label: "Share Wishlist", action: "share" });
    
    // Add privacy toggle after a separator
    baseOptions.push({ separator: true });
    baseOptions.push({ 
      icon: isPrivate ? "Globe" : "Lock", 
      label: isPrivate ? "Make Public" : "Make Private", 
      action: "togglePrivacy" 
    });
  }
  
  // Add gift-specific options
  if (type === 'gift') {
    baseOptions.push({ separator: true });
    baseOptions.push({ icon: "MoveRight", label: "Move to Wish List", action: "moveToWishlist" });
    baseOptions.push({ icon: "ListPlus", label: "Move to New Wish List", action: "moveToNewWishlist" });
  }
  
  // Add delete option after a separator
  baseOptions.push({ separator: true });
  baseOptions.push({ 
    icon: "Trash", 
    label: `Delete ${type === 'wishlist' ? 'Wishlist' : 'Gift'}`, 
    action: "delete",
    danger: true 
  });
  
  return baseOptions;
};

// Helper function to create an icon element
const createIcon = (iconName) => {
  const iconMap = {
    Copy: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c0-1.1.9-2 2-2h2"/><path d="M4 12c0-1.1.9-2 2-2h2"/><path d="M4 8c0-1.1.9-2 2-2h2"/></svg>',
    ListPlus: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-plus"><path d="M11 12H3"/><path d="M16 6H3"/><path d="M16 18H3"/><path d="M18 9v6"/><path d="M21 12h-6"/></svg>',
    MoveRight: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-right"><path d="M18 8L22 12L18 16"/><path d="M2 12H22"/></svg>',
    Plus: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
    Trash: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
    Lock: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    Globe: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    ExternalLink: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>',
    Edit: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    MoreVertical: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-more-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>',
    Share: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>'
  };
  
  const iconDiv = document.createElement('div');
  iconDiv.className = 'mr-2 h-4 w-4';
  iconDiv.innerHTML = iconMap[iconName];
  
  return iconDiv;
};

// Create the dropdown menu component
function createItemDropdownMenu(config) {
  const { type, itemId, isPrivate = false, align = 'end', side = 'bottom' } = config;
  
  // Create the dropdown container
  const dropdownContainer = document.createElement('div');
  dropdownContainer.className = 'item-dropdown-menu relative';
  
  // Create the trigger button
  const triggerButton = document.createElement('button');
  triggerButton.className = 'h-8 w-8 bg-gray-200 hover:bg-gray-300 border border-gray-300 rounded-full flex items-center justify-center p-0';
  triggerButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-more-vertical h-4 w-4"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>';
  
  // Create the dropdown content
  const dropdownContent = document.createElement('div');
  dropdownContent.className = `dropdown-content w-56 bg-white shadow-lg rounded-md border border-gray-200 z-[100] absolute ${align === 'end' ? 'right-0' : 'left-0'} ${side === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} hidden`;
  
  // Generate menu items
  const options = getDropdownOptions(type, isPrivate);
  
  options.forEach(option => {
    if (option.separator) {
      const separator = document.createElement('hr');
      separator.className = 'my-1 border-t border-gray-200';
      dropdownContent.appendChild(separator);
    } else {
      const menuItem = document.createElement('div');
      menuItem.className = `dropdown-item flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer ${option.danger ? 'text-red-600' : ''}`;
      menuItem.dataset.action = option.action;
      menuItem.dataset.itemId = itemId;
      menuItem.dataset.type = type;
      
      // Create icon
      const icon = createIcon(option.icon);
      icon.className = 'mr-2 h-4 w-4';
      menuItem.appendChild(icon);
      
      // Create label
      const label = document.createElement('span');
      label.textContent = option.label;
      menuItem.appendChild(label);
      
      dropdownContent.appendChild(menuItem);
    }
  });
  
  // Add elements to container
  dropdownContainer.appendChild(triggerButton);
  dropdownContainer.appendChild(dropdownContent);
  
  // Set up click listener for the trigger
  triggerButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle dropdown visibility
    const isVisible = !dropdownContent.classList.contains('hidden');
    
    // Close all other dropdowns first
    document.querySelectorAll('.dropdown-content').forEach(dropdown => {
      dropdown.classList.add('hidden');
    });
    
    // Toggle this dropdown
    if (isVisible) {
      dropdownContent.classList.add('hidden');
    } else {
      dropdownContent.classList.remove('hidden');
    }
  });
  
  // Close dropdown when clicking elsewhere
  document.addEventListener('click', (e) => {
    if (!dropdownContainer.contains(e.target)) {
      dropdownContent.classList.add('hidden');
    }
  });
  
  // Set up event handlers for menu items
  dropdownContainer.addEventListener('click', (e) => {
    const menuItem = e.target.closest('.dropdown-item');
    if (!menuItem) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const action = menuItem.dataset.action;
    const id = menuItem.dataset.itemId;
    const itemType = menuItem.dataset.type;
    
    // Handle different actions
    switch (action) {
      case 'view':
        window.location.href = `/${itemType}s/${id}`;
        break;
      
      case 'edit':
        window.location.href = `/${itemType}s/edit/${id}`;
        break;
      
      case 'delete':
        if (confirm(`Are you sure you want to delete this ${itemType}?`)) {
          window.location.href = `/${itemType}s/delete/${id}`;
        }
        break;
      
      case 'copyLink':
        const baseUrl = window.location.origin;
        const link = `${baseUrl}/${itemType}s/${id}`;
        
        // Use the clipboard API
        navigator.clipboard.writeText(link)
          .then(() => {
            alert('Link copied to clipboard!');
          })
          .catch(() => {
            alert('Failed to copy link');
          });
        break;
      
      case 'addGift':
        window.location.href = `/wishlists/${id}/add_gift`;
        break;
      
      case 'togglePrivacy':
        window.location.href = `/wishlists/${id}/toggle_privacy`;
        break;
      
      case 'moveToWishlist':
        window.location.href = `/gifts/${id}/move`;
        break;
      
      case 'moveToNewWishlist':
        // Here we'd typically show a modal, but we'll redirect to a page
        window.location.href = `/gifts/${id}/move_to_new`;
        break;
      
      case 'share':
        window.location.href = `/wishlists/${id}/share`;
        break;
    }
    
    // Hide dropdown after action
    dropdownContent.classList.add('hidden');
  });
  
  return dropdownContainer;
}

// Initialize dropdowns when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Find all dropdown containers
  const dropdownContainers = document.querySelectorAll('[data-dropdown="item-menu"]');
  
  dropdownContainers.forEach(container => {
    const type = container.dataset.type;
    const itemId = container.dataset.itemId;
    const isPrivate = container.dataset.isPrivate === 'true';
    
    const dropdownMenu = createItemDropdownMenu({
      type,
      itemId,
      isPrivate,
      align: container.dataset.align || 'end',
      side: container.dataset.side || 'bottom'
    });
    
    container.appendChild(dropdownMenu);
    
    // Prevent parent card click when clicking the dropdown
    container.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });
});

// CSS to be added to the page
const style = document.createElement('style');
style.textContent = `
  .item-dropdown-menu {
    position: relative;
    z-index: 50;
  }
  
  .dropdown-content {
    position: absolute;
    right: 0;
    top: 100%;
    margin-top: 0.25rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    z-index: 100;
  }
  
  .dropdown-item {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
  
  .dropdown-item:hover {
    background-color: #f3f4f6;
  }
  
  .dropdown-item.danger {
    color: #ef4444;
  }
`;

document.head.appendChild(style);
