Bài viết gốc:
[_The Art of the Error Message (Nghệ thuật thông báo lỗi)_](https://medium.com/s/user-friendly/the-art-of-the-error-message-9f878d0bff80)

_Bởi [Marina Posniak](https://medium.com/u/aacfeaaa2521) & [Tamara Hilmes](https://medium.com/u/86255198a82f)_

Khái niệm nắm bắt failure mang ý nghĩa khá lớn trong ngành công nghệ. “Fail fast, fail often” hầu như đã trở thành một câu thần chú của ngành. Nhưng có một loại failure hàng ngày mà chưa được chú ý nhiều trong quá trình phát triển sản phẩm: những thông báo lỗi bình thường.

`Thông báo lỗi phải giúp người dùng giải quyết vấn đề và tiếp tục công việc.`

# Khi thông báo lỗi là một vấn đề

Tất cả chúng ta đều đã thấy qua thông báo lỗi "mật khẩu chưa chính xác" ở đâu đó (hoặc có thể là hàng ngày). Mặc dù điều này có thể gây nản lòng khi mọi thứ không hoạt động như mong đợi, chúng ta thường chỉ gạt đi như không có vấn đề gì lớn. Nhưng hiệu ứng tích lũy trong những khoảnh khắc nhỏ này là gì?

Mỗi thông báo lỗi là một rào cản nhỏ bé cản trở những gì chúng ta đang cố gắng thực hiện. Tùy thuộc vào ngữ cảnh, một thông điệp không có ích có thể tạo nên sự khác biệt giữa việc tiếp tục sử dụng hoặc lựa chọn từ bỏ. Thậm chí, một số nghiên cứu còn cho rằng các thông báo lỗi kích hoạt phản ứng căng thẳng vật lý bằng cách tăng mức cortisol.

Chỉ cần nghĩ về sự khác biệt giữa việc nhìn thấy một cái gì đó như thế này:

![](https://cdn-images-1.medium.com/max/800/1*bAAcI5bChT2EciWlxJwLfQ.png)

Và thấy một cái gì đó mang tính hành động hơn, như thế này:

![](https://cdn-images-1.medium.com/max/800/1*CLQTWR2h3BOqP0MLtSg7bw.png)

Nếu bạn là một writer, designer hoặc developer đang làm một ứng dụng, bạn có thể giúp giảm bớt sự thất vọng của người dùng bằng cách suy nghĩ kỹ hơn về các lỗi sẽ hiển thị.

Hãy tự hỏi rằng liệu có cần thông báo lỗi không?. Trước khi viết bất cứ điều gì, hãy xem xét để tìm cách thiết kế lại experience để không có lỗi nào xảy ra cả. Có cách nào để làm cho nó hoạt động bình thường không? Thông báo lỗi tốt nhất là không có thông báo lỗi.

Nếu thật sự cần nó, hãy suy nghĩ cẩn thận về lời nhắn. Khi gặp sự cố và ứng dụng bị lỗi, hãy viết điều gì đó hữu ích. Thông điệp ấy sẽ giúp người dùng giải quyết vấn đề và tiếp tục sử dụng.

# Mẹo viết những thông báo lỗi hữu ích

Nếu ta thật sự không thể khắc phục sự cố cơ bản và cần hiển thị thông báo lỗi, đây là một số điều cần lưu ý.

## Giải thích những gì đã xảy ra và tại sao

Nhiều thông báo lỗi rất mơ hồ. Thực sự mơ hồ. Hãy luôn mô tả rõ ràng về những gì đang diễn ra bất kỳ khi nào có thể. Đưa ra số lượng chi tiết phù hợp, nhưng đừng quá nhiều thông tin về mặt kỹ thuật. Viết theo cách mà bất cứ ai cũng có thể dễ dàng hiểu được. Tức là đừng dùng biệt ngữ trong thông báo.

Hãy tưởng tượng người dùng nhìn thấy một quảng cáo về Spotify Premium và nhấp vào liên kết để bắt đầu dùng thử miễn phí. Sau đó, họ truy cập vào một trang và thấy một cái gì đó như thế này:

![](https://cdn-images-1.medium.com/max/800/1*OPL0sFzu3xpQtViI5Qt6ag.png)

Nó chưa thể hiện rõ lý do tại sao người dùng lại không đủ điều kiện(ineligible) để nhận offer này, đặc biệt là khi họ vừa nhận được email nói rằng, "Hey, nhận lấy này!". Chuyện gì đang xảy ra vậy?.

Trong trường hợp này, điều quan trọng là phải nói với người dùng những gì đã xảy ra (họ không đủ điều kiện để tiếp tục) và tại sao (trước đây họ đã đăng ký dùng thử miễn phí).

![](https://cdn-images-1.medium.com/max/800/1*MkJk6b2GSGuEG3Fzz_FOdA.png)

Và vâng, tin nhắn này đã dài hơn, nhưng đôi khi chúng ta cần thêm nhiều thông tin hơn nữa để làm cho nó thật sự hữu ích.

## Đề xuất thao tác tiếp theo
 
Sau khi ta giải thích những gì đã xảy ra, hãy nói với người dùng những gì họ có thể làm để giải quyết vấn đề. Hãy thêm một nút, một liên kết hoặc một chỉ dẫn hành động khác. Viết một tiêu đề rõ ràng trình bày thẳng vào điểm chính nhanh chóng.

Hãy tưởng tượng ta đang muốn tìm kiếm một số podcast mới. ta kích hoạt ứng dụng và thấy thông báo lỗi:

![](https://cdn-images-1.medium.com/max/800/1*YQRh9Ehy-FABQj7Dh16IKA.png)

Thông báo này cho ta biết những gì đã xảy ra và tại sao, nhưng nó chưa đề xuất thao tác tiếp theo. Tốt hơn hết là để thêm một tiêu đề rõ ràng (ứng dụng đã hết hạn sử dụng) và lời chỉ dẫn người dùng thao tác tiếp (nút download).

![](https://cdn-images-1.medium.com/max/800/1*GwIteJ5fM_-NFUeoPBo1Kg.png)

## Bắt đúng tone

Là các UX writers, chúng ta muốn truyền đạt đúng thông tin vào đúng thời điểm. Nhưng nó không chỉ về những gì chúng ta truyền đạt, mà còn nói về cách chúng ta truyền đạt. Khi ta nói đến tone, chúng ta cố gắng tìm sự cân bằng phù hợp, hoặc, như chúng tôi nói ở Thụy Điển, [lagom](https://en.wikipedia.org/wiki/Lagom).

Tone ở đây đề cập đến tính cách hoặc thái độ của ngôn ngữ. Trong cùng một brand voice, văn bản của ta có thể mang một âm điệu khác nhau tùy thuộc vào tình huống. Nó có thể nghiêm túc hơn, trung lập hoặc thân thiện hơn, tất cả phụ thuộc vào người ta viết cho ai và ta viết về cái gì. Bạn thay đổi giọng điệu của Bạn liên tục; chỉ cần nghĩ về cách bạn nói chuyện với bạn bè, bố mẹ hoặc sếp của bạn.

Làm thế nào để chọn đúng tone? Có thể bắt đầu bằng cách tự hỏi:

- Người dùng cảm thấy thế nào trong tình huống này? Nếu nó là một vấn đề căng thẳng hoặc nghiêm trọng, một giọng điệu ngớ ngẩn sẽ không phù hợp.
- Thực sự bạn sẽ trình bày nó như vậy? Đọc to tin nhắn có thể giúp bạn xác định chính xác các từ hoặc cụm từ bạn cần sửa lại.

![](https://cdn-images-1.medium.com/max/800/1*NUBTDySL7fMq5hJqiY99cg.png)

- _Bad request. Mật khẩu được cung cấp không hợp lệ. → Những từ như "Bad request" và "được cung cấp" làm cho nó nghe có vẻ cứng nhắc._
- _Mật khẩu đó không khớp. Thử lại? → Câu này trình bày một cách khá rõ ràng và dễ tiếp cận. Khá ổn đấy._
- _Có vấn đề! Mật khẩu bạn cung cấp không khớp. Bạn muốn thử lại không? → Thực sự bạn sẽ trình bày nó như vậy sao? Câu nói này thật sự có một chút quá ngớ ngẩn._

Ba thông điệp này cùng nói lên một điều, nhưng giọng điệu thì khác. Khi bạn viết một thông báo lỗi, hãy chọn đúng tone phù hợp nhất với người dùng và bối cảnh.

# Kết luận

Sự khác biệt giữa trải nghiệm người dùng tốt và xấu thường nằm ở các chi tiết. Viết thông báo lỗi rõ ràng có thể làm giảm sự thất vọng và giúp mọi người tiếp tục sử dụng ứng dụng hoặc dịch vụ của bạn. Rất đáng để chia sẻ cho người dùng của chúng ta một ít tình yêu. Lần tới khi bạn viết một thông báo lỗi, hãy ghi nhớ những lời khuyên sau:

- Trình bày những gì đã xảy ra và tại sao.
- Đề xuất bước tiếp theo.
- Tìm đúng tone

Và đừng quên đọc lớn message và lọc ra những biệt ngữ phiền phức.