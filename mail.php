<?php
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    // Retrieve and sanitize form inputs
    $name = isset($_POST['name']) ? htmlspecialchars($_POST['name']) : '';
    $email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_SANITIZE_EMAIL) : '';
    $phone = isset($_POST['phone']) ? htmlspecialchars($_POST['phone']) : '';
    $message = isset($_POST['message']) ? htmlspecialchars($_POST['message']) : '';
    $agree = isset($_POST['agree']) ? $_POST['agree'] : '';

    // Validate required fields
    if (empty($name) || empty($email) || empty($message) || empty($agree)) {
        die('Please fill in all required fields and agree to the Terms & Conditions.');
    }

    // Email settings
    $to = "email@domain-name.com";
    $subject = "Message from Boka Html Template " . htmlspecialchars($_POST['subject']);
    $headers = "From: " . $email . "\r\n" .
               "Reply-To: " . $email . "\r\n" .
               "X-Mailer: PHP/" . phpversion() . "\r\n" .
               "Return-Path: " . $email . "\r\n";

    // Construct email body
    $body = "You have a new message from Boka Html Template\n\n";
    $body .= "Name: " . $name . "\n";
    $body .= "Email: " . $email . "\n";
    $body .= "Phone: " . $phone . "\n";
    $body .= "Message: " . $message . "\n";

    // Send email
    $send = mail($to, $subject, $body, $headers);

    // Provide feedback
    if ($send) {
        echo "Email sent successfully!";
    } else {
        echo "Failed to send email. Please try again later.";
        error_log("Failed to send email. From: $email, To: $to, Subject: $subject");
    }
?>
