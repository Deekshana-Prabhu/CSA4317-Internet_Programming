package com.shopzone.servlet;

import com.shopzone.dao.ProductDAO;
import com.shopzone.model.Product;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 * ProductServlet - Retrieves product details from MySQL using GET method.
 * Supports category filtering, keyword searching, and full catalog retrieval.
 */
@WebServlet(name = "ProductServlet", urlPatterns = {"/products", "/ProductServlet"})
public class ProductServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private ProductDAO productDAO;

    @Override
    public void init() throws ServletException {
        productDAO = new ProductDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        String category = request.getParameter("category");
        String keyword = request.getParameter("search");
        String productId = request.getParameter("id");

        List<Product> productList;

        if (productId != null && !productId.trim().isEmpty()) {
            // Fetch single product details
            Product product = productDAO.getProductById(productId.trim());
            request.setAttribute("singleProduct", product);
        }

        // Determine which retrieval method to use
        if (keyword != null && !keyword.trim().isEmpty()) {
            // Search query with optional category
            productList = productDAO.searchProducts(keyword.trim(), category);
            request.setAttribute("searchKeyword", keyword.trim());
        } else if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("All")) {
            // Filter by specific category
            productList = productDAO.getProductsByCategory(category.trim());
            request.setAttribute("selectedCategory", category.trim());
        } else {
            // Fetch all products
            productList = productDAO.getAllProducts();
            request.setAttribute("selectedCategory", "All");
        }

        // Set products list in request scope
        request.setAttribute("productList", productList);
        request.setAttribute("totalResults", productList.size());

        // Forward to products.jsp to render the catalog
        request.getRequestDispatcher("products.jsp").forward(request, response);
    }
}
