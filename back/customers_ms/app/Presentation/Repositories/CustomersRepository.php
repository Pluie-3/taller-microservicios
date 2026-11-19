<?php
namespace App\Presentation\Repositories;

use App\Base\Database;
use PDO;

class CustomersRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getAll(): array {
        return $this->db->query("SELECT *, correo AS email FROM clientes ORDER BY id DESC")->fetchAll();
    }

    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT *, correo AS email FROM clientes WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare(
            "INSERT INTO clientes (nombre, telefono, correo, numero_licencia) VALUES (?, ?, ?, ?)"
        );
        $stmt->execute([
            $data['nombre'],
            $data['telefono'] ?? null,
            $data['email'] ?? $data['correo'] ?? null,
            $data['numero_licencia'] ?? null
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool {
        $stmt = $this->db->prepare(
            "UPDATE clientes SET nombre = ?, telefono = ?, correo = ?, numero_licencia = ? WHERE id = ?"
        );
        return $stmt->execute([
            $data['nombre'],
            $data['telefono'] ?? null,
            $data['email'] ?? $data['correo'] ?? null,
            $data['numero_licencia'] ?? null,
            $id
        ]);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM clientes WHERE id = ?");
        return $stmt->execute([$id]);
    }
}