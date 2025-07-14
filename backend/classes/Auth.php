<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require_once __DIR__ . '/../db/connect.php';

class Auth {
    private $db;
    private $sessionTimeout = 3600; 
    
    public function __construct() {
        $this->db = new Database();
        $this->startSession();
    }
    
    private function startSession() {
        if (session_status() === PHP_SESSION_NONE) {
            // Configure session settings
            ini_set('session.cookie_httponly', 1);
            ini_set('session.use_only_cookies', 1);
            ini_set('session.cookie_secure', isset($_SERVER['HTTPS']));
            
            session_start();
            
            // Session timeout Checkk
            if (isset($_SESSION['last_activity']) && 
                (time() - $_SESSION['last_activity'] > $this->sessionTimeout)) {
                $this->logout();
            }
            
            $_SESSION['last_activity'] = time();
        }
    }
    
    public function register($username, $email, $password, $firstName = '', $lastName = '') {
        try {
            if (empty($username) || empty($email) || empty($password)) {
                throw new Exception('All required fields must be filled');
            }
            
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                throw new Exception('Invalid email format');
            }
            
            if (strlen($password) < 6) {
                throw new Exception('Password must be at least 6 characters long');
            }
            
            // Check if user already exists
            $existingUser = $this->db->fetchOne(
                "SELECT id FROM users WHERE username = ? OR email = ?", 
                [$username, $email]
            );
            
            if ($existingUser) {
                throw new Exception('Username or email already exists');
            }
            
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            
            $sql = "INSERT INTO users (username, email, password_hash, first_name, last_name) 
                    VALUES (?, ?, ?, ?, ?)";
            
            $userId = $this->db->insert($sql, [
                $username, $email, $passwordHash, $firstName, $lastName
            ]);
            
            return [
                'success' => true,
                'user_id' => $userId,
                'message' => 'Registration successful'
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
    
    public function login($usernameOrEmail, $password) {
        try {
            if (empty($usernameOrEmail) || empty($password)) {
                throw new Exception('Username/email and password are required');
            }
            
            $sql = "SELECT id, username, email, password_hash, first_name, last_name, role, is_active 
                    FROM users 
                    WHERE (username = ? OR email = ?) AND is_active = 1";
            
            $user = $this->db->fetchOne($sql, [$usernameOrEmail, $usernameOrEmail]);
            
            if (!$user) {
                throw new Exception('Invalid credentials');
            }
            
            if (!password_verify($password, $user['password_hash'])) {
                throw new Exception('Invalid credentials');
            }
            
            $this->createUserSession($user);
            
            $this->db->update(
                "UPDATE users SET last_login = NOW() WHERE id = ?", 
                [$user['id']]
            );
            
            return [
                'success' => true,
                'user' => $this->getUserSessionData($user),
                'message' => 'Login successful'
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
    
    private function createUserSession($user) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['full_name'] = trim($user['first_name'] . ' ' . $user['last_name']);
        $_SESSION['logged_in'] = true;
        $_SESSION['login_time'] = time();
        
        $this->storeSessionInDB($user['id']);
    }
    
    private function storeSessionInDB($userId) {
        try {
            $sessionId = session_id();
            $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '';
            $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
            $expiresAt = date('Y-m-d H:i:s', time() + $this->sessionTimeout);
            
            // clean OLF session
            $this->db->delete(
                "DELETE FROM user_sessions WHERE user_id = ? OR expires_at < NOW()", 
                [$userId]
            );
            
            // Add new session
            $this->db->insert(
                "INSERT INTO user_sessions (user_id, session_id, ip_address, user_agent, expires_at) 
                 VALUES (?, ?, ?, ?, ?)",
                [$userId, $sessionId, $ipAddress, $userAgent, $expiresAt]
            );
        } catch (Exception $e) {

            error_log("Session storage error: " . $e->getMessage());
        }
    }
    
    private function getUserSessionData($user) {
        return [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'role' => $user['role'],
            'full_name' => trim($user['first_name'] . ' ' . $user['last_name'])
        ];
    }
    
    public function logout() {
        if (isset($_SESSION['user_id'])) {
            // Remove session ffrom DB
            $this->db->delete(
                "DELETE FROM user_sessions WHERE session_id = ?", 
                [session_id()]
            );
        }
        
        // Clear session data
        $_SESSION = array();
        
        // Delete session cookie
        if (isset($_COOKIE[session_name()])) {
            setcookie(session_name(), '', time() - 3600, '/');
        }
        
        // Destroy session
        session_destroy();
        
        return [
            'success' => true,
            'message' => 'Logged out successfully'
        ];
    }
    
    public function isLoggedIn() {
        return isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
    }
    
    public function getCurrentUser() {
        if (!$this->isLoggedIn()) {
            return null;
        }
        
        return [
            'id' => $_SESSION['user_id'] ?? null,
            'username' => $_SESSION['username'] ?? null,
            'email' => $_SESSION['email'] ?? null,
            'role' => $_SESSION['role'] ?? 'user',
            'full_name' => $_SESSION['full_name'] ?? null
        ];
    }
    
    public function requireLogin() {
        if (!$this->isLoggedIn()) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'error' => 'Authentication required',
                'redirect' => '/login'
            ]);
            exit();
        }
    }
    
    public function requireRole($requiredRole) {
        $this->requireLogin();
        
        if (($_SESSION['role'] ?? '') !== $requiredRole && ($_SESSION['role'] ?? '') !== 'admin') {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'error' => 'Insufficient permissions'
            ]);
            exit();
        }
    }
    
    public function changePassword($currentPassword, $newPassword) {
        try {
            $this->requireLogin();
            
            if (strlen($newPassword) < 6) {
                throw new Exception('New password must be at least 6 characters long');
            }
            
            // Get current user's password hash
            $user = $this->db->fetchOne(
                "SELECT password_hash FROM users WHERE id = ?", 
                [$_SESSION['user_id']]
            );
            
            if (!$user || !password_verify($currentPassword, $user['password_hash'])) {
                throw new Exception('Current password is incorrect');
            }
            
            // Update password
            $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);
            $this->db->update(
                "UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?",
                [$newPasswordHash, $_SESSION['user_id']]
            );
            
            return [
                'success' => true,
                'message' => 'Password changed successfully'
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
    
    public function updateProfile($firstName, $lastName, $email) {
        try {
            $this->requireLogin();
            
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                throw new Exception('Invalid email format');
            }
            
            // Check if email is already taken by another user
            $existingUser = $this->db->fetchOne(
                "SELECT id FROM users WHERE email = ? AND id != ?", 
                [$email, $_SESSION['user_id']]
            );
            
            if ($existingUser) {
                throw new Exception('Email is already taken');
            }
            
            // Update profile
            $this->db->update(
                "UPDATE users SET first_name = ?, last_name = ?, email = ?, updated_at = NOW() WHERE id = ?",
                [$firstName, $lastName, $email, $_SESSION['user_id']]
            );
            
            // Update session data
            $_SESSION['email'] = $email;
            $_SESSION['full_name'] = trim($firstName . ' ' . $lastName);
            
            return [
                'success' => true,
                'message' => 'Profile updated successfully'
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}
?>
