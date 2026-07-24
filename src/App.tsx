import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import RESIDENCE_DATA from './data/residence.json';
import OCCUPATIONS_DATA from './data/occupations.json';
import { buildExportPayload } from './exportHelper';
import './App.css';
import logoUrl from './assets/logo.png';
import type { FormHealthRecord, GoogleUser } from './types';
import {
  DEFAULT_PERSONAL_HISTORY_ROWS,
  DEFAULT_SPECIALTY_EXAM,
  FORM_MODULE_CATALOG,
  ETHNIC_GROUPS,
  ADMINISTRATIVE_DIVISIONS,
  ICD_POPULAR_TAGS,
  SAMPLE_PATIENT_DATABASE
} from './data/mockData';
import {
  IconCard, IconUser, IconCalendar, IconMapPin, IconBriefcase,
  IconStethoscope, IconSearch, IconFingerprint, IconScanFace,
  IconSave, IconPrinter, IconHistory, IconCheck, IconTrash, IconRotateCcw,
  IconAlertTriangle, IconBuilding, IconFileText, IconHeartPulse,
  IconGoogle, IconLogOut
} from './components/Icons';

const INITIAL_FORM_STATE: FormHealthRecord = {
  donViKham: "BỆNH VIỆN ĐA KHOA TỈNH / TRUNG TÂM Y TẾ SỞ Y TẾ TP.HCM",
  ngayKham: new Date().toISOString().split('T')[0],
  doiTuong: "13",
  diaDiemKham: "Phòng khám Sức khỏe Định kỳ - Tầng 2",

  soCCCD: "",
  hoTen: "",
  ngaySinh: "1995-01-01",
  gioiTinh: "Nam",
  danToc: "Kinh",
  nhomMau: "Chưa xác định",
  rhFactor: "Chưa xác định",
  soBHYT: "",
  dienThoai: "",
  noiOHienTai: "",
  tinhThanh: "TP. Hồ Chí Minh",
  quanHuyen: "Quận 1",
  xaPhuong: "Phường Bến Nghé",
  ngheNghiep: "",
  noiCongTac: "",
  xaPhuongCongTac: "",
  lyDoKham: "Khám sức khỏe định kỳ theo quy định",

  hinhThucChiTraKsk: "1",
  hinhThucChiTraChiTiet: "Hợp đồng khám sức khỏe định kỳ",
  nguonKacGhiRo: "",

  familyDiseases: {},
  icdCodesTag: [],
  icdCustomText: "",

  personalHistoryRows: DEFAULT_PERSONAL_HISTORY_ROWS,
  dangDieuTriThuoc: "",

  isFemale: false,
  soLanMangThai: "0",
  soLanSinh: "0",
  soLanSay: "0",
  tuoiBatDauKinh: "",
  chuKyKinh: "",
  ngayKinhGanNhat: "",
  benhPhuKhoa: "",

  tuanHoan: DEFAULT_SPECIALTY_EXAM,
  hoHap: DEFAULT_SPECIALTY_EXAM,
  tieuHoa: DEFAULT_SPECIALTY_EXAM,
  thanTietNieu: DEFAULT_SPECIALTY_EXAM,
  noiTiet: DEFAULT_SPECIALTY_EXAM,
  coXuongKhop: DEFAULT_SPECIALTY_EXAM,
  thanKinh: DEFAULT_SPECIALTY_EXAM,
  tamThan: DEFAULT_SPECIALTY_EXAM,
  ngoaiKhoa: DEFAULT_SPECIALTY_EXAM,
  daLieu: DEFAULT_SPECIALTY_EXAM,
  sanKhoa: DEFAULT_SPECIALTY_EXAM,
  phuKhoa: DEFAULT_SPECIALTY_EXAM,
  mat: DEFAULT_SPECIALTY_EXAM,
  taiMuiHong: DEFAULT_SPECIALTY_EXAM,
  rangHamMat: DEFAULT_SPECIALTY_EXAM,

  soLuongHC: "",
    khongKinhPhai: "", khongKinhTrai: "",
    kinhLoPhai: "", kinhLoTrai: "",
    coKinhPhai: "", coKinhTrai: "",
    khucXaPhaiCau: "", khucXaPhaiTru: "", khucXaPhaiTruc: "",
    khucXaTraiCau: "", khucXaTraiTru: "", khucXaTraiTruc: "",
  taiTraiNoiThuong: "",
  taiTraiNoiTham: "",
  taiPhaiNoiThuong: "",
  taiPhaiNoiTham: "",
  huyetSacTo: "",
  hematocrit: "",
  mcv: "",
  mch: "",
  mchc: "",
  rdw: "",
  soLuongBC: "",
  bcTrungTinh: "",
  bcLympho: "",
  bcDonNhan: "",
  bcAiToan: "",
  bcAiKiem: "",
  soLuongTC: "",

  duongMau: "",
  ureMau: "",
  creatinin: "",
  asat: "",
  alat: "",

  tiTrong: "",
  pH: "",
  bachCauNT: "",
  hongCauNT: "",
  nitritNT: "Âm Tính",
  proteinNT: "",
}

const SpecialtyExamBlock: React.FC<SpecialtyExamBlockProps> = ({ title, icon, data, onChange }) => (
  <div style={{ border: '1px solid #e0e7f3', borderRadius: '6px', padding: '12px 14px', marginBottom: '12px', background: '#ffffff' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
      {icon && <span style={{ color: '#1e65b9' }}>{icon}</span>}
      <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#1b365d' }}>{title}</span>
    </div>

    <div className="syt-grid">
      <div className="syt-field col-3" style={{ justifyContent: 'center' }}>
        <label className="syt-checkbox-item" style={{ margin: 0, padding: '6px 10px' }}>
          <input 
            type="checkbox" 
            checked={data?.normal ?? true} 
            onChange={e => onChange({ ...data, normal: e.target.checked })} 
          />
          <span style={{ fontWeight: 600, fontSize: '12px' }}>Chưa phát hiện bất thường</span>
        </label>
      </div>

      <div className="syt-field col-3">
        <label className="syt-label" style={{ fontSize: '12px' }}>Chẩn đoán sơ bộ (ICD)</label>
        <input 
          type="text" 
          className="syt-input" 
          style={{ padding: '4px 8px', fontSize: '12px' }}
          placeholder="ghi rõ theo mã ICD..." 
          value={data?.icdPreliminary || ''}
          onChange={e => onChange({ ...data, icdPreliminary: e.target.value })}
        />
      </div>

      <div className="syt-field col-3">
        <label className="syt-label" style={{ fontSize: '12px' }}>Chẩn đoán xác định (ICD)</label>
        <input 
          type="text" 
          className="syt-input" 
          style={{ padding: '4px 8px', fontSize: '12px' }}
          placeholder="ghi rõ theo mã ICD..." 
          value={data?.icdFinal || ''}
          onChange={e => onChange({ ...data, icdFinal: e.target.value })}
        />
      </div>

      <div className="syt-field col-3">
        <label className="syt-label" style={{ fontSize: '12px' }}>Phân loại <span className="syt-required-star">*</span></label>
        <select 
          className="syt-input" 
          style={{ padding: '4px 8px', fontSize: '12px', fontWeight: 600 }}
          value={data?.classification || 'Loại I'}
          onChange={e => onChange({ ...data, classification: e.target.value })}
        >
          <option value="Loại I">Loại I</option>
          <option value="Loại II">Loại II</option>
          <option value="Loại III">Loại III</option>
          <option value="Loại IV">Loại IV</option>
          <option value="Loại V">Loại V</option>
        </select>
      </div>
    </div>
  </div>
);

interface FormModuleWrapperProps {
  id: string;
  code: string;
  title: string;
  icon?: React.ReactNode;
  currentUser: GoogleUser | null;
  emailPermissions: Record<string, string[]>;
  children: React.ReactNode;
}

const FormModuleWrapper: React.FC<FormModuleWrapperProps> = ({
  id,
  code,
  title,
  icon,
  currentUser,
  emailPermissions,
  children
}) => {
  const isSuperadmin = currentUser?.email?.toLowerCase() === 'tienmed@gmail.com';
  const userEmail = currentUser?.email?.toLowerCase();
  
  let hasPermission = isSuperadmin;
  if (!isSuperadmin && userEmail && emailPermissions[userEmail]) {
    hasPermission = emailPermissions[userEmail].includes(code) || emailPermissions[userEmail].includes(id);
  }

  return (
    <div id={id} className="syt-module-card" style={{ scrollMarginTop: '20px' }}>
      <div className="syt-module-card-header">
        <div className="syt-module-card-title">
          <span className="syt-module-code-badge">{code}</span>
          {icon}
          <span>{title}</span>
        </div>

        <div>
          {isSuperadmin ? (
            <span className="syt-module-rbac-badge syt-rbac-superadmin">
              👑 SUPERADMIN • FULL ACCESS
            </span>
          ) : hasPermission ? (
            <span className="syt-module-rbac-badge syt-rbac-permitted">
              <IconCheck style={{ width: '12px', height: '12px' }} /> QUYỀN TRUY CẬP ĐÃ MỞ
            </span>
          ) : (
            <span className="syt-module-rbac-badge syt-rbac-locked">
              🔒 BỊ GIỚI HẠN QUYỀN
            </span>
          )}
        </div>
      </div>

      {hasPermission ? (
        children
      ) : (
        <div style={{ padding: '20px', textAlign: 'center', background: '#fff5f5', border: '1px dashed #fca5a5', borderRadius: '6px', color: '#991b1b' }}>
          <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
            🔒 Phân quyền Module: {title} ({code})
          </div>
          <div style={{ fontSize: '12px', color: '#7f1d1d' }}>
            Tài khoản hiện tại ({currentUser?.email || 'Chưa đăng nhập'}) không được cấp quyền chỉnh sửa module này.
          </div>
          <div style={{ marginTop: '6px', fontSize: '11px', color: '#b91c1c' }}>
            💡 Vui lòng đăng nhập với tài khoản Superadmin <b>tienmed@gmail.com</b> để quản trị toàn quyền.
          </div>
        </div>
      )}
    </div>
  );
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "630155980026-r7laqjbsbpj9l164vqc607cste77jeab.apps.googleusercontent.com";

const decodeGoogleCredentialToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to decode Google JWT token', e);
    return null;
  }
};

const reactSelectStyles = {
  control: (base: any) => ({
    ...base,
    borderColor: '#d2d6da',
    borderRadius: '0.375rem',
    minHeight: '40px',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#cb0c9f'
    }
  })
};

export const App: React.FC = () => {
  const [formData, setFormData] = useState<FormHealthRecord>(INITIAL_FORM_STATE);
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [savedRecords, setSavedRecords] = useState<FormHealthRecord[]>([]);
  const [activeSection, setActiveSection] = useState<string>('sec-hanhchinh');
  
  // Google OAuth Auth State
  const [currentUser, setCurrentUser] = useState<GoogleUser | null>(() => {
    const stored = localStorage.getItem('syt_google_user');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { return null; }
    }
    return null;
  });
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [emailPermissions, setEmailPermissions] = useState<Record<string, string[]>>(() => {
    const stored = localStorage.getItem('syt_email_permissions');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { return {}; }
    }
    return {};
  });

  // UI Modals & Notifications
  const [showLookupModal, setShowLookupModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState("");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showScanFaceModal, setShowScanFaceModal] = useState(false);
  const [showFingerprintModal, setShowFingerprintModal] = useState(false);
  const [searchCccdTerm, setSearchCccdTerm] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [customIcdInput, setCustomIcdInput] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Load saved records from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('syt_health_records');
    if (stored) {
      try {
        setSavedRecords(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('syt_email_permissions', JSON.stringify(emailPermissions));
  }, [emailPermissions]);

  // Google Identity Services (GIS) Official OAuth Initialization
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if ((window as any).google?.accounts?.id) {
        (window as any).google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response: any) => {
            if (response?.credential) {
              const payload = decodeGoogleCredentialToken(response.credential);
              if (payload) {
                const isSuperadmin = payload.email.toLowerCase() === 'tienmed@gmail.com';
                handleLoginSuccess({
                  id: payload.sub,
                  name: payload.name || payload.email.split('@')[0],
                  email: payload.email,
                  picture: payload.picture || 'https://lh3.googleusercontent.com/a/default-user=s96-c',
                  role: isSuperadmin ? 'Superadmin - Quản trị viên Tối cao SYT' : 'Bác sĩ / Cán bộ Y tế',
                  roleType: isSuperadmin ? 'superadmin' : 'doctor'
                });
              }
            }
          }
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (showGoogleModal && (window as any).google?.accounts?.id) {
      setTimeout(() => {
        const btnContainer = document.getElementById("google-signin-btn-container");
        if (btnContainer) {
          (window as any).google.accounts.id.renderButton(
            btnContainer,
            { theme: "outline", size: "large", text: "continue_with", width: 300 }
          );
        }
      }, 100);
    }
  }, [showGoogleModal]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getRoleForEmail = (email: string) => {
    if (email.toLowerCase() === 'tienmed@gmail.com') {
      return 'Superadmin - Quản trị viên Tối cao SYT';
    }
    return 'Bác sĩ / Cán bộ Y tế';
  };

  const handleLoginSuccess = (userObj: GoogleUser) => {
    const isSuperadmin = userObj.email.toLowerCase() === 'tienmed@gmail.com';
    const role = isSuperadmin ? 'Superadmin - Quản trị viên Tối cao SYT' : 'Bác sĩ / Cán bộ Y tế';
    const updatedUser = { ...userObj, role };

    setCurrentUser(updatedUser);
    localStorage.setItem('syt_google_user', JSON.stringify(updatedUser));

    // Auto-fill Doctor Signature in Section VII
    setFormData(prev => ({
      ...prev,
      tenBacSi: isSuperadmin ? 'BS. CKII NGUYỄN VĂN TIẾN' : userObj.name.toUpperCase()
    }));

    if (isSuperadmin) {
      triggerToast(`👑 Xin chào Superadmin Nguyễn Văn Tiến (tienmed@gmail.com)!`);
    } else {
      triggerToast(`🔑 Đăng nhập Google thành công: ${userObj.name}`);
    }
    setShowGoogleModal(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('syt_google_user');
    triggerToast("🔒 Đã đăng xuất khỏi tài khoản Google");
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle Field Changes
  const handleChange = (field: keyof FormHealthRecord, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'hoTen' && typeof value === 'string') {
        updated.hoTen = value.toUpperCase();
      }

      if (field === 'gioiTinh') {
        updated.isFemale = value === 'Nữ';
      }

      if (field === 'chieuCao' || field === 'canNang') {
        const heightM = parseFloat(field === 'chieuCao' ? value : prev.chieuCao) / 100;
        const weightKg = parseFloat(field === 'canNang' ? value : prev.canNang);
        if (heightM > 0 && weightKg > 0) {
          const bmiVal = (weightKg / (heightM * heightM)).toFixed(1);
          updated.bmi = bmiVal;
        }
      }

      return updated;
    });
  };

  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    return Math.max(0, currentYear - birthYear);
  };

  const getBmiCategory = (bmiStr: string) => {
    const val = parseFloat(bmiStr);
    if (isNaN(val) || val <= 0) return null;
    if (val < 18.5) return { text: 'Gầy (BMI < 18.5)', color: '#d97706' };
    if (val <= 22.9) return { text: 'Bình thường (18.5 - 22.9)', color: '#16a34a' };
    if (val <= 24.9) return { text: 'Thừa cân (23.0 - 24.9)', color: '#ea580c' };
    return { text: 'Béo phì (≥ 25.0)', color: '#dc2626' };
  };

  const handlePersonalRowChange = (id: number, field: 'hasDisease' | 'doctorAssessment', value: string) => {
    setFormData(prev => ({
      ...prev,
      personalHistoryRows: prev.personalHistoryRows.map(row => 
        row.id === id ? { ...row, [field]: value } : row
      )
    }));
  };

  const handleSelectAllNo = () => {
    setFormData(prev => ({
      ...prev,
      personalHistoryRows: prev.personalHistoryRows.map(row => ({
        ...row,
        hasDisease: 'không'
      }))
    }));
    triggerToast("Đã chọn tất cả 'Không' cho Tiền sử bản thân");
  };

  const handleFamilyCheckbox = (id: string) => {
    setFormData(prev => ({
      ...prev,
      familyDiseases: {
        ...prev.familyDiseases,
        [id]: !prev.familyDiseases[id]
      }
    }));
  };

  const handleAddIcdTag = (tag: string) => {
    if (!tag) return;
    if (!formData.icdCodesTag.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        icdCodesTag: [...prev.icdCodesTag, tag]
      }));
    }
  };

  const handleRemoveIcdTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      icdCodesTag: prev.icdCodesTag.filter(t => t !== tag)
    }));
  };

  const handleLoadDemoData = () => {
    const demo = SAMPLE_PATIENT_DATABASE[0];
    setFormData({ ...demo, id: Date.now().toString() });
    triggerToast("⚡ Đã nạp thành công dữ liệu mẫu NGUYỄN VĂN AN!");
  };

  const handleSaveForm = () => {
    const errors: string[] = [];
    if (!formData.hoTen.trim()) errors.push("Họ và tên bắt buộc nhập");
    if (!formData.soCCCD.trim()) errors.push("Số CCCD/Mã số định danh bắt buộc nhập");
    if (!formData.ngaySinh) errors.push("Ngày sinh bắt buộc nhập");
    if (!formData.dienThoai.trim()) errors.push("Điện thoại di động bắt buộc nhập");

    if (errors.length > 0) {
      setValidationErrors(errors);
      triggerToast("⚠️ Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
      return;
    }

    setValidationErrors([]);
    const recordToSave = {
      ...formData,
      id: formData.id || Date.now().toString(),
      createdAt: new Date().toLocaleString('vi-VN')
    };

    const updatedRecords = [recordToSave, ...savedRecords.filter(r => r.id !== recordToSave.id)];
    setSavedRecords(updatedRecords);
    localStorage.setItem('syt_health_records', JSON.stringify(updatedRecords));
    triggerToast("💾 Đã lưu thành công Phiếu Khám Sức Khỏe Định Kỳ!");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setValidationErrors([]);
    triggerToast("🧹 Đã làm mới form nhập liệu");
  };

  const handleSearchCccd = () => {
    const found = SAMPLE_PATIENT_DATABASE.find(p => p.soCCCD === searchCccdTerm || p.hoTen.includes(searchCccdTerm.toUpperCase()));
    if (found) {
      setFormData(found);
      setShowLookupModal(false);
      triggerToast(`Tìm thấy thông tin công dân: ${found.hoTen}`);
    } else {
      triggerToast("❌ Không tìm thấy thông tin công dân trong cơ sở dữ liệu mẫu");
    }
  };



  const availableDistricts = Object.keys(ADMINISTRATIVE_DIVISIONS[formData.tinhThanh] || {});
  const availableWards = (ADMINISTRATIVE_DIVISIONS[formData.tinhThanh] && ADMINISTRATIVE_DIVISIONS[formData.tinhThanh][formData.quanHuyen]) || [];

  return (
    <div className="syt-app-container">
      {/* TOP BRANDING & ACTION HEADER */}
      <header className="syt-top-header no-print">
        <div className="syt-branding">
          <div className="syt-logo-badge">
            <img src={logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }} />
          </div>
          <div className="syt-title-group">
            <h1>PHÒNG KHÁM ĐA KHOA TRƯỜNG ĐẠI HỌC Y KHOA PHẠM NGỌC THẠCH</h1>
            <p>Hệ thống Khám sức khỏe định kỳ & Quản lý hồ sơ sức khỏe điện tử (Form Chuẩn SYT)</p>
          </div>
        </div>

        <div className="syt-action-bar">
          {currentUser && currentUser.email.toLowerCase() === 'tienmed@gmail.com' && (
            <button className="syt-btn" style={{ background: '#f59e0b', borderColor: '#d97706', color: '#fff', padding: '6px 12px', fontSize: '12px', height: 'auto' }} onClick={() => setShowPermissionModal(true)} title="Phân quyền Email">
              ⚙️ Phân quyền
            </button>
          )}

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.15)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.3)' }}>
              <img 
                src={currentUser.picture || "https://lh3.googleusercontent.com/a/default-user=s96-c"} 
                alt="Avatar" 
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #ffffff' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', lineHeight: '1.2' }}>
                <span style={{ fontWeight: 'bold', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {currentUser.name}
                  {currentUser.email.toLowerCase() === 'tienmed@gmail.com' && (
                    <span style={{ background: '#f59e0b', color: '#000000', padding: '1px 6px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold' }}>
                      👑 SUPERADMIN
                    </span>
                  )}
                </span>
                <span style={{ opacity: 0.85, fontSize: '11px' }}>{currentUser.email}</span>
              </div>
              <button 
                className="syt-btn syt-btn-danger" 
                style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '12px' }}
                onClick={handleLogout}
                title="Đăng xuất khỏi tài khoản Google"
              >
                <IconLogOut /> Đăng xuất
              </button>
            </div>
          ) : (
            <button className="syt-btn" style={{ background: '#ffffff', color: '#1f2937', fontWeight: 600 }} onClick={() => setShowGoogleModal(true)}>
              <IconGoogle /> Đăng nhập Google
            </button>
          )}

          <button className="syt-btn syt-btn-secondary" onClick={() => setShowLookupModal(true)}>
            <IconSearch /> Tra cứu CCCD
          </button>



          <button className="syt-btn syt-btn-primary" onClick={handleSaveForm}>
            <IconSave /> Lưu phiếu khám
          </button>

          <button className="syt-btn syt-btn-outline" onClick={handleReset}>
            <IconRotateCcw /> Tạo mới
          </button>
        </div>
      </header>

      {/* VALIDATION ERROR DRAWER SUMMARY */}
      {validationErrors.length > 0 && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '12px 16px', borderRadius: '6px', color: '#991b1b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', marginBottom: '4px' }}>
            <IconAlertTriangle /> Vui lòng bổ sung các thông tin còn thiếu:
          </div>
          <ul style={{ paddingLeft: '24px', fontSize: '13px' }}>
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* MAIN SPLIT LAYOUT: SIDEBAR + FORM CONTENT */}
      <div className="syt-main-layout">
        
        {/* LEFT TREE SIDEBAR NAVIGATION - MODULAR RBAC ARCHITECTURE */}
        <aside className="syt-nav-sidebar no-print">
          <div className="syt-nav-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Danh mục Module ({FORM_MODULE_CATALOG.length})</span>
            <span style={{ fontSize: '10px', color: '#0369a1', background: '#e0f2fe', padding: '2px 6px', borderRadius: '4px' }}>RBAC</span>
          </div>

          {FORM_MODULE_CATALOG.map(mod => {
            const isSuperadmin = currentUser?.email?.toLowerCase() === 'tienmed@gmail.com';
            const userEmail = currentUser?.email?.toLowerCase();
            
            let isPermitted = isSuperadmin;
            if (!isSuperadmin && userEmail && emailPermissions[userEmail]) {
              isPermitted = emailPermissions[userEmail].includes(mod.code) || emailPermissions[userEmail].includes(mod.id);
            }

            return (
              <div 
                key={mod.id} 
                className={`syt-tree-item ${activeSection === mod.id ? 'active' : ''}`} 
                onClick={() => scrollToSection(mod.id)}
              >
                <div 
                  className="syt-tree-icon-badge" 
                  style={{ 
                    background: mod.category === 'hành chính' ? '#e1f5fe' :
                                mod.category === 'tiền sử' ? '#efedff' :
                                mod.category === 'lâm sàng' ? '#fff1f1' :
                                mod.category === 'cận lâm sàng' ? '#e8f5e9' : '#fff8e1', 
                    color: mod.category === 'hành chính' ? '#0984e3' :
                           mod.category === 'tiền sử' ? '#6c5ce7' :
                           mod.category === 'lâm sàng' ? '#d63031' :
                           mod.category === 'cận lâm sàng' ? '#2e7d32' : '#f59e0b'
                  }}
                >
                  <IconFileText className="w-4 h-4" />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="syt-module-code-badge" style={{ fontSize: '10px', padding: '1px 5px' }}>{mod.code}</span>
                    <span className="syt-tree-text" style={{ fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {mod.title}
                    </span>
                  </div>
                </div>

                {!isPermitted && (
                  <span title="Bị giới hạn quyền đối với vai trò hiện tại" style={{ fontSize: '12px' }}>🔒</span>
                )}
              </div>
            );
          })}
        </aside>

        {/* MAIN FORM CARD */}
        <div className="syt-form-card">
          


          {/* MODULE MOD-01: THÔNG TIN HÀNH CHÍNH */}
          <FormModuleWrapper 
            id="sec-hanhchinh" 
            code="MOD-01" 
            title="I. THÔNG TIN HÀNH CHÍNH" 
            icon={<IconUser style={{ width: '16px', height: '16px', color: '#0984e3' }} />} 
            currentUser={currentUser} 
            emailPermissions={emailPermissions}
          >
            <div className="syt-form-card" style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconUser style={{ color: '#0984e3' }} />
                <h3 style={{ margin: 0, color: '#0984e3', fontSize: '16px', textTransform: 'uppercase' }}>THÔNG TIN HÀNH CHÍNH</h3>
              </div>
              
              <div className="syt-grid">
                <div className="syt-field col-4">
                  <label className="syt-label">Ngày khám <span className="syt-required-star">*</span></label>
                  <input type="datetime-local" className="syt-input" value={formData.ngayKham} onChange={e => handleChange('ngayKham', e.target.value)} />
                </div>
                <div className="syt-field col-4">
                  <label className="syt-label">Đối tượng <span className="syt-required-star">*</span></label>
                  <select className="syt-input" value={formData.doiTuong} onChange={e => handleChange('doiTuong', e.target.value)}>
                    <option value="">-- Chọn đối tượng --</option>
                    <option value="1">Người cao tuổi</option>
                    <option value="2">Người khuyết tật</option>
                    <option value="3">Người thuộc hộ nghèo/cận nghèo</option>
                    <option value="4">Người có công</option>
                    <option value="5">Người mắc bệnh hiểm nghèo/mãn tính</option>
                    <option value="6">Người sống tại vùng sâu vùng xa</option>
                    <option value="7">Người sống tại vùng kinh tế đặc biệt khó khăn</option>
                    <option value="8">Người sống tại xã đảo, huyện đảo</option>
                    <option value="9">Người sống tại đảo</option>
                    <option value="10">Trẻ em trong cơ sở bảo trợ xã hội</option>
                    <option value="11">Học sinh trong các cơ sở giáo dục</option>
                    <option value="12">Sinh viên</option>
                    <option value="13">Người lao động</option>
                    <option value="14">Người lao động không theo hợp đồng</option>
                    <option value="15">Người chưa có BHYT</option>
                    <option value="16">Các đối tượng khác</option>
                  </select>
                </div>
                <div className="syt-field col-4">
                  <label className="syt-label">Địa điểm khám <span className="syt-required-star">*</span></label>
                  <select className="syt-input" value={formData.diaDiemKham} onChange={e => handleChange('diaDiemKham', e.target.value)}>
                    <option value="">-- Chọn địa điểm --</option>
                    <option value="Tại viện">Tại viện</option>
                    <option value="Ngoại viện">Ngoại viện</option>
                  </select>
                </div>

                <div className="syt-field col-6">
                  <label className="syt-label">Số CCCD/Mã số định danh/Hộ chiếu <span className="syt-required-star">*</span></label>
                  <div className="syt-input-container">
                    <input type="text" className="syt-input" placeholder="Nhập CCCD 12 số" value={formData.soCCCD} onChange={e => handleChange('soCCCD', e.target.value)} />
                  </div>
                </div>
                <div className="syt-field col-6">
                  <label className="syt-label">Họ và tên (viết chữ in hoa) <span className="syt-required-star">*</span></label>
                  <input type="text" className="syt-input syt-input-uppercase" placeholder="NHẬP HỌ TÊN" value={formData.hoTen} onChange={e => handleChange('hoTen', e.target.value.toUpperCase())} />
                </div>

                <div className="syt-field col-3">
                  <label className="syt-label">Ngày tháng năm sinh <span className="syt-required-star">*</span></label>
                  <input type="date" className="syt-input" value={formData.ngaySinh} onChange={e => handleChange('ngaySinh', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Giới tính <span className="syt-required-star">*</span></label>
                  <div className="syt-radio-group">
                    <label className="syt-radio-label"><input type="radio" name="gioiTinh" value="Nữ" checked={formData.gioiTinh === 'Nữ'} onChange={() => handleChange('gioiTinh', 'Nữ')} /> Nữ</label>
                    <label className="syt-radio-label"><input type="radio" name="gioiTinh" value="Nam" checked={formData.gioiTinh === 'Nam'} onChange={() => handleChange('gioiTinh', 'Nam')} /> Nam</label>
                  </div>
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Dân tộc</label>
                  <select className="syt-input" value={formData.danToc} onChange={e => handleChange('danToc', e.target.value)}>
                    <option value="">-- Chọn dân tộc --</option>
                    {ETHNIC_GROUPS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Nhóm máu (nếu có)</label>
                  <select className="syt-input" value={formData.nhomMau} onChange={e => handleChange('nhomMau', e.target.value)}>
                    <option value="">-- Chọn --</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="O">O</option>
                    <option value="AB">AB</option>
                  </select>
                </div>

                <div className="syt-field col-3">
                  <label className="syt-label">Yếu tố nhóm máu</label>
                  <select className="syt-input" value={formData.rhFactor} onChange={e => handleChange('rhFactor', e.target.value)}>
                    <option value="">-- Chọn --</option>
                    <option value="Rh+">Rh+</option>
                    <option value="Rh-">Rh-</option>
                  </select>
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Số thẻ Bảo Hiểm Y Tế</label>
                  <input type="text" className="syt-input" value={formData.soBHYT} onChange={e => handleChange('soBHYT', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Điện thoại di động <span className="syt-required-star">*</span></label>
                  <input type="text" className="syt-input" value={formData.dienThoai} onChange={e => handleChange('dienThoai', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Nơi ở hiện tại <span className="syt-required-star">*</span></label>
                  <input type="text" className="syt-input" value={formData.noiOHienTai} onChange={e => handleChange('noiOHienTai', e.target.value)} />
                </div>

                <div className="syt-field col-3">
                  <label className="syt-label">Thành phố/Tỉnh <span className="syt-required-star">*</span></label>
                  <Select
                    styles={reactSelectStyles}
                    options={Object.keys(RESIDENCE_DATA).map(p => ({ value: p, label: p }))}
                    value={formData.tinhThanh ? { value: formData.tinhThanh, label: formData.tinhThanh } : null}
                    onChange={(option: any) => {
                      handleChange('tinhThanh', option ? option.value : '');
                      handleChange('xaPhuong', '');
                    }}
                    placeholder="-- Chọn Tỉnh/TP --"
                    isClearable
                    isSearchable
                  />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Xã/Phường <span className="syt-required-star">*</span></label>
                  <Select
                    styles={reactSelectStyles}
                    options={(RESIDENCE_DATA[formData.tinhThanh as keyof typeof RESIDENCE_DATA] || []).map((w: string) => ({ value: w, label: w }))}
                    value={formData.xaPhuong ? { value: formData.xaPhuong, label: formData.xaPhuong } : null}
                    onChange={(option: any) => handleChange('xaPhuong', option ? option.value : '')}
                    placeholder="-- Chọn Xã/Phường --"
                    isClearable
                    isSearchable
                  />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Nghề nghiệp <span className="syt-required-star">*</span></label>
                  <Select
                    styles={reactSelectStyles}
                    options={OCCUPATIONS_DATA.map((o: string) => ({ value: o, label: o }))}
                    value={formData.ngheNghiep ? { value: formData.ngheNghiep, label: formData.ngheNghiep } : null}
                    onChange={(option: any) => handleChange('ngheNghiep', option ? option.value : '')}
                    placeholder="-- Chọn nghề nghiệp --"
                    isClearable
                    isSearchable
                  />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Nơi công tác, học tập</label>
                  <input type="text" className="syt-input" placeholder="Nhập tên cơ quan/trường học" value={formData.noiCongTac} onChange={e => handleChange('noiCongTac', e.target.value)} />
                </div>

                <div className="syt-field col-4">
                  <label className="syt-label">Xã/Phường công tác</label>
                  <input type="text" className="syt-input" placeholder="Nhập xã/phường công tác" value={formData.xaPhuongCongTac} onChange={e => handleChange('xaPhuongCongTac', e.target.value)} />
                </div>
                <div className="syt-field col-8"></div>

                <div className="syt-field col-12">
                  <label className="syt-label">Lý do khám sức khỏe</label>
                  <textarea className="syt-input" rows={2} value={formData.lyDoKham} onChange={e => handleChange('lyDoKham', e.target.value)}></textarea>
                </div>
              </div>

              <div style={{ marginTop: '32px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconBriefcase style={{ color: '#0984e3' }} />
                <h3 style={{ margin: 0, color: '#0984e3', fontSize: '16px', textTransform: 'uppercase' }}>THÔNG TIN ĐỐI TƯỢNG - CHI TRẢ</h3>
              </div>
              
              <div className="syt-grid">
                <div className="syt-field col-6">
                  <label className="syt-label">Hình thức chi trả khám sức khỏe <span className="syt-required-star">*</span></label>
                  <div className="syt-radio-group" style={{ flexDirection: 'column', gap: '8px' }}>
                    <label className="syt-radio-label"><input type="radio" name="htct" value="Ngân sách thành phố hỗ trợ" checked={formData.hinhThucChiTraKsk === 'Ngân sách thành phố hỗ trợ'} onChange={e => handleChange('hinhThucChiTraKsk', e.target.value)} /> Ngân sách thành phố hỗ trợ</label>
                    <label className="syt-radio-label"><input type="radio" name="htct" value="Người sử dụng lao động chi trả" checked={formData.hinhThucChiTraKsk === 'Người sử dụng lao động chi trả'} onChange={e => handleChange('hinhThucChiTraKsk', e.target.value)} /> Người sử dụng lao động chi trả</label>
                    <label className="syt-radio-label"><input type="radio" name="htct" value="Người dân tự chi trả" checked={formData.hinhThucChiTraKsk === 'Người dân tự chi trả'} onChange={e => handleChange('hinhThucChiTraKsk', e.target.value)} /> Người dân tự chi trả</label>
                    <label className="syt-radio-label"><input type="radio" name="htct" value="Nguồn khác" checked={formData.hinhThucChiTraKsk === 'Nguồn khác'} onChange={e => handleChange('hinhThucChiTraKsk', e.target.value)} /> Nguồn khác</label>
                  </div>
                </div>

                <div className="syt-field col-6">
                  <label className="syt-label">Hình thức chi trả <span className="syt-required-star">*</span></label>
                  <div className="syt-radio-group">
                    <label className="syt-radio-label"><input type="radio" name="htct_ct" value="Khám Theo Hợp Đồng" checked={formData.hinhThucChiTraChiTiet === 'Khám Theo Hợp Đồng'} onChange={e => handleChange('hinhThucChiTraChiTiet', e.target.value)} /> Khám Theo Hợp Đồng</label>
                    <label className="syt-radio-label"><input type="radio" name="htct_ct" value="Tự Thực hiện" checked={formData.hinhThucChiTraChiTiet === 'Tự Thực hiện'} onChange={e => handleChange('hinhThucChiTraChiTiet', e.target.value)} /> Tự Thực hiện</label>
                  </div>
                </div>

                {formData.hinhThucChiTraKsk === 'Nguồn khác' && (
                  <div className="syt-field col-12">
                    <label className="syt-label">Nguồn khác (Ghi rõ)</label>
                    <input type="text" className="syt-input" value={formData.nguonKacGhiRo || ''} onChange={e => handleChange('nguonKacGhiRo', e.target.value)} />
                  </div>
                )}
              </div>
            </div>
          </FormModuleWrapper>

          {/* MODULE MOD-02: THÔNG TIN ĐỐI TƯỢNG - CHI TRẢ */}
          <FormModuleWrapper 
            id="module_payment" 
            code="MOD-02" 
            title="II. THÔNG TIN ĐỐI TƯỢNG - CHI TRẢ" 
            icon={<IconCard />} 
            currentUser={currentUser} 
            emailPermissions={emailPermissions}
          >
            <div className="syt-group-title">Hình thức chi trả khám sức khỏe:</div>
            <div className="syt-payment-cards">
              {[
                { id: '1', title: 'Ngân sách TP hỗ trợ' },
                { id: '2', title: 'Người sử dụng lao động' },
                { id: '3', title: 'Người dân tự chi trả' },
                { id: '4', title: 'Nguồn khác' }
              ].map(card => (
                <div 
                  key={card.id}
                  className={`syt-payment-card ${formData.hinhThucChiTraKsk === card.id ? 'active' : ''}`}
                  onClick={() => handleChange('hinhThucChiTraKsk', card.id)}
                >
                  <div className="syt-payment-badge">{card.id}</div>
                  <div style={{ fontWeight: 600, fontSize: '13px' }}>{card.title}</div>
                </div>
              ))}
            </div>

            <div className="syt-grid" style={{ marginTop: '12px' }}>
              <div className="syt-field col-6">
                <label className="syt-label">Chi tiết hình thức chi trả:</label>
                <div className="syt-radio-group">
                  {['Hợp đồng khám sức khỏe định kỳ', 'Khám lẻ', 'Nguồn hỗ trợ khác'].map(opt => (
                    <label key={opt} className="syt-radio-label">
                      <input 
                        type="radio" 
                        name="hinhThucChiTraChiTiet" 
                        value={opt} 
                        checked={formData.hinhThucChiTraChiTiet === opt}
                        onChange={() => handleChange('hinhThucChiTraChiTiet', opt)}
                      /> {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className="syt-field col-6">
                <label className="syt-label">Nguồn khác (Ghi rõ nếu chọn nguồn khác)</label>
                <input 
                  type="text" 
                  className="syt-input" 
                  placeholder="Ghi rõ cơ quan, tổ chức hỗ trợ..."
                  disabled={formData.hinhThucChiTraKsk !== '4'}
                  value={formData.nguonKacGhiRo}
                  onChange={e => handleChange('nguonKacGhiRo', e.target.value)}
                />
              </div>
            </div>
          </FormModuleWrapper>

          {/* MODULE MOD-03: TIỀN SỬ GIA ĐÌNH & MÃ ICD */}
          <FormModuleWrapper 
            id="module_family_history" 
            code="MOD-03" 
            title="III. TIỀN SỬ GIA ĐÌNH & MÃ ICD" 
            icon={<IconFileText />} 
            currentUser={currentUser} 
            emailPermissions={emailPermissions}
          >
            <div className="syt-group-title">1. Bệnh, tật gia đình đã hoặc đang mắc (Tick chọn nếu có):</div>
            
            <div className="syt-family-grid">
              {[
                { id: '1', name: '1. Bệnh truyền nhiễm' },
                { id: '2', name: '2. Bệnh tim mạch' },
                { id: '3', name: '3. Đái tháo đường' },
                { id: '4', name: '4. Lao' },
                { id: '5', name: '5. Hen phế quản' },
                { id: '6', name: '6. Ung thư' },
                { id: '7', name: '7. Động kinh' },
                { id: '8', name: '8. Rối loạn tâm thần' },
                { id: '9', name: '9. Bệnh khác' }
              ].map(item => (
                <label key={item.id} className={`syt-checkbox-item ${formData.familyDiseases[item.id] ? 'checked' : ''}`}>
                  <input 
                    type="checkbox" 
                    checked={!!formData.familyDiseases[item.id]} 
                    onChange={() => handleFamilyCheckbox(item.id)}
                  />
                  <span style={{ fontWeight: 500 }}>{item.name}</span>
                </label>
              ))}
            </div>

            <div className="syt-grid" style={{ marginTop: '12px' }}>
              <div className="syt-field col-12">
                <label className="syt-label">Mã ICD / Mô tả chi tiết tiền sử gia đình:</label>
                
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', alignSelf: 'center', fontWeight: 'bold' }}>Gợi ý mã ICD:</span>
                  {ICD_POPULAR_TAGS.map(icd => (
                    <button 
                      key={icd} 
                      type="button"
                      className="syt-btn syt-btn-outline" 
                      style={{ padding: '3px 8px', fontSize: '11px' }}
                      onClick={() => handleAddIcdTag(icd)}
                    >
                      + {icd}
                    </button>
                  ))}
                </div>

                <div className="syt-tag-container">
                  {formData.icdCodesTag.map(t => (
                    <span key={t} className="syt-tag-chip">
                      {t}
                      <button type="button" onClick={() => handleRemoveIcdTag(t)}>×</button>
                    </span>
                  ))}
                  
                  <input 
                    type="text" 
                    className="syt-input" 
                    style={{ border: 'none', width: '220px', padding: '2px 4px' }}
                    placeholder="Gõ ICD/tên bệnh rồi nhấn Enter..."
                    value={customIcdInput}
                    onChange={e => setCustomIcdInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddIcdTag(customIcdInput);
                        setCustomIcdInput('');
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </FormModuleWrapper>

          {/* MODULE MOD-04: TIỀN SỬ BẢN THÂN */}
          <FormModuleWrapper 
            id="module_personal_history" 
            code="MOD-04" 
            title="II. TIỀN SỬ BẢN THÂN" 
            icon={<IconHistory style={{ width: '16px', height: '16px', color: '#0984e3' }} />} 
            currentUser={currentUser} 
            emailPermissions={emailPermissions}
          >
            <div className="syt-form-card" style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconHistory style={{ color: '#0984e3' }} />
                <h3 style={{ margin: 0, color: '#0984e3', fontSize: '16px', textTransform: 'uppercase' }}>TIỀN SỬ BẢN THÂN</h3>
              </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', marginBottom: '12px' }}>
              <div className="syt-group-title" style={{ margin: 0 }}>
                2. Bảng kê tiền sử bệnh tật cá nhân (Data Grid 22 items):
              </div>
              <button className="syt-btn syt-btn-success" style={{ padding: '4px 12px', fontSize: '12px' }} onClick={handleSelectAllNo}>
                <IconCheck /> CHỌN TẤT CẢ KHÔNG
              </button>
            </div>

            <div className="syt-table-container">
              <table className="syt-data-table">
                <thead>
                  <tr>
                    <th style={{ width: '50px', textAlign: 'center' }}>STT</th>
                    <th>Tên bệnh / Tiền sử sức khỏe</th>
                    <th style={{ width: '160px', textAlign: 'center' }}>Tiền sử (Có / Không)</th>
                    <th style={{ width: '35%' }}>Bác sĩ đánh giá / Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.personalHistoryRows.map(row => (
                    <tr key={row.id}>
                      <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#64748b' }}>{row.id}</td>
                      <td style={{ fontWeight: 500 }}>{row.diseaseName}</td>
                      <td style={{ textAlign: 'center' }}>
                        <div className="syt-toggle-btn-group">
                          <button 
                            type="button"
                            className={`syt-toggle-btn ${row.hasDisease === 'có' ? 'active-co' : ''}`}
                            onClick={() => handlePersonalRowChange(row.id, 'hasDisease', 'có')}
                          >
                            CÓ
                          </button>
                          <button 
                            type="button"
                            className={`syt-toggle-btn ${row.hasDisease === 'không' ? 'active-khong' : ''}`}
                            onClick={() => handlePersonalRowChange(row.id, 'hasDisease', 'không')}
                          >
                            KHÔNG
                          </button>
                        </div>
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="syt-input" 
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                          placeholder="Nhập ghi chú của bác sĩ..."
                          value={row.doctorAssessment || ''}
                          onChange={e => handlePersonalRowChange(row.id, 'doctorAssessment', e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="syt-grid">
              <div className="syt-field col-12">
                <label className="syt-label">Bệnh đang điều trị / Thuốc đang sử dụng (nếu có):</label>
                <textarea 
                  className="syt-input" 
                  rows={2}
                  placeholder="Liệt kê danh sách thuốc đang sử dụng hằng ngày..."
                  value={formData.dangDieuTriThuoc}
                  onChange={e => handleChange('dangDieuTriThuoc', e.target.value)}
                />
              </div>
            </div>

            </div>
          </FormModuleWrapper>

          {/* MODULE MOD-05: TIỀN SỬ SẢN PHỤ KHOA */}
          {(formData.isFemale || formData.gioiTinh === 'Nữ') && (
            <FormModuleWrapper 
              id="module_obstetrics" 
              code="MOD-05" 
              title="Tiền sử Sản phụ khoa (Dành cho Nữ)" 
              icon={<IconUser style={{ width: '16px', height: '16px', color: '#0984e3' }} />} 
              currentUser={currentUser} 
              emailPermissions={emailPermissions}
            >
              <div className="syt-form-card" style={{ padding: '24px' }}>
                <div style={{ marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IconUser style={{ color: '#0984e3' }} />
                  <h3 style={{ margin: 0, color: '#0984e3', fontSize: '16px', textTransform: 'uppercase' }}>TIỀN SỬ THAI SẢN (ĐỐI VỚI PHỤ NỮ)</h3>
                </div>

                <div className="syt-grid">
                  <div className="syt-field col-12">
                    <div className="syt-radio-group" style={{ gap: '20px' }}>
                      <label className="syt-radio-label">
                        <input type="radio" name="thaiSanCoKhong" value="Có" checked={formData.thaiSanCoKhong === 'Có'} onChange={e => handleChange('thaiSanCoKhong', e.target.value)} /> Có
                      </label>
                      <label className="syt-radio-label">
                        <input type="radio" name="thaiSanCoKhong" value="Không" checked={formData.thaiSanCoKhong === 'Không'} onChange={e => handleChange('thaiSanCoKhong', e.target.value)} /> Không
                      </label>
                    </div>
                  </div>

                  {formData.thaiSanCoKhong === 'Có' && (
                    <div className="syt-field col-12">
                      <label className="syt-label" style={{ fontWeight: 500 }}>Nếu có, xin hãy liệt kê các thuốc đang dùng và liều lượng</label>
                      <input type="text" className="syt-input" value={formData.thaiSanThuoc} onChange={e => handleChange('thaiSanThuoc', e.target.value)} />
                    </div>
                  )}
                </div>
              </div>
            </FormModuleWrapper>
          )}

          {/* MODULE MOD-06: KHÁM THỂ LỰC */}
          <FormModuleWrapper id="module_physical_metrics" code="MOD-06" title="Khám thể lực" icon={<IconHeartPulse style={{ width: '16px', height: '16px', color: '#0984e3' }} />} currentUser={currentUser} emailPermissions={emailPermissions}>
            <div className="syt-form-card" style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconHeartPulse style={{ color: '#0984e3' }} />
                <h3 style={{ margin: 0, color: '#0984e3', fontSize: '16px', textTransform: 'uppercase' }}>KHÁM THỂ LỰC</h3>
              </div>
              <div className="syt-grid">
                <div className="syt-field col-3">
                  <label className="syt-label">Chiều cao (cm) <span className="syt-required-star">*</span></label>
                  <input type="number" className="syt-input" placeholder="Nhập số (thập phân dùng...)" value={formData.chieuCao} onChange={e => handleChange('chieuCao', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Cân nặng (kg) <span className="syt-required-star">*</span></label>
                  <input type="number" className="syt-input" placeholder="Nhập số (thập phân dùng...)" value={formData.canNang} onChange={e => handleChange('canNang', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Nhịp thở (lần/phút) <span className="syt-required-star">*</span></label>
                  <input type="number" className="syt-input" placeholder="Nhập số (thập phân dùng...)" value={formData.nhipTho} onChange={e => handleChange('nhipTho', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Chỉ số BMI</label>
                  <input type="text" className="syt-input" style={{ borderStyle: 'dashed' }} placeholder="Nhập số (thập phân dùng...)" readOnly value={formData.bmi} />
                </div>

                <div className="syt-field col-3">
                  <label className="syt-label">Mạch (lần/phút) <span className="syt-required-star">*</span></label>
                  <input type="number" className="syt-input" placeholder="Nhập số (thập phân dùng...)" value={formData.mach} onChange={e => handleChange('mach', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Huyết áp TT (mmHg) <span className="syt-required-star">*</span></label>
                  <input type="number" className="syt-input" placeholder="Nhập số (thập phân dùng...)" value={formData.huyetApTT} onChange={e => handleChange('huyetApTT', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Huyết áp TTr (mmHg) <span className="syt-required-star">*</span></label>
                  <input type="number" className="syt-input" placeholder="Nhập số (thập phân dùng...)" value={formData.huyetApTTr} onChange={e => handleChange('huyetApTTr', e.target.value)} />
                </div>
                <div className="syt-field col-3"></div>

                <div className="syt-field col-12" style={{ marginTop: '12px' }}>
                  <label className="syt-label">Phân loại thể lực</label>
                  <div className="syt-radio-group" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {['Loại I', 'Loại II', 'Loại III', 'Loại IV', 'Loại V'].map(loai => (
                      <label key={loai} className="syt-radio-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="radio" name="phanLoaiTheLuc" style={{ width: '18px', height: '18px', cursor: 'pointer' }} value={loai} checked={formData.phanLoaiSK === loai} onChange={e => handleChange('phanLoaiSK', e.target.value as any)} />
                        {loai}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FormModuleWrapper>

          {/* MODULE MOD-07: NỘI, NGOẠI, DA LIỄU */}
          <FormModuleWrapper id="module_clinical_internal" code="MOD-07" title="1. NỘI KHOA (Nội khoa tổng quát) & 2. NGOẠI KHOA & DA LIỄU" icon={<IconStethoscope style={{ width: '16px', height: '16px', color: '#0984e3' }} />} currentUser={currentUser} emailPermissions={emailPermissions}>
            <div className="syt-form-card" style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconStethoscope style={{ color: '#0984e3' }} />
                <h3 style={{ margin: 0, color: '#0984e3', fontSize: '16px', textTransform: 'uppercase' }}>1. NỘI KHOA (Nội khoa tổng quát)</h3>
              </div>
              <SpecialtyExamBlock title="Tuần hoàn" icon={<IconHeartPulse />} data={formData.tuanHoan} onChange={val => handleChange('tuanHoan', val)} />
              <SpecialtyExamBlock title="Hô hấp" icon={<IconStethoscope />} data={formData.hoHap} onChange={val => handleChange('hoHap', val)} />
              <SpecialtyExamBlock title="Tiêu hóa" icon={<IconBriefcase />} data={formData.tieuHoa} onChange={val => handleChange('tieuHoa', val)} />
              <SpecialtyExamBlock title="Thận - Tiết niệu" icon={<IconFileText />} data={formData.thanTietNieu} onChange={val => handleChange('thanTietNieu', val)} />
              <SpecialtyExamBlock title="Nội tiết" icon={<IconUser />} data={formData.noiTiet} onChange={val => handleChange('noiTiet', val)} />
              <SpecialtyExamBlock title="Cơ - xương - khớp" icon={<IconHeartPulse />} data={formData.coXuongKhop} onChange={val => handleChange('coXuongKhop', val)} />
              <SpecialtyExamBlock title="Thần kinh" icon={<IconUser />} data={formData.thanKinh} onChange={val => handleChange('thanKinh', val)} />
              <SpecialtyExamBlock title="Tâm thần" icon={<IconUser />} data={formData.tamThan} onChange={val => handleChange('tamThan', val)} />

              <div style={{ marginTop: '24px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconStethoscope style={{ color: '#0984e3' }} />
                <h3 style={{ margin: 0, color: '#0984e3', fontSize: '16px', textTransform: 'uppercase' }}>2. NGOẠI KHOA & DA LIỄU</h3>
              </div>
              <SpecialtyExamBlock title="Ngoại khoa" icon={<IconStethoscope />} data={formData.ngoaiKhoa} onChange={val => handleChange('ngoaiKhoa', val)} />
              <SpecialtyExamBlock title="Da liễu" icon={<IconUser />} data={formData.daLieu} onChange={val => handleChange('daLieu', val)} />
            </div>
          </FormModuleWrapper>

          {/* MODULE MOD-08: SẢN PHỤ KHOA */}
          {(formData.isFemale || formData.gioiTinh === 'Nữ') && (
            <FormModuleWrapper id="module_clinical_obgyn" code="MOD-08" title="4. SẢN PHỤ KHOA" icon={<IconUser style={{ width: '16px', height: '16px', color: '#0984e3' }} />} currentUser={currentUser} emailPermissions={emailPermissions}>
              <div className="syt-form-card" style={{ padding: '24px' }}>
                <div style={{ marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IconUser style={{ color: '#0984e3' }} />
                  <h3 style={{ margin: 0, color: '#0984e3', fontSize: '16px', textTransform: 'uppercase' }}>4. SẢN PHỤ KHOA</h3>
                </div>
                
                {/* SẢN KHOA */}
                <div style={{ marginBottom: '24px', border: '1px solid #e0e7f3', borderRadius: '6px', padding: '16px', background: '#ffffff' }}>
                  <div style={{ color: '#1b365d', fontWeight: 'bold', fontSize: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IconUser style={{ color: '#0984e3', width: '16px', height: '16px' }} /> Sản khoa
                  </div>
                  <div className="syt-grid">
                    <div className="syt-field col-12" style={{ marginBottom: '12px' }}>
                      <label className="syt-checkbox-item" style={{ margin: 0 }}>
                        <input type="checkbox" checked={formData.sanKhoa?.normal ?? true} onChange={e => handleChange('sanKhoa', { ...formData.sanKhoa, normal: e.target.checked })} />
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>Chưa phát hiện bất thường</span>
                      </label>
                    </div>
                    <div className="syt-field col-6">
                      <label className="syt-label" style={{ fontSize: '12px' }}>Chẩn đoán sơ bộ</label>
                      <input type="text" className="syt-input" placeholder="ghi rõ theo mã ICD" value={formData.sanKhoa?.icdPreliminary || ''} onChange={e => handleChange('sanKhoa', { ...formData.sanKhoa, icdPreliminary: e.target.value })} />
                    </div>
                    <div className="syt-field col-6">
                      <label className="syt-label" style={{ fontSize: '12px' }}>Chẩn đoán xác định</label>
                      <input type="text" className="syt-input" placeholder="ghi rõ theo mã ICD" value={formData.sanKhoa?.icdFinal || ''} onChange={e => handleChange('sanKhoa', { ...formData.sanKhoa, icdFinal: e.target.value })} />
                    </div>
                    <div className="syt-field col-12" style={{ marginTop: '12px' }}>
                      <label className="syt-label" style={{ fontSize: '12px' }}>Phân loại <span className="syt-required-star">*</span></label>
                      <div className="syt-radio-group" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {['Loại I', 'Loại II', 'Loại III', 'Loại IV', 'Loại V'].map(loai => (
                          <label key={loai} className="syt-radio-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input type="radio" name="phanLoaiSanKhoa" style={{ width: '18px', height: '18px', cursor: 'pointer' }} value={loai} checked={formData.sanKhoa?.classification === loai} onChange={e => handleChange('sanKhoa', { ...formData.sanKhoa, classification: e.target.value })} />
                            {loai}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* PHỤ KHOA */}
                <div style={{ border: '1px solid #e0e7f3', borderRadius: '6px', padding: '16px', background: '#ffffff' }}>
                  <div style={{ color: '#1b365d', fontWeight: 'bold', fontSize: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IconUser style={{ color: '#0984e3', width: '16px', height: '16px' }} /> Phụ khoa
                  </div>
                  <div className="syt-grid">
                    <div className="syt-field col-12" style={{ marginBottom: '12px' }}>
                      <label className="syt-checkbox-item" style={{ margin: 0 }}>
                        <input type="checkbox" checked={formData.phuKhoa?.normal ?? true} onChange={e => handleChange('phuKhoa', { ...formData.phuKhoa, normal: e.target.checked })} />
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>Chưa phát hiện bất thường</span>
                      </label>
                    </div>
                    <div className="syt-field col-6">
                      <label className="syt-label" style={{ fontSize: '12px' }}>Chẩn đoán sơ bộ</label>
                      <input type="text" className="syt-input" placeholder="ghi rõ theo mã ICD" value={formData.phuKhoa?.icdPreliminary || ''} onChange={e => handleChange('phuKhoa', { ...formData.phuKhoa, icdPreliminary: e.target.value })} />
                    </div>
                    <div className="syt-field col-6">
                      <label className="syt-label" style={{ fontSize: '12px' }}>Chẩn đoán xác định</label>
                      <input type="text" className="syt-input" placeholder="ghi rõ theo mã ICD" value={formData.phuKhoa?.icdFinal || ''} onChange={e => handleChange('phuKhoa', { ...formData.phuKhoa, icdFinal: e.target.value })} />
                    </div>
                    <div className="syt-field col-12" style={{ marginTop: '12px' }}>
                      <label className="syt-label" style={{ fontSize: '12px' }}>Phân loại <span className="syt-required-star">*</span></label>
                      <div className="syt-radio-group" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {['Loại I', 'Loại II', 'Loại III', 'Loại IV', 'Loại V'].map(loai => (
                          <label key={loai} className="syt-radio-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input type="radio" name="phanLoaiPhuKhoa" style={{ width: '18px', height: '18px', cursor: 'pointer' }} value={loai} checked={formData.phuKhoa?.classification === loai} onChange={e => handleChange('phuKhoa', { ...formData.phuKhoa, classification: e.target.value })} />
                            {loai}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </FormModuleWrapper>
          )}

          {/* MODULE MOD-09: MẮT, TAI MŨI HỌNG, RĂNG HÀM MẶT */}
          <FormModuleWrapper id="module_clinical_eye_ent_dental" code="MOD-09" title="4. MẮT & 5. TAI - MŨI - HỌNG & 6. RĂNG - HÀM - MẶT" icon={<IconStethoscope style={{ width: '16px', height: '16px', color: '#0984e3' }} />} currentUser={currentUser} emailPermissions={emailPermissions}>
            <div className="syt-form-card" style={{ padding: '24px' }}>
              {/* MẮT */}
              <div style={{ marginBottom: '24px', border: '1px solid #e0e7f3', borderRadius: '6px', background: '#ffffff' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {/* Cột trái: Khám thị lực */}
                  <div style={{ flex: '1 1 50%', minWidth: '300px', padding: '16px', borderRight: '1px solid #e0e7f3' }}>
                    <div style={{ color: '#1b365d', fontWeight: 'bold', fontSize: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <IconUser style={{ color: '#0984e3', width: '16px', height: '16px' }} /> Khám thị lực
                    </div>
                    
                    <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px', color: '#1e293b' }}>Không kính</div>
                    <div className="syt-grid" style={{ marginBottom: '12px' }}>
                      <div className="syt-field col-6">
                        <label className="syt-label" style={{ fontSize: '12px' }}>Mắt phải (.../10)</label>
                        <input type="text" className="syt-input" placeholder="Nhập số..." value={formData.khongKinhPhai} onChange={e => handleChange('khongKinhPhai', e.target.value)} />
                      </div>
                      <div className="syt-field col-6">
                        <label className="syt-label" style={{ fontSize: '12px' }}>Mắt trái (.../10)</label>
                        <input type="text" className="syt-input" placeholder="Nhập số..." value={formData.khongKinhTrai} onChange={e => handleChange('khongKinhTrai', e.target.value)} />
                      </div>
                    </div>

                    <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px', color: '#1e293b' }}>Kính lỗ</div>
                    <div className="syt-grid" style={{ marginBottom: '12px' }}>
                      <div className="syt-field col-6">
                        <label className="syt-label" style={{ fontSize: '12px' }}>Mắt phải (.../10)</label>
                        <input type="text" className="syt-input" placeholder="Nhập số..." value={formData.kinhLoPhai} onChange={e => handleChange('kinhLoPhai', e.target.value)} />
                      </div>
                      <div className="syt-field col-6">
                        <label className="syt-label" style={{ fontSize: '12px' }}>Mắt trái (.../10)</label>
                        <input type="text" className="syt-input" placeholder="Nhập số..." value={formData.kinhLoTrai} onChange={e => handleChange('kinhLoTrai', e.target.value)} />
                      </div>
                    </div>

                    <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px', color: '#1e293b' }}>Có kính</div>
                    <div className="syt-grid">
                      <div className="syt-field col-6">
                        <label className="syt-label" style={{ fontSize: '12px' }}>Mắt phải (.../10)</label>
                        <input type="text" className="syt-input" placeholder="Nhập số..." value={formData.coKinhPhai} onChange={e => handleChange('coKinhPhai', e.target.value)} />
                      </div>
                      <div className="syt-field col-6">
                        <label className="syt-label" style={{ fontSize: '12px' }}>Mắt trái (.../10)</label>
                        <input type="text" className="syt-input" placeholder="Nhập số..." value={formData.coKinhTrai} onChange={e => handleChange('coKinhTrai', e.target.value)} />
                      </div>
                    </div>
                  </div>

                  {/* Cột phải: Khám khúc xạ */}
                  <div style={{ flex: '1 1 50%', minWidth: '300px', padding: '16px' }}>
                    <div style={{ color: '#1b365d', fontWeight: 'bold', fontSize: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <IconUser style={{ color: '#0984e3', width: '16px', height: '16px' }} /> Khám khúc xạ (nếu có)
                    </div>

                    <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px', color: '#1e293b' }}>Mắt phải</div>
                    <div className="syt-grid" style={{ marginBottom: '12px' }}>
                      <div className="syt-field col-4">
                        <label className="syt-label" style={{ fontSize: '12px' }}>Độ cầu</label>
                        <input type="text" className="syt-input" placeholder="Nhập số..." value={formData.khucXaPhaiCau} onChange={e => handleChange('khucXaPhaiCau', e.target.value)} />
                      </div>
                      <div className="syt-field col-4">
                        <label className="syt-label" style={{ fontSize: '12px' }}>Độ trụ</label>
                        <input type="text" className="syt-input" placeholder="Nhập số..." value={formData.khucXaPhaiTru} onChange={e => handleChange('khucXaPhaiTru', e.target.value)} />
                      </div>
                      <div className="syt-field col-4">
                        <label className="syt-label" style={{ fontSize: '12px' }}>Trục</label>
                        <input type="text" className="syt-input" placeholder="Nhập số..." value={formData.khucXaPhaiTruc} onChange={e => handleChange('khucXaPhaiTruc', e.target.value)} />
                      </div>
                    </div>

                    <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px', color: '#1e293b' }}>Mắt trái</div>
                    <div className="syt-grid">
                      <div className="syt-field col-4">
                        <label className="syt-label" style={{ fontSize: '12px' }}>Độ cầu</label>
                        <input type="text" className="syt-input" placeholder="Nhập số..." value={formData.khucXaTraiCau} onChange={e => handleChange('khucXaTraiCau', e.target.value)} />
                      </div>
                      <div className="syt-field col-4">
                        <label className="syt-label" style={{ fontSize: '12px' }}>Độ trụ</label>
                        <input type="text" className="syt-input" placeholder="Nhập số..." value={formData.khucXaTraiTru} onChange={e => handleChange('khucXaTraiTru', e.target.value)} />
                      </div>
                      <div className="syt-field col-4">
                        <label className="syt-label" style={{ fontSize: '12px' }}>Trục</label>
                        <input type="text" className="syt-input" placeholder="Nhập số..." value={formData.khucXaTraiTruc} onChange={e => handleChange('khucXaTraiTruc', e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '16px', borderTop: '1px solid #e0e7f3', background: '#f8fafc', borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px' }}>
                  <div style={{ color: '#1b365d', fontWeight: 'bold', fontSize: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IconUser style={{ color: '#0984e3', width: '16px', height: '16px' }} /> Mắt
                  </div>
                  <div className="syt-grid">
                    <div className="syt-field col-12" style={{ marginBottom: '12px' }}>
                      <label className="syt-checkbox-item" style={{ margin: 0 }}>
                        <input type="checkbox" checked={formData.mat?.normal ?? true} onChange={e => handleChange('mat', { ...formData.mat, normal: e.target.checked })} />
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>Chưa phát hiện bất thường</span>
                      </label>
                    </div>
                    <div className="syt-field col-6">
                      <label className="syt-label" style={{ fontSize: '12px' }}>Chẩn đoán sơ bộ</label>
                      <input type="text" className="syt-input" placeholder="ghi rõ theo mã ICD" value={formData.mat?.icdPreliminary || ''} onChange={e => handleChange('mat', { ...formData.mat, icdPreliminary: e.target.value })} />
                    </div>
                    <div className="syt-field col-6">
                      <label className="syt-label" style={{ fontSize: '12px' }}>Chẩn đoán xác định</label>
                      <input type="text" className="syt-input" placeholder="ghi rõ theo mã ICD" value={formData.mat?.icdFinal || ''} onChange={e => handleChange('mat', { ...formData.mat, icdFinal: e.target.value })} />
                    </div>
                    <div className="syt-field col-12" style={{ marginTop: '12px' }}>
                      <label className="syt-label" style={{ fontSize: '12px' }}>Phân loại <span className="syt-required-star">*</span></label>
                      <div className="syt-radio-group" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {['Loại I', 'Loại II', 'Loại III', 'Loại IV', 'Loại V'].map(loai => (
                          <label key={loai} className="syt-radio-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input type="radio" name="phanLoaiMat" style={{ width: '18px', height: '18px', cursor: 'pointer' }} value={loai} checked={formData.mat?.classification === loai} onChange={e => handleChange('mat', { ...formData.mat, classification: e.target.value })} />
                            {loai}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TAI MŨI HỌNG */}
              <div style={{ marginBottom: '24px', border: '1px solid #e0e7f3', borderRadius: '6px', background: '#ffffff' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #e0e7f3' }}>
                  <div style={{ color: '#1b365d', fontWeight: 'bold', fontSize: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IconUser style={{ color: '#0984e3', width: '16px', height: '16px' }} /> Kết quả khám thính lực
                  </div>
                  
                  <div className="syt-grid" style={{ marginBottom: '12px' }}>
                    <div className="syt-field col-6">
                      <label className="syt-label" style={{ fontSize: '12px' }}>Tai trái (Nói thường)</label>
                      <input type="text" className="syt-input" placeholder="Nhập số (thập phân dùng dấu phẩy)" value={formData.taiTraiNoiThuong || ''} onChange={e => handleChange('taiTraiNoiThuong', e.target.value)} />
                    </div>
                    <div className="syt-field col-6">
                      <label className="syt-label" style={{ fontSize: '12px' }}>Tai trái (Nói thầm)</label>
                      <input type="text" className="syt-input" placeholder="Nhập số (thập phân dùng dấu phẩy)" value={formData.taiTraiNoiTham || ''} onChange={e => handleChange('taiTraiNoiTham', e.target.value)} />
                    </div>
                  </div>

                  <div className="syt-grid">
                    <div className="syt-field col-6">
                      <label className="syt-label" style={{ fontSize: '12px' }}>Tai phải (Nói thường)</label>
                      <input type="text" className="syt-input" placeholder="Nhập số (thập phân dùng dấu phẩy)" value={formData.taiPhaiNoiThuong || ''} onChange={e => handleChange('taiPhaiNoiThuong', e.target.value)} />
                    </div>
                    <div className="syt-field col-6">
                      <label className="syt-label" style={{ fontSize: '12px' }}>Tai phải (Nói thầm)</label>
                      <input type="text" className="syt-input" placeholder="Nhập số (thập phân dùng dấu phẩy)" value={formData.taiPhaiNoiTham || ''} onChange={e => handleChange('taiPhaiNoiTham', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div style={{ padding: '16px', background: '#f8fafc', borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px' }}>
                  <div style={{ color: '#1b365d', fontWeight: 'bold', fontSize: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IconUser style={{ color: '#0984e3', width: '16px', height: '16px' }} /> Tai - Mũi - Họng
                  </div>
                  <div className="syt-grid">
                    <div className="syt-field col-12" style={{ marginBottom: '12px' }}>
                      <label className="syt-checkbox-item" style={{ margin: 0 }}>
                        <input type="checkbox" checked={formData.taiMuiHong?.normal ?? true} onChange={e => handleChange('taiMuiHong', { ...formData.taiMuiHong, normal: e.target.checked })} />
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>Chưa phát hiện bất thường</span>
                      </label>
                    </div>
                    <div className="syt-field col-6">
                      <label className="syt-label" style={{ fontSize: '12px' }}>Chẩn đoán sơ bộ</label>
                      <input type="text" className="syt-input" placeholder="ghi rõ theo mã ICD" value={formData.taiMuiHong?.icdPreliminary || ''} onChange={e => handleChange('taiMuiHong', { ...formData.taiMuiHong, icdPreliminary: e.target.value })} />
                    </div>
                    <div className="syt-field col-6">
                      <label className="syt-label" style={{ fontSize: '12px' }}>Chẩn đoán xác định</label>
                      <input type="text" className="syt-input" placeholder="ghi rõ theo mã ICD" value={formData.taiMuiHong?.icdFinal || ''} onChange={e => handleChange('taiMuiHong', { ...formData.taiMuiHong, icdFinal: e.target.value })} />
                    </div>
                    <div className="syt-field col-12" style={{ marginTop: '12px' }}>
                      <label className="syt-label" style={{ fontSize: '12px' }}>Phân loại <span className="syt-required-star">*</span></label>
                      <div className="syt-radio-group" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {['Loại I', 'Loại II', 'Loại III', 'Loại IV', 'Loại V'].map(loai => (
                          <label key={loai} className="syt-radio-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input type="radio" name="phanLoaiTMH" style={{ width: '18px', height: '18px', cursor: 'pointer' }} value={loai} checked={formData.taiMuiHong?.classification === loai} onChange={e => handleChange('taiMuiHong', { ...formData.taiMuiHong, classification: e.target.value })} />
                            {loai}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RĂNG HÀM MẶT */}
              <div style={{ marginBottom: '24px', border: '1px solid #e0e7f3', borderRadius: '6px', background: '#ffffff' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #e0e7f3' }}>
                  <div style={{ color: '#1b365d', fontWeight: 'bold', fontSize: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IconUser style={{ color: '#0984e3', width: '16px', height: '16px' }} /> Răng - Hàm - Mặt
                  </div>
                  
                  {/* Interactive Dental Chart */}
                  <div style={{ border: '1px solid #0d9488', borderRadius: '6px', padding: '24px 16px', marginBottom: '16px', background: '#f0fdfa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0d9488', paddingBottom: '16px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', gap: '12px', paddingRight: '20px', borderRight: '2px solid #0d9488' }}>
                        {[18, 17, 16, 15, 14, 13, 12, 11].map(n => {
                          const val = formData.rangStatuses?.[n] ?? 0;
                          const colors: Record<number, string> = {
                            0: '#10b981', // green
                            1: '#ef4444', // red
                            2: '#f59e0b', // amber
                            3: '#3b82f6', // blue
                            4: '#6b7280', // gray
                            5: '#9ca3af', // light gray
                            6: '#8b5cf6', // purple
                            7: '#ec4899', // pink
                            8: '#14b8a6', // teal
                            9: '#000000', // black
                          };
                          const color = colors[val] || '#fff';
                          return (
                          <div key={n} style={{ textAlign: 'center', fontWeight: 'bold', color: '#0f766e', position: 'relative' }}>
                            <div style={{ width: '26px', height: '36px', background: color, border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '900', color: val === 0 ? '#ffffff' : '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                              {val}
                            </div>
                            {n}
                            <select 
                              style={{ position: 'absolute', top: 0, left: 0, width: '26px', height: '36px', opacity: 0, cursor: 'pointer' }}
                              value={val}
                              onChange={e => handleChange('rangStatuses', { ...formData.rangStatuses, [n]: parseInt(e.target.value, 10) })}
                            >
                              <option value="0">0 - Bình thường</option>
                              <option value="1">1 - Sâu</option>
                              <option value="2">2 - Trám sâu lại</option>
                              <option value="3">3 - Trám tốt</option>
                              <option value="4">4 - Mất do sâu</option>
                              <option value="5">5 - Mất lý do khác</option>
                              <option value="6">6 - Bít hố rãnh</option>
                              <option value="7">7 - Trụ, cầu, implant</option>
                              <option value="8">8 - Chưa mọc</option>
                              <option value="9">9 - Loại trừ</option>
                            </select>
                          </div>
                          );
                        })}
                      </div>
                      <div style={{ display: 'flex', gap: '12px', paddingLeft: '20px' }}>
                        {[21, 22, 23, 24, 25, 26, 27, 28].map(n => {
                          const val = formData.rangStatuses?.[n] ?? 0;
                          const colors: Record<number, string> = {
                            0: '#10b981', // green
                            1: '#ef4444', // red
                            2: '#f59e0b', // amber
                            3: '#3b82f6', // blue
                            4: '#6b7280', // gray
                            5: '#9ca3af', // light gray
                            6: '#8b5cf6', // purple
                            7: '#ec4899', // pink
                            8: '#14b8a6', // teal
                            9: '#000000', // black
                          };
                          const color = colors[val] || '#fff';
                          return (
                          <div key={n} style={{ textAlign: 'center', fontWeight: 'bold', color: '#0f766e', position: 'relative' }}>
                            <div style={{ width: '26px', height: '36px', background: color, border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '900', color: val === 0 ? '#ffffff' : '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                              {val}
                            </div>
                            {n}
                            <select 
                              style={{ position: 'absolute', top: 0, left: 0, width: '26px', height: '36px', opacity: 0, cursor: 'pointer' }}
                              value={val}
                              onChange={e => handleChange('rangStatuses', { ...formData.rangStatuses, [n]: parseInt(e.target.value, 10) })}
                            >
                              <option value="0">0 - Bình thường</option>
                              <option value="1">1 - Sâu</option>
                              <option value="2">2 - Trám sâu lại</option>
                              <option value="3">3 - Trám tốt</option>
                              <option value="4">4 - Mất do sâu</option>
                              <option value="5">5 - Mất lý do khác</option>
                              <option value="6">6 - Bít hố rãnh</option>
                              <option value="7">7 - Trụ, cầu, implant</option>
                              <option value="8">8 - Chưa mọc</option>
                              <option value="9">9 - Loại trừ</option>
                            </select>
                          </div>
                          );
                        })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '12px', paddingRight: '20px', borderRight: '2px solid #0d9488' }}>
                        {[48, 47, 46, 45, 44, 43, 42, 41].map(n => {
                          const val = formData.rangStatuses?.[n] ?? 0;
                          const colors: Record<number, string> = {
                            0: '#10b981', // green
                            1: '#ef4444', // red
                            2: '#f59e0b', // amber
                            3: '#3b82f6', // blue
                            4: '#6b7280', // gray
                            5: '#9ca3af', // light gray
                            6: '#8b5cf6', // purple
                            7: '#ec4899', // pink
                            8: '#14b8a6', // teal
                            9: '#000000', // black
                          };
                          const color = colors[val] || '#fff';
                          return (
                          <div key={n} style={{ textAlign: 'center', fontWeight: 'bold', color: '#0f766e', position: 'relative' }}>
                            <div style={{ width: '26px', height: '36px', background: color, border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '900', color: val === 0 ? '#ffffff' : '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                              {val}
                            </div>
                            {n}
                            <select 
                              style={{ position: 'absolute', top: 0, left: 0, width: '26px', height: '36px', opacity: 0, cursor: 'pointer' }}
                              value={val}
                              onChange={e => handleChange('rangStatuses', { ...formData.rangStatuses, [n]: parseInt(e.target.value, 10) })}
                            >
                              <option value="0">0 - Bình thường</option>
                              <option value="1">1 - Sâu</option>
                              <option value="2">2 - Trám sâu lại</option>
                              <option value="3">3 - Trám tốt</option>
                              <option value="4">4 - Mất do sâu</option>
                              <option value="5">5 - Mất lý do khác</option>
                              <option value="6">6 - Bít hố rãnh</option>
                              <option value="7">7 - Trụ, cầu, implant</option>
                              <option value="8">8 - Chưa mọc</option>
                              <option value="9">9 - Loại trừ</option>
                            </select>
                          </div>
                          );
                        })}
                      </div>
                      <div style={{ display: 'flex', gap: '12px', paddingLeft: '20px' }}>
                        {[31, 32, 33, 34, 35, 36, 37, 38].map(n => {
                          const val = formData.rangStatuses?.[n] ?? 0;
                          const colors: Record<number, string> = {
                            0: '#10b981', // green
                            1: '#ef4444', // red
                            2: '#f59e0b', // amber
                            3: '#3b82f6', // blue
                            4: '#6b7280', // gray
                            5: '#9ca3af', // light gray
                            6: '#8b5cf6', // purple
                            7: '#ec4899', // pink
                            8: '#14b8a6', // teal
                            9: '#000000', // black
                          };
                          const color = colors[val] || '#fff';
                          return (
                          <div key={n} style={{ textAlign: 'center', fontWeight: 'bold', color: '#0f766e', position: 'relative' }}>
                            <div style={{ width: '26px', height: '36px', background: color, border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '900', color: val === 0 ? '#ffffff' : '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                              {val}
                            </div>
                            {n}
                            <select 
                              style={{ position: 'absolute', top: 0, left: 0, width: '26px', height: '36px', opacity: 0, cursor: 'pointer' }}
                              value={val}
                              onChange={e => handleChange('rangStatuses', { ...formData.rangStatuses, [n]: parseInt(e.target.value, 10) })}
                            >
                              <option value="0">0 - Bình thường</option>
                              <option value="1">1 - Sâu</option>
                              <option value="2">2 - Trám sâu lại</option>
                              <option value="3">3 - Trám tốt</option>
                              <option value="4">4 - Mất do sâu</option>
                              <option value="5">5 - Mất lý do khác</option>
                              <option value="6">6 - Bít hố rãnh</option>
                              <option value="7">7 - Trụ, cầu, implant</option>
                              <option value="8">8 - Chưa mọc</option>
                              <option value="9">9 - Loại trừ</option>
                            </select>
                          </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '16px', background: '#f8fafc', borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px' }}>
                  <div className="syt-grid">
                    <div className="syt-field col-12" style={{ marginBottom: '12px' }}>
                      <label className="syt-checkbox-item" style={{ margin: 0 }}>
                        <input type="checkbox" checked={formData.rangHamMat?.normal ?? true} onChange={e => handleChange('rangHamMat', { ...formData.rangHamMat, normal: e.target.checked })} />
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>Chưa phát hiện bất thường</span>
                      </label>
                    </div>
                    <div className="syt-field col-6">
                      <label className="syt-label" style={{ fontSize: '12px' }}>Chẩn đoán sơ bộ</label>
                      <input type="text" className="syt-input" placeholder="ghi rõ theo mã ICD" value={formData.rangHamMat?.icdPreliminary || ''} onChange={e => handleChange('rangHamMat', { ...formData.rangHamMat, icdPreliminary: e.target.value })} />
                    </div>
                    <div className="syt-field col-6">
                      <label className="syt-label" style={{ fontSize: '12px' }}>Chẩn đoán xác định</label>
                      <input type="text" className="syt-input" placeholder="ghi rõ theo mã ICD" value={formData.rangHamMat?.icdFinal || ''} onChange={e => handleChange('rangHamMat', { ...formData.rangHamMat, icdFinal: e.target.value })} />
                    </div>
                    <div className="syt-field col-12" style={{ marginTop: '12px' }}>
                      <label className="syt-label" style={{ fontSize: '12px' }}>Phân loại <span className="syt-required-star">*</span></label>
                      <div className="syt-radio-group" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {['Loại I', 'Loại II', 'Loại III', 'Loại IV', 'Loại V'].map(loai => (
                          <label key={loai} className="syt-radio-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input type="radio" name="phanLoaiRHM" style={{ width: '18px', height: '18px', cursor: 'pointer' }} value={loai} checked={formData.rangHamMat?.classification === loai} onChange={e => handleChange('rangHamMat', { ...formData.rangHamMat, classification: e.target.value })} />
                            {loai}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FormModuleWrapper>

          {/* MODULE MOD-10: CẬN LÂM SÀNG TỔNG HỢP */}
          <FormModuleWrapper id="module_paraclinical_blood" code="MOD-10" title="VI. KẾT QUẢ CẬN LÂM SÀNG & XÉT NGHIỆM" icon={<IconStethoscope />} currentUser={currentUser} emailPermissions={emailPermissions}>
          {/* SECTION VI: KẾT QUẢ CẬN LÂM SÀNG */}
          <div id="sec-canlamsang" className="syt-section-header">
            <IconStethoscope /> VI. KẾT QUẢ CẬN LÂM SÀNG & XÉT NGHIỆM
          </div>

          <div className="dx-form-group-content">
            <b style={{ color: '#3399ff', fontSize: '15px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
              1. Khám phân loại sức khỏe để đi học, đi làm / 2. Khám sức khỏe định kỳ
            </b>

            {/* a) Xét nghiệm máu */}
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <div className="syt-group-title" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                a) Xét nghiệm máu (Blood Test)
              </div>

              <b style={{ fontSize: '13px', display: 'block', margin: '8px 0', color: '#1e293b' }}>
                Huyết học: Tổng phân tích tế bào máu ngoại vi (14 chỉ số)
              </b>

              <div className="syt-grid">
                <div className="syt-field col-3">
                  <label className="syt-label">Số lượng HC (M/µL)</label>
                  <input type="text" className="syt-input" value={formData.soLuongHC} onChange={e => handleChange('soLuongHC', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Huyết sắc tố (g/dL)</label>
                  <input type="text" className="syt-input" value={formData.huyetSacTo} onChange={e => handleChange('huyetSacTo', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Hematocrit (%)</label>
                  <input type="text" className="syt-input" value={formData.hematocrit} onChange={e => handleChange('hematocrit', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">MCV (fL)</label>
                  <input type="text" className="syt-input" value={formData.mcv} onChange={e => handleChange('mcv', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">MCH (pg)</label>
                  <input type="text" className="syt-input" value={formData.mch} onChange={e => handleChange('mch', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">MCHC (g/dL)</label>
                  <input type="text" className="syt-input" value={formData.mchc} onChange={e => handleChange('mchc', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">RDW (%)</label>
                  <input type="text" className="syt-input" value={formData.rdw} onChange={e => handleChange('rdw', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Số lượng bạch cầu (K/µL)</label>
                  <input type="text" className="syt-input" value={formData.soLuongBC} onChange={e => handleChange('soLuongBC', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Bạch cầu trung tính (K/µL)</label>
                  <input type="text" className="syt-input" value={formData.bcTrungTinh} onChange={e => handleChange('bcTrungTinh', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Bạch cầu lympho (K/µL)</label>
                  <input type="text" className="syt-input" value={formData.bcLympho} onChange={e => handleChange('bcLympho', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Bạch cầu đơn nhân (K/µL)</label>
                  <input type="text" className="syt-input" value={formData.bcDonNhan} onChange={e => handleChange('bcDonNhan', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Bạch cầu ái toan (K/µL)</label>
                  <input type="text" className="syt-input" value={formData.bcAiToan} onChange={e => handleChange('bcAiToan', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Bạch cầu ái kiềm (K/µL)</label>
                  <input type="text" className="syt-input" value={formData.bcAiKiem} onChange={e => handleChange('bcAiKiem', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Số lượng tiểu cầu (K/µL)</label>
                  <input type="text" className="syt-input" value={formData.soLuongTC} onChange={e => handleChange('soLuongTC', e.target.value)} />
                </div>
              </div>

              <b style={{ fontSize: '13px', display: 'block', margin: '14px 0 8px 0', color: '#1e293b' }}>
                Sinh hóa máu (Blood Biochemistry)
              </b>

              <div className="syt-grid">
                <div className="syt-field col-3">
                  <label className="syt-label">Đường máu (mmol/L)</label>
                  <input type="text" className="syt-input" value={formData.duongMau} onChange={e => handleChange('duongMau', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Urê (mmol/L)</label>
                  <input type="text" className="syt-input" value={formData.ureMau} onChange={e => handleChange('ureMau', e.target.value)} />
                </div>
                <div className="syt-field col-2">
                  <label className="syt-label">Creatinin (µmol/L)</label>
                  <input type="text" className="syt-input" value={formData.creatinin} onChange={e => handleChange('creatinin', e.target.value)} />
                </div>
                <div className="syt-field col-2">
                  <label className="syt-label">ASAT(GOT) (U/L)</label>
                  <input type="text" className="syt-input" value={formData.asat} onChange={e => handleChange('asat', e.target.value)} />
                </div>
                <div className="syt-field col-2">
                  <label className="syt-label">ALAT(GPT) (U/L)</label>
                  <input type="text" className="syt-input" value={formData.alat} onChange={e => handleChange('alat', e.target.value)} />
                </div>
              </div>
            </div>

            {/* b) Xét nghiệm nước tiểu */}
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <div className="syt-group-title" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                b) Xét nghiệm nước tiểu (Tổng phân tích bằng máy tự động)
              </div>

              <div className="syt-grid" style={{ marginTop: '8px' }}>
                <div className="syt-field col-2">
                  <label className="syt-label">Tỉ trọng</label>
                  <input type="text" className="syt-input" value={formData.tiTrong} onChange={e => handleChange('tiTrong', e.target.value)} />
                </div>
                <div className="syt-field col-2">
                  <label className="syt-label">pH</label>
                  <input type="text" className="syt-input" value={formData.pH} onChange={e => handleChange('pH', e.target.value)} />
                </div>
                <div className="syt-field col-2">
                  <label className="syt-label">Bạch cầu</label>
                  <input type="text" className="syt-input" value={formData.bachCauNT} onChange={e => handleChange('bachCauNT', e.target.value)} />
                </div>
                <div className="syt-field col-2">
                  <label className="syt-label">Hồng cầu (Ery/µL)</label>
                  <input type="text" className="syt-input" value={formData.hongCauNT} onChange={e => handleChange('hongCauNT', e.target.value)} />
                </div>
                <div className="syt-field col-4">
                  <label className="syt-label">Nitrit (neg/pos)</label>
                  <div className="syt-radio-group">
                    <label className="syt-radio-label">
                      <input 
                        type="radio" 
                        name="nitritNT" 
                        value="Âm Tính" 
                        checked={formData.nitritNT === 'Âm Tính'} 
                        onChange={() => handleChange('nitritNT', 'Âm Tính')} 
                      /> Âm Tính
                    </label>
                    <label className="syt-radio-label">
                      <input 
                        type="radio" 
                        name="nitritNT" 
                        value="Dương Tính" 
                        checked={formData.nitritNT === 'Dương Tính'} 
                        onChange={() => handleChange('nitritNT', 'Dương Tính')} 
                      /> Dương Tính
                    </label>
                  </div>
                </div>

                <div className="syt-field col-3">
                  <label className="syt-label">Protein (mg/dL)</label>
                  <input type="text" className="syt-input" value={formData.proteinNT} onChange={e => handleChange('proteinNT', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Glucose (mg/dL)</label>
                  <input type="text" className="syt-input" value={formData.glucoseNT} onChange={e => handleChange('glucoseNT', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Thể cetonic (mg/dL)</label>
                  <input type="text" className="syt-input" value={formData.cetonicNT} onChange={e => handleChange('cetonicNT', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Bilirubin (mg/dL)</label>
                  <input type="text" className="syt-input" value={formData.bilirubinNT} onChange={e => handleChange('bilirubinNT', e.target.value)} />
                </div>
                <div className="syt-field col-3">
                  <label className="syt-label">Urobilinogen (mg/dL)</label>
                  <input type="text" className="syt-input" value={formData.urobilinogenNT} onChange={e => handleChange('urobilinogenNT', e.target.value)} />
                </div>
                <div className="syt-field col-9">
                  <label className="syt-label">Khác (nếu có)</label>
                  <input type="text" className="syt-input" value={formData.nuocTieuKhac} onChange={e => handleChange('nuocTieuKhac', e.target.value)} />
                </div>
              </div>
            </div>

            {/* c) Kết quả Chẩn đoán hình ảnh */}
            <div className="syt-grid" style={{ marginBottom: '16px' }}>
              <div className="syt-field col-12">
                <label className="syt-label">c) Kết quả Chẩn đoán hình ảnh (X-Quang tim phổi thẳng):</label>
                <textarea 
                  className="syt-input" 
                  rows={2}
                  placeholder="Nhập kết quả đọc phim X-Quang tim phổi..."
                  value={formData.xQuangTimPhoi}
                  onChange={e => handleChange('xQuangTimPhoi', e.target.value)}
                />
              </div>
            </div>

            {/* d) Cận lâm sàng khác */}
            <div className="syt-grid">
              <div className="syt-field col-3">
                <label className="syt-label">d) Cận lâm sàng khác có thực hiện?</label>
                <div className="syt-radio-group">
                  <label className="syt-radio-label">
                    <input 
                      type="radio" 
                      name="clsKhacRadio" 
                      value="Có" 
                      checked={formData.clsKhacRadio === 'Có'}
                      onChange={() => handleChange('clsKhacRadio', 'Có')}
                    /> Có
                  </label>
                  <label className="syt-radio-label">
                    <input 
                      type="radio" 
                      name="clsKhacRadio" 
                      value="Không" 
                      checked={formData.clsKhacRadio === 'Không'}
                      onChange={() => handleChange('clsKhacRadio', 'Không')}
                    /> Không
                  </label>
                </div>
              </div>

              <div className="syt-field col-9">
                <label className="syt-label">Nếu có, liệt kê kết quả chi tiết:</label>
                <input 
                  type="text" 
                  className="syt-input" 
                  disabled={formData.clsKhacRadio !== 'Có'}
                  placeholder="VD: Siêu âm bụng tổng quát, Điện tâm đồ ECG..."
                  value={formData.clsKhacChiTiet}
                  onChange={e => handleChange('clsKhacChiTiet', e.target.value)}
                />
              </div>
            </div>
          </div>

          </FormModuleWrapper>

          {/* MODULE MOD-13: KẾT LUẬN & ĐỀ NGHỊ BÁC SĨ */}
          <FormModuleWrapper id="module_doctor_conclusion" code="MOD-13" title="V. KẾT LUẬN & ĐỀ NGHỊ BÁC SĨ" icon={<IconCheck />} currentUser={currentUser} emailPermissions={emailPermissions}>
          {/* SECTION VII: KẾT LUẬN SỨC KHỎE (FROM LATEST HTML DOM) */}
          <div id="sec-ketluan" className="syt-section-header">
            <IconUser /> VII. KẾT LUẬN & ĐỀ NGHỊ BÁC SĨ (V. KẾT LUẬN)
          </div>

          <div className="dx-form-group-content" style={{ background: '#f4f8fc', border: '1px solid #cfe0f0' }}>
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#0d47a1', marginBottom: '12px' }}>
              V. KẾT LUẬN PHÂN LOẠI SỨC KHỎE THEO QUY ĐỊNH BỘ Y TẾ
            </div>

            <div className="syt-grid">
              <div className="syt-field col-6">
                <div style={{ background: '#ffffff', border: '1px solid #d6e3f3', borderRadius: '6px', padding: '12px' }}>
                  <label className="syt-label" style={{ color: '#1e3a5f', fontSize: '13px' }}>1. Phân loại sức khỏe</label>
                  <select 
                    className="syt-input" 
                    style={{ fontWeight: 'bold', color: '#1b365d', marginTop: '6px' }}
                    value={formData.phanLoaiSK}
                    onChange={e => handleChange('phanLoaiSK', e.target.value)}
                  >
                    <option value="Loại I">Loại I - Rất khỏe</option>
                    <option value="Loại II">Loại II - Khỏe</option>
                    <option value="Loại III">Loại III - Trung bình</option>
                    <option value="Loại IV">Loại IV - Yếu</option>
                    <option value="Loại V">Loại V - Rất yếu</option>
                  </select>
                </div>
              </div>

              <div className="syt-field col-6">
                <div style={{ background: '#ffffff', border: '1px solid #d6e3f3', borderRadius: '6px', padding: '12px' }}>
                  <label className="syt-label" style={{ color: '#1e3a5f', fontSize: '13px' }}>2. Các bệnh, tật (nếu có)</label>
                  <input 
                    type="text" 
                    className="syt-input" 
                    style={{ marginTop: '6px' }}
                    placeholder="Ghi rõ tên bệnh, tật hoặc nhập 'Không có'..."
                    value={formData.ketLuanBacSi || 'Không có'}
                    onChange={e => handleChange('ketLuanBacSi', e.target.value)}
                  />
                </div>
              </div>

              <div className="syt-field col-12" style={{ marginTop: '8px' }}>
                <div style={{ background: '#ffffff', border: '1px solid #d6e3f3', borderRadius: '6px', padding: '12px' }}>
                  <label className="syt-label" style={{ color: '#1e3a5f', fontSize: '13px' }}>3. Đề nghị bác sĩ & Phương án điều trị:</label>
                  <textarea 
                    className="syt-input" 
                    rows={3}
                    style={{ marginTop: '6px' }}
                    placeholder="Ghi rõ phương án điều trị, phục hồi chức năng hoặc giới thiệu khám chuyên khoa..."
                    value={formData.ketLuanBacSi}
                    onChange={e => handleChange('ketLuanBacSi', e.target.value)}
                  />
                </div>
              </div>

              <div className="syt-field col-6" style={{ marginTop: '8px' }}>
                <label className="syt-label">Bác sĩ kết luận (Ký và ghi rõ họ tên)</label>
                <input 
                  type="text" 
                  className="syt-input" 
                  value={formData.tenBacSi}
                  onChange={e => handleChange('tenBacSi', e.target.value)}
                />
              </div>
            </div>

            {/* VISUAL NOTICE GUIDANCE CARD (MATCHING HTML DOM) */}
            <div style={{ marginTop: '20px', border: '1px solid #dbe4ee', borderRadius: '12px', padding: '16px 20px', background: 'linear-gradient(180deg, #ffffff 0%, #f9fbfd 100%)', boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)' }}>
              <div style={{ display: 'inline-block', marginBottom: '12px', padding: '4px 12px', fontSize: '12px', fontWeight: 'bold', color: '#0f766e', background: '#ecfeff', border: '1px solid #bae6fd', borderRadius: '999px' }}>
                📌 Ghi chú hướng dẫn kết luận sức khỏe
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ padding: '8px 12px', background: '#f8fafc', borderLeft: '4px solid #0ea5e9', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ minWidth: '22px', height: '22px', borderRadius: '50%', background: '#0ea5e9', color: '#fff', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
                  <span><b>Phân loại sức khỏe</b> theo đúng quy định hiện hành của Bộ Y tế (từ Loại I đến Loại V).</span>
                </div>

                <div style={{ padding: '8px 12px', background: '#f8fafc', borderLeft: '4px solid #f59e0b', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ minWidth: '22px', height: '22px', borderRadius: '50%', background: '#f59e0b', color: '#fff', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
                  <span><b>Ghi rõ</b> các bệnh, tật đang mắc phải hoặc nghi ngờ nếu có phát hiện trong quá trình khám.</span>
                </div>

                <div style={{ padding: '8px 12px', background: '#f8fafc', borderLeft: '4px solid #10b981', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ minWidth: '22px', height: '22px', borderRadius: '50%', background: '#10b981', color: '#fff', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
                  <span><b>Ghi rõ</b> phương án điều trị, phục hồi chức năng hoặc giới thiệu khám chuyên khoa khi cần thiết.</span>
                </div>
              </div>
            </div>
          </div>
          </FormModuleWrapper>

          {/* BOTTOM FORM BUTTONS */}
          <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button className="syt-btn syt-btn-outline" onClick={handleReset}>
              <IconRotateCcw /> Hủy bỏ / Nhập lại
            </button>
            <button className="syt-btn syt-btn-primary" style={{ padding: '12px 28px', fontSize: '15px' }} onClick={handleSaveForm}>
              <IconSave /> LƯU PHIẾU KHÁM SỨC KHỎE
            </button>
          </div>

        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="syt-toast">
          <IconCheck style={{ color: '#4ade80' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MODAL: LOOKUP CCCD DATABASE */}
      {showLookupModal && (
        <div className="syt-modal-overlay">
          <div className="syt-modal-content">
            <div className="syt-modal-header">
              <h3><IconSearch /> Tra cứu Hồ sơ Công dân bằng CCCD</h3>
              <button className="syt-modal-close" onClick={() => setShowLookupModal(false)}>×</button>
            </div>
            <div className="syt-modal-body">
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
                Nhập số CCCD hoặc họ tên để truy vấn dữ liệu dân cư thành phố:
              </p>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input 
                  type="text" 
                  className="syt-input" 
                  placeholder="Nhập số CCCD (VD: 079095001234) hoặc tên..."
                  value={searchCccdTerm}
                  onChange={e => setSearchCccdTerm(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearchCccd()}
                />
                <button className="syt-btn syt-btn-primary" onClick={handleSearchCccd}>
                  <IconSearch /> Tìm kiếm
                </button>
              </div>

              <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
                Hồ sơ công dân có sẵn trong hệ thống:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {SAMPLE_PATIENT_DATABASE.map(patient => (
                  <div 
                    key={patient.soCCCD}
                    style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#f8fafc', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onClick={() => {
                      setFormData(patient);
                      setShowLookupModal(false);
                      triggerToast(`Đã chọn bệnh nhân: ${patient.hoTen}`);
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#1b365d' }}>{patient.hoTen} ({patient.gioiTinh})</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>CCCD: {patient.soCCCD} | Ngày sinh: {patient.ngaySinh} | BHYT: {patient.soBHYT}</div>
                    </div>
                    <button className="syt-btn syt-btn-outline" style={{ padding: '4px 10px', fontSize: '12px' }}>
                      Chọn
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="syt-modal-footer">
              <button className="syt-btn syt-btn-outline" onClick={() => setShowLookupModal(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FINGERPRINT SCAN SIMULATOR */}
      {showFingerprintModal && (
        <div className="syt-modal-overlay">
          <div className="syt-modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div className="syt-modal-header">
              <h3><IconFingerprint /> Quét vân tay công dân</h3>
              <button className="syt-modal-close" onClick={() => setShowFingerprintModal(false)}>×</button>
            </div>
            <div className="syt-modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#eff6ff', border: '2px dashed #3399ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3399ff', margin: '10px 0' }}>
                <IconFingerprint className="w-12 h-12" />
              </div>
              <p style={{ fontSize: '13px', color: '#475569' }}>Đặt ngón tay lên máy quét Bio-fingerprint kết nối cổng USB...</p>
              <button className="syt-btn syt-btn-primary" onClick={() => {
                handleLoadDemoData();
                setShowFingerprintModal(false);
              }}>
                <IconCheck /> Mô phỏng Nhận diện thành công
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FACE SCAN SIMULATOR */}
      {showScanFaceModal && (
        <div className="syt-modal-overlay">
          <div className="syt-modal-content" style={{ maxWidth: '450px', textAlign: 'center' }}>
            <div className="syt-modal-header">
              <h3><IconScanFace /> Quét khuôn mặt AI (FaceID)</h3>
              <button className="syt-modal-close" onClick={() => setShowScanFaceModal(false)}>×</button>
            </div>
            <div className="syt-modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '100%', height: '220px', background: '#0f172a', borderRadius: '8px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <IconScanFace className="w-16 h-16" />
                <div style={{ position: 'absolute', bottom: '10px', fontSize: '12px', background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: '12px' }}>
                  Đang quét khuôn mặt công dân...
                </div>
              </div>
              <button className="syt-btn syt-btn-primary" onClick={() => {
                handleLoadDemoData();
                setShowScanFaceModal(false);
              }}>
                <IconCheck /> Khớp dữ liệu FaceID thành công
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SAVED RECORDS HISTORY */}
      {showHistoryModal && (
        <div className="syt-modal-overlay">
          <div className="syt-modal-content" style={{ maxWidth: '800px' }}>
            <div className="syt-modal-header">
              <h3><IconHistory /> Lịch sử Phiếu Khám Sức Khỏe Đã Lưu ({savedRecords.length})</h3>
              <button className="syt-modal-close" onClick={() => setShowHistoryModal(false)}>×</button>
            </div>
            <div className="syt-modal-body">
              {savedRecords.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>Chưa có phiếu khám nào được lưu.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {savedRecords.map(rec => (
                    <div 
                      key={rec.id}
                      style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 16px', background: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#1b365d' }}>{rec.hoTen} ({rec.gioiTinh}) - CCCD: {rec.soCCCD}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          Lưu lúc: {rec.createdAt} | Đơn vị: {rec.donViKham} | Phân loại: <span style={{ fontWeight: 'bold', color: '#1e65b9' }}>{rec.phanLoaiSK}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          className="syt-btn syt-btn-outline" 
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                          onClick={() => {
                            setFormData(rec);
                            setShowHistoryModal(false);
                            triggerToast(`Đã mở lại phiếu khám của ${rec.hoTen}`);
                          }}
                        >
                          Tải phiếu
                        </button>
                        <button 
                          className="syt-btn syt-btn-danger" 
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                          onClick={() => {
                            const filtered = savedRecords.filter(r => r.id !== rec.id);
                            setSavedRecords(filtered);
                            localStorage.setItem('syt_health_records', JSON.stringify(filtered));
                            triggerToast("Đã xóa phiếu khám");
                          }}
                        >
                          <IconTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="syt-modal-footer">
              <button className="syt-btn syt-btn-outline" onClick={() => setShowHistoryModal(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
      
      {/* MODAL: GOOGLE OAUTH AUTHENTICATION */}
      {showGoogleModal && (
        <div className="syt-modal-overlay">
          <div className="syt-modal-content" style={{ maxWidth: '520px' }}>
            <div className="syt-modal-header" style={{ background: 'linear-gradient(135deg, #1b365d 0%, #1e65b9 100%)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconGoogle /> Đăng nhập Google OAuth 2.0 (Sở Y Tế TP.HCM)
              </h3>
              <button className="syt-modal-close" onClick={() => setShowGoogleModal(false)}>×</button>
            </div>
            
            <div className="syt-modal-body" style={{ padding: '24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#eff6ff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', border: '1px solid #bfdbfe' }}>
                  <IconGoogle className="w-8 h-8" />
                </div>
                <h4 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1b365d' }}>Hệ thống Xác thực Google OAuth</h4>
                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                  Chọn hoặc mô phỏng tài khoản Google cán bộ y tế / Superadmin để truy cập hệ thống:
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', margin: '30px 0' }}>
                <div id="google-signin-btn-container"></div>
              </div>
              
              <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8' }}>
                Google Identity Services Token Verification • SSL 256-bit Encrypted
              </div>
            </div>

            <div className="syt-modal-footer">
              <button className="syt-btn syt-btn-outline" onClick={() => setShowGoogleModal(false)}>Hủy bỏ</button>
            </div>
          </div>
        </div>
      )}

      {/* PERMISSION MANAGEMENT MODAL (SUPERADMIN ONLY) */}
      {showPermissionModal && (
        <div className="syt-modal-overlay">
          <div className="syt-modal-content" style={{ width: '800px', maxWidth: '95%' }}>
            <div className="syt-modal-header">
              <h3><IconCheck /> Quản lý Phân quyền Module theo Email</h3>
              <button className="syt-modal-close" onClick={() => setShowPermissionModal(false)}>×</button>
            </div>
            
            <div className="syt-modal-body" style={{ background: '#f8fafc', padding: '20px' }}>
              <div style={{ marginBottom: '24px', background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#0f172a' }}>Thêm / Cập nhật Email</h4>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <input 
                    type="email" 
                    className="syt-input" 
                    style={{ flex: 1 }} 
                    placeholder="Nhập email bác sĩ (VD: bacsiA@gmail.com)" 
                    value={newEmailInput}
                    onChange={(e) => setNewEmailInput(e.target.value.toLowerCase())}
                  />
                </div>
                
                <h5 style={{ margin: '0 0 8px 0', color: '#334155' }}>Chọn các Module được phép chỉnh sửa:</h5>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f1f5f9', padding: '12px', borderRadius: '6px' }}>
                  {FORM_MODULE_CATALOG.map(mod => (
                    <label key={mod.code} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedModules.includes(mod.code)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedModules([...selectedModules, mod.code]);
                          } else {
                            setSelectedModules(selectedModules.filter(m => m !== mod.code));
                          }
                        }}
                      />
                      <span style={{ fontWeight: 600, color: '#0ea5e9' }}>{mod.code}</span>
                      <span>{mod.title}</span>
                    </label>
                  ))}
                </div>
                
                <div style={{ marginTop: '16px', textAlign: 'right' }}>
                  <button 
                    className="syt-btn syt-btn-primary" 
                    onClick={() => {
                      if (!newEmailInput.trim() || !newEmailInput.includes('@')) {
                        alert('Vui lòng nhập email hợp lệ!');
                        return;
                      }
                      setEmailPermissions(prev => ({
                        ...prev,
                        [newEmailInput.trim()]: selectedModules
                      }));
                      setNewEmailInput('');
                      setSelectedModules([]);
                      triggerToast(`Đã lưu quyền cho email ${newEmailInput}`);
                    }}
                  >
                    Lưu Quyền Cho Email Này
                  </button>
                </div>
              </div>

              <h4 style={{ margin: '0 0 12px 0', color: '#0f172a' }}>Danh sách Email đã được phân quyền</h4>
              {Object.keys(emailPermissions).length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  Chưa có email nào được cấp quyền. (Chỉ Superadmin mới có toàn quyền)
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.entries(emailPermissions).map(([email, mods]) => (
                    <div key={email} style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>{email}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {mods.map(m => (
                            <span key={m} style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button 
                        className="syt-btn syt-btn-outline" 
                        style={{ borderColor: '#ef4444', color: '#ef4444', padding: '6px 12px' }}
                        onClick={() => {
                          const newPerms = { ...emailPermissions };
                          delete newPerms[email];
                          setEmailPermissions(newPerms);
                          triggerToast(`Đã xóa quyền của ${email}`);
                        }}
                      >
                        <IconTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="syt-modal-footer">
              <button className="syt-btn syt-btn-primary" onClick={() => setShowPermissionModal(false)}>Đóng & Lưu</button>
            </div>
          </div>
        </div>
      )}


      

      {/* EXPORT BUTTON */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999 }}>
        <button 
          className="syt-btn syt-btn-primary" 
          style={{ background: '#10b981', padding: '12px 24px', fontSize: '16px', borderRadius: '50px', boxShadow: '0 4px 12px rgba(16,185,129,0.4)', border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={() => {
            const payload = buildExportPayload(formData);
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "kham_suc_khoe.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
            triggerToast("Đã xuất file JSON thành công!");
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          XUẤT DỮ LIỆU (JSON)
        </button>
      </div>
    </div>
  );
};

export default App;