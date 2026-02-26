-- Seed weather data for major Indian states
INSERT INTO weather_data (state, temperature, humidity, wind_speed, rainfall, alert_level) VALUES
('Andhra Pradesh', 32.5, 65, 12.3, 5.2, 'medium'),
('Arunachal Pradesh', 28.1, 72, 8.5, 15.3, 'low'),
('Assam', 27.8, 78, 6.2, 22.1, 'high'),
('Bihar', 35.2, 58, 10.1, 2.1, 'medium'),
('Chhattisgarh', 33.7, 60, 9.8, 3.5, 'medium'),
('Goa', 31.2, 85, 15.6, 45.2, 'high'),
('Gujarat', 34.8, 55, 14.2, 1.3, 'low'),
('Haryana', 36.5, 45, 12.5, 0.8, 'low'),
('Himachal Pradesh', 22.3, 68, 8.9, 8.5, 'low'),
('Jharkhand', 32.9, 62, 11.2, 4.8, 'medium'),
('Karnataka', 29.5, 68, 10.3, 6.2, 'medium'),
('Kerala', 28.7, 80, 9.4, 35.6, 'high'),
('Madhya Pradesh', 34.2, 52, 11.5, 2.4, 'medium'),
('Maharashtra', 31.8, 65, 13.2, 8.9, 'medium'),
('Manipur', 26.4, 75, 7.8, 18.3, 'medium'),
('Meghalaya', 25.9, 82, 9.2, 42.1, 'critical'),
('Mizoram', 26.1, 80, 8.4, 38.5, 'high'),
('Nagaland', 24.8, 76, 7.5, 25.2, 'high'),
('Odisha', 30.2, 70, 11.8, 12.5, 'high'),
('Punjab', 34.1, 50, 10.9, 1.2, 'low'),
('Rajasthan', 38.2, 42, 16.3, 0.5, 'low'),
('Sikkim', 20.5, 75, 8.1, 20.3, 'medium'),
('Tamil Nadu', 32.1, 70, 12.4, 4.8, 'medium'),
('Telangana', 33.2, 66, 11.9, 6.3, 'medium'),
('Tripura', 27.3, 78, 7.3, 28.4, 'high'),
('Uttar Pradesh', 33.8, 56, 10.2, 3.1, 'medium'),
('Uttarakhand', 23.7, 70, 9.5, 12.8, 'medium'),
('West Bengal', 29.8, 72, 10.6, 14.2, 'high');

-- Seed risk assessments
INSERT INTO risk_assessments (state, risk_score, risk_level, confidence_level, analysis_text) VALUES
('Andhra Pradesh', 65.0, 'high', 85.0, 'Moderate flooding risk due to rainfall patterns'),
('Arunachal Pradesh', 42.0, 'medium', 78.0, 'Landslide potential with moderate risk'),
('Assam', 78.0, 'critical', 92.0, 'Critical flood risk during monsoon season'),
('Bihar', 58.0, 'medium', 82.0, 'Riverine flood risk in low-lying areas'),
('Chhattisgarh', 52.0, 'medium', 79.0, 'Moderate wildfire and flood risk'),
('Goa', 71.0, 'high', 88.0, 'High coastal flood and storm surge risk'),
('Gujarat', 38.0, 'low', 75.0, 'Minimal risk currently'),
('Haryana', 32.0, 'low', 70.0, 'Low risk, drought monitoring'),
('Himachal Pradesh', 45.0, 'medium', 81.0, 'Avalanche and landslide risks'),
('Jharkhand', 55.0, 'medium', 80.0, 'Moderate flood risk'),
('Karnataka', 48.0, 'medium', 77.0, 'Monsoon flooding concerns'),
('Kerala', 82.0, 'critical', 95.0, 'Critical flood and landslide risk'),
('Madhya Pradesh', 50.0, 'medium', 76.0, 'Moderate seasonal risk'),
('Maharashtra', 61.0, 'high', 84.0, 'High flooding and landslide potential'),
('Manipur', 68.0, 'high', 81.0, 'Earthquake and flood risk'),
('Meghalaya', 88.0, 'critical', 96.0, 'Critical flooding risk - highest rainfall area'),
('Mizoram', 75.0, 'high', 89.0, 'High landslide and flood risk'),
('Nagaland', 72.0, 'high', 86.0, 'Earthquake and landslide risk'),
('Odisha', 76.0, 'high', 91.0, 'Cyclone and flood risk - coastal state'),
('Punjab', 35.0, 'low', 71.0, 'Low seasonal risk'),
('Rajasthan', 28.0, 'low', 68.0, 'Very low flood risk'),
('Sikkim', 58.0, 'medium', 83.0, 'Earthquake and landslide risks'),
('Tamil Nadu', 54.0, 'medium', 79.0, 'Monsoon and cyclone risk'),
('Telangana', 52.0, 'medium', 77.0, 'Moderate flood risk'),
('Tripura', 70.0, 'high', 87.0, 'High flood and landslide risk'),
('Uttar Pradesh', 56.0, 'medium', 81.0, 'Moderate flood risk'),
('Uttarakhand', 62.0, 'high', 85.0, 'Cloudbursts and avalanche risk'),
('West Bengal', 73.0, 'high', 90.0, 'High cyclone and flood risk - coastal');

-- Seed resources
INSERT INTO resources (name, category, total_quantity, current_quantity, location, status) VALUES
('Emergency Shelters', 'Infrastructure', 500, 450, 'Distributed Across States', 'available'),
('Medical Teams', 'Personnel', 200, 180, 'Regional Centers', 'available'),
('Rescue Boats', 'Equipment', 150, 140, 'Coastal & Riverine Regions', 'available'),
('Helicopters', 'Transport', 25, 23, 'National Depots', 'available'),
('Generator Sets', 'Equipment', 1000, 850, 'Various Locations', 'available'),
('Water Purification Units', 'Equipment', 300, 270, 'Field Stations', 'available'),
('Food Rations', 'Supplies', 50000, 42000, 'Distribution Centers', 'available'),
('Medical Supplies', 'Supplies', 20000, 18500, 'Hospitals', 'available'),
('Communication Equipment', 'Equipment', 400, 380, 'Control Centers', 'available'),
('Search & Rescue Dogs', 'Personnel', 50, 48, 'Training Centers', 'available');

-- Seed shelters
INSERT INTO shelters (name, location, state, capacity, current_occupancy, status, coordinates) VALUES
('Disaster Relief Camp - North Delhi', 'Red Fort Grounds', 'Delhi', 5000, 2100, 'operational', '{"lat": 28.6562, "lng": 77.2410}'),
('Community Center Shelter - Mumbai', 'Bandra Sports Complex', 'Maharashtra', 3000, 1200, 'operational', '{"lat": 19.0596, "lng": 72.8295}'),
('State Stadium Shelter - Kolkata', 'Eden Gardens Complex', 'West Bengal', 4000, 1800, 'operational', '{"lat": 22.5651, "lng": 88.3629}'),
('Relief Camp - Chennai', 'Marina Beach Area', 'Tamil Nadu', 3500, 1450, 'operational', '{"lat": 13.0499, "lng": 80.2824}'),
('Emergency Shelter - Bangalore', 'Kanteerava Stadium', 'Karnataka', 2500, 900, 'operational', '{"lat": 13.0828, "lng": 77.5768}'),
('Disaster Camp - Hyderabad', 'Necklace Road Complex', 'Telangana', 2800, 1100, 'operational', '{"lat": 17.3850, "lng": 78.4867}'),
('Relief Center - Pune', 'Balewadi Sports Complex', 'Maharashtra', 2200, 800, 'operational', '{"lat": 18.5626, "lng": 73.8143}'),
('Emergency Shelter - Ahmedabad', 'Sabarmati Riverfront', 'Gujarat', 2000, 600, 'operational', '{"lat": 23.1815, "lng": 72.6369}'),
('Flood Relief Camp - Guwahati', 'Sarusajai Stadium', 'Assam', 2500, 2000, 'full', '{"lat": 26.1445, "lng": 91.7362}'),
('Disaster Relief - Jaipur', 'Central Park', 'Rajasthan', 1800, 450, 'operational', '{"lat": 26.9048, "lng": 75.7713}');

-- Seed action plans
INSERT INTO action_plans (title, description, state, status, priority) VALUES
('Flood Management - Assam', 'Coordinate flood relief and evacuation for Assam', 'Assam', 'in_progress', 'critical'),
('Landslide Response - Himachal Pradesh', 'Deploy resources for landslide-prone areas', 'Himachal Pradesh', 'pending', 'high'),
('Cyclone Preparedness - Odisha', 'Prepare coastal areas for potential cyclone', 'Odisha', 'in_progress', 'high'),
('Earthquake Response - Sikkim', 'Emergency response protocol for earthquake zones', 'Sikkim', 'pending', 'high'),
('Heatwave Management', 'Distribute cooling centers and medical aid', 'Rajasthan', 'in_progress', 'medium'),
('Water Scarcity Relief', 'Supply potable water to drought-affected areas', 'Rajasthan', 'pending', 'high'),
('Winter Preparedness - Uttarakhand', 'Prepare for avalanche and harsh weather', 'Uttarakhand', 'pending', 'medium'),
('Coastal Protection - Kerala', 'Storm surge and flooding prevention measures', 'Kerala', 'in_progress', 'critical');

-- Seed action plan steps (for the first action plan)
INSERT INTO action_plan_steps (plan_id, step_number, description, completed) 
SELECT id, 1, 'Activate emergency operations center', TRUE FROM action_plans WHERE title = 'Flood Management - Assam'
UNION ALL
SELECT id, 2, 'Deploy medical teams to affected areas', TRUE FROM action_plans WHERE title = 'Flood Management - Assam'
UNION ALL
SELECT id, 3, 'Establish evacuation routes', FALSE FROM action_plans WHERE title = 'Flood Management - Assam'
UNION ALL
SELECT id, 4, 'Coordinate with local authorities', FALSE FROM action_plans WHERE title = 'Flood Management - Assam'
UNION ALL
SELECT id, 5, 'Monitor water levels continuously', FALSE FROM action_plans WHERE title = 'Flood Management - Assam';

-- Seed alerts
INSERT INTO alerts (title, description, location, severity, alert_type, status) VALUES
('Severe Flooding Alert', 'Heavy rainfall causing severe flooding in low-lying areas', 'Assam - Brahmaputra Valley', 'critical', 'flood', 'active'),
('Landslide Warning', 'High-risk landslide warning for mountain slopes', 'Himachal Pradesh - Kinnaur District', 'high', 'landslide', 'active'),
('Cyclone Watch', 'Cyclone watch issued for coastal areas', 'Odisha - Bay of Bengal Coast', 'high', 'cyclone', 'active'),
('Heat Wave Alert', 'Severe heat wave conditions expected', 'Rajasthan - Jaisalmer', 'medium', 'heat_wave', 'active'),
('Flash Flood Warning', 'Flash flood warning for river basins', 'Kerala - Western Ghats', 'high', 'flood', 'active'),
('Wind Advisory', 'Strong wind advisory issued', 'Gujarat - Kutch Region', 'low', 'wind', 'acknowledged'),
('Earthquake Alert', 'Minor earthquake detected', 'Sikkim - Kanchendzonga Region', 'medium', 'earthquake', 'acknowledged'),
('Avalanche Risk', 'Avalanche risk in mountainous areas', 'Uttarakhand - Greater Himalayas', 'high', 'avalanche', 'active');

-- Display confirmation
SELECT 'Database seeded successfully!' as status,
       (SELECT COUNT(*) FROM weather_data) as weather_records,
       (SELECT COUNT(*) FROM risk_assessments) as risk_records,
       (SELECT COUNT(*) FROM resources) as resource_records,
       (SELECT COUNT(*) FROM shelters) as shelter_records,
       (SELECT COUNT(*) FROM action_plans) as action_plan_records,
       (SELECT COUNT(*) FROM alerts) as alert_records;
