-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create motorbikes table
CREATE TABLE IF NOT EXISTS motorbikes (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    motorbike_id INTEGER REFERENCES motorbikes(id),
    quantity INTEGER NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample motorbikes with more models and Harley Davidson
INSERT INTO motorbikes (brand, model, year, price, description, image_url, stock) VALUES
    -- Honda models
    ('Honda', 'CBR 1000RR', 2023, 15999.99, 'High-performance sport bike with advanced technology and aerodynamic design. Features a 998cc inline-four engine producing 214 horsepower.', 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 5),
    ('Honda', 'CB 650R', 2023, 8999.99, 'Modern naked bike with a 649cc inline-four engine. Perfect balance of performance and comfort for daily riding.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 8),
    ('Honda', 'Africa Twin', 2023, 14999.99, 'Adventure touring bike designed for both on-road and off-road exploration. Features a 1084cc twin-cylinder engine.', 'https://images.unsplash.com/photo-1595854348181-88c9e9c2f0e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 6),
    ('Honda', 'Gold Wing', 2023, 27999.99, 'Ultimate touring motorcycle with luxury features. Powered by a 1833cc flat-six engine with 125 horsepower.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 4),
    ('Honda', 'Rebel 500', 2023, 6499.99, 'Entry-level cruiser with a 471cc parallel-twin engine. Perfect for beginners and urban commuting.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 10),
    
    -- Yamaha models
    ('Yamaha', 'MT-07', 2023, 7999.99, 'Versatile naked bike perfect for urban riding. Features a 689cc twin-cylinder engine with excellent torque.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 8),
    ('Yamaha', 'YZF-R1', 2023, 17999.99, 'Superbike with a 998cc crossplane inline-four engine producing 200 horsepower. Advanced electronics for track performance.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 5),
    ('Yamaha', 'Tracer 900 GT', 2023, 12999.99, 'Sport touring bike with a 847cc triple-cylinder engine. Comfortable for long-distance riding with advanced features.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 7),
    ('Yamaha', 'XSR700', 2023, 8999.99, 'Modern classic with retro styling. Powered by the same 689cc twin-cylinder engine as the MT-07.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 6),
    ('Yamaha', 'Tenere 700', 2023, 9999.99, 'Adventure bike designed for off-road exploration. Features a 689cc twin-cylinder engine with long-travel suspension.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 4),
    
    -- Kawasaki models
    ('Kawasaki', 'Ninja 650', 2023, 7499.99, 'Sporty yet comfortable middleweight sportbike. Features a 649cc parallel-twin engine with good fuel efficiency.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 6),
    ('Kawasaki', 'Ninja ZX-10R', 2023, 16999.99, 'Superbike with a 998cc inline-four engine producing 203 horsepower. Advanced electronics for track performance.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 5),
    ('Kawasaki', 'Versys 1000', 2023, 12999.99, 'Adventure touring bike with a 1043cc inline-four engine. Comfortable for long-distance riding with luggage capacity.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 7),
    ('Kawasaki', 'Z900', 2023, 8999.99, 'Naked bike with a 948cc inline-four engine. Sporty handling with comfortable ergonomics.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 8),
    ('Kawasaki', 'W800', 2023, 9999.99, 'Classic retro-styled bike with a 773cc twin-cylinder engine. Timeless design with modern reliability.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 4),
    
    -- Ducati models
    ('Ducati', 'Monster', 2023, 11999.99, 'Italian style and performance in a naked bike. Features a 937cc L-twin engine with 111 horsepower.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 4),
    ('Ducati', 'Panigale V4', 2023, 27999.99, 'Superbike with a 1103cc V4 engine producing 214 horsepower. Advanced electronics and aerodynamics for track performance.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 3),
    ('Ducati', 'Multistrada V4', 2023, 22999.99, 'Adventure touring bike with a 1158cc V4 engine. Comfortable for long-distance riding with advanced features.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 5),
    ('Ducati', 'Scrambler', 2023, 9999.99, 'Modern interpretation of a classic design. Features a 803cc L-twin engine with a retro style.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 6),
    ('Ducati', 'Streetfighter V4', 2023, 19999.99, 'Naked bike with a 1103cc V4 engine producing 208 horsepower. Sporty handling with aggressive styling.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 4),
    
    -- BMW models
    ('BMW', 'R 1250 GS', 2023, 18999.99, 'Adventure touring bike ready for any journey. Features a 1254cc boxer engine with BMW''s ShiftCam technology.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 3),
    ('BMW', 'S 1000 RR', 2023, 19999.99, 'Superbike with a 999cc inline-four engine producing 207 horsepower. Advanced electronics for track performance.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 4),
    ('BMW', 'F 900 R', 2023, 10999.99, 'Naked bike with a 895cc parallel-twin engine. Sporty handling with comfortable ergonomics.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 7),
    ('BMW', 'R 18', 2023, 17999.99, 'Cruiser with a 1802cc boxer engine. Classic design with modern technology.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 5),
    ('BMW', 'M 1000 RR', 2023, 32999.99, 'Superbike with a 999cc inline-four engine producing 212 horsepower. Advanced electronics and aerodynamics for track performance.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 2),
    
    -- Harley Davidson models
    ('Harley Davidson', 'Street Glide', 2023, 27999.99, 'Touring motorcycle with a 114ci Milwaukee-Eight engine. Comfortable for long-distance riding with advanced features.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 5),
    ('Harley Davidson', 'Road King', 2023, 24999.99, 'Classic touring motorcycle with a 114ci Milwaukee-Eight engine. Timeless design with modern reliability.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 4),
    ('Harley Davidson', 'Softail', 2023, 18999.99, 'Cruiser with a 114ci Milwaukee-Eight engine. Classic design with modern technology.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 6),
    ('Harley Davidson', 'Sport Glide', 2023, 22999.99, 'Touring motorcycle with a 114ci Milwaukee-Eight engine. Sporty handling with comfortable ergonomics.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 5),
    ('Harley Davidson', 'Fat Boy', 2023, 19999.99, 'Cruiser with a 114ci Milwaukee-Eight engine. Classic design with modern technology.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 4),
    ('Harley Davidson', 'Road Glide', 2023, 28999.99, 'Touring motorcycle with a 114ci Milwaukee-Eight engine. Comfortable for long-distance riding with advanced features.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 3),
    ('Harley Davidson', 'Street Bob', 2023, 16999.99, 'Cruiser with a 114ci Milwaukee-Eight engine. Classic design with modern technology.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 7),
    ('Harley Davidson', 'Heritage Classic', 2023, 21999.99, 'Touring motorcycle with a 114ci Milwaukee-Eight engine. Classic design with modern technology.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 5),
    ('Harley Davidson', 'Low Rider', 2023, 18999.99, 'Cruiser with a 114ci Milwaukee-Eight engine. Sporty handling with comfortable ergonomics.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 6),
    ('Harley Davidson', 'Street Glide Special', 2023, 29999.99, 'Touring motorcycle with a 114ci Milwaukee-Eight engine. Comfortable for long-distance riding with advanced features.', 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 4); 