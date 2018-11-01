---
layout: post
title: 'Big Data Concept'
date: 2018-10-28
author: Vchitai
color: rgb(255,10,32)
cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR98oX_KnqLw6x8G6dyn5sNPXWzQreKdDINK9Xqp6QZzZdmuYl5'
tags: jekyll xxx
---

> Những khái niệm cơ bản của Big Data. Những thông tin trong bài viết được tổng kết từ khóa học Big Data ở trường KHTN.

# Big Data là gì?

Có rất nhiều định nghĩa trên khắp thế giới được đưa ra để định nghĩa cho khái niệm này. Chúng ta sẽ theo dõi vài định nghĩa nổi tiếng sau:

> Big data is a term used to refer to data sets that are too large or complex for traditional data-processing application software to adequately deal with. Data with many cases (rows) offer greater statistical power, while data with higher complexity (more attributes or columns) may lead to a higher false discovery rate. - [Wikipedia](https://en.wikipedia.org/wiki/Big_data)

Big Data là một thuật ngữ để chỉ việc một tập dữ liệu quá lớn hay quá phức tạp để xử lý đối với các phần mềm xử lý dữ liệu truyền thống. Càng nhiều dữ liệu cung cấp một nguồn sức mạnh thống kê to lớn, trong khi đó dữ liệu với độ phức tạp càng cao sẽ dẫn đến tỉ lệ khai thác thất bại cao hơn.

> Big data is high-volume, high-velocity and/or high-variety information assets that demand cost-effective, innovative forms of information processing that enable enhanced insight, decision making, and process automation. - [Gartner IT Glossary](https://www.gartner.com/it-glossary/big-data/)

Big Data là những tập thông tin với "dung lượng" lớn, "vận tốc" (thay đổi) lớn và "độ đa dạng" cao, yêu cầu những hình thức xử lý thông tin cải tiến và hiệu quả cho phép ta khai thác thông tin, ra quyết định và xử lý tự động.

Big Data is a term that describes at least three separate, but irrelated, trends
- Capturing and managing lots of information
- Working with many new types of data
- Exploiting these masses of information and new data types with new styles of applications
- Hadoop for Dummies, Special Ed. 2012

Big Data là một thuật ngữ miêu tả ít nhất ba xu hướng tách biệt và không liên quan:
- Thu thập và quản lý rất nhiều dữ liệu
- Làm việc với nhiều kiểu dữ liệu mới
- Khai thác khối lượng dữ liệu và những kiểu dữ liệu trên với nhiều kiểu ứng dụng.

Nói tóm lại
- "Big Data" tương tự với "small data" nhưng có kích thước lớn hơn.
- Xử lý khối lượng dữ liệu lớn yêu cầu nhiều cách tiếp cận khác với truyền thống.
- Khai thác dữ liệu từ Big Data giúp ta giải quyết nhiều vấn đề cũ và mới một cách tốt hơn.
- Big Data không phải là một công nghệ đơn lẻ mà là sự kết hợp của các công nghệ cũ và mới giúp công ty có những thông tind được khai thác mang tính thực tiễn.
- Công nghệ Big Data phải có khả năng xử lý khối lượng lớn các dữ liệu khác nhau với tốc độ ổn định, trong thời gian cho phép để cho phép phân tích và phản ứng lại trong thời gian thực.

# Những đặc tính V của Big Data

Các đặc tính của Big Data được biểu thị qua 4 chữ V:
- Volume (Dung lượng dữ liệu)
Khối lượng dữ liệu sinh ra ngày nay là khổng lồ so với các nguồn dữ liệu truyền thống do sự gia tăng của các nguồn tạo dữ liệu, các cảm biến có độ nhạy bén cao hơn và những cơ sở hạ tầng có khả năng scale lớn. Đơn vị đo dữ liệu nay đã lên đến Exabyte, zettabyte, yottabyte,....
- Velocity (Tốc độ thay đổi dữ liệu)
Dữ liệu được sinh ra ngày càng nhanh và không bao giờ dừng lại. Và yêu cầu về tốc độ mà chúng ta biến dữ liệu thành những thông tin hữu ích ngày càng cao. Từ các phương pháp xử lý dữ liệu theo khối (batch), nay ta phải xử lý dữ liệu theo dòng (stream) do các phương tiện kết nối ngày càng nhiều. Đó là cuộc chạy đua lợi thế cạnh tranh và các thông tin để tiền xử lý dữ liệu
- Variety (Độ đa dạng của dữ liệu)
Dữ liệu ngày nay được sinh ra từ rất nhiều nguồn, máy móc và cả con người, được xử lý từ trong và ngoài các tổ chức do sự bành trướng của công nghệ di động, đa phương tiện truyền thông xã hội, các thiết bị IoT. Cấp độ cấu trúc dữ liệu và độ phức tạp ngày càng cao, dữ liệu ngày nay có thể chia làm ba loại: có cấu trúc, phi cấu trúc và bán cấu trúc
- Veracity (Tính không chắc chắn của dữ liệu)
Tính chất này do chất lượng của các nguồn dữ liệu khác nhau gây ảnh hưởng đến tính toàn vẹn và rõ ràng của dữ liệu. Nhiều thông tin được sinh ra cần phải được truy xuất nguồn gốc và tính tin cậy để không khai thác ra những thông tin sai lệch.

Và tất cả những đặc tính trên nhằm mang lại chữ V mà ta cần quan tâm nhất - Value, giá trị thông tin ta nhận được từ việc khai thác dữ liệu. Thông tin này giúp chúng ta xử lý vấn đề và ra quyết định chính xác mang lại lợi ích rất lớn.

# Những vấn đề cơ bản của Big Data

- Khi khối lượng dữ liệu ngày càng lớn, giá trị của những record dữ liệu khác nhau sẽ giảm tỉ lệ với độ tuổi, loại, độ màu mỡ, số lượng và các tác nhân khác.

- Rất khó để xử lý những dữ liệu phức tạp bằng các hệ thống phân tích truyền thống hiện tại. Cơ sở hạ tầng không cho phép lưu trữ tập trung khối lượng dữ liệu quá lớn, và việc vận chuyển dữ liệu giữa các hệ thống cũng gặp nhiều trở ngại về băng thông, tốc độ truyền tải.

- Có một sự khoảng cách đáng kể giữa những nhà lãnh đạo kinh doanh và những chuyển gia IT. Trong khi những nhà lãnh đạo quan tâm đến việc tăng lợi nhuận cho việc kinh doanh, những chuyên gia IT chỉ quan tâm về kỹ thuật lưu trữ và xử lý.

- Vấn đề quản lý dữ liệu có lẽ là vấn đề khó nhất. Vấn đề truy xuất, sử dụng, cập nhật, quản trị và trích dẫn là những vấn đề lớn chắn đường. 
    - Các nguồn dữ liệu đa dạng về kích thước, định dạng và các thu thập dữ liệu
    - Trả lời những câu hỏi về xuất xứ, ý nghĩa của dữ liệu được thu thập
    - Xác thực từng mẩu dữ liệu là chuyện phi thực tế

- Sức mạnh của những bộ xử lý là có giới hạn. Những thuật toán xử lý và phân tích dữ liệu song song để có thể mở rộng đang rất cần thiết.