-- Update all motorbikes with their respective brand logos from local assets
UPDATE motorbikes 
SET image_url = CASE brand
    WHEN 'Honda' THEN '/assets/honda.jpg'
    WHEN 'Yamaha' THEN '/assets/yamaha.jpeg'
    WHEN 'Kawasaki' THEN '/assets/kawasaki.jpg'
    WHEN 'Ducati' THEN '/assets/ducati.jpg'
    WHEN 'BMW' THEN '/assets/bmw.png'
    WHEN 'Harley Davidson' THEN '/assets/harley.png'
END; 