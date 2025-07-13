-- Insert sample donation centers data
INSERT INTO donation_centers (id, name, address, phone, email, is_active, created_at, updated_at) VALUES
-- Hanoi Centers
(gen_random_uuid(), 'Viện Huyết học - Truyền máu Trung ương', '26 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội', '024 3868 5173', 'contact@viemhuyethoc.vn', true, NOW(), NOW()),
(gen_random_uuid(), 'Bệnh viện Bạch Mai', '78 Giải Phóng, Đống Đa, Hà Nội', '024 3869 3731', 'info@bachmai.edu.vn', true, NOW(), NOW()),
(gen_random_uuid(), 'Bệnh viện Việt Đức', '40 Tràng Thi, Hoàn Kiếm, Hà Nội', '024 3825 3531', 'contact@bvdaihocyduoc.vn', true, NOW(), NOW()),
(gen_random_uuid(), 'Bệnh viện E', '89 Trần Cung, Cầu Giấy, Hà Nội', '024 3754 3832', 'info@benhviene.org.vn', true, NOW(), NOW()),
(gen_random_uuid(), 'Bệnh viện Nhi Trung ương', '18/879 La Thành, Đống Đa, Hà Nội', '024 6273 8532', 'contact@benhviennhitrunguong.org.vn', true, NOW(), NOW()),

-- Ho Chi Minh City Centers
(gen_random_uuid(), 'Viện Huyết học - Truyền máu TP.HCM', '118 Hồng Bàng, Quận 5, TP.HCM', '028 3955 1346', 'info@bthh.org.vn', true, NOW(), NOW()),
(gen_random_uuid(), 'Bệnh viện Chợ Rẫy', '201B Nguyễn Chí Thanh, Quận 5, TP.HCM', '028 3855 4137', 'info@choray.vn', true, NOW(), NOW()),
(gen_random_uuid(), 'Bệnh viện Nhân dân 115', '527 Sư Vạn Hạnh, Quận 10, TP.HCM', '028 3865 4249', 'info@benhvien115.com.vn', true, NOW(), NOW()),
(gen_random_uuid(), 'Bệnh viện Đại học Y Dược TP.HCM', '215 Hồng Bàng, Quận 5, TP.HCM', '028 3855 4269', 'info@bvdaihocyduoc.vn', true, NOW(), NOW()),
(gen_random_uuid(), 'Bệnh viện Nhi Đồng 1', '341 Sư Vạn Hạnh, Quận 10, TP.HCM', '028 3927 1119', 'info@benhviennhi.org.vn', true, NOW(), NOW()),

-- Da Nang Centers
(gen_random_uuid(), 'Bệnh viện Đà Nẵng', '124 Hải Phòng, Hải Châu, Đà Nẵng', '0236 3821 115', 'info@benhviendanang.vn', true, NOW(), NOW()),
(gen_random_uuid(), 'Bệnh viện C Đà Nẵng', '122 Hải Phòng, Hải Châu, Đà Nẵng', '0236 3821 115', 'info@benhvienc.vn', true, NOW(), NOW()),

-- Can Tho Centers
(gen_random_uuid(), 'Bệnh viện Đa khoa Trung ương Cần Thơ', '315 Nguyễn Văn Linh, Ninh Kiều, Cần Thơ', '0292 3737 123', 'info@benhviencantho.vn', true, NOW(), NOW()),

-- Hai Phong Centers
(gen_random_uuid(), 'Bệnh viện Việt Tiệp', '1 Nhà Thương, Lê Chân, Hải Phòng', '0225 3747 888', 'info@benhvienvietiep.vn', true, NOW(), NOW()),

-- Hue Centers
(gen_random_uuid(), 'Bệnh viện Trung ương Huế', '16 Lê Lợi, Vĩnh Ninh, Huế', '0234 3822 325', 'info@benhvienhue.vn', true, NOW(), NOW()),

-- Nha Trang Centers
(gen_random_uuid(), 'Bệnh viện Đa khoa tỉnh Khánh Hòa', '19 Yersin, Lộc Thọ, Nha Trang', '0258 3822 115', 'info@benhvienkhanhhoa.vn', true, NOW(), NOW()),

-- Buon Ma Thuot Centers
(gen_random_uuid(), 'Bệnh viện Đa khoa tỉnh Đắk Lắk', '184 Phan Chu Trinh, Tân Lợi, Buôn Ma Thuột', '0262 3852 115', 'info@benhviendaklak.vn', true, NOW(), NOW()),

-- Vung Tau Centers
(gen_random_uuid(), 'Bệnh viện Lê Lợi', '4 Lê Lợi, Phường 1, Vũng Tàu', '0254 3852 115', 'info@benhvienleloi.vn', true, NOW(), NOW()),

-- Long Xuyen Centers
(gen_random_uuid(), 'Bệnh viện Đa khoa tỉnh An Giang', '1 Nguyễn Văn Thoại, Mỹ Xuyên, Long Xuyên', '0296 3842 115', 'info@benhvienangiang.vn', true, NOW(), NOW()),

-- Rach Gia Centers
(gen_random_uuid(), 'Bệnh viện Đa khoa tỉnh Kiên Giang', '1 Nguyễn Trung Trực, Vĩnh Thanh Vân, Rạch Giá', '0297 3862 115', 'info@benhvienkiengiang.vn', true, NOW(), NOW()),

-- My Tho Centers
(gen_random_uuid(), 'Bệnh viện Đa khoa tỉnh Tiền Giang', '1 Trần Hưng Đạo, Phường 1, Mỹ Tho', '0273 3872 115', 'info@benhvientiengiang.vn', true, NOW(), NOW()),

-- Vinh Centers
(gen_random_uuid(), 'Bệnh viện Đa khoa tỉnh Nghệ An', '19 Lê Hồng Phong, Hưng Bình, Vinh', '0238 3842 115', 'info@benhviennghean.vn', true, NOW(), NOW()),

-- Thanh Hoa Centers
(gen_random_uuid(), 'Bệnh viện Đa khoa tỉnh Thanh Hóa', '1 Trần Phú, Đông Vệ, Thanh Hóa', '0237 3852 115', 'info@benhvienthanhhoa.vn', true, NOW(), NOW()),

-- Quy Nhon Centers
(gen_random_uuid(), 'Bệnh viện Đa khoa tỉnh Bình Định', '106 Nguyễn Huệ, Lê Lợi, Quy Nhơn', '0256 3822 115', 'info@benhvienbinhdinh.vn', true, NOW(), NOW()),

-- Pleiku Centers
(gen_random_uuid(), 'Bệnh viện Đa khoa tỉnh Gia Lai', '1 Trần Hưng Đạo, Diên Hồng, Pleiku', '0269 3822 115', 'info@benhviengialai.vn', true, NOW(), NOW()),

-- Bien Hoa Centers
(gen_random_uuid(), 'Bệnh viện Đa khoa tỉnh Đồng Nai', '1 Trần Hưng Đạo, Tân Hiệp, Biên Hòa', '0251 3822 115', 'info@benhviendongnai.vn', true, NOW(), NOW()),

-- Thu Dau Mot Centers
(gen_random_uuid(), 'Bệnh viện Đa khoa tỉnh Bình Dương', '1 Đại lộ Bình Dương, Phú Hòa, Thủ Dầu Một', '0274 3822 115', 'info@benhvienbinhduong.vn', true, NOW(), NOW()),

-- Tay Ninh Centers
(gen_random_uuid(), 'Bệnh viện Đa khoa tỉnh Tây Ninh', '1 Trần Hưng Đạo, Phường 1, Tây Ninh', '0276 3822 115', 'info@benhvientayninh.vn', true, NOW(), NOW()),

-- Long An Centers
(gen_random_uuid(), 'Bệnh viện Đa khoa tỉnh Long An', '1 Nguyễn Thị Minh Khai, Phường 1, Tân An', '0272 3822 115', 'info@benhvienlongan.vn', true, NOW(), NOW()),

-- Tien Giang Centers
(gen_random_uuid(), 'Bệnh viện Đa khoa tỉnh Tiền Giang', '1 Trần Hưng Đạo, Phường 1, Mỹ Tho', '0273 3822 115', 'info@benhvientiengiang.vn', true, NOW(), NOW()),

-- Ben Tre Centers
(gen_random_uuid(), 'Bệnh viện Đa khoa tỉnh Bến Tre', '1 Nguyễn Huệ, Phường 1, Bến Tre', '0275 3822 115', 'info@benhvienbentre.vn', true, NOW(), NOW()),

-- Tra Vinh Centers
(gen_random_uuid(), 'Bệnh viện Đa khoa tỉnh Trà Vinh', '1 Trần Hưng Đạo, Phường 1, Trà Vinh', '0294 3822 115', 'info@benhvientravinh.vn', true, NOW(), NOW()),

-- Soc Trang Centers
(gen_random_uuid(), 'Bệnh viện Đa khoa tỉnh Sóc Trăng', '1 Trần Hưng Đạo, Phường 1, Sóc Trăng', '0299 3822 115', 'info@benhviensoctrang.vn', true, NOW(), NOW()),

-- Bac Lieu Centers
(gen_random_uuid(), 'Bệnh viện Đa khoa tỉnh Bạc Liêu', '1 Trần Hưng Đạo, Phường 1, Bạc Liêu', '0291 3822 115', 'info@benhvienbaclieu.vn', true, NOW(), NOW()),

-- Ca Mau Centers
(gen_random_uuid(), 'Bệnh viện Đa khoa tỉnh Cà Mau', '1 Trần Hưng Đạo, Phường 1, Cà Mau', '0290 3822 115', 'info@benhviencamau.vn', true, NOW(), NOW()); 