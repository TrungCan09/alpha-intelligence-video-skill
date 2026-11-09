# Motion language, sound và anti-pattern

## Nguyên tắc

Mỗi chuyển động phải trả lời được: **nó giúp người xem hiểu ý nào?** Nếu không trả lời được, bỏ chuyển động.

## Semantic legibility gate

Trước khi code một graphic quan hệ hoặc phép ẩn dụ, viết một câu `visualMeaning`: “Người xem thấy X thay đổi thành Y nên hiểu Z.” Nếu graphic chỉ đẹp nhưng câu này không rõ, không được dùng.

- Dùng đường thẳng có hướng, source và target rõ cho hành động gửi/truyền.
- Dùng xây nhanh nội dung, snap/lock hoặc trạng thái trước–sau cho ý “xuất hiện ngay”.
- Chỉ dùng đường cong, quỹ đạo, sóng hoặc node trôi khi chính hình dạng đó mã hóa một quan hệ cụ thể.
- Không dùng chấm chạy trên đường trừ khi người xem nhận ra chúng là dữ liệu/vật thể gì và đang đi từ đâu tới đâu.
- Kiểm tra clip gồm key frame và 0,5 giây trước đó. Nếu một người xem mới không đoán đúng ý chính, ưu tiên biểu diễn trực tiếp hơn thay vì thêm nhãn giải thích cho graphic mơ hồ.

## Hình học và cân bằng

- Dùng anchor có tên như `bottom-center`, `top-center`, `left-center`; không căn connector bằng mắt qua các `left/top` rời rạc.
- Flow thẳng phải chia sẻ một axis. Với flow dọc: tâm source, thân connector, đầu mũi tên và tâm target có cùng `center-x`.
- Đầu connector dừng trước target một khoảng nhìn thấy được (`end gap`), mặc định tối thiểu 8 px; chỉ chạm/đi vào card khi có cổng kết nối được thiết kế rõ.
- Connector nằm ở layer giữa các card; card không được che đầu mũi tên, nhưng connector cũng không xuyên qua vùng chữ.
- Những phần tử có quan hệ trực tiếp như stack + trạng thái, icon + caption hoặc card + chú thích phải dùng flex/grid flow và `gap` tối thiểu 16 px. Chỉ dùng vị trí tuyệt đối cho decoration độc lập; kiểm tra khoảng cách ở cả đỉnh spring overshoot, không chỉ frame cuối.
- Kiểm tra bounding box ở trạng thái entrance, overshoot và exit. Không chỉ kiểm tra vị trí cuối.
- Optical balance quan trọng hơn đối xứng toán học: kiểm tra trọng lượng chữ, card, khoảng âm và hero glow quanh trục chính.
- Glyph tiếng Việt, dấu hỏi và icon phải có line-height/overflow đủ; không dùng việc cắt mép như một hiệu ứng nếu làm mất nghĩa.

Scene phải có chuyển động hoặc thay đổi focus có nghĩa trong 15 frame đầu. Nếu giữ quá 90 frame, phải có lý do đọc/nhấn rõ; nếu không, thêm một diễn tiến nội dung chứ không thêm decoration ngẫu nhiên.

Một scene là một chuỗi trạng thái, không phải poster hoàn chỉnh được giữ trên màn hình. Với mỗi semantic beat, xác định rõ **đối tượng nào đổi trạng thái, vì sao đổi và người xem hiểu thêm điều gì**. Background drift, grain, particle và glow breathing chỉ là ambient layer, không được tính là diễn tiến nội dung.

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
- Đường sóng, quỹ đạo hoặc chấm chuyển động được dùng như ký hiệu chung chung cho “AI đang xử lý”.
- Zoom nhỏ cả bảng chỉ để “có chuyển động”.
- Reveal chữ lặp cùng easing ở mọi scene.
- Glow đồng thời trên nhiều vật thể.
- Card/đồ họa xuyên qua chữ hoặc đè safe zone.
- Đòn bẩy, trục, vòng tròn hoặc sơ đồ sai quan hệ hình học.
- SFX spam khiến voice mất trọng tâm.
- Emoji làm icon vì màu/glyph không tuân theme; dùng CSS/SVG hoặc asset đã kiểm tra.
- Dùng `<Video>` cho footage thay vì `<OffthreadVideo>`.

## Kiểm tra sáng tạo

Trước khi chốt storyboard, liệt kê motion concept của từng scene. Nếu hai scene liên tiếp dùng cùng động từ và bố cục, thiết kế lại ít nhất một scene. Đa dạng không có nghĩa là thêm hiệu ứng; đa dạng là dùng phép ẩn dụ hình ảnh đúng nội dung.

Chạy `check-storyboard.mjs` trước khi code và `audit-motion-density.mjs` trên MP4 cuối. Motion-density chỉ là lưới an toàn; vẫn phải xem playback 1× và 0,5× để chắc rằng chuyển động bám voice thay vì chỉ làm pixel thay đổi.
