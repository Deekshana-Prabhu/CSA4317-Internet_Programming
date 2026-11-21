<?php
/**
 * ShopEase – Integrated E-Commerce Product and Order Management System
 * Main Website Entry Point & PHP Backend Controller
 * 
 * Includes:
 * - Session Management
 * - MySQL PDO Connectivity & Prepared Statements
 * - Customer Registration (password_hash) & Login (password_verify)
 * - Cart & Order Processing with Database Transactions
 * - Cookies for user preferences & returning customer detection
 * - PHP File Handling (fopen, fwrite, fclose) for order confirmations in orders/
 * - XML Reading, DOM manipulation & XSD Schema Validation
 * - XSLTProcessor transformation for invoices
 */

require_once __DIR__ . '/config.php';

// Handle Backend API / Actions if requested
$action = $_GET['action'] ?? $_POST['action'] ?? null;
$response = ['status' => 'success'];

// 1. Action: Customer Registration via PHP & MySQL
if ($action === 'php_register' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $mobile = trim($_POST['mobile'] ?? '');
    $password = $_POST['password'] ?? '';
    $address = trim($_POST['address'] ?? '');

    // Server-Side Regex Validation
    if (!preg_match('/^[a-zA-Z\s.]{3,50}$/', $name)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid name format. Minimum 3 alphabetic characters required.']);
        exit;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email address format.']);
        exit;
    }
    if (!preg_match('/^[6-9]\d{9}$/', $mobile)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid Indian mobile number. Must be 10 digits starting with 6-9.']);
        exit;
    }
    if (strlen($password) < 6) {
        echo json_encode(['status' => 'error', 'message' => 'Password must be at least 6 characters long.']);
        exit;
    }
    if (strlen($address) < 10) {
        echo json_encode(['status' => 'error', 'message' => 'Address must be at least 10 characters long.']);
        exit;
    }

    if ($db_connected && $pdo) {
        try {
            // Check for duplicate email
            $checkStmt = $pdo->prepare("SELECT customer_id FROM customers WHERE email = :email");
            $checkStmt->execute([':email' => $email]);
            if ($checkStmt->fetch()) {
                echo json_encode(['status' => 'error', 'message' => 'An account with this email address already exists.']);
                exit;
            }

            // Secure Password Hashing
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

            // Insert new customer using prepared statement
            $insertStmt = $pdo->prepare("INSERT INTO customers (customer_name, email, mobile, password, address) VALUES (:name, :email, :mobile, :password, :address)");
            $insertStmt->execute([
                ':name' => $name,
                ':email' => $email,
                ':mobile' => $mobile,
                ':password' => $hashedPassword,
                ':address' => $address
            ]);

            $newCustomerId = $pdo->lastInsertId();

            // Set PHP Session
            $_SESSION['customer_id'] = $newCustomerId;
            $_SESSION['customer'] = [
                'id' => $newCustomerId,
                'name' => $name,
                'email' => $email,
                'mobile' => $mobile,
                'address' => $address
            ];

            // Set cookie for customer name (lasts 7 days)
            setcookie('customer_name', $name, time() + (7 * 86400), '/');

            echo json_encode(['status' => 'success', 'message' => 'Registration successful via PHP & MySQL!', 'user' => $_SESSION['customer']]);
            exit;
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
            exit;
        }
    } else {
        // Fallback for preview mode
        echo json_encode(['status' => 'preview', 'message' => 'Running in Browser Preview Mode (MySQL not connected). Handled client-side.']);
        exit;
    }
}

// 2. Action: Customer Login via PHP & MySQL
if ($action === 'php_login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($db_connected && $pdo) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM customers WHERE email = :email");
            $stmt->execute([':email' => $email]);
            $customer = $stmt->fetch();

            if ($customer && password_verify($password, $customer['password'])) {
                $_SESSION['customer_id'] = $customer['customer_id'];
                $_SESSION['customer'] = [
                    'id' => $customer['customer_id'],
                    'name' => $customer['customer_name'],
                    'email' => $customer['email'],
                    'mobile' => $customer['mobile'],
                    'address' => $customer['address']
                ];
                setcookie('customer_name', $customer['customer_name'], time() + (7 * 86400), '/');
                echo json_encode(['status' => 'success', 'message' => 'Welcome back, ' . $customer['customer_name'] . '!', 'user' => $_SESSION['customer']]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Invalid email or password.']);
            }
            exit;
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
            exit;
        }
    } else {
        echo json_encode(['status' => 'preview', 'message' => 'Running in Preview Mode.']);
        exit;
    }
}

// 3. Action: Logout via PHP
if ($action === 'php_logout') {
    session_unset();
    session_destroy();
    setcookie('customer_name', '', time() - 3600, '/');
    header('Location: index.php');
    exit;
}

// 4. Action: Order Placement with Database Transactions & PHP File Handling
if ($action === 'php_place_order' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    $inputData = json_decode(file_get_contents('php://input'), true);

    $name = trim($inputData['name'] ?? '');
    $email = trim($inputData['email'] ?? '');
    $mobile = trim($inputData['mobile'] ?? '');
    $address = trim($inputData['address'] ?? '');
    $paymentMethod = $inputData['payment_method'] ?? 'Cash on Delivery';
    $items = $inputData['items'] ?? [];

    if (empty($items)) {
        echo json_encode(['status' => 'error', 'message' => 'Cart is empty.']);
        exit;
    }

    $customerId = $_SESSION['customer_id'] ?? 1;
    $orderId = 'ORD-2026-' . rand(1000, 9999);
    $orderDate = date('Y-m-d H:i:s');

    // Calculate Subtotal & Total
    $subtotal = 0;
    foreach ($items as $item) {
        $subtotal += ($item['price'] * $item['quantity']);
    }
    $deliveryFee = $subtotal >= 999 ? 0 : 99;
    $grandTotal = $subtotal + $deliveryFee;

    // Database Transaction
    if ($db_connected && $pdo) {
        try {
            $pdo->beginTransaction();

            // Insert into orders table
            $orderStmt = $pdo->prepare("INSERT INTO orders (order_id, customer_id, order_date, total_amount, payment_method, order_status, delivery_address) VALUES (:order_id, :customer_id, :order_date, :total, :pay_method, 'Confirmed', :address)");
            $orderStmt->execute([
                ':order_id' => $orderId,
                ':customer_id' => $customerId,
                ':order_date' => $orderDate,
                ':total' => $grandTotal,
                ':pay_method' => $paymentMethod,
                ':address' => $address
            ]);

            // Insert order items & deduct stock
            $itemStmt = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (:order_id, :product_id, :qty, :price)");
            $stockStmt = $pdo->prepare("UPDATE products SET stock = stock - :qty WHERE product_id = :product_id AND stock >= :qty");

            foreach ($items as $item) {
                $itemStmt->execute([
                    ':order_id' => $orderId,
                    ':product_id' => $item['id'],
                    ':qty' => $item['quantity'],
                    ':price' => $item['price']
                ]);

                $stockStmt->execute([
                    ':qty' => $item['quantity'],
                    ':product_id' => $item['id']
                ]);
            }

            $pdo->commit();
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['status' => 'error', 'message' => 'Order transaction failed: ' . $e->getMessage()]);
            exit;
        }
    }

    // ---------------------------------------------------------
    // PHP File Handling: Generate Order Confirmation Text Report
    // ---------------------------------------------------------
    $reportFileName = REPORTS_DIR . $orderId . '.txt';
    $fileHandle = @fopen($reportFileName, 'w');

    if ($fileHandle) {
        $reportContent = "========================================================================\n";
        $reportContent .= "                      SHOPEASE E-COMMERCE ORDER REPORT\n";
        $reportContent .= "========================================================================\n";
        $reportContent .= "Order Reference ID   : {$orderId}\n";
        $reportContent .= "Generation Timestamp : {$orderDate} IST\n";
        $reportContent .= "Order Status         : Confirmed\n\n";
        $reportContent .= "------------------------------------------------------------------------\n";
        $reportContent .= "CUSTOMER BILLING & DELIVERY INFORMATION\n";
        $reportContent .= "------------------------------------------------------------------------\n";
        $reportContent .= "Customer Name        : {$name}\n";
        $reportContent .= "Email Address        : {$email}\n";
        $reportContent .= "Mobile Phone         : +91 {$mobile}\n";
        $reportContent .= "Delivery Address     : {$address}\n\n";
        $reportContent .= "------------------------------------------------------------------------\n";
        $reportContent .= "ORDERED PRODUCTS & ITEMIZATION\n";
        $reportContent .= "------------------------------------------------------------------------\n";

        foreach ($items as $idx => $item) {
            $lineTotal = number_format($item['price'] * $item['quantity'], 2);
            $unitPrice = number_format($item['price'], 2);
            $num = $idx + 1;
            $reportContent .= "[{$num}] SKU: {$item['id']}\n";
            $reportContent .= "    Item: {$item['name']} ({$item['category']})\n";
            $reportContent .= "    Quantity: {$item['quantity']} unit(s)  x  INR {$unitPrice}  =  INR {$lineTotal}\n\n";
        }

        $reportContent .= "------------------------------------------------------------------------\n";
        $reportContent .= "FINANCIAL SUMMARY\n";
        $reportContent .= "------------------------------------------------------------------------\n";
        $reportContent .= "Items Subtotal       : INR " . number_format($subtotal, 2) . "\n";
        $reportContent .= "Standard Delivery    : INR " . number_format($deliveryFee, 2) . ($deliveryFee === 0 ? " (Complimentary Free Shipping)" : "") . "\n";
        $reportContent .= "Taxes (GST Included) : INR 0.00\n";
        $reportContent .= "Grand Total Amount   : INR " . number_format($grandTotal, 2) . "\n";
        $reportContent .= "Payment Method       : {$paymentMethod}\n\n";
        $reportContent .= "========================================================================\n";
        $reportContent .= "Thank you for shopping with ShopEase!\n";
        $reportContent .= "Tagline: \"Discover. Shop. Enjoy.\"\n";
        $reportContent .= "Generated via PHP file handling (fopen, fwrite, fclose).\n";
        $reportContent .= "========================================================================\n";

        fwrite($fileHandle, $reportContent);
        fclose($fileHandle);
    }

    echo json_encode([
        'status' => 'success',
        'order_id' => $orderId,
        'report_file' => 'orders/' . $orderId . '.txt',
        'message' => 'Order placed successfully and confirmation report generated in orders/'
    ]);
    exit;
}

// 5. Action: XML Schema Validation using PHP DOMDocument
if ($action === 'php_validate_xml') {
    header('Content-Type: application/json');
    $type = $_GET['type'] ?? 'products';
    $xmlFile = ($type === 'orders') ? __DIR__ . '/orders.xml' : __DIR__ . '/products.xml';
    $xsdFile = ($type === 'orders') ? __DIR__ . '/orders.xsd' : __DIR__ . '/products.xsd';

    if (file_exists($xmlFile) && file_exists($xsdFile)) {
        libxml_use_internal_errors(true);
        $dom = new DOMDocument();
        $dom->load($xmlFile);
        $isValid = $dom->schemaValidate($xsdFile);

        if ($isValid) {
            echo json_encode([
                'status' => 'success',
                'message' => "PHP DOMDocument: {$type}.xml validated successfully against {$type}.xsd!"
            ]);
        } else {
            $errors = libxml_get_errors();
            $errorList = [];
            foreach ($errors as $err) {
                $errorList[] = trim($err->message);
            }
            libxml_clear_errors();
            echo json_encode([
                'status' => 'error',
                'message' => 'Validation failed: ' . implode('; ', $errorList)
            ]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'XML or XSD file not found on server.']);
    }
    exit;
}

// 6. Action: XSLT Transformation using PHP XSLTProcessor
if ($action === 'php_xslt_invoice') {
    $xmlFile = __DIR__ . '/orders.xml';
    $xslFile = __DIR__ . '/orders.xsl';

    if (class_exists('XSLTProcessor') && file_exists($xmlFile) && file_exists($xslFile)) {
        $xml = new DOMDocument();
        $xml->load($xmlFile);

        $xsl = new DOMDocument();
        $xsl->load($xslFile);

        $proc = new XSLTProcessor();
        $proc->importStylesheet($xsl);
        echo $proc->transformToXML($xml);
    } else {
        // Fallback: If XSLT extension is not enabled in XAMPP php.ini
        header('Location: index.html');
    }
    exit;
}

// If no specific API action is requested, render the main unified front-end page
// Reads from index.html to guarantee 100% feature-parity across Preview Mode and PHP Mode!
include __DIR__ . '/index.html';
?>
