<?php
namespace App\Presentation\Repositories;

use App\Base\Database;
use PDO;

class VehiclesRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getAll(?string $estado = null): array {
        if ($estado) {
            $stmt = $this->db->prepare("SELECT * FROM vehiculos WHERE estado = ? ORDER BY id DESC");
            $stmt->execute([$estado]);
            return $stmt->fetchAll();
        }
        return $this->db->query("SELECT * FROM vehiculos ORDER BY id DESC")->fetchAll();
    }

    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM vehiculos WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare(
            "INSERT INTO vehiculos (marca, modelo, anio, categoria, estado) VALUES (?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $data['marca'],
            $data['modelo'],
            $data['anio'],
            $data['categoria'] ?? null,
            $data['estado'] ?? 'disponible'
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool {
        $stmt = $this->db->prepare(
            "UPDATE vehiculos SET marca = ?, modelo = ?, anio = ?, categoria = ?, estado = ? WHERE id = ?"
        );
        return $stmt->execute([
            $data['marca'],
            $data['modelo'],
            $data['anio'],
            $data['categoria'] ?? null,
            $data['estado'] ?? 'disponible',
            $id
        ]);
    }

    public function updateEstado(int $id, string $estado): bool {
        $stmt = $this->db->prepare("UPDATE vehiculos SET estado = ? WHERE id = ?");
        return $stmt->execute([$estado, $id]);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM vehiculos WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
