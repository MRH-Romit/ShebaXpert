# Provider List Module - শেবা এক্সপার্ট

## Overview
The Provider List module displays all verified service providers with filtering, searching, messaging, and calling functionalities. This module is designed to match the project's color scheme and styling patterns.

## Features

### 🔍 **Advanced Filtering & Search**
- **Category Filter**: Filter by service categories (ইলেকট্রিশিয়ান, প্লাম্বার, কাঠমিস্ত্রি, etc.)
- **Location Filter**: Filter by geographical locations
- **Rating Filter**: Filter by minimum star ratings
- **Text Search**: Search by provider name, description, or category
- **Clear Filters**: Reset all filters with one click

### 👥 **Provider Display**
- **Grid Layout**: Responsive card-based layout
- **Provider Cards**: Show essential information at a glance
  - Name and photo
  - Service category badge
  - Location with map icon
  - Star ratings with review count
  - Work description (truncated)
  - Online/offline status indicator
  - Action buttons (Message, Call, View Details)

### 📱 **Communication Features**
- **Message System**: Send messages to providers with subject and content
- **Direct Calling**: One-click phone calling functionality
- **Provider Details Modal**: Comprehensive provider information

### 📄 **Pagination**
- **Page Navigation**: Previous/Next buttons
- **Page Numbers**: Direct page access
- **Items Per Page**: 9 providers per page
- **Responsive Design**: Works on all screen sizes

## File Structure

```
Provider List/
├── provider-list.html      # Main HTML file
├── provider-list.css       # Styling (matches project theme)
├── provider-list.js        # JavaScript functionality
└── README.md              # This documentation
```

## API Integration

### Backend Route: `/api/providers`
- **GET** `/api/providers` - Get paginated provider list
- **GET** `/api/providers/:id` - Get provider details
- **POST** `/api/providers/:id/message` - Send message to provider
- **GET** `/api/categories` - Get service categories
- **GET** `/api/locations` - Get available locations

### Database Tables Used
- `service_providers` - Main provider data
- `users` - User account information
- `reviews` - Provider ratings and reviews
- `jobs` - Completed job statistics
- `messages` - Message system
- `notifications` - System notifications

## Styling & Theme

### Color Scheme (CSS Variables)
```css
--primary-color: #1a237e      /* Primary blue */
--primary-light: #6258d7      /* Light blue */
--secondary-color: #00acc1    /* Cyan */
--accent-color: #ffab00       /* Orange */
--success-color: #4caf50      /* Green */
--warning-color: #ff9800      /* Orange warning */
--error-color: #f44336        /* Red */
```

### Typography
- **Font Family**: 'Hind Siliguri' for Bengali text support
- **Font Weights**: 300, 400, 500, 600, 700

### Design Patterns
- **Card-based UI**: Consistent with dashboard design
- **Hover Effects**: Smooth transitions and elevation
- **Modal Dialogs**: Backdrop blur and slide-in animations
- **Loading States**: Spinner with branded colors
- **Responsive Grid**: CSS Grid with auto-fit columns

## JavaScript Functionality

### Class: `ProviderListManager`
```javascript
// Main methods:
- loadProviders()           // Load data from API
- filterProviders()         // Apply search and filters
- renderProviders()         // Render provider cards
- viewProvider(id)          // Show provider details
- openMessageModal(id)      // Open message dialog
- sendMessage()            // Send message via API
- callProvider(phone)      // Initiate phone call
```

### Event Handling
- **Search Input**: Real-time filtering as user types
- **Filter Dropdowns**: Immediate filtering on change
- **Pagination**: Page navigation with disabled states
- **Modal Controls**: Open/close with backdrop clicking
- **Mobile Menu**: Responsive sidebar toggle

## Usage Instructions

### 1. **Navigation**
- Access via sidebar menu: "সেবা প্রোভাইডার"
- Or direct URL: `/Provider List/provider-list.html`

### 2. **Searching Providers**
- Use the search box in header to find providers by name
- Select filters from dropdown menus
- Click "ফিল্টার পরিষ্কার" to reset all filters

### 3. **Viewing Provider Details**
- Click "বিস্তারিত" button on any provider card
- Modal will show complete provider information
- Includes stats, contact info, specialties, and reviews

### 4. **Messaging**
- Click "মেসেজ" button on provider card
- Fill in subject and message content
- Click "পাঠান" to send message
- Provider will receive notification

### 5. **Calling**
- Click "কল" button to initiate phone call
- Confirmation dialog will appear
- Works on mobile devices with phone capability

## Mobile Responsiveness

### Breakpoints
- **Desktop**: > 768px (3-column grid)
- **Tablet**: 768px (2-column grid)
- **Mobile**: < 480px (1-column grid)

### Mobile Features
- **Hamburger Menu**: Collapsible sidebar
- **Touch-friendly**: Larger buttons and touch targets
- **Swipe Support**: Can be added for card navigation
- **Optimized Modals**: Full-screen on small devices

## API Response Format

### Provider List Response
```json
{
  "success": true,
  "data": {
    "providers": [
      {
        "id": 1,
        "name": "মোহাম্মদ করিম",
        "category": "ইলেকট্রিশিয়ান",
        "location": "ঢাকা",
        "rating": 4.8,
        "reviewCount": 125,
        "description": "১০ বছরের অভিজ্ঞতা সহ দক্ষ ইলেকট্রিশিয়ান...",
        "phone": "01711234567",
        "email": "karim@example.com",
        "photo": "/uploads/providers/photo.jpg",
        "isOnline": true,
        "completedJobs": 243,
        "experience": "১০ বছর",
        "priceRange": "৫০০-১৫০০ টাকা",
        "workingHours": "সকাল ৮টা - রাত ৮টা",
        "specialties": ["ঘরের ওয়্যারিং", "ফ্যান ইন্সটলেশন"]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 42,
      "itemsPerPage": 9
    }
  }
}
```

## Future Enhancements

### Planned Features
1. **Real-time Chat**: WebSocket-based messaging
2. **Video Calls**: Integration with WebRTC
3. **Booking System**: Direct appointment scheduling
4. **Provider Comparison**: Side-by-side comparison tool
5. **Favorites**: Save favorite providers
6. **Map Integration**: Location-based provider search
7. **Advanced Filters**: Price range, availability, distance
8. **Sort Options**: By rating, price, distance, availability

### Performance Optimizations
1. **Virtual Scrolling**: For large provider lists
2. **Image Lazy Loading**: Optimize page load time
3. **Caching**: Browser and service worker caching
4. **CDN Integration**: Faster asset delivery

## Browser Support
- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support (with webkit prefixes)
- **Edge**: ✅ Full support
- **Mobile Browsers**: ✅ Responsive design

## Accessibility Features
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG 2.1 compliant
- **Focus Indicators**: Clear focus states
- **Alt Text**: Images with descriptive alt text

## Installation & Setup

### 1. **File Placement**
- Copy `Provider List` folder to project root
- Ensure relative paths to `Resources` folder are correct

### 2. **Backend Setup**
- Add `providerListRoutes.js` to backend routes
- Update `server.js` to include new routes
- Ensure database tables exist

### 3. **Navigation Integration**
- Update sidebar navigation in other pages
- Add menu item pointing to provider list

### 4. **Testing**
- Test all filter combinations
- Verify mobile responsiveness
- Test API endpoints
- Validate messaging functionality

## Troubleshooting

### Common Issues
1. **Images not loading**: Check relative paths in HTML
2. **API errors**: Verify backend server is running
3. **Styling issues**: Ensure CSS file is linked correctly
4. **Mobile menu not working**: Check JavaScript event listeners

### Debug Tips
- Use browser developer tools
- Check console for JavaScript errors
- Verify network requests in Network tab
- Test on different screen sizes
