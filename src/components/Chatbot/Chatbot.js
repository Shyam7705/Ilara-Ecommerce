import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { paginationItems, SplOfferData } from "../../constants";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! 👋 I'm your Ilara shopping assistant. I can help you find products, navigate the website, or answer questions about Ilara! Use the quick action buttons below to get started.",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const GEMINI_API_KEY = "AIzaSyAAJDVUNhl1MtoMNYXJr7TxL46b2QRS20k";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Get all products safely (filter out null/undefined)
  const getAllProducts = () => {
    const allProducts = [...(paginationItems || []), ...(SplOfferData || [])];
    return allProducts.filter(item => item && item.productName);
  };

  // Get unique products
  const getUniqueProducts = () => {
    const allProducts = getAllProducts();
    return Array.from(
      new Map(allProducts.map(item => [item.productName, item])).values()
    );
  };

  // Check if question is website-related
  const isWebsiteRelated = (message) => {
    const lowerMessage = message.toLowerCase();
    const websiteKeywords = [
      "product", "products", "item", "items", "shop", "shopping", "buy", "purchase",
      "cart", "basket", "order", "price", "cost", "offer", "deal", "discount",
      "ilara", "website", "page", "navigation", "home", "about", "contact",
      "headphones", "watch", "table", "cap", "bag", "backpack", "clock", "basket",
      "glasses", "sunglasses", "toys", "flower", "base", "materials", "household"
    ];
    return websiteKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  // Get website context for the AI
  const getWebsiteContext = () => {
    const uniqueProducts = getUniqueProducts();
    
    const productList = uniqueProducts
      .slice(0, 20) // Limit to first 20 for context
      .map(
        (p) => `${p.productName} - ₹${p.price} - Color: ${p.color || "Mixed"} - Description: ${p.des || "Quality product"}`
      )
      .join("\n");

    return `You are a helpful and friendly shopping assistant for Ilara, an Indian e-commerce website.

IMPORTANT RULES:
1. If the user asks about something NOT related to Ilara website, products, shopping, or navigation, give a brief, polite general answer and redirect them back to website-related topics.
2. Focus ONLY on website-related questions: products, navigation, shopping, orders, prices, offers, etc.
3. For general/unrelated questions, politely say: "I'm specialized in helping with Ilara shopping. I can help you find products, navigate the website, or answer questions about our products and services. What would you like to know about Ilara?"

Website Information:
- Company: Ilara Shopping
- Currency: All prices in Indian Rupees (₹)
- Website offers: Electronics, Accessories, Furniture, Home goods, and more

Available Pages:
- Home (/): Main landing page
- Shop (/shop): Browse all products
- About (/about): About Ilara
- Contact (/contact): Contact information
- Cart (/cart): Shopping cart
- Offers (/offer): Special offers and deals
- Sign Up (/signup): Create account
- Sign In (/signin): Login page
- Product Details (/product/{productId}): View product details

Product Catalog (sample):
${productList}

Navigation Instructions:
- When user wants to see a product, respond with product info AND use format: [NAVIGATE:/product/productname] (productname = product name lowercase, no spaces)
- When user wants to browse products, use: [NAVIGATE:/shop]
- When user wants to go home, use: [NAVIGATE:/]
- When user wants to see cart, use: [NAVIGATE:/cart]
- When user asks about offers, use: [NAVIGATE:/offer]

Your Personality:
- Be warm, friendly, and helpful
- Provide accurate product information including prices in ₹
- Suggest products when asked
- Help with navigation
- Answer questions about Ilara shopping
- Keep responses concise but informative
- Redirect unrelated questions back to Ilara shopping topics`;
  };

  // Find product in message
  const findProductInMessage = (message) => {
    const uniqueProducts = getUniqueProducts();
    const lowerMessage = message.toLowerCase();
    
    // Try exact match first
    let matchedProduct = uniqueProducts.find((product) => {
      const productNameLower = product.productName.toLowerCase();
      return lowerMessage.includes(productNameLower);
    });

    // If no exact match, try partial match with keywords
    if (!matchedProduct) {
      const keywords = lowerMessage.split(" ").filter(word => word.length > 3);
      matchedProduct = uniqueProducts.find((product) => {
        const productNameLower = product.productName.toLowerCase();
        return keywords.some(keyword => productNameLower.includes(keyword));
      });
    }

    return matchedProduct || null;
  };

  // Handle navigation with product data
  const handleNavigation = (path, product = null) => {
    if (path && path !== location.pathname) {
      setTimeout(() => {
        if (product && path.startsWith("/product/")) {
          navigate(path, {
            state: {
              item: product,
            },
          });
        } else {
          navigate(path);
        }
        setIsOpen(false);
      }, 1000);
    }
  };

  const sendMessage = async (customMessage = null) => {
    const messageToSend = customMessage || inputMessage.trim();
    if (!messageToSend || isLoading) return;

    const userMessage = messageToSend;
    if (!customMessage) {
      setInputMessage("");
    }
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    const lowerMessage = userMessage.toLowerCase();
    let navigationPath = null;
    let matchedProduct = null;

    // Check if question is website-related
    const isRelated = isWebsiteRelated(userMessage);

    // Check for navigation commands
    if (lowerMessage.includes("home") || lowerMessage.includes("homepage")) {
      navigationPath = "/";
    } else if (lowerMessage.includes("shop") || lowerMessage.includes("products") || lowerMessage.includes("browse")) {
      navigationPath = "/shop";
    } else if (lowerMessage.includes("cart") || lowerMessage.includes("basket")) {
      navigationPath = "/cart";
    } else if (lowerMessage.includes("about")) {
      navigationPath = "/about";
    } else if (lowerMessage.includes("contact")) {
      navigationPath = "/contact";
    } else if (lowerMessage.includes("offer") || lowerMessage.includes("deals") || lowerMessage.includes("discount")) {
      navigationPath = "/offer";
    } else if (lowerMessage.includes("sign in") || lowerMessage.includes("login")) {
      navigationPath = "/signin";
    } else if (lowerMessage.includes("sign up") || lowerMessage.includes("register")) {
      navigationPath = "/signup";
    }

    // Try to find a product in the message
    if (!navigationPath) {
      matchedProduct = findProductInMessage(userMessage);
      if (matchedProduct) {
        const productId = matchedProduct.productName.toLowerCase().replace(/\s+/g, "");
        navigationPath = `/product/${productId}`;
      }
    }

    // If question is not website-related, give a general response
    if (!isRelated && !navigationPath && !matchedProduct) {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm specialized in helping with Ilara shopping. I can help you find products, navigate the website, or answer questions about our products and services. What would you like to know about Ilara? You can also use the quick action buttons below to get started!",
        },
      ]);
      return;
    }

    try {
      // Call Gemini API only for website-related questions
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${getWebsiteContext()}\n\nPrevious conversation:\n${messages.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')}\n\nUser: ${userMessage}\n\nAssistant:`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to get response");
      }

      let assistantMessage =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I apologize, but I couldn't process your request. Please try again.";

      // Check for navigation commands in the response
      const navMatch = assistantMessage.match(/\[NAVIGATE:(.+?)\]/);
      if (navMatch) {
        navigationPath = navMatch[1];
        assistantMessage = assistantMessage.replace(/\[NAVIGATE:(.+?)\]/, "").trim();
      }

      // If assistant message is empty after removing navigation, add a friendly message
      if (!assistantMessage.trim() && navigationPath) {
        assistantMessage = "Let me take you there!";
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantMessage },
      ]);

      // Navigate if path was found
      if (navigationPath) {
        handleNavigation(navigationPath, matchedProduct);
      }
    } catch (apiError) {
      console.error("Chatbot API error:", apiError);
      
      // Fallback responses for common queries
      let fallbackResponse = "";
      
      if (navigationPath) {
        if (navigationPath === "/shop") {
          fallbackResponse = "I'll take you to the shop page where you can browse all our products!";
        } else if (navigationPath === "/cart") {
          fallbackResponse = "I'll take you to your cart!";
        } else if (navigationPath === "/") {
          fallbackResponse = "I'll take you to the home page!";
        } else if (navigationPath.startsWith("/product/")) {
          if (matchedProduct) {
            fallbackResponse = `I found ${matchedProduct.productName}! It's priced at ₹${matchedProduct.price}. Let me show you the details.`;
          } else {
            fallbackResponse = "Let me show you that product!";
          }
        } else {
          fallbackResponse = "I'll take you there!";
        }
      } else if (matchedProduct) {
        const productId = matchedProduct.productName.toLowerCase().replace(/\s+/g, "");
        navigationPath = `/product/${productId}`;
        fallbackResponse = `I found ${matchedProduct.productName}! It's priced at ₹${matchedProduct.price}. Let me show you the details.`;
      } else if (isRelated) {
        fallbackResponse = "I'm here to help! You can ask me about products, navigate to different pages (shop, cart, offers), or get information about Ilara shopping. Try using the quick action buttons below or ask me about a specific product!";
      } else {
        fallbackResponse = "I'm specialized in helping with Ilara shopping. I can help you find products, navigate the website, or answer questions about our products and services. What would you like to know about Ilara?";
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fallbackResponse },
      ]);

      if (navigationPath) {
        handleNavigation(navigationPath, matchedProduct);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primeColor text-white rounded-full shadow-lg hover:bg-black transition-colors duration-300 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open chatbot"
      >
        {isOpen ? (
          <FaTimes className="text-xl" />
        ) : (
          <FaRobot className="text-xl" />
        )}
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200"
          >
            {/* Header */}
            <div className="bg-primeColor text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaRobot className="text-xl" />
                <div>
                  <h3 className="font-semibold">Ilara Assistant</h3>
                  <p className="text-xs text-gray-200">Online now</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:text-gray-200 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.role === "user"
                        ? "bg-primeColor text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions (Recommended Chats) */}
            <div className="border-t border-gray-200 px-4 pt-3 pb-2">
              <p className="text-xs text-gray-500 mb-2 font-medium">Recommended:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => sendMessage("Show me all products")}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                >
                  Browse Products
                </button>
                <button
                  onClick={() => sendMessage("What are the special offers?")}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                >
                  Special Offers
                </button>
                <button
                  onClick={() => sendMessage("Show me headphones")}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                >
                  Find Headphones
                </button>
                <button
                  onClick={() => sendMessage("Show me smart watch")}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                >
                  Find Smart Watch
                </button>
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Ilara products..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primeColor"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-primeColor text-white px-4 py-2 rounded-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
