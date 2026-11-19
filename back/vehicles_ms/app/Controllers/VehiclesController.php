<?php
namespace App\Controllers;

use App\Presentation\Repositories\VehiclesRepository;

class VehiclesController {
    private VehiclesRepository $repo;
    private array $estadosValidos = ['disponible', 'alquilado', 'mantenimiento'];

    public function __construct() {
        $this->repo = new VehiclesRepository();
    }

    public function index(?string $estado = null): void {
        echo json_encode($this->repo->getAll($estado));
    }

    public function show(int $id): void {
        $vehiculo = $this->repo->getById($id);
        if (!$vehiculo) {
            http_response_code(404);
            echo json_encode(['error' => 'Vehículo no encontrado']);
            return;
        }
        echo json_encode($vehiculo);
    }

    public function store(array $data): void {
        if (empty($data['marca']) || empty($data['modelo']) || empty($data['anio'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Marca, modelo y año son obligatorios']);
            return;
        }
        $estado = $data['estado'] ?? 'disponible';
        if (!in_array($estado, $this->estadosValidos, true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Estado inválido']);
            return;
        }
        $id = $this->repo->create($data);
        http_response_code(201);
        echo json_encode($this->repo->getById($id));
    }

    public function update(int $id, array $data): void {
        if (!$this->repo->getById($id)) {
            http_response_code(404);
            echo json_encode(['error' => 'Vehículo no encontrado']);
            return;
        }
        $this->repo->update($id, $data);
        echo json_encode($this->repo->getById($id));
    }

    public function changeStatus(int $id, array $data): void {
        if (!$this->repo->getById($id)) {
            http_response_code(404);
            echo json_encode(['error' => 'Vehículo no encontrado']);
            return;
        }
        $estado = $data['estado'] ?? '';
        if (!in_array($estado, $this->estadosValidos, true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Estado debe ser disponible, alquilado o mantenimiento']);
            return;
        }
        $this->repo->updateEstado($id, $estado);
        echo json_encode($this->repo->getById($id));
    }

    public function destroy(int $id): void {
        if (!$this->repo->getById($id)) {
            http_response_code(404);
            echo json_encode(['error' => 'Vehículo no encontrado']);
            return;
        }
        $this->repo->delete($id);
        echo json_encode(['message' => 'Vehículo eliminado']);
    }
}
