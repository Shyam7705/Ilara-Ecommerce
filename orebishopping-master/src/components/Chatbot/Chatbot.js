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
      content: "Hello! 👋 I'm your Ilara shopping assistant. How can I help you today? I can help you find products, navigate the website, or answer questions about Ilara!",
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

  // Get website context for the AI
  const getWebsiteContext = () => {
    const allProducts = [...paginationItems, ...SplOfferData];
    const uniqueProducts = Array.from(
      new Map(allProducts.map(item => [item.productName, item])).values()
    );
    
    const productList = uniqueProducts
      .slice(0, 20) // Limit to first 20 for context
      .map(
        (p) => `${p.productName} - ₹${p.price} - Color: ${p.color || "Mixed"} - Category: ${p.category || "General"} - Brand: ${p.brand || "Ilara"} - Description: ${p.des || "Quality product"}`
      )
      .join("\n");

    return `You are a helpful and friendly shopping assistant for Ilara, an Indian e-commerce website selling various products.

Website Information:
- Company: Ilara Shopping
- Currency: All prices in Indian Rupees (₹)
- Website offers: Electronics, Accessories, Furniture, and more

Available Pages:
- Home (/): Main landing page
- Shop (/shop): Browse all products
- About (/about): About Ilara
- Contact (/contact): Contact information
- Cart (/cart): Shopping cart
- Offers (/offer): Special offers and deals
- Sign Up (/signup): Create account
- Sign In (/signin): Login page
- Product Details (/product/{productId}): View product details (productId is product name in lowercase, spaces removed)

Product Catalog (sample):
${productList}

Navigation Instructions:
- When user wants to see a product, respond with the product info AND use format: [NAVIGATE:/product/productname] (productname = product name lowercase, no spaces)
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
- Keep responses concise but informative`;
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

    // Check for navigation commands first
    const lowerMessage = userMessage.toLowerCase();
    let navigationPath = null;

    if (lowerMessage.includes("home") || lowerMessage.includes("homepage")) {
      navigationPath = "/";
    } else if (lowerMessage.includes("shop") || lowerMessage.includes("products")) {
      navigationPath = "/shop";
    } else if (lowerMessage.includes("cart") || lowerMessage.includes("basket")) {
      navigationPath = "/cart";
    } else if (lowerMessage.includes("about")) {
      navigationPath = "/about";
    } else if (lowerMessage.includes("contact")) {
      navigationPath = "/contact";
    } else if (lowerMessage.includes("offer") || lowerMessage.includes("deals")) {
      navigationPath = "/offer";
    } else if (lowerMessage.includes("sign in") || lowerMessage.includes("login")) {
      navigationPath = "/signin";
    } else if (lowerMessage.includes("sign up") || lowerMessage.includes("register")) {
      navigationPath = "/signup";
    }

    // Try to find a product in the message
    const allProducts = [...paginationItems, ...SplOfferData];
    const uniqueProducts = Array.from(
      new Map(allProducts.map(item => [item.productName, item])).values()
    );
    
    const matchedProduct = uniqueProducts.find((product) => {
      const productNameLower = product.productName.toLowerCase();
      return lowerMessage.includes(productNameLower) || 
             productNameLower.includes(lowerMessage.split(" ").find(word => word.length > 3) || "");
    });

    if (matchedProduct && !navigationPath) {
      const productId = matchedProduct.productName.toLowerCase().replace(/\s+/g, "");
      navigationPath = `/product/${productId}`;
    }

    try {
      // Call Gemini API
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
      if (navigationPath && navigationPath !== location.pathname) {
        setTimeout(() => {
          navigate(navigationPath);
          setIsOpen(false);
        }, 1000);
      }
    } catch (apiError) {
      console.error("Chatbot API error:", apiError);
      
      // Fallback responses for common queries
      let fallbackResponse = "";
      
      if (navigationPath) {
        fallbackResponse = `I'll take you to the ${navigationPath === "/shop" ? "shop" : navigationPath === "/cart" ? "cart" : navigationPath === "/" ? "home page" : "page"}!`;
      } else if (lowerMessage.includes("product") || lowerMessage.includes("item")) {
        if (matchedProduct) {
          const productId = matchedProduct.productName.toLowerCase().replace(/\s+/g, "");
          navigationPath = `/product/${productId}`;
          fallbackResponse = `I found ${matchedProduct.productName}! It's priced at ₹${matchedProduct.price}. Let me show you the details.`;
        } else {
          fallbackResponse = "I can help you find products! Try saying 'show me headphones' or 'show me smart watch' and I'll take you to those product pages.";
        }
      } else {
        fallbackResponse = "I'm here to help! You can ask me about products, navigate to different pages (shop, cart, offers), or get information about Ilara shopping. What would you like to know?";
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fallbackResponse },
      ]);

      if (navigationPath && navigationPath !== location.pathname) {
        setTimeout(() => {
          navigate(navigationPath);
          setIsOpen(false);
        }, 1000);
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

            {/* Quick Actions */}
            <div className="border-t border-gray-200 px-4 pt-3 pb-2">
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
                  placeholder="Ask me anything about Ilara..."
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

