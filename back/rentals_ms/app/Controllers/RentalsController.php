<?php
namespace App\Controllers;

use App\Repositories\RentalsRepository;

class RentalsController
{
    private RentalsRepository $repository;

    public function __construct()
    {
        $this->repository = new RentalsRepository();
    }

    public function index(): void
    {
        $this->jsonResponse(200, $this->repository->getAll());
    }

    public function show(int $id): void
    {
        $rental = $this->repository->findById($id);
        if (!$rental) {
            $this->jsonResponse(404, ['error' => 'Alquiler no encontrado']);
            return;
        }
        $this->jsonResponse(200, $rental);
    }

    public function history(string $tipo, int $id): void
    {
        $this->jsonResponse(200, $this->repository->getHistory($tipo, $id));
    }

    public function available(string $fecha): void
    {
        $this->jsonResponse(200, $this->repository->getAvailableByDate($fecha));
    }

    public function store(array $data): void
    {
        foreach (['cliente_id', 'vehiculo_id', 'fecha_inicio', 'fecha_fin'] as $field) {
            if (!isset($data[$field]) || $data[$field] === '') {
                $this->jsonResponse(400, ['error' => "El campo {$field} es obligatorio"]);
                return;
            }
        }
        if ($data['fecha_fin'] < $data['fecha_inicio']) {
            $this->jsonResponse(400, ['error' => 'La fecha de fin debe ser mayor o igual a la fecha de inicio']);
            return;
        }

        $vehiculoId = (int) $data['vehiculo_id'];
        if ($this->repository->hasDateOverlap($vehiculoId, (string) $data['fecha_inicio'], (string) $data['fecha_fin'])) {
            $this->jsonResponse(400, ['error' => 'El vehículo ya tiene una reserva en esas fechas']);
            return;
        }

        $id = $this->repository->create($data);
        $this->jsonResponse(201, $this->repository->findById($id));
    }

    public function deliver(int $id): void
    {
        $rental = $this->repository->findById($id);
        if (!$rental || $rental['estado'] !== 'reservado') {
            $this->jsonResponse(400, ['error' => 'Solo se pueden entregar reservas en estado reservado']);
            return;
        }
        $updated = $this->repository->updateStatus($id, 'en_curso');
        $this->updateVehicleStatus((int) $updated['vehiculo_id'], 'alquilado');
        $this->jsonResponse(200, $updated);
    }

    public function finish(int $id, array $data = []): void
    {
        $rental = $this->repository->findById($id);
        if (!$rental || $rental['estado'] !== 'en_curso') {
            $this->jsonResponse(400, ['error' => 'Solo se pueden devolver alquileres en curso']);
            return;
        }
        $fechaDev = $data['fecha_devolucion'] ?? date('Y-m-d');
        $updated = $this->repository->finish($id, $fechaDev);
        $this->updateVehicleStatus((int) $updated['vehiculo_id'], 'disponible');
        $this->jsonResponse(200, $updated);
    }

    public function cancel(int $id): void
    {
        $rental = $this->repository->findById($id);
        if (!$rental || $rental['estado'] !== 'reservado') {
            $this->jsonResponse(400, ['error' => 'Solo se pueden cancelar reservas pendientes']);
            return;
        }
        $updated = $this->repository->updateStatus($id, 'cancelado');
        $this->jsonResponse(200, $updated);
    }

    private function updateVehicleStatus(int $vehiculoId, string $estado): void
    {
        $url = "http://localhost:8002/vehiculos/{$vehiculoId}/estado";
        $payload = json_encode(['estado' => $estado]);

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_CUSTOMREQUEST => 'PUT',
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Content-Length: ' . strlen($payload),
            ],
        ]);
        curl_exec($ch);
        curl_close($ch);
    }

    private function jsonResponse(int $status, mixed $payload): void
    {
        http_response_code($status);
        echo json_encode($payload);
    }
}