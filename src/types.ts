export const TYPES_VERSION = '1.0.0';

export type UserRoleType = 'superadmin' | 'doctor' | 'nurse' | 'lab_technician' | 'receptionist';

export type ModulePermissionId =
  | 'module_admin_info'
  | 'module_payment'
  | 'module_family_history'
  | 'module_personal_history'
  | 'module_obstetrics'
  | 'module_physical_metrics'
  | 'module_clinical_internal'
  | 'module_clinical_surgical_derma'
  | 'module_clinical_obgyn'
  | 'module_paraclinical_blood'
  | 'module_paraclinical_urine'
  | 'module_paraclinical_imaging'
  | 'module_doctor_conclusion';

export interface FormModuleConfig {
  id: ModulePermissionId;
  code: string;
  title: string;
  category: 'hành chính' | 'tiền sử' | 'lâm sàng' | 'cận lâm sàng' | 'kết luận';
  allowedRoles: UserRoleType[];
  iconName: string;
}

export interface PersonalHistoryRow {
  id: number;
  diseaseName: string;
  hasDisease: 'có' | 'không';
  doctorAssessment?: string;
}

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  role: string;
  roleType?: UserRoleType;
  accessToken?: string;
}

export interface FamilyHistoryItem {
  id: string;
  name: string;
  checked: boolean;
}

export interface ClinicalSpecialtyExam {
  normal: boolean;
  icdPreliminary: string;
  icdFinal: string;
  classification: string; // 'Loại I' | 'Loại II' | 'Loại III' | 'Loại IV' | 'Loại V'
}

export interface FormHealthRecord {
  id?: string;
  createdAt?: string;

  // Header & Administrative
  donViKham: string;
  ngayKham: string;
  doiTuong: string;
  diaDiemKham: string;

  soCCCD: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: 'Nam' | 'Nữ';
  danToc: string;
  nhomMau: string;
  rhFactor: string;
  soBHYT: string;
  dienThoai: string;
  noiOHienTai: string;
  tinhThanh: string;
  quanHuyen: string;
  xaPhuong: string;
  ngheNghiep: string;
  noiCongTac: string;
  xaPhuongCongTac: string;
  lyDoKham: string;

  // Payment
  hinhThucChiTraKsk: string; // 1, 2, 3, 4
  hinhThucChiTraChiTiet: string; // Hợp đồng, Khám lẻ, Nguồn hỗ trợ khác
  nguonKacGhiRo: string;

  // Family History
  familyDiseases: Record<string, boolean>;
  icdCodesTag: string[];
  icdCustomText: string;

  // Personal History
  personalHistoryRows: PersonalHistoryRow[];
  dangDieuTriThuoc: string;
  
  // Female Obstetric History
  isFemale: boolean;
  soLanMangThai: string;
  soLanSinh: string;
  soLanSay: string;
  tuoiBatDauKinh: string;
  chuKyKinh: string;
  ngayKinhGanNhat: string;
  benhPhuKhoa: string;

  // Clinical Specialty Examinations (From SYT DOM Snippet 5)
  tuanHoan: ClinicalSpecialtyExam;
  hoHap: ClinicalSpecialtyExam;
  tieuHoa: ClinicalSpecialtyExam;
  thanTietNieu: ClinicalSpecialtyExam;
  noiTiet: ClinicalSpecialtyExam;
  coXuongKhop: ClinicalSpecialtyExam;
  thanKinh: ClinicalSpecialtyExam;
  tamThan: ClinicalSpecialtyExam;
  ngoaiKhoa: ClinicalSpecialtyExam;
  daLieu: ClinicalSpecialtyExam;
  sanKhoa: ClinicalSpecialtyExam;

  // Paraclinical / Lab Tests - Blood Count
  soLuongHC: string; // M/µL
  huyetSacTo: string; // g/dL
  hematocrit: string; // %
  mcv: string; // fL
  mch: string; // pg
  mchc: string; // g/dL
  rdw: string; // %
  soLuongBC: string; // K/µL
  bcTrungTinh: string; // K/µL
  bcLympho: string; // K/µL
  bcDonNhan: string; // K/µL
  bcAiToan: string; // K/µL
  bcAiKiem: string; // K/µL
  soLuongTC: string; // K/µL

  // Paraclinical / Lab Tests - Blood Biochemistry
  duongMau: string; // mmol/L
  ureMau: string; // mmol/L
  creatinin: string; // µmol/L
  asat: string; // U/L
  alat: string; // U/L

  // Urinalysis
  tiTrong: string;
  pH: string;
  bachCauNT: string;
  hongCauNT: string;
  nitritNT: 'Âm Tính' | 'Dương Tính' | '';
  proteinNT: string;
  glucoseNT: string;
  cetonicNT: string;
  bilirubinNT: string;
  urobilinogenNT: string;
  nuocTieuKhac: string;

  // Diagnostic & Other
  xQuangTimPhoi: string;
  clsKhacRadio: 'Có' | 'Không' | '';
  clsKhacChiTiet: string;

  // Physical & Doctor Assessment
  chieuCao: string;
  canNang: string;
  bmi: string;
  mach: string;
  huyetAp: string;
  phanLoaiSK: 'Loại I' | 'Loại II' | 'Loại III' | 'Loại IV' | 'Loại V' | '';
  ketLuanBacSi: string;
  tenBacSi: string;
}
