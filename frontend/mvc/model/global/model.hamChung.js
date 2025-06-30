import { GlobalStore, DoiTuyen } from "/frontend/global/global.js";


import PrimaryKeys from './databaseKey.js';

const hamChung = {
    PrimaryKeys, // 👈 cho phép gọi ở nơi khác: hamChung.primaryKeys["cau_thu"]
    async layDanhSach(table) {
        return await layDanhSach(table);
    },
    async layThongTinTheo_ID(table, id) {
        return await layThongTinTheo_ID(table, id);
    },
    async layThongTinTheo_2_ID(table, id, id2) {
        return await layThongTinTheo_2_ID(table, id, id2);
    },

    async taoID_theoBang(table) {
        return await taoID_theoBang(table);
    },

    async them(data, table_name) {
        return await them(data, table_name)
    },
    async sua(data, table_name) {
        return await sua(data, table_name)
    },
    async xoa(data, table_name) {
        return await xoa(data, table_name)
    },
    doiKhoangTrangThanhGachDuoi(tenFile) {
        return doiKhoangTrangThanhGachDuoi(tenFile)
    },
    getImage(public_id) {
        return getImage(public_id)
    },

    async uploadImage(file) {
        return uploadImage(file);
    },
    // uploadImage(imagePath) {
    //     return uploadImage(imagePath);
    // },
    // deleteImage(public_id) {
    //     return deleteImage(public_id);
    // },

    async taoTranDau_getHinhThucTaoDoi() {
        return await getHinhThucTaoDoi();
    },
    async taoTranDau_chiaBang(teams, danh_sach_doi_hat_dong, bangs, random = false) {
        return await taoTranDau_chiaBang(teams, danh_sach_doi_hat_dong, bangs, random);
    },
    async taoTranDau_vongTron(teams) {
        return await taoTranDau_vongTron(teams);
    },
    async taoTranDau_loaiTrucTiep(teams, randomize = false) {
        return await taoTranDau_loaiTrucTiep(teams, randomize);
    },


    async sendEmail(emailReceiver, subject, message) {
        return await sendEmail(emailReceiver, subject, message);
    }



};

async function layDanhSach(table) {
    console.log(GlobalStore.getLinkCongAPI() + table);
    try {
        const response = await fetch(GlobalStore.getLinkCongAPI() + table);
        return await response.json();
    } catch (error) {
        console.error(`Lỗi khi lấy danh sách ${table}:`, error);
        return [];
    }
}

// Hàm lấy chi tiết theo ID
async function layThongTinTheo_ID(table, id) {
    try {
        const response = await fetch(GlobalStore.getLinkCongAPI() + table + "/" + id);
        return await response.json();
    } catch (error) {
        console.error(`Lỗi khi lấy thông tin ${table} với ID ${id}:`, error);
        return null;
    }
}
async function layThongTinTheo_2_ID(table, id, id2) {
    try {
        const response = await fetch(GlobalStore.getLinkCongAPI() + table + "/" + id + "/" + id2);
        return await response.json();
    } catch (error) {
        console.error(`Lỗi khi lấy thông tin ${table} với ID ${id}:`, error);
        return null;
    }
}



async function taoID_theoBang(table) {
    const primaryKeys = PrimaryKeys;
    try {
        const response = await fetch(GlobalStore.getLinkCongAPI() + table);
        const danhSach = await response.json();

        // Lấy khóa chính cho bảng từ đối tượng ánh xạ
        const keyColumns = primaryKeys[table] || ['id']; // Nếu không có trong ánh xạ thì dùng 'id' làm mặc định

        // Chuyển "don_dat_ban" -> "ddb_"
        const prefix = table.split("_").map(word => word.charAt(0)).join("") + "_";

        //   console.log(prefix);
        if (!Array.isArray(danhSach) || danhSach.length === 0) {
            console.log(prefix);
            return `${prefix}0001`; // Nếu bảng rỗng, tạo ID đầu tiên
        }
        //s   console.log(prefix);

        // Tìm ID lớn nhất trong danh sách theo các khóa chính đã xác định
        const lastID = danhSach
            .map(item => keyColumns.map(key => item?.[key]).join("_")) // Kết hợp các khóa chính lại với nhau
            .filter(id => typeof id === "string" && id.startsWith(prefix)) // Kiểm tra kiểu dữ liệu và prefix
            .sort()
            .pop();

        if (!lastID) {
            return `${prefix}0001`; // Nếu không tìm thấy ID hợp lệ
        }

        // Lấy số cuối cùng, tăng lên 1
        const numberPart = parseInt(lastID.split("_").pop()) || 0;
        const newID = `${prefix}${(numberPart + 1).toString().padStart(4, "0")}`;

        return newID;
    } catch (error) {
        console.error(`Lỗi khi lấy danh sách ${table}:`, error);
        return `${table.split("_").map(w => w.charAt(0)).join("")}_0001`; // ID mặc định nếu lỗi
    }
}



async function them(data, table_name) {
    if (!data) {
        console.error("Dữ liệu không hợp lệ!");
        alert("Dữ liệu không hợp lệ!");
        return;
    }

    const url = `${GlobalStore.getLinkCongAPI()}${table_name}`;

    // console.log("Gửi POST request tới:", url);
    // console.log("Dữ liệu gửi đi:", data);

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
        .then(async response => {
            const text = await response.text();
            if (!text.trim().startsWith("{") && !text.trim().startsWith("[")) {
                //      console.log("Phản hồi từ server:", text);
                return { message: text };
            }
            return JSON.parse(text);
        })
        .then(resData => {
            // alert(resData.message || "Thêm dữ liệu thành công.");
            console.log("Thêm thành công:", resData.message);
            //  table();
        })
        .catch(error => {
            console.error("Có lỗi xảy ra khi thêm:", error.message);
            alert(`Lỗi: ${error.message}`);
        });
}
async function sua(data, table_name) {

    const primaryKeys = PrimaryKeys[table_name];

    if (!data) {
        console.error("Dữ liệu không hợp lệ!");
        alert("Dữ liệu không hợp lệ!");
        return;
    }
    if (!primaryKeys) {
        console.error(`Bảng ${table_name} không hợp lệ.`);
        alert("Bảng không hợp lệ!");
        return;
    }

    const keyValues = primaryKeys.map(key => data[key]);
    if (keyValues.some(value => value === undefined)) {
        console.error("Thiếu thông tin khóa chính!", data);
        alert("Thiếu thông tin khóa chính!");
        return;
    }

    const idPath = keyValues.join("/");
    const url = `${GlobalStore.getLinkCongAPI()}${table_name}/${idPath}`;

    // console.log("Gửi PUT request tới:", url);
    // console.log("Dữ liệu gửi đi:", data);

    fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
        .then(async response => {
            const text = await response.text();

            // Kiểm tra nếu phản hồi trống hoặc không phải JSON
            if (!text.trim().startsWith("{") && !text.trim().startsWith("[")) {
                //     console.log("Phản hồi từ server:", text);
                return { message: text }; // Trả về một object chứa message
            }

            return JSON.parse(text); // Nếu JSON hợp lệ, parse bình thường
        })
        .then(resData => {
            console.error(`Sửa thành công:`, resData.message);
            //   alert(resData.message || "Sửa dữ liệu thành công.");
            // table();
        })
        .catch(error => {
            console.error("Có lỗi xảy ra khi sửa:", error.message);
            alert(`Lỗi: ${error.message}`);
        });
}
async function xoa(keys, table_name) {
    const primaryKeysMap = PrimaryKeys;

    // Kiểm tra xem bảng có hợp lệ không
    const primaryKeys = primaryKeysMap[table_name];
    if (!primaryKeys) {
        console.error(`Bảng ${table_name} không hợp lệ.`);
        alert("Bảng không hợp lệ!");
        return;
    }

    // Kiểm tra `keys` có hợp lệ không
    if (!keys || typeof keys !== "object") {
        console.error("Thiếu thông tin khóa chính để xóa!", keys);
        alert("Thiếu thông tin khóa chính để xóa!");
        return;
    }

    // Lấy danh sách giá trị của khóa chính
    const keyValues = primaryKeys.map(key => keys[key]);

    // Kiểm tra xem tất cả giá trị của khóa chính đã có chưa
    if (keyValues.some(value => value === undefined || value === null)) {
        console.error("Thiếu thông tin khóa chính!", keys);
        alert("Thiếu thông tin khóa chính!");
        return;
    }

    // Tạo đường dẫn DELETE từ khóa chính
    const idPath = keyValues.join("/");
    const url = `${GlobalStore.getLinkCongAPI()}${table_name}/${idPath}`;

    console.log("Gửi DELETE request tới:", url);

    try {
        const response = await fetch(url, { method: 'DELETE' });

        if (!response.ok) {
            console.error(`Lỗi HTTP ${response.status}: ${response.statusText}`);
            alert(`Lỗi xóa: ${response.statusText}`);
            return;
        }

        const text = await response.text();
        const resData = text.trim().startsWith("{") || text.trim().startsWith("[") ? JSON.parse(text) : { message: text };

        //  alert(resData.message || "Xóa dữ liệu thành công.");
    } catch (error) {
        console.error("Có lỗi xảy ra khi xóa:", error.message);
        alert(`Lỗi: ${error.message}`);
    }
}

async function getImage(publicId) {
    if (!publicId) {
        // console.error("publicId không hợp lệ:", publicId);
        return null;
    }
    try {
        const url = GlobalStore.getLinkCongApi_image() + "/" + publicId;
        const response = await fetch(url);
        // const response = await fetch(`http://localhost:5000/api/image/${publicId}`);
        console.log("Đường dẫn ảnh:", url);
        const data = await response.json();

        if (data.imageUrl) {
            //    console.log("Link ảnh:", data.imageUrl);
            return data.imageUrl;
        } else {
            // console.error("Không lấy được link ảnh", data);
            return null;
        }
    } catch (error) {
        //  console.error("Lỗi khi gọi API lấy ảnh:", error);
        return null;
    }
}
async function uploadImage(file) {
    if (!file) {
        alert('Vui lòng chọn một file ảnh.');
        return null;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
        alert("Đang upload ảnh...");
        const url = GlobalStore.getLinkCongApi_image()
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Upload không thành công');

        const data = await response.json();

        if (data.imageUrl) {
            console.log('Upload thành công! Link ảnh:', data.imageUrl);
            return data.imageUrl;
        } else {
            console.error('Upload thất bại:', data);
            return null;
        }
    } catch (error) {
        console.error('Lỗi upload:', error);
        return null;
    }
}

async function deleteImage(publicId) {
    if (!publicId) {
        alert('Thiếu public_id để xóa ảnh.');
        return;
    }
    const url = GlobalStore.getLinkCongApi_image() + "/" + publicId;
    try {
        const response = await fetch(url, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Đã xóa ảnh thành công: ${publicId}`);
            console.log(data.message);
        } else {
            alert(`Xóa ảnh thất bại: ${data.error}`);
            console.error('Lỗi:', data.error);
        }
    } catch (error) {
        console.error('Lỗi khi gọi API xóa ảnh:', error);
    }
}
async function taoTranDau_chiaBang(teams, danh_sach_doi_hat_dong = [], bangs, random = false) {
    const url = GlobalStore.getLinkCongApi_taoTranDau() + "/chia-bang";

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                teams,
                danh_sach_doi_hat_dong,
                bangs,
                random
            })
        });

        if (!res.ok) {
            throw new Error('Có lỗi xảy ra khi gọi API');
        }

        return await res.json();
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        return { error: error.message };
    }
}



// Gọi API vòng tròn
async function taoTranDau_vongTron(teams) {
    const url = GlobalStore.getLinkCongApi_taoTranDau() + "/" + "vong-tron";
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teams })
    });
    return await res.json();
}

// Gọi API loại trực tiếp
async function taoTranDau_loaiTrucTiep(teams, randomize = false) {
    const url = GlobalStore.getLinkCongApi_taoTranDau() + "/" + "loai-truc-tiep";
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teams, randomize })
    });
    return await res.json();
}
async function getHinhThucTaoDoi() {
    const url = GlobalStore.getLinkCongApi_taoTranDau();
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Kết quả:", data);
        return data;
    } catch (error) {
        console.error("Lỗi gọi API:", error);
        return null;
    }
}


// lúc mà upload ảnh lên thì public_id không được có khoảng trắng, nó sẽ tự động thay thế bằng dấu gạch dưới
// nên khi lấy về thì phải thay thế lại bằng khoảng trắng
function doiKhoangTrangThanhGachDuoi(tenFile) {
    return tenFile.replace(/\s+/g, '_');
}

async function sendEmail(emailReceiver, subject, message) {
    const url = GlobalStore.getLinkCongApi_gmail() + "send-email";
    // const res = await fetch(url, {
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email_receiver: emailReceiver,
            subject: subject,
            message: message
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Phản hồi từ API:', data);
            alert(data.message);
        })
        .catch(error => {
            console.error('Lỗi khi gọi API:', error);
            alert('Gửi email thất bại!');
        });
}


// // Gắn vào window để có thể truy cập ở mọi nơi
// window.hamChung = hamChung;

export default hamChung;