<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../app/Base/cors.php';

use App\Controllers\VehiclesController;

$controller = new VehiclesController();
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$body = json_decode(file_get_contents('php://input'), true) ?? [];

if ($uri === '/vehiculos' && $method === 'GET') {
    $estado = $_GET['estado'] ?? null;
    $controller->index($estado);
} elseif ($uri === '/vehiculos/disponibles' && $method === 'GET') {
    $controller->index('disponible');
} elseif (preg_match('#^/vehiculos/(\d+)$#', $uri, $m) && $method === 'GET') {
    $controller->show((int)$m[1]);
} elseif ($uri === '/vehiculos' && $method === 'POST') {
    $controller->store($body);
} elseif (preg_match('#^/vehiculos/(\d+)$#', $uri, $m) && $method === 'PUT') {
    $controller->update((int)$m[1], $body);
} elseif (preg_match('#^/vehiculos/(\d+)/estado$#', $uri, $m) && $method === 'PUT') {
    $controller->changeStatus((int)$m[1], $body);
} elseif (preg_match('#^/vehiculos/(\d+)$#', $uri, $m) && $method === 'DELETE') {
    $controller->destroy((int)$m[1]);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Ruta no encontrada en vehicles_ms']);
}