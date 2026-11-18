package com.shopzone.servlet;

import com.shopzone.dao.ProductDAO;
import com.shopzone.model.Cart;
import com.shopzone.model.Product;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * CartServlet - Manages customer shopping cart operations
 * Supports add, update, remove, and clear actions with stock validation.
 */
@WebServlet(name = "CartServlet", urlPatterns = {"/cart-action", "/CartServlet"})
public class CartServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private ProductDAO productDAO;

    @Override
    public void init() throws ServletException {
        productDAO = new ProductDAO();
    }

    private Cart getOrCreateCart(HttpSession session) {
        Cart cart = (Cart) session.getAttribute("cart");
        if (cart == null) {
            cart = new Cart();
            session.setAttribute("cart", cart);
        }
        return cart;
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        processRequest(request, response);
    }

    private void processRequest(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession();
        Cart cart = getOrCreateCart(session);

        String action = request.getParameter("action");
        String productId = request.getParameter("productId");
        String qtyStr = request.getParameter("quantity");
        String redirect = request.getParameter("redirect");

        int quantity = 1;
        if (qtyStr != null && !qtyStr.trim().isEmpty()) {
            try {
                quantity = Integer.parseInt(qtyStr.trim());
            } catch (NumberFormatException e) {
                quantity = 1;
            }
        }

        if ("add".equalsIgnoreCase(action)) {
            if (productId != null && !productId.trim().isEmpty()) {
                Product product = productDAO.getProductById(productId.trim());
                if (product != null) {
                    if (product.getStock() <= 0) {
                        session.setAttribute("cartError", "Sorry, '" + product.getProductName() + "' is currently out of stock!");
                    } else {
                        String error = cart.addItem(product, quantity);
                        if (error != null) {
                            session.setAttribute("cartError", error);
                        } else {
                            session.setAttribute("cartSuccess", "Added " + quantity + "x '" + product.getProductName() + "' to your cart!");
                        }
                    }
                } else {
                    session.setAttribute("cartError", "Product not found.");
                }
            }
        } else if ("update".equalsIgnoreCase(action)) {
            if (productId != null && !productId.trim().isEmpty()) {
                Product product = productDAO.getProductById(productId.trim());
                if (product != null) {
                    String warn = cart.updateQuantity(productId.trim(), quantity, product.getStock());
                    if (warn != null) {
                        session.setAttribute("cartWarning", warn);
                    } else {
                        session.setAttribute("cartSuccess", "Cart quantity updated successfully.");
                    }
                }
            }
        } else if ("remove".equalsIgnoreCase(action)) {
            if (productId != null && !productId.trim().isEmpty()) {
                cart.removeItem(productId.trim());
                session.setAttribute("cartSuccess", "Item removed from your cart.");
            }
        } else if ("clear".equalsIgnoreCase(action)) {
            cart.clear();
            session.setAttribute("cartSuccess", "Your shopping cart has been cleared.");
        }

        // Determine redirection destination
        if ("products".equalsIgnoreCase(redirect)) {
            response.sendRedirect("products");
        } else if ("home".equalsIgnoreCase(redirect)) {
            response.sendRedirect("index.jsp");
        } else {
            response.sendRedirect("cart.jsp");
        }
    }
}
