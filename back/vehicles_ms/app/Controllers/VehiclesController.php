<?php
require_once __DIR__ . '/../Base/database.php';

class VehiclesController {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    public function index() {
        try {
            $query = "SELECT * FROM vehiculos"; 
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $vehicles = $stmt->fetchAll(PDO::FETCH_ASSOC);

            header('Content-Type: application/json');
            echo json_encode($vehicles);
        } catch (Exception $e) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
    }
}