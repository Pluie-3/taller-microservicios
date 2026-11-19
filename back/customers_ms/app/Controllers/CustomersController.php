<?php
namespace App\Controllers;

use App\Presentation\Repositories\CustomersRepository;

class CustomersController {
    private CustomersRepository $repo;

    public function __construct() {
        $this->repo = new CustomersRepository();
    }

    public function index(): void {
        echo json_encode($this->repo->getAll());
    }

    public function show(int $id): void {
        $cliente = $this->repo->getById($id);
        if (!$cliente) {
            http_response_code(404);
            echo json_encode(['error' => 'Cliente no encontrado']);
            return;
        }
        echo json_encode($cliente);
    }

    public function store(array $data): void {
        if (empty(trim($data['nombre'] ?? ''))) {
            http_response_code(400);
            echo json_encode(['error' => 'El nombre es obligatorio']);
            return;
        }
        $id = $this->repo->create($data);
        http_response_code(201);
        echo json_encode($this->repo->getById($id));
    }

    public function update(int $id, array $data): void {
        if (!$this->repo->getById($id)) {
            http_response_code(404);
            echo json_encode(['error' => 'Cliente no encontrado']);
            return;
        }
        if (empty(trim($data['nombre'] ?? ''))) {
            http_response_code(400);
            echo json_encode(['error' => 'El nombre es obligatorio']);
            return;
        }
        $this->repo->update($id, $data);
        echo json_encode($this->repo->getById($id));
    }

    public function destroy(int $id): void {
        if (!$this->repo->getById($id)) {
            http_response_code(404);
            echo json_encode(['error' => 'Cliente no encontrado']);
            return;
        }
        $this->repo->delete($id);
        echo json_encode(['message' => 'Cliente eliminado']);
    }
}