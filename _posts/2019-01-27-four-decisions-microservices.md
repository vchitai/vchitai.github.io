---
layout: post
type: 
title: "Four decisions in Microservice Architecture"
description:
category: Technical
tags: [technical]
headline: 
video: 
imagefeature: 
comments: true
mathjax: 
---
Bài viết gốc:

[_Walking the wire: Mastering the Four Decisions in Microservices Architecture
(Đi trên dây điện: Làm chủ bốn quyết định trong kiến trúc Microservices)_](https://medium.com/systems-architectures/walking-the-microservices-path-towards-loose-coupling-few-pitfalls-4067bf5e497a)

Microservices đã trở thành một tiêu chuẩn kiến trúc mới để xây dựng hệ thống với các dịch vụ đơn giản, nhẹ tải, độc lập với nhau để có thể phát triển và chạy độc lập với các thành phần khác.

Nếu mới bắt đầu với microservice, tôi đề nghị bạn đọc [bài viết của Martin Fowler](https://martinfowler.com/articles/microservices.html). Nếu bạn muốn so sánh nó với SOA, hãy xem bài [diễn thuyết của Don Ferguson](https://www.youtube.com/watch?v=W7tGlxJtofI). Đồng thời, [“trade-off of microservices” (Sự đánh đổi của microservice)](https://martinfowler.com/articles/microservice-trade-offs.html) và [“when it is worth doing microservices”(Khi nào nên làm microservice?)](http://martinfowler.com/bliki/MicroservicePremium.html) của Martin Fowler cũng sẽ giúp bạn quyết định khi nào microservices thật sự hữu ích.

Hãy giả sử rằng bạn đã nghe, đọc hay quan tâm đến microservices. Những tín đồ của kiến trúc microservices đang đối mặt với nhiều thách thức thực tế. Bài viết này sẽ thảo luận về các giải quyết vài vấn đề trong đấy. Từ bây giờ, tôi sẽ sử dụng MSA trong phần còn lại của bài viết mỗi khi nhắc đến kiến trúc Microservices.

# Quyết định thứ nhất: Không sử dụng database trung gian

![](https://cdn-images-1.medium.com/max/600/1*6Tr4t8K9h1yhEpw_4Lbntw.png)

Mỗi microservice nên có database riêng và dữ liệu không nên chia sẻ dữ liệu qua một database chung. Nguyên tắc này giúp loại bỏ một nguyên nhân thường gặp làm bó buộc các hệ thống với nhau. Theo đó, nếu hai service chia sẻ database với nhau, service thứ hai sẽ hỏng ngay nếu service đầu tiên thay đổi schema của database. Hai team sẽ phải bàn bạc với nhau trước khi thay đổi database, dẫn tới tình trạng trì hoãn và kéo lùi chúng ta lại.

Tôi nghĩ đây là một nguyên tắc đúng đắn và không nên phá vỡ.

Tuy nhiên, có một vấn đề ở đây. Chúng ta thường xuyên chia sẻ database giữa các service dùng chung dữ liệu (ví dụ: dữ liệu tài khoản ngân hàng, giỏ hàng) và cần phải cập nhật dữ liệu theo cơ chế transaction bằng việc sử dụng database transaction để tăng cường tính thống nhất.

Bất kỳ giải pháp nào khác đều khá khó. Hãy xem thử một vài giải pháp.

Giải pháp 1: Nếu việc cập nhật chỉ xảy ra trên một microservice (ví dụ: quy trình duyệt nợ phải kiểm tra balance của tài khoản), ta có thể dùng hệ thống message bất đồng bộ (message queue) để chia sẻ dữ liệu

![](https://cdn-images-1.medium.com/max/800/1*lYK6dTfYyP1YCie_yHBIuw.png)

Giải pháp 2: Nếu việc cập nhật xảy ra trên cả hai service, hoặc ta phải xem xét sáp nhập hai services lại làm một hoặc chọn cách sử dụng transactions. Bài viết [Microservices: It’s not (only) the size that matters, it’s (also) how you use them (Microservices: không chỉ kích thước, mà cách sử dụng của bạn cũng là vấn đề)](https://www.tigerteam.dk/2014/micro-services-its-not-only-the-size-that-matters-its-also-how-you-use-them-part-2/) mô tả chi tiết hơn cho ý thứ nhất. Phần tiếp theo của bài viết sẽ mô tả chi tiết sử dụng transaction theo ý hai.

## Xử lý việc cập nhật dữ liệu một cách thống nhất 

Chúng ta đã thảo luận cách xử lý trường hợp một service duy nhất cập nhật dữ liệu. Cùng thảo luận cách xử lý khi nhiều service cập nhật dữ liệu. Chúng ta đã cùng thảo luận về một ví dụ trong phần trên.

Thông thường, chúng ta sử dụng các transaction chậm, nặng nề và tốn kém với một các tùy chỉnh phân tán để giải quyết vấn đề này. Tuy nhiên, ta thỉnh thoảng có thể giải quyết vấn đề mà không sử dụng transaction.

Có khá nhiều lựa chọn để ta chọn lựa.

### Lựa chọn 1: Đưa tất cả cập nhật về cùng một Microservice.

Tránh việc cập nhật xuyên biên giới microservice ngay khi có thể. Tuy nhiên, đôi khi nếu sử dụng cách này, ta cuối cùng sẽ tạo ra một vài services hay một kiến trúc một khối to đùng, xấu xí, kéo lùi ta về sau. Vì thể, việc này thỉnh thoảng không hề khả thi tí nào.

### Lựa chọn 2: Sử dụng Compensation với nhiều Guarantee nhỏ hơn

Như mô tả trong bài viết nổi tiếng [“Starbucks Does Not Use Two-Phase Commit”(Starbucks không dùng commit hai pha)](https://news.ycombinator.com/item?id=7995130), thế giới thực của chúng ta hoạt động không cần transactions. Thật vậy, các barista ở Starbucks không cần phải đợi cho tới khi transaction hoàn thành. Thay vào đó, họ xử lý nhiều khách hàng khác nhau cùng lúc, đền bù nếu xảy ra lỗi rõ ràng. Ta có thể làm giống vậy nếu ta muốn chỉ làm ít việc.

Ý tưởng chủ đạo là nếu một hành động thất bại xảy ra, ta có thể đền bù cho việc đó. Ví dụ, nếu đang ship một quyển sách, đầu tiên hãy giảm tiền ngay, sau đó ship quyển sách, và nếu việc ship thất bại, hoàn tiền lại.

Một ý tưởng đơn giản khác là tặng cho user một nút để ép refresh trang nếu họ cảm thấy dữ liệu chưa ở trạng thái mới nhất. Đồng thời, cơ chế eventual consistency hay timeout đôi khi đã đủ dùng. Ta sẽ cố gắng chịu đựng một vấn đề không thể tránh khỏi và xử lý bằng cách đánh đổi tính thống nhất ([bài viết của Vogel](http://www.allthingsdistributed.com/2007/12/eventually_consistent.html) là một khởi điểm tốt đấy)

Cuối cùng, [Life Beyond Distributed Transactions: An Apostate’s Opinion](http://adrianmarriott.net/logosroot/papers/LifeBeyondTxns.pdf) là  một cuộc thảo luận chi tiết về tất cả các tricks ở phía trên.

Nhưng cũng phải nói rằng, vài trường hợp nhất thiết phải cần transaction để cho ra kết quả chính xác. Hãy xem bài viết [Microservices and transactions-an update](http://jbossts.blogspot.com/2015/04/microservices-and-transactions-update.html), nơi cân đo đong đến những ưu nhược và chọn lựa cẩn thận

# Quyết định thứ hai: Xử lý bảo mật cho Microservice

Trước khi microserivce ra đời, các service xác thực nhau bằng cách gọi đến một database hay Identity Server khi chúng nhận được một request.

![](https://cdn-images-1.medium.com/max/800/1*3lpnSTPEKDs5KRBASZ9JZw.png)

Trong MSA, chúng ta có thể thay thế identity server với một microservice, mà theo ý kiến của tôi, sẽ kéo theo một sơ đồ dependency phức tạp và to lớn khác.

Thay vào đó, tôi thích cách tiếp cận theo token được mô tả trong cuốn sách “Building Microservices” và tóm lại theo hình bên dưới.

![](https://cdn-images-1.medium.com/max/800/1*KUVq9jOXlF_5j6eaf96qxg.png)

Client giao tiếp với một server identity hay SSO, tự xác thực nó, nhận lại một token mô tả user và các quyền của user với SAML hay OpenIDConnect, và gửi token cho các microservice khác với mỗi request. Mỗi microservice verify token đó và xác thực lời gọi dựa trên quyền hạn user được mô tả trong token. Mô hình này đẩy việc xác thực về phía client và quản lý quyền ở các microservices trong khi đơn giản hóa các dependencies. Ví dụ, với model này, với cùng một truy vấn, user với role "publisher" có thể thấy các kết quả khác với user với role "admin" bởi vì họ có permission khác nhau.

Cũng cần phải lưu ý rằng client có thể lấy token một lần và tái sử dụng nó, việc này chỉ diễn ra một lần mỗi session. Vì vậy, chi phí cho các lần gọi bổ sung là nhỏ.

Bài viết [How To Control User Identity Within Microservices?](http://nordicapis.com/how-to-control-user-identity-within-microservices/) cung cấp thêm nhiều thông tin về các tiếp cận này.

# Quyết định thứ ba: Xử lý điều phối microservice (Microservice Composition)

Ở đây, "composition" có nghĩa là "cách để kết nối nhiều microservice khác nhau vào một luồng để trả về thứ mà end-user muốn.

Hầu hết luồng composition trong SOA trông giống sơ đồ sau. Có một server trung tâm chạy workflow.

![](https://cdn-images-1.medium.com/max/800/1*HWkqQd1NRu1hgeukxq3HUw.png)

Các composition của SOA sử dụng một server trung tâm (ví dụ như ESB hay một engine workflow). MSA không tán thành với cách làm của ESB (ví dụ trong [Top 5 Anti-ESB Arguments for DevOps Teams](http://devops.com/2015/07/06/top-5-anti-esb-arguments-devops-teams/)). Một mặt khác, [Do Good Microservices Architectures Spell the Death of the Enterprise Service Bus?](https://www.voxxed.com/blog/2015/01/good-microservices-architectures-death-enterprise-service-bus-part-one/) đưa ra một quan điểm trái ngược.

TÔi không dự định đi sâu vào ESB flight trong bài viết này. Tuy nhiên, tôi muốn thảo luận xem liệu chúng ta có cần một server trung tâm để làm việc kết hợp các microservice hay không. Có khá nhiều cách để làm việc kết hợp các microservices.

## Cách tiếp cận 1: Dẫn luồng từ Client

Sơ đồ sau cho thấy cách tiếp cận để làm microservice mà không sử dụng server trung tâm. Browser ở client xử lý luồng. Bài viết [Domain Service Aggregators: A Structured Approach to Microservice Composition](http://www.infoq.com/presentations/domain-service-aggregator) là một ví dụ của cách tiếp cận này.

![](https://cdn-images-1.medium.com/max/800/1*9WiMk5CdA2v1fW1FH_3Wfg.png)

Cách tiếp cận này có nhiều vấn đề:
- Bây giờ nhiều lời gọi sẽ cần phải thực hiện bởi client. Vì vậy, nếu client có một kết nối mạng chậm, mà đây là trường hợp thường thấy, mô hình thực thi sẽ bị chậm.
- Thêm mối quan tâm về bảo mật khi các logic chạy dưới browser (Tôi có thể hack app của tôi để cho tôi một khoản vay)
- Các ví dụ trên tập trung vào một website, nhưng hầu hết các kết hợp phức tạp thường đến từ nhiều trường hợp khác. Vì vậy khả năng ứng dụng nói chung của composition chưa được mô tả.
- Lưu trữ trạng thái ở đâu đây? Liệu client có thể được tin tưởng để được nắm giữ việc lưu trữ trạng thái trong workflow? Mặc dù việc mô hình hóa các trạng thái với REST là khả thi, nhưng nó cũng là một việc phức tạp.

## Cách tiếp cận 2: Choreography

Cách tiếp cận này điều khiển luồng từ một khu vực trung tâm gọi là orchestration. Tuy nhiên, đó không phải là cách duy nhất để định vị các thành phần để thực hiện công việc. Ví dụ, trong một buổi khiêu vũ, không có một người nào chỉ đạo biểu diễn. Thay vào đó, mỗi vũ công theo sát người gần nhất và tiến hành đồng bộ. Choreography áp dụng cùng ý tưởng vào business model.

Cách implement điển hình nhất là dùng một hệ thống event, mỗi hệ thống tham gia vào quy trình lắng nghe một vài event khác nhau và làm công việc riêng của họ. Mỗi hành động sẽ sinh ra một event bất đồng bộ trigger hệ thống liên quan tham gia vào luồng. Các môi trường như RxJava hay Node.js sử dụng programming model này.

Ví dụ, giả sử rằng một quy trình vay nợ bao gồm một yêu cầu vay nợ, một bước kiểm tra tín dụng, kiểm tra các dư nợ khác, một bước quản lý phê duyệt và một thông báo quyết định cuối cùng. Bức tranh sau đây cho thấy cách hiện thực hóa quy trình này bằng choreography. Yêu cầu được đặt trong một hàng đợi, được thu nhặt bởi actor tiếp theo, và đưa kết quả của nó vào hàng đợi kế tiếp cho actor kế tiếp, quy trình tiếp diễn cho tới khi nó được hoàn thành.

![](https://cdn-images-1.medium.com/max/800/1*kNPGVUGpWyoiuNTcgE9QNw.png)

Choreography như một buổi khiêu vũ. Cả hai đều phức tạp và phải luyện tập nhiều để thực hiện một cách chính xác. Ví dụ, lập trình viên không biết khi nào quy trình hoàn thành, nếu lỗi xảy ra hay quy trình gặp trục trặc. Choreography yêu cầu phải theo dõi khắt khe để theo sát quy trình, phục hồi và thông báo ngay khi gặp lỗi.

Một mặt khác, Choreography tạo ra các hệ thống khá độc lập với nhau, đó là lợi điểm chính của nó. Ví dụ, có thể thêm một actor mới vào quy trình mà không thay đổi các actor khác. Thông tin thêm xem ở bài viết [Scaling Microservices with an Event Stream (Nhân rộng Microservices với một Event Stream)](https://www.thoughtworks.com/insights/blog/scaling-microservices-event-stream) 

## Cách tiếp cận 3: Server tập trung

Lựa chọn đơn giản nhất sau cùng là một server tập trung (còn được gọi là orchestration)

Các implement của SOA sử dụng hai phương thức: ESB hay Bussiness Processes. MSA đề xuất một API Gateway (ví dụ: [Microservices: Decomposing Applications for Deployability and Scalability (Microservices: Phân rã ứng dụng để dễ deploy và scale)](http://www.infoq.com/articles/microservices-intro)). Tôi đoán API Gateway nhẹ tải hơn và sử dụng các công nghệ như REST/JSON. Tuy nhiên, trong một ý nghĩa kiến trúc thuần túy, tất cả kiểu orchestration trên được sử dụng với một server tập trung.

Một vài biến thể khác của server tập trung là "backend for frontends" (BEF), trong đó xây dựng một API server-side với mỗi loại client (ví dụ: một cho desktop, một cho iOs). Mô hình này tạo ra nhiều API khác nhau với mỗi loại client, tối ưu cho từng trường hợp. Tham khảo mô hình: [Backends For Frontends for more information](http://samnewman.io/patterns/architectural/bff/).

Đừng rối trí với những lựa chọn trên và hãy bắt đầu với API Gateway bởi lẽ nó là cách tiếp cận trực tiếp nhất. Ta có thể chuyển sang các lựa chọn phức tạp khác khi có nhu cầu.

# Quyết định thứ tư: Tránh Dependency Hell

Mục đích của MSA là cho phép các dịch vụ có thể phát hành và triển khai độc lập với nhau. Để làm được điều đó, ta phải tránh được dependency hell.

Cùng xem thử microservice "A" với API "A1" đã nâng cấp thành API "A2". Bây giờ có hai trường hợp xảy ra:

1. Microservice B phải gửi messenge chuẩn bị cho A1 đến A2. Hỗ trợ được trường hợp này là có tính tương thích ngược.

2. Microservice A có thể quay ngược lại về A1, và microservice C cũng có thể tiếp tục gửi message chuẩn bị cho A2 đến A1.

Nếu các microservices được release độc lập, bạn phải xử lý các tình huống trên. Nếu không, tất cả nỗ lực xây dựng MSA của bạn đã bị lãng phí.

Thông thường, xử lý các tình huống trên liên quan đến việc thêm các tham số phụ và không bao giờ đổi tên hay bỏ các tham số đã từng tồn tại. Các tình huống phức tạp hơn đều có thể xảy ra.

Bài viết [“Taming Dependency Hell” within Microservices with Michael Bryzek ("Thuần hóa Dependency Hell" trong Microservices với Michael Bryzek)](http://www.infoq.com/news/2015/06/taming-dependency-hell) thảo luận chi tiết về vấn đề này. [Ask HN: How do you version control your microservices? (Hỏi đáp Hacker News: Bạn quản lý version cho microservice như thế nào?)](https://news.ycombinator.com/item?id=9705098) cũng là một tài liệu tốt

Cuối cùng, hỗ trợ tương thích ngược và xuôi nên được ràng buộc thời gian để tránh phức tạp hóa. Ví dụ, ta có một nguyên tắc rằng không microservice nào nên sử dụng một API quá ba tháng tuổi. Điều này giúp developer của microservice có thể drop các luồng code hỗ trợ phiên bản cũ. 

Cuối cùng, tôi muốn khoa trương một tí về sơ đồ dependency của ta nên như thế nào trong kiến trúc microservice.

Một lựa chọn là gọi thoải mái microservice khác bất kỳ khi nào cần thiết. Điều đó tạo ra một kiến trúc spaghetti từ thời tiền ESB. Và tôi không phải là fan hâm mộ của mô hình đó.

Một điểm cực khác là rằng microservice không nên gọi microservice khác và tất cả kết nối phải nên thực hiện thông qua API gateway và message bus. Điều này sẽ dẫn tới một mô hình cây một cấp. Ví dụ, thay vì để microservice A gọi B, chúng ta sẽ đem kết quả từ microservice A tới gateway, nơi sẽ gọi B với kết quả đó. Đây là mô hình orchestration. Hầu hết các business logic bây giờ sẽ nằm ở gateway. Và vâng, điều này làm gateway phình to ra.

Đề nghị của tôi là hoặc chúng ta đi theo mô hình orchestration hoặc là làm việc cật lực hơn để cài đặt choreography đúng cách. Đúng rồi, tôi đang đề nghị rằng không nên làm theo kiểu spaghetti đấy.

# Kết luận

_Lời tác giả_

Mục đích của Microservices là tách rời các thành phần, giữ tính loose coupling. Một kiến trúc microservice được thiết kế cẩn thận sẽ giúp ta implement một project sử dụng một tập hợp các microservice, với mỗi thành phần được quản lý, phát triển và release độc lập nahu.

Khi thiết kế với microservices, ta phải để mắt đến mục tiêu cuối cùng, chính là "loose coupling". Có khá nhiều thách thức trên con đường đó và bài viết này trả lời những câu hỏi sau:

1. Tôi nên giải quyết tình huống phải chia sẻ dữ liệu giữa hai microservice như thế nào?
2. Tôi nên làm thế nào để phát triển các API microservice mà vẫn giữ được tính "loose coupling"?
3. Làm thế nào để xử lý bảo mật?
4. Làm thế nào để điều hành các microservice?

Cảm ơn! Tôi muốn nghe suy nghĩ của bạn sau khi đọc bài này.

Nếu bạn thích bài viết này, tôi nghĩ là những bài viết sau cũng khá thú vị đấy:
- [Multi-tenancy after 10 years of Cloud Computing](https://hackernoon.com/multi-tenancy-after-10-years-of-cloud-computing-19de782ef899)
- [Distributed Caching Woes: Cache Invalidation](https://medium.com/systems-architectures/distributed-caching-woes-cache-invalidation-c3d389198af3)

Đồng thời, hãy ghé thăm [bài viết nhiều lượt đọc nhất](https://iwringer.wordpress.com/) và [bài diễn văn này](https://www.slideshare.net/hemapani/presentations) [(video)](https://www.youtube.com/playlist?list=PLfcx6fgWEvUPhSpOfMOW4xN9H9djROBDi) của tôi. Liên lạc tôi qua (@srinath_perera)(https://twitter.com/srinath_perera?lang=en) và tìm tôi ở [đây](http://people.apache.org/~hemapani/).







