# Production lessons v2.1

Đây là bộ nhớ sản xuất đã ẩn danh. Chỉ đọc category liên quan tới tác vụ; registry đầy đủ nằm tại `knowledge/lessons.json`.

## Voice sync

### SYNC-001

Visual hit không đi trước semantic cue và text phải đọc được trong 0,2 giây. Không sửa drift bằng timestamp rải trong component; sửa cue mapping hoặc entrance duration.

## Semantic motion

### SEM-001

Graphic quan hệ phải cho thấy source, action, target và kết quả. `visualMeaning` không rõ là tín hiệu phải đổi graphic, không phải thêm nhãn giải thích.

### SEM-002

Semantic render phải vẫn truyền đạt đủ ý khi bỏ mesh, particle, grain và breathing. Nếu không, scene chỉ đang chuyển động trang trí.

## Scene rhythm

### RHY-001

Scene mở bằng thay đổi có nghĩa trong 15 frame. Hold trên 90 frame chỉ hợp lệ khi có lý do đọc hoặc nhấn; background drift không phải diễn tiến.

### RHY-002

Recipe là quan hệ motion, không phải template thẩm mỹ. Không lặp recipe liên tiếp hoặc cùng cặp motion concept/layout family.

## Layout

### LAY-001

Connector chỉ xuất hiện cùng hoặc sau source; dùng named anchor, chung axis, end gap tối thiểu 8 px và layer không xuyên chữ.

### LAY-002

Kiểm tra overlap tại entrance, peak overshoot, hold và exit. Dùng flow layout cho phần tử liên quan; absolute positioning chỉ dành cho decoration độc lập.

### LAY-003

Optical balance quan trọng hơn đối xứng số học. Không dồn toàn bộ nội dung lên 40% trên hoặc lấp khoảng trống bằng graphic vô nghĩa.

## Typography

### TYP-001

Hero tiếng Việt cần glyph padding, line-height phù hợp và unicode font preload. Kiểm tra chuỗi frame để phân biệt clipping layout với font-loading/capture race.

### TYP-002

Khóa line break theo cụm nghĩa. Không để auto-wrap tách `TỰ TIN`, `CÂU TRẢ LỜI`, `DỰ ĐOÁN TỪ TIẾP THEO` hoặc một từ đơn.

## Branding

### BRD-001

Header, tagline, palette, gradient và font role chỉ đến từ brand system. Scene không được tạo theme song song.

## Sound

### SND-001

SFX phục vụ semantic hit, không phục vụ từng animation. Một transition không đồng thời cần hit, whoosh, flash và bass drop.

## Delivery

### DEL-001

QA phải dựa trên MP4 thật. Source screenshot hoặc preview cũ không chứng minh master không clipping, drift hoặc lỗi capture.
