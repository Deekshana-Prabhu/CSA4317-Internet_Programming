<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>

    <xsl:template match="/">
        <html>
            <head>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>ShopEase - Official Tax Invoice</title>
                <style>
                    * {
                        box-sizing: border-box;
                        margin: 0;
                        padding: 0;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    }
                    body {
                        background: #f8fafc;
                        color: #1e293b;
                        padding: 30px 15px;
                    }
                    .invoice-container {
                        max-width: 820px;
                        margin: 0 auto;
                        background: #ffffff;
                        border-radius: 16px;
                        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
                        border: 1px solid #e2e8f0;
                        overflow: hidden;
                    }
                    .invoice-header {
                        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #38bdf8 100%);
                        color: #ffffff;
                        padding: 36px 40px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .brand h1 {
                        font-size: 30px;
                        font-weight: 800;
                        letter-spacing: -0.5px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    .brand p {
                        font-size: 13px;
                        opacity: 0.9;
                        margin-top: 4px;
                    }
                    .invoice-meta {
                        text-align: right;
                    }
                    .invoice-title {
                        font-size: 22px;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    .invoice-id {
                        font-size: 14px;
                        opacity: 0.95;
                        margin-top: 4px;
                        font-family: monospace;
                    }
                    .invoice-body {
                        padding: 36px 40px;
                    }
                    .info-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 30px;
                        margin-bottom: 30px;
                        padding-bottom: 24px;
                        border-bottom: 1px solid #f1f5f9;
                    }
                    .info-box h3 {
                        font-size: 12px;
                        text-transform: uppercase;
                        color: #64748b;
                        letter-spacing: 0.8px;
                        margin-bottom: 8px;
                    }
                    .info-box p {
                        font-size: 14px;
                        color: #334155;
                        line-height: 1.5;
                    }
                    .status-pill {
                        display: inline-block;
                        padding: 4px 12px;
                        border-radius: 9999px;
                        font-size: 12px;
                        font-weight: 600;
                        background: #ecfdf5;
                        color: #059669;
                        margin-top: 6px;
                    }
                    .items-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 30px;
                    }
                    .items-table th {
                        background: #f8fafc;
                        color: #475569;
                        text-align: left;
                        padding: 12px 14px;
                        font-size: 12px;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        border-bottom: 2px solid #e2e8f0;
                    }
                    .items-table td {
                        padding: 14px;
                        font-size: 14px;
                        border-bottom: 1px solid #f1f5f9;
                        color: #1e293b;
                    }
                    .text-right {
                        text-align: right;
                    }
                    .totals-section {
                        display: flex;
                        justify-content: flex-end;
                        margin-bottom: 30px;
                    }
                    .totals-box {
                        width: 320px;
                    }
                    .totals-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 8px 0;
                        font-size: 14px;
                        color: #64748b;
                    }
                    .totals-row.grand-total {
                        border-top: 2px solid #e2e8f0;
                        margin-top: 8px;
                        padding-top: 14px;
                        font-size: 18px;
                        font-weight: 700;
                        color: #4f46e5;
                    }
                    .invoice-footer {
                        background: #f8fafc;
                        padding: 20px 40px;
                        border-top: 1px solid #e2e8f0;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .footer-note {
                        font-size: 12px;
                        color: #64748b;
                    }
                    .action-buttons {
                        display: flex;
                        gap: 12px;
                    }
                    .btn {
                        padding: 8px 18px;
                        border-radius: 8px;
                        font-size: 13px;
                        font-weight: 600;
                        cursor: pointer;
                        border: none;
                        transition: all 0.2s ease;
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                    }
                    .btn-primary {
                        background: #6366f1;
                        color: #ffffff;
                    }
                    .btn-primary:hover {
                        background: #4f46e5;
                    }
                    .btn-outline {
                        background: #ffffff;
                        color: #475569;
                        border: 1px solid #cbd5e1;
                    }
                    .btn-outline:hover {
                        background: #f1f5f9;
                    }
                    @media print {
                        body {
                            background: #ffffff;
                            padding: 0;
                        }
                        .invoice-container {
                            border: none;
                            box-shadow: none;
                            max-width: 100%;
                        }
                        .action-buttons {
                            display: none !important;
                        }
                    }
                </style>
            </head>
            <body>
                <xsl:for-each select="orders/order[1]">
                    <div class="invoice-container">
                        <div class="invoice-header">
                            <div class="brand">
                                <h1>ShopEase</h1>
                                <p>Integrated E-Commerce Product &amp; Order Management System</p>
                                <p>Discover. Shop. Enjoy.</p>
                            </div>
                            <div class="invoice-meta">
                                <div class="invoice-title">Tax Invoice</div>
                                <div class="invoice-id">INV-<xsl:value-of select="order_id"/></div>
                                <p style="font-size: 13px; margin-top: 4px;">Date: <xsl:value-of select="order_date"/></p>
                            </div>
                        </div>

                        <div class="invoice-body">
                            <div class="info-grid">
                                <div class="info-box">
                                    <h3>Billed To (Customer Details)</h3>
                                    <p><strong><xsl:value-of select="customer_name"/></strong></p>
                                    <p>Email: <xsl:value-of select="customer_email"/></p>
                                    <p>Mobile: +91 <xsl:value-of select="customer_mobile"/></p>
                                    <p>Delivery Address: <xsl:value-of select="delivery_address"/></p>
                                </div>
                                <div class="info-box">
                                    <h3>Order &amp; Payment Details</h3>
                                    <p><strong>Order ID:</strong> <xsl:value-of select="order_id"/></p>
                                    <p><strong>Payment Mode:</strong> <xsl:value-of select="payment_method"/></p>
                                    <p>
                                        <strong>Status: </strong>
                                        <span class="status-pill"><xsl:value-of select="order_status"/></span>
                                    </p>
                                </div>
                            </div>

                            <table class="items-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Product Item</th>
                                        <th>Category</th>
                                        <th class="text-right">Unit Price</th>
                                        <th class="text-right">Qty</th>
                                        <th class="text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <xsl:for-each select="order_items/item">
                                        <tr>
                                            <td><xsl:value-of select="position()"/></td>
                                            <td>
                                                <strong><xsl:value-of select="product_name"/></strong>
                                                <div style="font-size: 12px; color: #64748b;">SKU: <xsl:value-of select="product_id"/></div>
                                            </td>
                                            <td><xsl:value-of select="category"/></td>
                                            <td class="text-right">&#8377;<xsl:value-of select="unit_price"/></td>
                                            <td class="text-right"><xsl:value-of select="quantity"/></td>
                                            <td class="text-right">&#8377;<xsl:value-of select="subtotal"/></td>
                                        </tr>
                                    </xsl:for-each>
                                </tbody>
                            </table>

                            <div class="totals-section">
                                <div class="totals-box">
                                    <div class="totals-row">
                                        <span>Subtotal</span>
                                        <span>&#8377;<xsl:value-of select="subtotal_amount"/></span>
                                    </div>
                                    <div class="totals-row">
                                        <span>Delivery Fee</span>
                                        <span>
                                            <xsl:choose>
                                                <xsl:when test="delivery_fee = 0 or delivery_fee = '0.00'">FREE</xsl:when>
                                                <xsl:otherwise>&#8377;<xsl:value-of select="delivery_fee"/></xsl:otherwise>
                                            </xsl:choose>
                                        </span>
                                    </div>
                                    <div class="totals-row">
                                        <span>GST / Tax (Included)</span>
                                        <span>&#8377;0.00</span>
                                    </div>
                                    <div class="totals-row grand-total">
                                        <span>Grand Total</span>
                                        <span>&#8377;<xsl:value-of select="total_amount"/></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="invoice-footer">
                            <div class="footer-note">
                                <p>Thank you for shopping with <strong>ShopEase</strong>!</p>
                                <p>This is a computer-generated tax invoice and requires no physical signature.</p>
                            </div>
                            <div class="action-buttons">
                                <button class="btn btn-outline" onclick="window.print()">
                                    &#128438; Print Invoice
                                </button>
                                <button class="btn btn-primary" onclick="alert('Invoice downloaded successfully.')">
                                    &#11015; Download PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </xsl:for-each>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
