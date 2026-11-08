# Motion language, sound và anti-pattern

## Nguyên tắc

Mỗi chuyển động phải trả lời được: **nó giúp người xem hiểu ý nào?** Nếu không trả lời được, bỏ chuyển động.

## Một concept mỗi scene

Chọn một động từ hình ảnh phù hợp nội dung: khóa, tách, hội tụ, so sánh, soi chiếu, dự đoán, kiểm chứng, nâng, đóng băng, mở lớp. Không áp dụng cùng cấu trúc reveal cho mọi scene.

Entrance nên phối hợp 2–3 thuộc tính: opacity + translate + scale/clip. Exit nhanh hơn entrance. Mọi interpolation phải clamp và có easing.

Text và card không breathing liên tục. Chỉ decoration nền được chuyển động rất nhẹ.

## Motion primitives nên dùng

- Hard cut có chủ đích tại khoảng nghỉ.
- Mask/clip reveal cho chuyển trạng thái.
- Focus shift cho A/B khi cả hai vẫn hiện diện.
- Connector draw sau nguồn trong chuỗi quan hệ.
- Scan highlight chạy qua hệ thống đã dựng xong.
- Morph/assembly khi nội dung nói về quá trình hình thành.
- Freeze và depth shift khi nội dung yêu cầu “dừng lại”.

## Sound choreography

- Voice volume 1.0 và luôn là lớp chính.
- Chỉ đặt SFX tại semantic hit quan trọng; thường 5–8 hit cho video khoảng một phút.
- Không click mỗi chữ, mỗi token hoặc mỗi card.
- Một transition không cần đồng thời hit, whoosh, flash và bass drop.
- Không thêm nhạc nền nếu chưa được yêu cầu.

## Anti-pattern

- Flash/whip toàn màn hình lặp lại.
- Progress bar hoặc thanh trắng chạy xuyên suốt không có ý nghĩa.
- Mũi tên hiện trước các ô mà nó nối.
- Connector trang trí thành hình khó hiểu.
- Zoom nhỏ cả bảng chỉ để “có chuyển động”.
- Reveal chữ lặp cùng easing ở mọi scene.
- Glow đồng thời trên nhiều vật thể.
- Card/đồ họa xuyên qua chữ hoặc đè safe zone.
- Đòn bẩy, trục, vòng tròn hoặc sơ đồ sai quan hệ hình học.
- SFX spam khiến voice mất trọng tâm.

## Kiểm tra sáng tạo

Trước khi chốt storyboard, liệt kê motion concept của từng scene. Nếu hai scene liên tiếp dùng cùng động từ và bố cục, thiết kế lại ít nhất một scene. Đa dạng không có nghĩa là thêm hiệu ứng; đa dạng là dùng phép ẩn dụ hình ảnh đúng nội dung.
