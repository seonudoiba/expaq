-- This file will automatically run when Spring Boot starts (for H2, HSQLDB, or when spring.sql.init.mode=always)
-- Production-ready seed data for Expaq Travel Platform

-- Insert Roles
INSERT INTO role (name, description) VALUES 
('ADMIN', 'System Administrator'),
('USER', 'Regular User'),
('GUIDE', 'Tour Guide'),
('VENDOR', 'Activity Vendor')
ON CONFLICT (name) DO NOTHING;

-- Insert Countries
INSERT INTO country (name, code, phone_code) VALUES
('United States', 'US', '+1'),
('United Kingdom', 'GB', '+44'),
('France', 'FR', '+33'),
('Japan', 'JP', '+81'),
('Italy', 'IT', '+39'),
('Spain', 'ES', '+34'),
('Thailand', 'TH', '+66'),
('Australia', 'AU', '+61'),
('Greece', 'GR', '+30'),
('Mexico', 'MX', '+52')
ON CONFLICT (code) DO NOTHING;

-- Insert Cities (assuming country IDs are sequential starting from 1)
INSERT INTO city (name, country_id, postal_code, timezone) VALUES
('New York', 1, '10001', 'America/New_York'),
('Los Angeles', 1, '90001', 'America/Los_Angeles'),
('Miami', 1, '33101', 'America/New_York'),
('London', 2, 'SW1', 'Europe/London'),
('Paris', 3, '75001', 'Europe/Paris'),
('Tokyo', 4, '100-0001', 'Asia/Tokyo'),
('Rome', 5, '00100', 'Europe/Rome'),
('Barcelona', 6, '08001', 'Europe/Madrid'),
('Bangkok', 7, '10100', 'Asia/Bangkok'),
('Sydney', 8, '2000', 'Australia/Sydney'),
('Athens', 9, '105 57', 'Europe/Athens'),
('Cancun', 10, '77500', 'America/Cancun')
ON CONFLICT DO NOTHING;

-- Insert Activity Types
INSERT INTO activity_type (name, description, icon) VALUES
('Sightseeing', 'Explore iconic landmarks and attractions', '🏛️'),
('Adventure', 'Thrilling outdoor experiences', '🏔️'),
('Cultural', 'Immerse in local culture and traditions', '🎭'),
('Food & Wine', 'Culinary experiences and tastings', '🍷'),
('Water Sports', 'Beach and water activities', '🏄'),
('Wildlife', 'Animal encounters and safaris', '🦁'),
('Wellness', 'Spa and relaxation experiences', '🧘'),
('Nightlife', 'Evening entertainment and clubs', '🌃'),
('Photography', 'Capture stunning moments with expert guidance', '📸'),
('Shopping', 'Local markets and shopping districts', '🛍️')
ON CONFLICT DO NOTHING;

-- Default admin user (password: Admin123!)
-- Note: Password should be bcrypt encoded - this is just an example
-- In production, use proper password encoding
INSERT INTO users (email, password, first_name, last_name, phone_number, role_id, city_id, email_verified, active, created_at, updated_at) VALUES
('admin@expaq.com', '$2a$10$YourBcryptHashHere', 'Admin', 'User', '+1234567890', 1, 1, true, true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;