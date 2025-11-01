# 🛍️ Ilara Shopping - Modern E-Commerce Platform

Ilara is a fully-featured, modern e-commerce shopping platform built with React and Redux. It offers a seamless shopping experience with AI-powered assistance, comprehensive product filtering, and secure user authentication.

![Ilara Shopping](https://img.shields.io/badge/React-18.0-blue) ![Redux](https://img.shields.io/badge/Redux-8.0-purple) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.2-teal) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🛒 Shopping Features
- **Product Catalog**: Browse a wide range of products with detailed descriptions
- **Advanced Filtering**: Filter products by:
  - Price Range (₹0 - ₹30,000+)
  - Color (Black, White, Gray, Mixed)
  - Category (Accessories, Electronics, Furniture, Others)
  - Brand (Apple, Sony, Ray-Ban, Nike, Samsonite, and more)
- **Smart Sorting**: Sort products by price (Low to High / High to Low)
- **Product Details**: Comprehensive product pages with descriptions, prices, colors, and brands
- **Shopping Cart**: Add items to cart with quantity management
- **Responsive Design**: Fully responsive across all devices

### 🤖 AI-Powered Chatbot
- **Intelligent Assistant**: Gemini AI-powered chatbot that understands your queries
- **Website Navigation**: Chatbot can navigate you to different pages
- **Product Search**: Find products by name with AI assistance
- **Contextual Help**: Get instant answers about Ilara shopping, products, and services
- **Quick Actions**: One-click buttons for common tasks

### 👤 User Management
- **User Registration**: Create new accounts with secure authentication
- **Sign In/Sign Out**: Secure login system with session management
- **Local Storage**: Persistent user sessions using SQLite-compatible storage

### 🎨 User Interface
- **Modern Design**: Beautiful, clean UI with smooth animations
- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **Framer Motion**: Smooth animations and transitions
- **Dark Mode Ready**: Professional color scheme

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd orebishopping-master
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to see the application

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 📁 Project Structure

```
orebishopping-master/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── sitemap.xml
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── Chatbot/          # AI Chatbot component
│   │   ├── home/
│   │   │   ├── Footer/
│   │   │   ├── Header/
│   │   │   ├── Products/
│   │   │   └── SpecialOffers/
│   │   └── pageProps/
│   │       ├── productDetails/
│   │       └── shopPage/
│   ├── constants/
│   │   └── index.js          # Product data and navigation
│   ├── pages/
│   │   ├── About/
│   │   ├── Account/           # SignIn & SignUp
│   │   ├── Cart/
│   │   ├── Contact/
│   │   ├── Home/
│   │   ├── ProductDetails/
│   │   ├── Shop/
│   │   └── payment/
│   ├── redux/
│   │   ├── ilaraSlice.js     # Redux state management
│   │   └── store.js
│   ├── utils/
│   │   └── database.js       # Authentication utilities
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## 🛠️ Technologies Used

### Frontend
- **React 18.0** - UI library
- **Redux Toolkit** - State management
- **Redux Persist** - State persistence
- **React Router DOM** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Icons** - Icon library
- **React Slick** - Carousel component

### AI Integration
- **Google Gemini AI** - AI-powered chatbot

### Backend/Storage
- **LocalStorage** - Client-side data storage (SQLite-compatible)

## 🎯 Key Features Explained

### Product Filtering
The shop page includes powerful filtering options:
- **Price Filters**: Predefined ranges (₹0-2000, ₹2000-4000, etc.)
- **Color Filters**: Filter by product color
- **Category Filters**: Filter by product category
- **Brand Filters**: Filter by brand name
- All filters work together for precise product discovery

### AI Chatbot
The chatbot feature includes:
- **Natural Language Processing**: Understands conversational queries
- **Product Search**: "Show me headphones" navigates to product pages
- **Navigation**: "Take me to shop" navigates to /shop
- **Context Awareness**: Remembers conversation history
- **Fallback Handling**: Works even if API is unavailable

### Authentication
- Secure user registration and login
- Session management with localStorage
- Dummy user available for testing:
  - Email: `shyam@ilara.com`
  - Password: `Radhe@`

## 📱 Available Pages

- **Home** (`/`) - Landing page with featured products
- **Shop** (`/shop`) - Browse all products with filters
- **About** (`/about`) - About Ilara shopping
- **Contact** (`/contact`) - Contact information
- **Cart** (`/cart`) - Shopping cart
- **Offers** (`/offer`) - Special offers and deals
- **Product Details** (`/product/:id`) - Individual product pages
- **Sign Up** (`/signup`) - User registration
- **Sign In** (`/signin`) - User login

## 🎨 Customization

### Colors
Primary colors can be customized in `tailwind.config.js`:
- Primary Color: Used for buttons, links, and highlights
- Can be modified to match your brand

### Products
Product data is stored in `src/constants/index.js`:
- `paginationItems`: Main product catalog
- `SplOfferData`: Special offer products
- Update these arrays to modify product listings

### Chatbot Configuration
Chatbot API key is configured in `src/components/Chatbot/Chatbot.js`:
- Update `GEMINI_API_KEY` with your Google Gemini API key
- Modify `getWebsiteContext()` to update chatbot knowledge

## 📝 Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App (irreversible)
```

## 🔐 Security Notes

- API keys are stored in client-side code (for development)
- For production, consider using environment variables
- User passwords are hashed using crypto-js
- Session data is stored in localStorage

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Shyam Baranwal**
- Powered by Shyam Baranwal
- Email: shyam@ilara.com

## 🙏 Acknowledgments

- React community for amazing libraries
- Google Gemini for AI capabilities
- Tailwind CSS for utility-first styling
- All contributors and supporters

## 📞 Support

For support, email shyam@ilara.com or open an issue in the repository.

## 🎉 Thank You

Thank you for using Ilara Shopping! We hope you enjoy your shopping experience.

---

**Made with ❤️ for Ilara Shopping**
