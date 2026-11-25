<?php
namespace App\Controllers;

use App\Presentation\Repositories\CustomersRepository;
use PDOException;

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
        $error = $this->validarDatos($data);
        if ($error !== null) {
            http_response_code(400);
            echo json_encode(['error' => $error]);
            return;
        }
        try {
            $id = $this->repo->create($data);
            http_response_code(201);
            echo json_encode($this->repo->getById($id));
        } catch (PDOException $e) {
            http_response_code(409);
            echo json_encode(['error' => 'El correo o número de licencia ya está registrado']);
        }
    }

    public function update(int $id, array $data): void {
        if (!$this->repo->getById($id)) {
            http_response_code(404);
            echo json_encode(['error' => 'Cliente no encontrado']);
            return;
        }
        $error = $this->validarDatos($data);
        if ($error !== null) {
            http_response_code(400);
            echo json_encode(['error' => $error]);
            return;
        }
        try {
            $this->repo->update($id, $data);
            echo json_encode($this->repo->getById($id));
        } catch (PDOException $e) {
            http_response_code(409);
            echo json_encode(['error' => 'El correo o número de licencia ya está registrado']);
        }
    }

    public function destroy(int $id): void {
        if (!$this->repo->getById($id)) {
            http_response_code(404);
            echo json_encode(['error' => 'Cliente no encontrado']);
            return;
        }
        try {
            $this->repo->delete($id);
            echo json_encode(['message' => 'Cliente eliminado']);
        } catch (PDOException $e) {
            http_response_code(409);
            echo json_encode(['error' => 'No se puede eliminar el cliente porque tiene alquileres asociados']);
        }
    }

    private function validarDatos(array $data): ?string {
        if (trim((string)($data['nombre'] ?? '')) === '') {
            return 'El nombre es obligatorio';
        }
        if (trim((string)($data['numero_licencia'] ?? '')) === '') {
            return 'El número de licencia es obligatorio';
        }
        $telefono = trim((string)($data['telefono'] ?? ''));
        if ($telefono === '' || !ctype_digit($telefono)) {
            return 'El teléfono es obligatorio y debe contener solo números';
        }
        $correo = trim((string)($data['email'] ?? $data['correo'] ?? ''));
        if ($correo === '' || !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
            return 'Debe ingresar un correo electrónico válido';
        }
        return null;
    }
}