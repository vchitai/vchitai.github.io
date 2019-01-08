Học cách quản lý project Python là một điều cần thiết khi chúng ta làm việc với các class của Python và sẵn sàng xây dựng các dự án lớn hơn. Các module tự viết và module được Python cung cấp là những thành phần cơ bản trong kiến trúc, nhưng để sử dụng các hàm và class trong module, chúng ta phải import các module vào nhau, sử dụng lại code đã được viết trước đó. Nếu không chú ý, chúng ta sẽ dễ dàng rơi vào các bẫy import hỗn loạn.
Bài viết sẽ trình bày về kiến thức cơ bản về module và package, đồng thời chỉ một vài khác biệt của absolutely import và relatively import, cuối cùng trình bày một số lỗi phổ biến trong quá trình import. Lưu ý: Bài viết đang trình bày trên Python3

# Module và Package

Về cơ bản, một file Python chính là một module. Chúng ta có thể define các class, function và biến trong đó. Nếu xem một module Python là một tập tin, thì một package là một thư mục. Các package có thể có các package con và các module để project của chúng ta dễ quản lý và có tổ chức hơn, cuối cùng, ta có thể đóng gói project và phân phối cho những người khác sử dụng

Đầu tiên hãy tìm hiểu về module. Giả sử có một module sample_module.py define hàm sample_func như sau:

```python
def sample_func():
    print('Hello!')
```

Bây giờ có bạn đang có một module sample_module_import khác trong cùng thư mục muốn sử dụng lại function này, lúc này chúng ta có thể import trực tiếp sample_module như sau:

```python
from sample_module import sample_func
if __name__ == '__main__':
    sample_func()
```

Chạy `python3 sample_module_import`, ta có kết quả:

```
Hello!
```

Kế đến là package, chúng ta sẽ đưa hai tập tin trên vào cùng một thư mục tên là sample_package, tổ chức như bên dưới

```
sample_package/
├── __init__.py
├── sample_module.py
└── sample_module_import.py
```

File `__init__.py` ở đây vô cùng quan trọng, mặc dù không có nội dung gì, nhưng chúng ta vẫn phải đặt nó ở đấy để thông báo rằng nó là một package.

Lúc này, nếu chúng ta vào trong thư mục trên chạy câu lệnh như trên thì cũng được kết quả tương tự. Nhưng vì tất cả đã được đóng thành một package, chúng thường sẽ được import ở nhiều nơi trong project. Lúc này việc sử dụng import sẽ hơi khác.

Chúng ta sẽ thử thay đổi file sample_package/sample_module_import.py một tí. Giả như chúng ta đang ở trên thư mục cha của sample_package và chạy các lệnh sau：

```
1. python3 sample_package/sample_module_import.py
2. python3 -m sample_package.sample_module_import
```

Những cách import dưới đây sẽ cho ra kết quả gì?

```python
# relative import ngầm không đúng chuẩn cú pháp của Python (Python3 không hỗ trợ)
from sample_module import sample_func
1. Thành công xuất ra Hello!
2. ModuleNotFoundError. Vì Python3 không hỗ trợ relative import ngầm (Phía trước không đặt dấu chấm) và coi nó như absolute import, và các thứ 3 mới là cách viết đúng

# relative import ngầm đúng chuẩn cú pháp của Python (Python3 không hỗ trợ)
from .sample_module import sample_func
1. Không chạy được vì một file chứa một đường dẫn tương đối không thể được thực thi trực tiếp, nó chỉ có thể được tham chiếu như một module.
2. Thành công xuất ra Hello!

# absolute import đúng chuẩn
from sample_package.sample_module import sample_func
1. Nếu đường dẫn package này không nằm trong python path, cách này sẽ thất bại
2. Thành công xuất ra Hello!
```

Chúng ta sẽ nói rõ thêm về absolute import và relative import ngay sau đây:
Lệnh -m trong câu lệnh thực thi là để Python import trước package hay module mà ta cần, sau đó bắt đầu chạy. Vì vậy khi sample_module_import đang chạy, nó sẽ tìm các module dựa theo sample_package nên những lần import trên sẽ thành công.
Ngoài ra, python path là nơi mà Python sẽ sử dụng để tìm kiếm các module, là vị trí thư mục đặt các module chuẩn. Vì vậy, trong các thứ 3, Python sẽ đưa ra lỗi vì nó không thể tìm thấy sample_package.sample_module trong python path. Chúng ta có thể thêm thư mục hiện tại vào sys.path, chính là đường dẫn Python (được khởi tạo từ biến môi trường PYTHONPATH), để Python có thể tìm được module này, nhưng phương pháp này rất tệ và khó có thể bảo trì được, hầu hết được sử dụng để debug, các trường hợp khác cực kỳ không được khuyến khích.

# Cú pháp import cơ bản

Như đã giới thiệu ở trên, tôi sẽ giới thiệu nó ở đây. Nếu ta muốn sử dụng các function, class hay variable trong module khác, ta sẽ phải import chúng trước khi sử dụng. Các module thường được import trên đầu file, nhưng không bắt buộc phải như vậy.

## Cách 1: import [module]

```python
# Import toàn bộ module random
import random
# Sử dụng hàm randint của module random
print(random.randint(0, 5))
```

## Cách 2：from [module] import [name1, name2, ...]

```python
# Từ trong module random import chỉ một hàm randint
from random import randint
# Không giống như cách trên, lúc sử dụng randint, ta không cần thêm tiền tố random
print(randint(0, 5))
```

##Cách 3：import [module] as [new_name]

```python
# Import toàn bộ module random
# Nhưng tên của module này có thể xung đột với module khác, nên ta đổi tên nó thành rd
import random as rd
# Sử dụng rd thay vì random
print(rd.randint(0, 5))
```

## Cách 4（不推薦）：from [module] import \*

```python
# Import toàn bộ mọi thứ trong module random
from random import *
# Sử dụng randint không cần tiền tố random
print(randint(0, 5))
```

_Cách 4 cực kỳ không khuyến khích vì dễ gây xung đột tên, gây khó đọc và bảo trì code_

# Absolute Import v.s. Relative Import

Python có hai cách import，absolute import và relative import. Absolute import sử dụng toàn bộ đường dẫn module，relative import chỉ sử dụng đường dẫn module tương đối trong package hiện tại.

Ta sử dụng relative import khi có lúc cần thay đổi cấu trúc của project, các package và module bên trong bị thay đổi. Lúc này nếu các package bên trong sử dụng relative import, quan hệ tương đối của chúng sẽ không thay đổi, không cần phải import lại từng module với đường dẫn mới. Nhưng vì relative import phụ thuộc vào package hiện tại, nó sẽ gây ra nhiều kết quả khác nhau khi thực thi. Khi bạn vô tình tạo ra một loạt lỗi thì absolute import giảm được rất nhiều rắc rối.

Tham khảo cấu trúc sau của PEP328. Kiến trúc của package được trình bày như sau:

```
package
├── __init__.py
├── subpackage1
│   ├── __init__.py
│   ├── moduleX.py
│   └── moduleY.py
├── subpackage2
│   ├── __init__.py
│   └── moduleZ.py
└── moduleA.py
```

Bây giờ giả sử package/subpackage1/moduleX.py muốn import một vài thứ khác từ module khác, hãy sử dụng cú pháp sau ([A] đại diện cho absolute import, [R] đại diện relative import):

```python
# Import module họ hàng `moduleY` dưới cùng package
[A] from package.subpackage1 import moduleY
[R] from . import moduleY
[Error] import .moduleY
# Từ trong  從同一個 package 底下的 sibling module `moduleY` 中，
# import `spam` 這個 function
[A] from package.subpackage1.moduleY import spam
[R] from .moduleY import spam
# 從隔壁 package 底下的 module `moduleZ` 中，
# import `eggs` 這個 function
[A] from package.subpackage2.moduleZ import eggs
[R] from ..subpackage2.moduleZ import eggs
# Import parent package 底下的 module `moduleA`
[A] from package import moduleA
[R] from .. import moduleA 或 from ... package import moduleA
```
