
# URL Changes Reference

This file lists how URLs have changed after blueprint implementation. Use this as a reference to update any hardcoded URLs in JavaScript or templates.

## Authentication URLs
- Before: `/login` → After: `/login` (unchanged, handled by auth_bp)
- Before: `/signup` → After: `/signup` (unchanged, handled by auth_bp)
- Before: `/logout` → After: `/logout` (unchanged, handled by auth_bp)
- Before: `/google-login` → After: `/google-login` (unchanged, handled by auth_bp)
- Before: `/google-auth` → After: `/google-auth` (unchanged, handled by auth_bp)

## Main URLs
- Before: `/` → After: `/` (unchanged, handled by main_bp)
- Before: `/how-it-works` → After: `/how-it-works` (unchanged, handled by main_bp)
- Before: `/categories` → After: `/categories` (unchanged, handled by main_bp)

## Gift URLs
- Before: `/featured` → After: `/featured` (unchanged, handled by gifts_bp)
- Before: `/category/<category>` → After: `/category/<category>` (unchanged, handled by gifts_bp)
- Before: `/gift/<gift_id>` → After: `/gift/<gift_id>` (unchanged, handled by gifts_bp)
- Before: `/gift/<gift_id>/edit` → After: `/gift/<gift_id>/edit` (unchanged, handled by gifts_bp)

## Wishlist URLs
- Before: `/wishlists` → After: `/wishlists` (unchanged, handled by wishlists_bp)
- Before: `/wishlist/new` → After: `/wishlist/new` (unchanged, handled by wishlists_bp)
- Before: `/wishlist/<wishlist_id>` → After: `/wishlist/<wishlist_id>` (unchanged, handled by wishlists_bp)
- Before: `/wishlist/<wishlist_id>/edit` → After: `/wishlist/<wishlist_id>/edit` (unchanged, handled by wishlists_bp)
- Before: `/wishlist/<wishlist_id>/delete` → After: `/wishlist/<wishlist_id>/delete` (unchanged, handled by wishlists_bp)
- Before: `/wishlist/<wishlist_id>/add-gift` → After: `/wishlist/<wishlist_id>/add-gift` (unchanged, handled by wishlists_bp)
- Before: `/wishlist/<wishlist_id>/add-gift-from-url` → After: `/wishlist/<wishlist_id>/add-gift-from-url` (unchanged, handled by wishlists_bp)
- Before: `/wishlist/<wishlist_id>/add/<gift_id>` → After: `/wishlist/<wishlist_id>/add/<gift_id>` (unchanged, handled by wishlists_bp)
- Before: `/wishlist/<wishlist_id>/remove/<gift_id>` → After: `/wishlist/<wishlist_id>/remove/<gift_id>` (unchanged, handled by wishlists_bp)
- Before: `/wishlist/<wishlist_id>/bookmark` → After: `/wishlist/<wishlist_id>/bookmark` (unchanged, handled by wishlists_bp)
- Before: `/wishlist/<wishlist_id>/remove-bookmark` → After: `/wishlist/<wishlist_id>/remove-bookmark` (unchanged, handled by wishlists_bp)
- Before: `/wishlist/<wishlist_id>/reserve/<gift_id>` → After: `/wishlist/<wishlist_id>/reserve/<gift_id>` (unchanged, handled by wishlists_bp)
- Before: `/wishlist/<wishlist_id>/unreserve/<gift_id>` → After: `/wishlist/<wishlist_id>/unreserve/<gift_id>` (unchanged, handled by wishlists_bp)
- Before: `/wishlist/<wishlist_id>/mark-purchased/<gift_id>` → After: `/wishlist/<wishlist_id>/mark-purchased/<gift_id>` (unchanged, handled by wishlists_bp)
- Before: `/wishlist/<wishlist_id>/spoiler` → After: `/wishlist/<wishlist_id>/spoiler` (unchanged, handled by wishlists_bp)
- Before: `/wishlist/<wishlist_id>/toggle-spoilers` → After: `/wishlist/<wishlist_id>/toggle-spoilers` (unchanged, handled by wishlists_bp)
- Before: `/wishlist/<wishlist_id>/share` → After: `/wishlist/<wishlist_id>/share` (unchanged, handled by wishlists_bp)

## User URLs
- Before: `/user/<user_id>` → After: `/user/<user_id>` (unchanged, handled by users_bp)
- Before: `/profile/edit` → After: `/profile/edit` (unchanged, handled by users_bp)
- Before: `/user/<user_id>/followers` → After: `/user/<user_id>/followers` (unchanged, handled by users_bp)
- Before: `/user/<user_id>/following` → After: `/user/<user_id>/following` (unchanged, handled by users_bp)
- Before: `/follow/<user_id>` → After: `/follow/<user_id>` (unchanged, handled by users_bp)
- Before: `/unfollow/<user_id>` → After: `/unfollow/<user_id>` (unchanged, handled by users_bp)
- Before: `/find-friends` → After: `/find-friends` (unchanged, handled by users_bp)
- Before: `/dashboard` → After: `/dashboard` (unchanged, handled by users_bp)

## Notification URLs
- Before: `/notifications` → After: `/notifications` (unchanged, handled by notifications_bp)
- Before: `/notifications/count` → After: `/notifications/count` (unchanged, handled by notifications_bp)
- Before: `/notifications/clear` → After: `/notifications/clear` (unchanged, handled by notifications_bp)
- Before: `/notifications/<notification_id>/delete` → After: `/notifications/<notification_id>/delete` (unchanged, handled by notifications_bp)
- Before: `/notifications/mark-read` → After: `/notifications/mark-read` (unchanged, handled by notifications_bp)

## API URLs
- Before: `/api/gifts/search` → After: `/api/gifts/search` (unchanged, handled by api_bp)
- Before: `/api/wishlists/<wishlist_id>/items` → After: `/api/wishlists/<wishlist_id>/items` (unchanged, handled by api_bp)
- Before: `/api/wishlists/<wishlist_id>/items/<item_id>` → After: `/api/wishlists/<wishlist_id>/items/<item_id>` (unchanged, handled by api_bp)
- Before: `/api/users/search` → After: `/api/users/search` (unchanged, handled by api_bp)
- Before: `/api/gifts/categories` → After: `/api/gifts/categories` (unchanged, handled by api_bp)

Note: Blueprint URLs are designed to maintain backward compatibility with the original URL structure, so no changes to templates or JavaScript are required.
