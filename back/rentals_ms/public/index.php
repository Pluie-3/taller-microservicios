<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../app/Base/cors.php';

use App\Controllers\RentalsController;

$controller = new RentalsController();
$method = $_SERVER['REQUEST_METHOD'];
$uri = rtrim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$body = json_decode(file_get_contents('php://input'), true) ?? [];

if (preg_match('#^/(alquileres|reservas|rentals)$#', $uri) && $method === 'GET') {
    $controller->index();
} elseif (preg_match('#^/(alquileres|reservas|rentals)/(\d+)$#', $uri, $m) && $method === 'GET') {
    $controller->show((int)$m[2]);
} elseif (preg_match('#^/(alquileres|reservas|rentals)/(vehiculo|cliente)/(\d+)$#', $uri, $m) && $method === 'GET') {
    $controller->history($m[2], (int)$m[3]);
} elseif (preg_match('#^/disponibles$#', $uri) && $method === 'GET') {
    $fecha = $_GET['fecha'] ?? date('Y-m-d');
    $controller->available($fecha);
} elseif (preg_match('#^/(alquileres|reservas|rentals)$#', $uri) && $method === 'POST') {
    $controller->store($body);
} elseif (preg_match('#^/(alquileres|reservas|rentals)/(\d+)/entregar$#', $uri, $m) && $method === 'PUT') {
    $controller->deliver((int)$m[2]);
} elseif (preg_match('#^/(alquileres|reservas|rentals)/(\d+)(/devolver|/finalizar)?$#', $uri, $m) && $method === 'PUT') {
    $controller->finish((int)$m[2], $body);
} elseif (preg_match('#^/(alquileres|reservas|rentals)/(\d+)/cancelar$#', $uri, $m) && $method === 'PUT') {
    $controller->cancel((int)$m[2]);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Ruta no encontrada en rentals_ms: ' . $uri]);
}