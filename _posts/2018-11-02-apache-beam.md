---
layout: post
title: 'Big Data Platform - Apache Beam'
date: 2018-11-01
author: Vchitai
color: rgb(255,10,32)
cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR98oX_KnqLw6x8G6dyn5sNPXWzQreKdDINK9Xqp6QZzZdmuYl5'
tags: jekyll xxx
---

> Những khái niệm cơ bản của Big Data. Những thông tin trong bài viết được tổng kết từ khóa học Big Data ở trường KHTN.

# Tổng quát về Apache Beam

Apache Beam là một mô hình thống nhất, mã nguồn mở để cài đặt những pipeline xử lý song song cho dữ liệu khối hay dữ liệu dòng. Bạn có thể xây dựng một chương trình để định nghĩa pipeline nói trên bằng những công cụ Apache Beam SDK. Pipeline sau đó có thể được thực thi bởi một trong những khối back-end xử lý phân tán có hỗ trợ Beam như Apache Apex, Apache Flink, Apache Spark và Google Cloud Dataflow.

Beam đặc biệt hữu ích với cách tác vụ xử lý dữ liệu xử lý ngẫu nhiên song song - Embarassingly Parallel, trong đó vấn đề có thể phân rã thành những khối dữ liệu nhỏ hơn có thể xử lý độc lập và song song với nhau. Bạn cũng có thể sử dụng Beam để trích xuất, biến đổi và tải dữ liệu vào kho dữ liệu hệ thống (Extract-Transform-Load ETL) và tích hợp dữ liệu gốc. Các công việc trên giúp di chuyển dữ liệu giữa các phương tiện lưu trữ và nguồn dữ liệu khác nhau, chuyển đổi dữ liệu vào một định dạng mong muốn, và tải dữ liệu vào một hệ thống mới.

## Apache Beam SDKs

Beam hiện tại đang hỗ trợ SDK cho các ngôn ngữ sau:
- Java
- Python
- Go
Đồng thời cũng hỗ trợ một Interface cho Scala là Scio

## Apache Beam Pipeline Runner

Những Apache Beam Pipeline Runner chịu trách nhiệm dịch pipeline xử lý dữ liệu mà bạn đã định nghĩa với chương trình Beam thành API tương thích với các hệ thống back-end xử lý dữ liệu phân tán khác. Khi chạy một chương trình Beam, bạn phải chỉ ra một runner tương thích với hệ thống back-end mà bạn muốn thực thi pipeline.

Những hệ thống back-end xử lý dữ liệu phân tán mà Beam đang hỗ trợ: 
- Apache Apex
- Apache Flink
- Apache Spark
- Apache Gearpump (dự án đang ấp ủ)
- Apache Samza
- Google Cloud Dataflow

# Những khái niệm cơ bản trong Beam
Tham khảo: https://beam.apache.org/documentation/programming-guide/

Để sử dụng Beam, bạn phải xây dựng một chương trình Driver bằng một trong những SDK của Beam. Chương trình Driver này định nghĩa tất cả các dữ liệu nhận vào, các bước biến đổi trung gian và dữ liệu xuất ra. Đồng thời nó cũng thiết lập những thông số và runner để thực thi cho pipeline (thông thường được truyền bằng command line).

SDK Beam cài đặt sẵn các lớp xử lý để đơn giản hóa cơ chế xử lý dữ liệu phân tán có thể mở rộng lớn. Các lớp xử lý của Beam hoạt động như nhau trên cả nguồn dữ liệu khối (batch) và dòng (stream). Khi tạo một pipeline Beam, chúng ta phải hiểu rằng những tác vụ xử lý dữ liệu của chúng ta đang hoạt động dưới những lớp xử lý này. Nó bao gồm:

- Pipeline: đóng gói toàn bộ tác vụ xử lý dữ liệu từ đầu đến cuối. Bao gồm cả đọc dữ liệu đầu vào, biến đổi dữ liệu đó và ghi dữ liệu đầu ra. Tất cả chương trình Beam phải tạo một Pipeline. Khi tạo một Pipeline, ta cũng phải chỉ ra tùy chọn thực thi để cho Pipeline biết nên chạy ở đâu và chạy như thế nào.

- PCollection: mô tả một tập dữ liệu phân tán mà Beam pipeline đang thao tác. Tập dữ liệu có thể cố định, như từ những nguồn cố định như file, hay không cố định như từ những nguồn cập nhật liên tục qua subscription hay những cơ chế khác. Pipeline thông thường sẽ tạo một PCollection khởi đầu bằng các đọc dữ liệu từ khác nguồn bên ngoài, nhưng ta cũng có thể tạo một PCollection từ dữ liệu trong bộ nhớ ngay trong chương trình. Như vậy, các PCollection có thể là dữ liệu đầu vào và đầu ra cho mỗi bước trung gian trong pipeline.

- PTransform: mô tả một quá trình xử lý dữ liệu, hay một bước, trong pipeline. Mỗi PTransform nhận vào một hoặc nhiều object PCollection làm input và thực hiện những hàm xử lý mà ta cung cấp trên những các element của PCollection ấy và sinh ra không hoặc nhiều object PCollection khác.

- Các bước biến đổi nhập xuất (I/O): Beam cung cấp khá nhiều kiểu nhập xuất khác nhau để đọc ghi dữ liệu từ liệu hệ thống lưu trữ bên ngoài.

Một chương trình Beam thông thường sẽ hoạt động như sau:

- Tạo một object Pipeline và thiết lập các thông số thực thi cho pipeline, bao gồm cả Pipeline Runner.

- Tạo một PCollection khởi đầu cho dữ liệu pipeline hoặc sử dụng IOs để đọc dữ liệu từ các hệ thống lưu trữ dữ liệu bên ngoài hoặc sử dụng transform Create để tạo PCollection từ dữ liệu trong bộ nhớ.

- Chạy PTransforms cho các PCollection. Transform có thể thay đổi, lọc, nhóm, phân tích hay xử lý dữ liệu trong PCollection. Một transform tạo một PCollection mới mà không được chỉnh sửa collection input. Một pipeline thông thường chạy lần lượt các transform cho mỗi PCollection ouput mới được sinh ra cho tới khi hoàn thành quá trình xử lý. Tuy nhiên, lưu ý rằng một pipeline không chỉ là các transform chạy tối tiếp nhau theo một đường thẳng. Nếu xem các PCollection như các biến chạy và PTransform như các hàm chạy trên các biến, hình dạng của pipeline có thể là một đồ thị xử lý rất phức tạp

- Sử dụng IO để ghi các PCollection đã được xử lý cuối cùng ra hệ thống lưu trữ bên ngoài.

- Chạy pipeline sử dụng Pipeline Runner được chỉ định trước 

Khi ta chạy một chương trình Beam, Pipeline Runner được chỉ được sẽ xây dựng một biểu đồ workflow của pipeline dựa trên các PCollection mà ta tạo ra và các transform mà ta sử dụng. Đồ thị đó được thực thi sử dụng một hệ thống back-end xử lý phân tán, trở thành một "job" bất đồng bộ trên hệ thống ấy.

# Mô hình thực thi của Apache Beam
Tham khảo: https://beam.apache.org/documentation/execution-model/

## Xử lý các data element 

Quá trình giao tiếp và serialize (tuần tự hóa - tiến hình biến đổi một đối tượng thành một định dạng có thể lưu trữ và di chuyển) giữa các element (đơn vị dữ liệu - đơn vị nhỏ nhất để xử lý dữ liệu trong Beam) giữa các máy tính là một trong những tiến trình tốn kém nhất trong khi pipeline thực thi phân tán. Tránh quá trình serialize này sẽ yêu cầu phải tái xử lý các element sau khi gặp lỗi và có thể giới hạn việc phân tán ouput tới các máy tính khác.

### Serialize and giao tiếp trong hệ thống

Runner có thể serialize các element giữa các máy để giao tiếp với nhau và cho các mục đích khác như giữ tính bền vững (persistent) của hệ thống.

Một runner có thể quyết định cách truyền tải những các element giữa các transform theo nhiều cách khác nhau, như là:

1. Truyền các element tới một worker để xử lý nhóm dữ liệu. Thao tác này liên quan việc serialize, nhóm hay sắp xếp theo khóa các element.

2. Tái phân phối các element giữa các worker để điều chỉnh tiến trình song song. Thao tác này liên quan quá trình serialize và giao tiếp bằng các element giữa các worker khác nhau

3. Sử dụng các element như một input cho ParDo. Việc này yêu cầu phải serialize các element và truyền tải chúng tới tất cả các worker thực thi ParDo.

4. Truyền dữ liệu giữa các transform đang chạy trên cùng một worker. Cho phép Runner tránh phải serialize dữ liệu; thay vào đó, runner chỉ cần truyền dữ liệu trong bộ nhớ. 

Có vài tình huống khiến cho runner buộc phải serialize và bảo toàn dữ liệu là :

- Khi đang là một phần của DoFn có trạng thái, runner phải lưu trữ giá trị dữ liệu với cơ chế quản lý trạng thái.
- Khi cập nhật kết quả quá trình xử lý, runner phải lưu trữ lại các ouput như là checkpoint.

### Đóng gói dữ liệu và bảo toàn hệ thống

Các pipeline của Beam thường tập trung vào xử lý vấn đề "embarassingly parallel" (Song song ngẫu nhiên - Những vấn đề có khả năng xử lý song song mà ít cần giao tiếp giữa các tác vụ song song). Bởi vậy, các API nhấn mạnh việc xử lý dữ liệu song song, khiến cho những thao tác chính xác như "gán một số thứ tự tăng dần cho từng các element trong một PCollection" trở nên khó khăn. Hệ thống được cố ý thiết kế như vậy vì những thuật toán như trên khó có thể giải quyết những vấn đề mở rộng hơn.

Xử lý tất cả dữ liệu một cách song song cũng có vài nhược điểm. Cụ thể là nó khiến cho ta không thể xử lý dữ liệu theo khối (batch), ví dụ như không thể ghi dữ liệu xuống hay sao lưu tiến trình trong lúc đang xử lý.

Thay vì xử lý tất cả dữ liệu tuần tự, các dữ liệu trong PCollection được xử lý theo những khối. Việc phân chia các tập dữ liệu thành các khối được các runner thực hiện một cách tùy ý. Việc này cho phép runner có thể chọn một cách lưu trữ kết quả trung gian hiệu quả giữa các đơn vị dữ liệu và có thể thực hiện lại công việc nếu có lỗi xảy ra. Ví dụ như một runner xử lý theo stream có thể chọn xử lý và commit từng khối nhỏ dữ liệu và một runner xử lý theo batch có thể xử lý những khối dữ liệu lớn hơn.

## Xử lý song song trong và ngoài các bước transform

### Xử lý dữ liệu song song trong một bước transform

Khi thực thi một ParDo, một runner có thể chưa một tập collection ví dụ gồm chín đơn vị dữ liệu vào hai khối dữ liệu dữ liệu để xử lý như hình.

![](https://beam.apache.org/images/execution_model_bundling.svg)

Khi ParDo trên tiến hành thực thi, các worker có thể xử lý hai khối dữ liệu song song như hình.

![](https://beam.apache.org/images/execution_model_bundling_gantt.svg)

Bởi vì các đơn vị dữ liệu là thành phần nhỏ nhất không thể chia nhỏ hơn, số lượng tác vụ song song tối đa cho một transform chính là số lượng đơn vị dữ liệu trong tập dữ liệu. Tập dữ liệu đầu vào có chín các element, vì vậy số lượng tác vụ song song tối đa là chín.

![](https://beam.apache.org/images/execution_model_bundling_gantt_max.svg)

### Xử lý dữ liệu song song giữa các bước transform

Các transform ParDo được thực thi theo thứ tự có thể được xử lý song song tùy thuộc vào cách runner chọn thực thi transform sử dụng dữ liệu trên các đơn vị dữ liệu được tạo ra bởi transform sinh ra dữ liệu mà không cần đợi cả khối. Trong hình minh họa, ParDo1 và ParDo2 được thực thi song song nếu ouput của ParDo1 cần phải được xử lý ở chung worker với ParDo1.

![](https://beam.apache.org/images/execution_model_bundling_multi.svg)

Hình dưới cho chúng ta thấy cách mà các transform có thể thực thi song song với nhau. Worker thứ nhất thực thi ParDo1 trên đơn vị dữ liệu của bundle A (khối dữ liệu A) tạo ra bundle C, và sau đó thực thi ParDo2 ngay trên đơn vị dữ liệu của bundle C.. Tương tự, worker thứ hai thực thi ParDo1 trên các đơn vị dữ liệu của bundle B tạo ra bundle D, và sau đó thực thi ParDo2 ngay trên đơn vị dữ liệu của bundle D.

![](https://beam.apache.org/images/execution_model_bundling_multi_gantt.svg)

Thực thi các transform theo cách này cho phép runner tránh phải tái phân phối các đơn vị dữ liệu giữa các worker, giúp tiết kiệm hao phí giao tiếp. Tuy nhiên, các tác vụ song song tối đa bây giờ phụ thuộc vào tác vụ song song tối đa của bước thực thi song song đầu tiên.

## Xử lý lỗi giữa các bước transform

### Lỗi trong một bước tranform

Nếu quá trình xử lý của một đơn vị dữ liệu trong bundle thất bại, toàn bộ bundle sẽ thất bại. Toàn bộ quá trình xử lý elements trên bundle đó phải được thực hiện lại ngay để tránh toàn bộ pipeline thất bại, mặc dù chúng không cần thiết phải phải xử lý lại cùng với bundle cũ.

Với ví dụ này, chúng ta sẽ sử dụng ParDo từ phía trên có một tập dữ liệu input gồm chín đơn vị dữ liệu và được chia thành hai bundle.

Trong hình dưới, worker thứ nhất xử lý thành công cả năm element trong bundle A. Worker thứ hai xử lý bốn element trong bundle B: hai element đầu tiên được xử lý thành công và element thứ ba xử lý thất bại, element cuối cùng vẫn đang chờ xử lý.

Chúng ta có thể thấy runner sẽ thực thi lại trên toàn bộ dữ liệu trong bundle B và quá trình xử lý hoàn toàn thành công vào lần 2. Lưu ý rằng quá trình thực thi lại không cần thiết phải chạy trên cùng worker với lần chạy ban đầu.

![](https://beam.apache.org/images/execution_model_failure_retry.svg)

Bởi vì chúng ta gặp phải một lỗi trong quá trình xử lý một element trong bundle input, chúng ta phải xử lý lại tất cả element trong bundle input. Có nghĩa là runner phải bỏ tất cả bundle output bởi vì tất cả kết quả phải được tính toán lại.

### Coupled failure: Lỗi giữa các bước tranform

Nếu có một lỗi trong lúc xử lý một đơn vị dữ liệu trong ParDo2 khiến cho ParDo1 phải thực thi lại, hai bước trên gọi là co-failing.

Trong ví dụ này chúng ta sẽ sử dụng lại hai ParDo được định nghĩa ở phần trên

Worker thứ hai đã thành công thực thi ParDo1 trên tất cả dữ liệu ở bundle B. Tuy nhiên, worker thất bại trong việc xử lý dữ liệu ở bundle D, nên ParDo2 thất bại. Runner buộc phải từ bỏ và tính toán lại ouput của ParDo2. Bởi vì runner đang thực thi ParDo1 và ParDo2 cùng nhau, bundle output từ ParDo1 phải bị bỏ đi và tất cả element trong bundle input phải được xử lý lại. Hai ParDo đang co-failing.

![](https://beam.apache.org/images/execution_model_bundling_coupled_failure.svg)

Lưu ý rằng bước retry không cần thiết phải có cùng thời gian thực hiện với lần đầu.

Tất cả DoFns gặp phải coupled failures sẽ bị ngắt và bị loại bỏ vì chúng không theo lifecycle của một DoFn bình thường.

Thực thi transform theo hướng này cho phép runner tránh lưu trữ các đơn vị dữ liệu các bước transform, tiết kiệm hao phí lưu trữ.