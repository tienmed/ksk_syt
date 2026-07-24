import type { FormHealthRecord, PersonalHistoryRow, FormModuleConfig } from '../types';

export const INITIAL_PERSONAL_HISTORY_DISEASES: string[] = [
  "Bệnh truyền nhiễm (Cúm, Sởi, Quai bị, Thủy đậu, COVID-19, v.v.)",
  "Bệnh tim mạch (Tăng huyết áp, Bệnh mạch vành, Tai biến mạch máu não)",
  "Bệnh đái tháo đường",
  "Bệnh lao",
  "Bệnh hen phế quản",
  "Bệnh ung thư",
  "Động kinh",
  "Rối loạn tâm thần",
  "Bệnh thận / Tiết niệu",
  "Bệnh gan / Mật (Viêm gan B, C, Xơ gan, v.v.)",
  "Bệnh dạ dày / Tiêu hóa",
  "Bệnh về máu",
  "Bệnh cơ xương khớp (Thoái hóa, Bệnh Gút, Viêm khớp dạng thấp)",
  "Dị ứng (Thuốc, thức ăn, hóa chất)",
  "Tiền sử phẫu thuật / Chấn thương",
  "Nghiện thuốc lá / Rượu bia / Chất kích thích",
  "Bệnh truyền qua đường tình dục (STDs)",
  "Bệnh da liễu truyền nhiễm",
  "Bệnh mắt nghiêm trọng (Đục thủy tinh thể, Glôcôm)",
  "Bệnh tai mũi họng mãn tính",
  "Bệnh răng hàm mặt",
  "Bệnh mãn tính khác"
];

export const DEFAULT_PERSONAL_HISTORY_ROWS: PersonalHistoryRow[] = INITIAL_PERSONAL_HISTORY_DISEASES.map((name, index) => ({
  id: index + 1,
  diseaseName: name,
  hasDisease: 'không',
  doctorAssessment: ''
}));

export const DEFAULT_SPECIALTY_EXAM = {
  normal: true,
  icdPreliminary: "",
  icdFinal: "",
  classification: "Loại I"
};

export const FORM_MODULE_CATALOG: FormModuleConfig[] = [
  {
    id: 'module_admin_info',
    code: 'MOD-01',
    title: 'Thông tin hành chính',
    category: 'hành chính',
    allowedRoles: ['superadmin', 'doctor', 'nurse', 'receptionist'],
    iconName: 'IconCard'
  },
  {
    id: 'module_payment',
    code: 'MOD-02',
    title: 'Hình thức chi trả & Hợp đồng',
    category: 'hành chính',
    allowedRoles: ['superadmin', 'receptionist'],
    iconName: 'IconCard'
  },
  {
    id: 'module_family_history',
    code: 'MOD-03',
    title: 'Tiền sử gia đình & Mã ICD',
    category: 'tiền sử',
    allowedRoles: ['superadmin', 'doctor', 'nurse'],
    iconName: 'IconFileText'
  },
  {
    id: 'module_personal_history',
    code: 'MOD-04',
    title: 'Tiền sử bản thân (Data Grid 22 Bệnh)',
    category: 'tiền sử',
    allowedRoles: ['superadmin', 'doctor', 'nurse'],
    iconName: 'IconHistory'
  },
  {
    id: 'module_obstetrics',
    code: 'MOD-05',
    title: 'Tiền sử Sản phụ khoa (Dành cho Nữ)',
    category: 'tiền sử',
    allowedRoles: ['superadmin', 'doctor'],
    iconName: 'IconUser'
  },
  {
    id: 'module_physical_metrics',
    code: 'MOD-06',
    title: 'Khám thể lực, BMI, Mạch & Huyết áp',
    category: 'lâm sàng',
    allowedRoles: ['superadmin', 'doctor', 'nurse'],
    iconName: 'IconHeartPulse'
  },
  {
    id: 'module_clinical_internal',
    code: 'MOD-07',
    title: 'Khám lâm sàng - Nội khoa 8 chuyên khoa',
    category: 'lâm sàng',
    allowedRoles: ['superadmin', 'doctor'],
    iconName: 'IconStethoscope'
  },
  {
    id: 'module_clinical_surgical_derma',
    code: 'MOD-08',
    title: 'Khám lâm sàng - Ngoại khoa & Da liễu',
    category: 'lâm sàng',
    allowedRoles: ['superadmin', 'doctor'],
    iconName: 'IconStethoscope'
  },
  {
    id: 'module_clinical_obgyn',
    code: 'MOD-09',
    title: 'Khám lâm sàng - Sản phụ khoa',
    category: 'lâm sàng',
    allowedRoles: ['superadmin', 'doctor'],
    iconName: 'IconUser'
  },
  {
    id: 'module_paraclinical_blood',
    code: 'MOD-10',
    title: 'Xét nghiệm máu (Huyết học & Sinh hóa)',
    category: 'cận lâm sàng',
    allowedRoles: ['superadmin', 'doctor', 'lab_technician'],
    iconName: 'IconStethoscope'
  },
  {
    id: 'module_paraclinical_urine',
    code: 'MOD-11',
    title: 'Xét nghiệm nước tiểu (11 chỉ số)',
    category: 'cận lâm sàng',
    allowedRoles: ['superadmin', 'doctor', 'lab_technician'],
    iconName: 'IconFileText'
  },
  {
    id: 'module_paraclinical_imaging',
    code: 'MOD-12',
    title: 'Chẩn đoán hình ảnh X-Quang tim phổi',
    category: 'cận lâm sàng',
    allowedRoles: ['superadmin', 'doctor', 'lab_technician'],
    iconName: 'IconFileText'
  },
  {
    id: 'module_doctor_conclusion',
    code: 'MOD-13',
    title: 'V. Kết luận & Phân loại sức khỏe',
    category: 'kết luận',
    allowedRoles: ['superadmin', 'doctor'],
    iconName: 'IconCheck'
  }
];

export const ETHNIC_GROUPS = [
  "Kinh", "Tày", "Thái", "Mường", "Khơ-me", "H'Mông", "Nùng", "Hoa", "Dao", "Gia-rai", "Ê-đê", "Ba-na", "Xơ-đăng", "Chăm", "Cơ-ho", "Khác"
];

export const ADMINISTRATIVE_DIVISIONS: Record<string, Record<string, string[]>> = {
  "TP. Hồ Chí Minh": {
    "Quận 1": ["Phường Bến Nghé", "Phường Bến Thành", "Phường Cầu Kho", "Phường Cầu Ông Lãnh", "Phường Đa Kao", "Phường Tân Định"],
    "Quận 3": ["Phường Võ Thị Sáu", "Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5"],
    "TP. Thủ Đức": ["Phường Bĩnh Thọ", "Phường An Phú", "Phường Linh Trung", "Phường Thảo Điền", "Phường Hiệp Bình Chánh"],
    "Quận Bình Thạnh": ["Phường 1", "Phường 2", "Phường 14", "Phường 15", "Phường 25", "Phường 26"],
    "Quận Tân Bình": ["Phường 1", "Phường 2", "Phường 4", "Phường 12", "Phường 13"]
  },
  "Hà Nội": {
    "Quận Hoàn Kiếm": ["Phường Hàng Bạc", "Phường Hàng Bài", "Phường Tràng Tiền"],
    "Quận Ba Đình": ["Phường Đội Cấn", "Phường Điện Biên", "Phường Kim Mã"]
  },
  "Đà Nẵng": {
    "Quận Hải Châu": ["Phường Hải Châu I", "Phường Hải Châu II", "Phường Phước Ninh"]
  }
};

export const ICD_POPULAR_TAGS = [
  "I10 - Tăng huyết áp vô căn",
  "E11 - Đái tháo đường týp 2",
  "J45 - Hen phế quản",
  "K29 - Viêm dạ dày và tá tràng",
  "M17 - Thoái hóa khớp gối",
  "B18.2 - Viêm gan vi rút C mạn tính",
  "J06 - Viêm đường hô hấp trên cấp tính"
];

export const SAMPLE_PATIENT_DATABASE: FormHealthRecord[] = [
  {
    donViKham: "BỆNH VIỆN ĐA KHOA TỈNH / TRUNG TÂM Y TẾ SỞ Y TẾ TP.HCM",
    ngayKham: new Date().toISOString().split('T')[0],
    doiTuong: "Khám sức khỏe định kỳ",
    diaDiemKham: "Phòng khám Sức khỏe Định kỳ - Tầng 2",
    soCCCD: "079095001234",
    hoTen: "NGUYỄN VĂN AN",
    ngaySinh: "1988-05-15",
    gioiTinh: "Nam",
    danToc: "Kinh",
    nhomMau: "O",
    rhFactor: "Rh+",
    soBHYT: "DN4790950012345",
    dienThoai: "0908123456",
    noiOHienTai: "123 Đường Lê Lợi, Phường Bến Nghé",
    tinhThanh: "TP. Hồ Chí Minh",
    quanHuyen: "Quận 1",
    xaPhuong: "Phường Bến Nghé",
    ngheNghiep: "Kỹ sư Phần mềm",
    noiCongTac: "Công ty Cổ phần Công nghệ SYT",
    xaPhuongCongTac: "Phường Bến Nghé",
    lyDoKham: "Khám sức khỏe định kỳ hàng năm theo quy định công ty",
    hinhThucChiTraKsk: "2", // Người sử dụng lao động chi trả
    hinhThucChiTraChiTiet: "Hợp đồng khám sức khỏe định kỳ",
    nguonKacGhiRo: "",
    familyDiseases: { "2": true, "3": true }, // Tim mạch, Đái tháo đường
    icdCodesTag: ["I10 - Tăng huyết áp vô căn"],
    icdCustomText: "Bố có tiền sử tăng huyết áp",
    personalHistoryRows: DEFAULT_PERSONAL_HISTORY_ROWS.map(r => r.id === 2 ? { ...r, hasDisease: 'có', doctorAssessment: 'Tăng huyết áp nhẹ độ 1' } : r),
    dangDieuTriThuoc: "Amlodipine 5mg x 1 viên/ngày",
    isFemale: false,
    soLanMangThai: "0",
    soLanSinh: "0",
    soLanSay: "0",
    tuoiBatDauKinh: "",
    chuKyKinh: "",
    ngayKinhGanNhat: "",
    benhPhuKhoa: "",
    tuanHoan: { normal: true, icdPreliminary: "", icdFinal: "I10", classification: "Loại I" },
    hoHap: { normal: true, icdPreliminary: "", icdFinal: "", classification: "Loại I" },
    tieuHoa: { normal: true, icdPreliminary: "", icdFinal: "", classification: "Loại I" },
    thanTietNieu: { normal: true, icdPreliminary: "", icdFinal: "", classification: "Loại I" },
    noiTiet: { normal: true, icdPreliminary: "", icdFinal: "", classification: "Loại I" },
    coXuongKhop: { normal: true, icdPreliminary: "", icdFinal: "", classification: "Loại I" },
    thanKinh: { normal: true, icdPreliminary: "", icdFinal: "", classification: "Loại I" },
    tamThan: { normal: true, icdPreliminary: "", icdFinal: "", classification: "Loại I" },
    ngoaiKhoa: { normal: true, icdPreliminary: "", icdFinal: "", classification: "Loại I" },
    daLieu: { normal: true, icdPreliminary: "", icdFinal: "", classification: "Loại I" },
    sanKhoa: { normal: true, icdPreliminary: "", icdFinal: "", classification: "Loại I" },
    soLuongHC: "4.85",
    huyetSacTo: "14.2",
    hematocrit: "43.5",
    mcv: "89.2",
    mch: "29.8",
    mchc: "33.4",
    rdw: "12.8",
    soLuongBC: "6.9",
    bcTrungTinh: "4.2",
    bcLympho: "2.1",
    bcDonNhan: "0.4",
    bcAiToan: "0.15",
    bcAiKiem: "0.05",
    soLuongTC: "245",
    duongMau: "5.4",
    ureMau: "4.8",
    creatinin: "82",
    asat: "24",
    alat: "28",
    tiTrong: "1.018",
    pH: "6.5",
    bachCauNT: "0",
    hongCauNT: "0",
    nitritNT: "Âm Tính",
    proteinNT: "0",
    glucoseNT: "0",
    cetonicNT: "0",
    bilirubinNT: "0",
    urobilinogenNT: "0.2",
    nuocTieuKhac: "Bình thường",
    xQuangTimPhoi: "Hình ảnh tim phổi bình thường, không thấy tổn thương xơ hang hay thâm nhiễm.",
    clsKhacRadio: "Không",
    clsKhacChiTiet: "",
    chieuCao: "172",
    canNang: "68",
    bmi: "23.0",
    mach: "75",
    huyetAp: "120/80",
    phanLoaiSK: "Loại I",
    ketLuanBacSi: "Sức khỏe tốt, đủ điều kiện làm việc bình thường. Tiếp tục duy trì chế độ sinh hoạt lành mạnh.",
    tenBacSi: "BS. CKI NGUYỄN VĂN BÌNH"
  },
  {
    donViKham: "BỆNH VIỆN ĐA KHOA TỈNH / TRUNG TÂM Y TẾ SỞ Y TẾ TP.HCM",
    ngayKham: new Date().toISOString().split('T')[0],
    doiTuong: "Khám sức khỏe định kỳ",
    diaDiemKham: "Phòng khám Sức khỏe Định kỳ - Tầng 2",
    soCCCD: "079192005678",
    hoTen: "TRẦN THỊ MAI",
    ngaySinh: "1992-08-20",
    gioiTinh: "Nữ",
    danToc: "Kinh",
    nhomMau: "A",
    rhFactor: "Rh+",
    soBHYT: "HS4791920056789",
    dienThoai: "0918987654",
    noiOHienTai: "456 Đường CMT8, Phường 4",
    tinhThanh: "TP. Hồ Chí Minh",
    quanHuyen: "Quận 3",
    xaPhuong: "Phường Võ Thị Sáu",
    ngheNghiep: "Kế toán viên",
    noiCongTac: "Trường Đại học Y Dược TP.HCM",
    xaPhuongCongTac: "Phường Võ Thị Sáu",
    lyDoKham: "Khám sức khỏe định kỳ năm 2026",
    hinhThucChiTraKsk: "1", // Ngân sách thành phố hỗ trợ
    hinhThucChiTraChiTiet: "Hợp đồng khám sức khỏe định kỳ",
    nguonKacGhiRo: "",
    familyDiseases: {},
    icdCodesTag: [],
    icdCustomText: "",
    personalHistoryRows: DEFAULT_PERSONAL_HISTORY_ROWS,
    dangDieuTriThuoc: "Không có",
    isFemale: true,
    soLanMangThai: "1",
    soLanSinh: "1",
    soLanSay: "0",
    tuoiBatDauKinh: "13",
    chuKyKinh: "28 ngày",
    ngayKinhGanNhat: "2026-07-10",
    benhPhuKhoa: "Bình thường",
    tuanHoan: { normal: true, icdPreliminary: "", icdFinal: "", classification: "Loại I" },
    hoHap: { normal: true, icdPreliminary: "", icdFinal: "", classification: "Loại I" },
    tieuHoa: { normal: true, icdPreliminary: "", icdFinal: "", classification: "Loại I" },
    thanTietNieu: { normal: true, icdPreliminary: "", icdFinal: "", classification: "Loại I" },
    noiTiet: { normal: true, icdPreliminary: "", icdFinal: "", classification: "Loại I" },
    coXuongKhop: { normal: true, icdPreliminary: "", icdFinal: "", classification: "Loại I" },
    thanKinh: { normal: true, icdPreliminary: "", icdFinal: "", classification: "Loại I" },
    tamThan: { normal: true, icdPreliminary: "", icdFinal: "", classification: "Loại I" },
    ngoaiKhoa: { normal: true, icdPreliminary: "", icdFinal: "", classification: "Loại I" },
    daLieu: { normal: true, icdPreliminary: "", icdFinal: "", classification: "Loại I" },
    sanKhoa: { normal: true, icdPreliminary: "", icdFinal: "", classification: "Loại I" },
    soLuongHC: "4.20",
    huyetSacTo: "12.8",
    hematocrit: "38.2",
    mcv: "90.5",
    mch: "30.1",
    mchc: "33.1",
    rdw: "11.9",
    soLuongBC: "5.8",
    bcTrungTinh: "3.5",
    bcLympho: "1.8",
    bcDonNhan: "0.3",
    bcAiToan: "0.1",
    bcAiKiem: "0.04",
    soLuongTC: "210",
    duongMau: "4.9",
    ureMau: "4.2",
    creatinin: "65",
    asat: "18",
    alat: "20",
    tiTrong: "1.015",
    pH: "6.0",
    bachCauNT: "0",
    hongCauNT: "0",
    nitritNT: "Âm Tính",
    proteinNT: "0",
    glucoseNT: "0",
    cetonicNT: "0",
    bilirubinNT: "0",
    urobilinogenNT: "0.1",
    nuocTieuKhac: "Bình thường",
    xQuangTimPhoi: "Hình ảnh X-Quang ngực thẳng bình thường.",
    clsKhacRadio: "Không",
    clsKhacChiTiet: "",
    chieuCao: "160",
    canNang: "52",
    bmi: "20.3",
    mach: "72",
    huyetAp: "110/70",
    phanLoaiSK: "Loại I",
    ketLuanBacSi: "Sức khỏe Loại I. Đủ sức khỏe công tác.",
    tenBacSi: "BS. CKI PHẠM VĂN ĐỒNG"
  }
];
