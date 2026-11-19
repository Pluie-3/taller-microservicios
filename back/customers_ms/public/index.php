<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../app/Base/cors.php';

use App\Controllers\CustomersController;

$controller = new CustomersController();
$method = $_SERVER['REQUEST_METHOD'];
$uri = rtrim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$body = json_decode(file_get_contents('php://input'), true) ?? [];

if (preg_match('#^/(clientes|customers)$#', $uri) && $method === 'GET') {
    $controller->index();
} elseif (preg_match('#^/(clientes|customers)/(\d+)$#', $uri, $m) && $method === 'GET') {
    $controller->show((int)$m[2]);
} elseif (preg_match('#^/(clientes|customers)$#', $uri) && $method === 'POST') {
    $controller->store($body);
} elseif (preg_match('#^/(clientes|customers)/(\d+)$#', $uri, $m) && $method === 'PUT') {
    $controller->update((int)$m[2], $body);
} elseif (preg_match('#^/(clientes|customers)/(\d+)$#', $uri, $m) && $method === 'DELETE') {
    $controller->destroy((int)$m[2]);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Ruta no encontrada en customers_ms: ' . $uri]);
}