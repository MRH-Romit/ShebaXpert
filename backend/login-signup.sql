-- ShebaXpert Login and Signup Data Export
-- Generated on: 2025-05-31
-- Database: SQLite

-- User Roles
INSERT INTO user_roles (id, role_name, description, created_at) VALUES 
(1, 'admin', 'System Administrator', datetime('now')),
(2, 'user', 'Regular User', datetime('now')),
(3, 'service_provider', 'Service Provider', datetime('now')),
(4, 'moderator', 'Content Moderator', datetime('now'));

-- User Status
INSERT INTO user_status (id, status_name, description, created_at) VALUES 
(1, 'active', 'Active User', datetime('now')),
(2, 'inactive', 'Inactive User', datetime('now')),
(3, 'suspended', 'Suspended User', datetime('now')),
(4, 'pending_verification', 'Pending Email Verification', datetime('now'));

-- Users (signup data will be appended here)
-- Test User
INSERT INTO users (id, firstName, lastName, email, phone, password_hash, role_id, status_id, email_verified, created_at, updated_at) VALUES 
(1, 'Test', 'User', 'test@shebaxpert.com', '+8801712345678', '$2b$12$hash_here', 2, 1, 1, datetime('now'), datetime('now'));

-- New signups will be added below this line by the application
-- Format: INSERT INTO users (firstName, lastName, email, phone, password_hash, role_id, status_id, email_verified, created_at, updated_at) VALUES (...);

-- New signup: john.doe@example.com on 2025-05-31T15:31:08.930Z
INSERT INTO users (id, firstName, lastName, email, phone, password_hash, role_id, status_id, email_verified, created_at, updated_at) VALUES 
(undefined, 'John', 'Doe', 'john.doe@example.com', '+8801712345679', '$2b$12$J7uG7bN/uSKteVmu.8SAR.I3FRekPe7i1cVl55C3l15W0JPWbkMUS', 2, 1, 0, datetime('now'), datetime('now'));

-- New signup: jane.smith.1748705675375@example.com on 2025-05-31T15:34:35.692Z
INSERT INTO users (id, firstName, lastName, email, phone, password_hash, role_id, status_id, email_verified, created_at, updated_at) VALUES 
(undefined, 'Jane', 'Smith', 'jane.smith.1748705675375@example.com', '+8801712345680', '$2b$12$gZAfS2Keg0z1BCr0m68dsuTUghXixX0lTYl7DA1v63T8gy6zqE8jC', 2, 1, 0, datetime('now'), datetime('now'));

-- New signup: jane.smith.1748705752450@example.com on 2025-05-31T15:35:52.785Z
INSERT INTO users (id, firstName, lastName, email, phone, password_hash, role_id, status_id, email_verified, created_at, updated_at) VALUES 
(undefined, 'Jane', 'Smith', 'jane.smith.1748705752450@example.com', '+8801712345680', '$2b$12$bgGjdhwWAdfpi5sojYjS3OtNCKxsgpRDqLoPphe99mCAluwTbdM4.', 2, 1, 0, datetime('now'), datetime('now'));

-- New signup: testuser.1748706283512@example.com on 2025-05-31T15:44:43.814Z
INSERT INTO users (id, firstName, lastName, email, phone, password_hash, role_id, status_id, email_verified, created_at, updated_at) VALUES 
(undefined, 'New', 'User', 'testuser.1748706283512@example.com', '+8801712345999', '$2b$12$/wP57MPmaujgHEKOpUgtYe/O2kbtnA1mlOxVMYAuF0e3U9js.5gR2', 2, 1, 0, datetime('now'), datetime('now'));

-- New signup: testuser20250531221753@example.com on 2025-05-31T16:17:54.113Z
INSERT INTO users (id, firstName, lastName, email, phone, password_hash, role_id, status_id, email_verified, created_at, updated_at) VALUES 
(undefined, 'Test', 'User2', 'testuser20250531221753@example.com', '+8801712345999', '$2b$12$XukqQu4TVRlP10H2Fxmd9uir.SER8HG6LqjLOyFNnUg9XD7w.egDe', 2, 1, 0, datetime('now'), datetime('now'));
