<?php
namespace App\Repositories;

use App\Base\Database;
use PDO;

class RentalsRepository
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function getAll(): array
    {
        $sql = "SELECT r.*, c.nombre AS cliente_nombre, v.marca AS vehiculo_marca, v.modelo AS vehiculo_modelo
                FROM reservas r
                INNER JOIN clientes c ON r.cliente_id = c.id
                INNER JOIN vehiculos v ON r.vehiculo_id = v.id
                ORDER BY r.id DESC";
        return $this->db->query($sql)->fetchAll();
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM reservas WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function getHistory(string $tipo, int $id): array
    {
        $col = $tipo === 'cliente' ? 'cliente_id' : 'vehiculo_id';
        $stmt = $this->db->prepare("SELECT * FROM reservas WHERE {$col} = ? ORDER BY fecha_inicio DESC");
        $stmt->execute([$id]);
        return $stmt->fetchAll();
    }

    public function getAvailableByDate(string $fecha): array
    {
        $sql = "SELECT v.* FROM vehiculos v
                WHERE v.estado <> 'mantenimiento'
                  AND NOT EXISTS (
                      SELECT 1 FROM reservas r
                      WHERE r.vehiculo_id = v.id
                        AND r.estado IN ('reservado', 'en_curso')
                        AND :fecha BETWEEN r.fecha_inicio AND r.fecha_fin
                  )
                ORDER BY v.id ASC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':fecha' => $fecha]);
        return $stmt->fetchAll();
    }

    public function hasDateOverlap(int $vehiculoId, string $fechaInicio, string $fechaFin): bool
    {
        $sql = "SELECT COUNT(*) FROM reservas
                WHERE vehiculo_id = :vehiculo_id
                  AND estado IN ('reservado', 'en_curso')
                  AND fecha_inicio <= :fecha_fin
                  AND fecha_fin >= :fecha_inicio";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':vehiculo_id' => $vehiculoId,
            ':fecha_inicio' => $fechaInicio,
            ':fecha_fin' => $fechaFin,
        ]);
        return (int) $stmt->fetchColumn() > 0;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            "INSERT INTO reservas (cliente_id, vehiculo_id, fecha_inicio, fecha_fin, estado)
             VALUES (?, ?, ?, ?, 'reservado')"
        );
        $stmt->execute([
            (int) $data['cliente_id'],
            (int) $data['vehiculo_id'],
            $data['fecha_inicio'],
            $data['fecha_fin'],
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function updateStatus(int $id, string $estado): ?array
    {
        $stmt = $this->db->prepare("UPDATE reservas SET estado = ? WHERE id = ?");
        $stmt->execute([$estado, $id]);
        return $this->findById($id);
    }

    public function finish(int $id, string $fechaDevolucion): ?array
    {
        $stmt = $this->db->prepare("UPDATE reservas SET estado = 'devuelto', fecha_devolucion = ? WHERE id = ?");
        $stmt->execute([$fechaDevolucion, $id]);
        return $this->findById($id);
    }
}