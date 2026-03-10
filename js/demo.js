// 1. Hộp cảnh báo
window.alert("Hello! Đây là window.alert()");

// 2. Hộp nhập liệu
let name = window.prompt("Nhập tên của bạn:");
console.log("Tên người dùng nhập:", name);

// 3. Ghi trực tiếp ra HTML (không khuyến khích dùng nhiều)
document.write("<h2>Xin chào " + name + "</h2>");

// 4. Thay đổi nội dung một phần tử HTML bằng innerHTML
// (yêu cầu HTML có phần tử id="output")
let output = document.getElementById("output");
if (output) {
    output.innerHTML = "<p>Đây là nội dung được chèn bằng innerHTML</p>";
}

// 5. Xuất ra bảng điều khiển trình duyệt
console.log("Chương trình đã chạy xong");
