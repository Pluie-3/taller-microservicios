<?php

require_once __DIR__ . '/../app/Controllers/CustomersController.php';

$controller = new CustomersController();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $controller->index();
} else {
    header('Content-Type: application/json');
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
}