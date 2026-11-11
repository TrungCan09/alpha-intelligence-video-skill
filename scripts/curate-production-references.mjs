#!/usr/bin/env node
import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {transcriptHash} from './lib/lock-utils.mjs';

const root=resolve(process.argv[2]??'assets/reference/production');
const definitions={
  'lesson-1':{
    texts:[
      'Thực ra thì xong bài nhờ AI chưa chắc đã có nghĩa là bạn thực sự học được điều gì đó.',
      'Việc có ngay một sản phẩm hoàn chỉnh trong tay đôi khi lại tạo ra cảm giác hiểu bài giả tạo.',
      'Nó rất khác với việc bạn thực sự nắm vững kiến thức, có thể tự tin giải thích lại, hay tự tay giải quyết một bài toán tương tự.',
      'Ừm, điểm khác biệt cốt lõi nằm ở cách chúng ta tiếp cận.',
      'Bạn chọn phó mặc tất cả cho AI, hay tự mình suy nghĩ trước rồi mới dùng nó để soi chiếu và tìm ra những lỗ hổng?',
      'Lần tới, trước khi gõ câu lệnh, hãy thử dừng lại một nhịp và tự hỏi: AI đã làm giúp mình phần nào?',
      'Đâu mới là quyết định của chính mình? Và quan trọng nhất, mình đã học thêm được gì sau bước đó?',
      'Hãy dùng AI như một đòn bẩy để nâng tầm bản thân, thay vì chỉ để hoàn thành mục tiêu cho xong, bạn nhé!',
      'Ở bài tiếp theo, chúng ta sẽ cùng bóc tách xem AI thực sự tạo ra câu trả lời như thế nào.'
    ],
    shots:[
      [['seg-001'],'Xong bài nhờ AI chưa chắc là đã học','problem contrast',['lock','split'],'editorial-contrast',['text','card'],'push'],
      [['seg-002'],'Sản phẩm hoàn chỉnh có thể tạo cảm giác hiểu giả','false completion',['assemble','reflect'],'module-grid',['card','shape','text'],'static'],
      [['seg-003'],'Năng lực thật gồm hiểu, giải thích và tự giải','competence network',['branch','scan'],'radial-network',['text','connector'],'track'],
      [['seg-004'],'Khác biệt nằm ở cách tiếp cận','choice axis',['split','focus'],'axis-choice',['text','shape'],'static'],
      [['seg-005'],'Phó mặc cho AI đối lập với tự nghĩ và soi chiếu','balanced comparison',['compare','transfer'],'split-ab',['card','connector','text'],'track'],
      [['seg-006'],'Dừng trước khi gõ lệnh và tự hỏi câu đầu','freeze prompt',['type','freeze'],'prompt-stage',['card','text','shape'],'pull'],
      [['seg-007'],'Ba câu tự hỏi tích lũy theo lời nói','progressive questions',['accumulate','focus'],'focus-rail',['text','connector'],'static'],
      [['seg-008'],'AI là đòn bẩy nâng năng lực bản thân','physical leverage',['tilt','lift'],'lever-stage',['shape','card','text'],'push'],
      [['seg-009'],'Dẫn sang cơ chế AI tạo câu trả lời','next lesson convergence',['merge','shimmer'],'token-convergence',['token-field','text'],'pull']
    ]
  },
  'lesson-2':{
    texts:[
      'Sau khi phân biệt được giữa kết quả do AI tạo ra và năng lực thực tế của chính mình,','một câu hỏi lớn hơn sẽ bắt đầu nảy ra:','Hmm... làm thế nào mà AI lại có thể đưa ra những câu trả lời mượt mà đến thế nhỉ?','Bạn biết đấy, khi thấy AI phản hồi quá tự nhiên, chúng ta rất dễ lầm tưởng rằng —','nó đang thực sự suy nghĩ, hay thấu hiểu vấn đề giống hệt con người. Nhưng thực tế thì sao?','Trong suốt quá trình huấn luyện, AI chỉ học cách nhận diện các quy luật,','và mối liên hệ từ một lượng dữ liệu khổng lồ mà thôi.','Cụ thể nhé... khi bạn đặt một câu hỏi, nội dung đó sẽ được chia nhỏ thành các đơn vị gọi là — token.','Thay vì thực sự hiểu theo cách của chúng ta, AI sẽ tính toán và dự đoán xem: token nào hợp lý nhất để xuất hiện tiếp theo.','Rồi cứ thế, lặp lại quy trình đó cho đến khi ghép thành một câu trả lời hoàn chỉnh.','Ừm... bạn có thể hình dung nó giống như tính năng gợi ý từ trên bàn phím điện thoại vậy —','nhưng ở một cấp độ mạnh mẽ hơn rất nhiều, nhờ khả năng nắm bắt toàn bộ ngữ cảnh.','Chẳng hạn, nếu bạn chỉ hỏi vỏn vẹn là: Hãy giải thích về tế bào... AI sẽ đưa ra một câu trả lời khá chung chung.','Thế nhưng, nếu biết bạn đang là học sinh lớp 8, đã học qua những gì, và đang vướng mắc ở đâu —','thì câu trả lời lúc này sẽ trở nên chính xác và gần gũi hơn hẳn.','Sau cùng thì... vì AI đâu thể tự đọc được suy nghĩ của chúng ta,','nên chất lượng câu trả lời sẽ phụ thuộc rất lớn vào bối cảnh mà bạn cung cấp.','Vậy... tại sao một công cụ có khả năng diễn đạt trôi chảy đến thế,','đôi khi lại tự tin đưa ra những thông tin sai lệch hoàn toàn?','Chúng ta sẽ cùng giải mã điều này trong bài 3 nhé.'
    ],
    shots:[
      [['seg-001','seg-002'],'Bài trước dẫn tới một câu hỏi lớn hơn','previous lesson bridge',['lock','recede'],'depth-label',['card','text'],'pull'],
      [['seg-003'],'AI tạo câu trả lời mượt mà bằng cách nào','hero question',['converge','focus'],'question-stage',['text','shape'],'push'],
      [['seg-004'],'Phản hồi tự nhiên tạo cảm giác AI hiểu','fluency illusion',['type','assemble'],'response-card',['card','text'],'static'],
      [['seg-005'],'Giả định suy nghĩ và thấu hiểu bị bóc tách','illusion reveal',['split','reveal'],'layer-reveal',['card','text','token-field'],'push'],
      [['seg-006','seg-007'],'AI học quy luật và mối liên hệ từ dữ liệu','data pattern network',['connect','merge'],'network-grid',['shape','connector','text'],'track'],
      [['seg-008'],'Câu hỏi được chia thành token','tokenization',['split','disassemble'],'token-strip',['text','token-field'],'static'],
      [['seg-009'],'AI dự đoán token tiếp theo','prediction ranking',['count','select'],'probability-stage',['token-field','shape','text'],'push'],
      [['seg-010'],'Dự đoán lặp thành câu trả lời hoàn chỉnh','prediction loop',['repeat','lock'],'process-loop',['token-field','text'],'track'],
      [['seg-011'],'So sánh với gợi ý từ bàn phím điện thoại','keyboard analogy',['type','suggest'],'phone-keyboard',['shape','text'],'pull'],
      [['seg-012'],'Toàn bộ ngữ cảnh làm hệ thống mạnh hơn','context expansion',['camera','reveal'],'context-depth',['card','text'],'pull'],
      [['seg-013'],'Prompt tế bào thiếu bối cảnh cho kết quả chung chung','generic prompt',['enter','dim'],'split-ab',['card','text'],'static'],
      [['seg-014'],'Bổ sung lớp 8, kiến thức và vướng mắc','context enrichment',['assemble','focus'],'split-ab',['card','text'],'track'],
      [['seg-015'],'Câu trả lời trở nên gần gũi hơn','quality shift',['transfer','resolve'],'focus-transfer',['card','text'],'push'],
      [['seg-016'],'AI không thể tự đọc suy nghĩ của người dùng','context boundary',['block'],'boundary-stage',['shape','text'],'static'],
      [['seg-017'],'Chất lượng câu trả lời phụ thuộc bối cảnh được cung cấp','context input',['insert','focus'],'axis-flow',['card','text'],'track'],
      [['seg-018','seg-019'],'Trôi chảy vẫn có thể đi cùng thông tin sai lệch','verification mismatch',['verify','contrast'],'verification-stage',['text','shape'],'pull'],
      [['seg-020'],'Dẫn sang bài 3 để giải mã thông tin sai','next lesson',['resolve','exit'],'outro-stage',['text','card'],'push']
    ]
  },
  'lesson-3':{
    texts:[
      'Hãy thử tưởng tượng nhé... Bạn hỏi AI về một cuốn sách,','và chỉ vài giây sau, nó trả lời đầy đủ tên tác giả,','năm xuất bản, nội dung chính — thậm chí kèm cả một đoạn trích rất thuyết phục.','Chà... chỉ có một vấn đề nhỏ thôi:','cuốn sách ấy... hoàn toàn không tồn tại.','Vậy tại sao AI có thể trả lời sai, mà vẫn tự tin đến thế?','Như ở bài trước, chúng ta biết AI hoạt động bằng cách dự đoán từ tiếp theo dựa trên ngữ cảnh.','Mục tiêu của nó là tạo ra một câu trả lời mạch lạc —','chứ không phải tự kiểm chứng thông tin.','Vì thế, khi thiếu dữ liệu hoặc gặp câu hỏi quá đặc thù...','AI vẫn sẽ cố ghép nên một đáp án nghe thật hợp lý,','từ tên người, con số cho đến những trích dẫn... không hề có thật.','Hiện tượng này được gọi là — ảo giác AI.','Thực tế, AI rất dễ trả lời sai trong 4 tình huống:','Khi câu hỏi quá mơ hồ... khi thông tin đã cũ...','Khi bạn đòi hỏi nguồn và số liệu quá chi tiết...','Hoặc khi chính câu hỏi — đã chứa sẵn một giả định sai.','Bạn biết đấy, điều nguy hiểm là cả thông tin đúng lẫn sai,','đều được viết bằng cùng một giọng văn chuyên nghiệp và tự tin.','Một câu trả lời dài hơn, nhiều số liệu hơn... chưa chắc đã đáng tin hơn đâu.','Vậy nên lần tới, trước khi đưa câu trả lời của AI vào bài tập,','hãy dừng lại kiểm tra ba điều:','Một là, thông tin này đã thay đổi chưa?','Hai là, nguồn trích dẫn có thật không?','Và ba là — giả định trong câu hỏi của mình đã chuẩn chưa?','Biết AI có thể sai không phải để nghi ngờ tất cả,','mà để biết khi nào nên tham khảo... và khi nào cần tự xác minh.','Vậy... ở bài tiếp theo, hãy cùng nhìn lại xem:','Bạn đang thực sự dùng AI để học...','hay chỉ để né tránh những phần khó của việc học?'
    ],
    shots:[
      [['seg-001','seg-002'],'Hỏi AI về một cuốn sách và nhận câu trả lời tức thì','book setup',['type','assemble'],'book-response',['card','text'],'push'],
      [['seg-003'],'Thông tin chi tiết và trích dẫn trông thuyết phục','credible detail',['accumulate','focus'],'detail-stack',['text','card'],'track'],
      [['seg-004','seg-005'],'Cú lật: cuốn sách không tồn tại','verification reveal',['freeze','collapse'],'mismatch-stage',['card','shape','text'],'push'],
      [['seg-006'],'Vì sao AI sai mà vẫn tự tin','hero question',['contrast','focus'],'question-stage',['text','shape'],'static'],
      [['seg-007'],'AI dự đoán từ tiếp theo theo ngữ cảnh','prediction chain',['draw','advance'],'axis-flow',['text','connector','token-field'],'track'],
      [['seg-008','seg-009'],'Mục tiêu mạch lạc không đồng nghĩa kiểm chứng','goal mismatch',['compare','separate'],'split-goal',['text','card'],'static'],
      [['seg-010','seg-011'],'Thiếu dữ liệu vẫn ghép đáp án hợp lý','plausible assembly',['assemble','fill'],'assembly-stage',['card','token-field'],'push'],
      [['seg-012','seg-013'],'Tên, số liệu, trích dẫn giả tạo thành ảo giác AI','hallucination label',['accumulate','stamp'],'evidence-stack',['text','card'],'push'],
      [['seg-014','seg-015'],'Hai tình huống đầu: mơ hồ và thông tin cũ','risk cases one two',['count','focus'],'risk-grid',['card','text'],'static'],
      [['seg-016','seg-017'],'Hai tình huống sau: nguồn cụ thể và giả định sai','risk cases three four',['count','verify'],'risk-grid',['card','text'],'track'],
      [['seg-018','seg-019'],'Đúng và sai có cùng giọng văn tự tin','confidence mask',['mirror','compare'],'balanced-split',['text','card'],'static'],
      [['seg-020'],'Dài và nhiều số liệu chưa chắc đáng tin','detail distrust',['expand','reject'],'typographic-scale',['text','shape'],'push'],
      [['seg-021','seg-022'],'Dừng lại và kiểm tra ba điều','checklist setup',['freeze','assemble'],'checklist-stage',['text','card'],'pull'],
      [['seg-023','seg-024'],'Kiểm tra độ mới và nguồn trích dẫn','checklist one two',['accumulate','verify'],'checklist-stage',['card','text'],'static'],
      [['seg-025'],'Kiểm tra giả định trong câu hỏi','checklist three',['focus','lock'],'checklist-stage',['card','text'],'push'],
      [['seg-026','seg-027'],'Biết khi nào tham khảo và khi nào xác minh','calibrated trust',['balance','resolve'],'decision-axis',['text','shape'],'static'],
      [['seg-028','seg-029','seg-030'],'Dẫn sang việc dùng AI để học hay né phần khó','next lesson choice',['split','question'],'outro-choice',['text','card'],'pull']
    ]
  }
};

for(const [lessonId,definition] of Object.entries(definitions)){
  const folder=resolve(root,lessonId); const transcript=JSON.parse(await readFile(resolve(folder,'transcript.lock.json'),'utf8')); if(transcript.segments.length!==definition.texts.length)throw new Error(`${lessonId}: số segment không khớp.`); transcript.segments.forEach((segment,index)=>{segment.text=definition.texts[index];}); transcript.reviewed=true; transcript.transcriptSha256=transcriptHash(transcript); await writeFile(resolve(folder,'transcript.lock.json'),`${JSON.stringify(transcript,null,2)}\n`);
  const segmentMap=new Map(transcript.segments.map((segment)=>[segment.id,segment])); const shots=definition.shots.map((item,index)=>{const [sourceCueIds,spokenMeaning,semanticFunction,motionVerbs,layoutFamily,elementKinds,cameraPattern]=item;const selected=sourceCueIds.map((id)=>segmentMap.get(id));const start=Math.min(...selected.map((segment)=>segment.start));const end=Math.max(...selected.map((segment)=>segment.end));const motionFingerprint=[`layout:${layoutFamily}`,...motionVerbs.map((verb)=>`verb:${verb}`),...elementKinds.map((kind)=>`primitive:${kind}`),`camera:${cameraPattern}`].join('|');return{id:`${lessonId}-shot-${String(index+1).padStart(2,'0')}`,lessonId,start,end,spokenMeaning,semanticFunction,motionVerbs,layoutFamily,elementKinds,cameraPattern,motionFingerprint,usefulFor:[semanticFunction,'voice-aligned state change'],avoidWhen:['visual thesis khác hoặc thời lượng không đủ đọc'],qualityNotes:['một entry point','motion phục vụ semantic cue'],sourceCueIds};}); await writeFile(resolve(folder,'shot-index.json'),`${JSON.stringify({schemaVersion:1,lessonId,reviewed:true,shots},null,2)}\n`);
  const manifest=JSON.parse(await readFile(resolve(folder,'manifest.json'),'utf8'));manifest.transcriptReviewed=true;manifest.shotIndexReviewed=true;await writeFile(resolve(folder,'manifest.json'),`${JSON.stringify(manifest,null,2)}\n`);const times=shots.map((shot)=>(shot.start+shot.end)/2);const sheet=spawnSync(process.execPath,[resolve(import.meta.dirname,'build-contact-sheet.mjs'),resolve(folder,'video.mp4'),'--times',times.join(','),'--out',resolve(folder,'contact-sheet.png')],{encoding:'utf8'});if(sheet.status!==0)throw new Error(sheet.stderr||sheet.stdout);console.log(`PASS Curated ${lessonId}: ${shots.length} semantic shot.`);
}
