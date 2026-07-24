import React, { useState, useEffect } from 'react';
import './App.css';
import type { FormHealthRecord } from './types';
import {
  DEFAULT_PERSONAL_HISTORY_ROWS,
  ETHNIC_GROUPS,
  ADMINISTRATIVE_DIVISIONS,
  ICD_POPULAR_TAGS,
  SAMPLE_PATIENT_DATABASE
} from './data/mockData';
import {
  IconCard, IconUser, IconCalendar, IconMapPin, IconBriefcase,
  IconStethoscope, IconSearch, IconFingerprint, IconScanFace,
  IconSave, IconPrinter, IconHistory, IconCheck, IconTrash, IconRotateCcw,
  IconAlertTriangle, IconBuilding, IconFileText, IconHeartPulse
} from './components/Icons';

const INITIAL_FORM_STATE: FormHealthRecord = {
  donViKham: "BỆNH VIỆN ĐA KHOA TỈNH / TRUNG TÂM Y TẾ SỞ Y TẾ TP.HCM",
  ngayKham: new Date().toISOString().split('T')[0],
  doiTuong: "Khám sức khỏe định kỳ",
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

  soLuongHC: "",
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
  glucoseNT: "",
  cetonicNT: "",
  bilirubinNT: "",
  urobilinogenNT: "",
  nuocTieuKhac: "",

  xQuangTimPhoi: "",
  clsKhacRadio: "Không",
  clsKhacChiTiet: "",

  chieuCao: "",
  canNang: "",
  bmi: "",
  mach: "",
  huyetAp: "",
  phanLoaiSK: "Loại I",
  ketLuanBacSi: "",
  tenBacSi: "BS. CKI NGUYỄN VĂN AN"
};

export const App: React.FC = () => {
  const [formData, setFormData] = useState<FormHealthRecord>(INITIAL_FORM_STATE);
  const [savedRecords, setSavedRecords] = useState<FormHealthRecord[]>([]);
  
  // UI Modals & Notifications
  const [showLookupModal, setShowLookupModal] = useState(false);
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

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const scrollToSection = (sectionId: string) => {
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
            <IconHeartPulse className="w-8 h-8" />
          </div>
          <div className="syt-title-group">
            <h1>SỞ Y TẾ TP. HỒ CHÍ MINH</h1>
            <p>Hệ thống Khám sức khỏe định kỳ & Quản lý hồ sơ sức khỏe điện tử (Form Chuẩn SYT)</p>
          </div>
        </div>

        <div className="syt-action-bar">
          <button className="syt-btn syt-btn-secondary" onClick={() => setShowLookupModal(true)}>
            <IconSearch /> Tra cứu CCCD
          </button>

          <button className="syt-btn syt-btn-outline" onClick={handleLoadDemoData} title="Nạp dữ liệu mẫu nhanh">
            ⚡ Nạp dữ liệu mẫu
          </button>

          <button className="syt-btn syt-btn-primary" onClick={handleSaveForm}>
            <IconSave /> Lưu phiếu khám
          </button>

          <button className="syt-btn syt-btn-success" onClick={handlePrint}>
            <IconPrinter /> In / Xuất PDF
          </button>

          <button className="syt-btn syt-btn-secondary" onClick={() => setShowHistoryModal(true)}>
            <IconHistory /> Lịch sử ({savedRecords.length})
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
        
        {/* LEFT TREE SIDEBAR NAVIGATION */}
        <aside className="syt-nav-sidebar no-print">
          <div className="syt-nav-title">Danh mục phiếu khám</div>
          
          <div className="syt-tree-item" onClick={() => scrollToSection('sec-hanhchinh')}>
            <div className="syt-tree-icon-badge" style={{ background: '#e1f5fe', color: '#0984e3' }}>
              <IconCard className="w-5 h-5" />
            </div>
            <div className="syt-tree-text">Thông tin hành chính</div>
          </div>

          <div className="syt-tree-item" onClick={() => scrollToSection('sec-chitra')}>
            <div className="syt-tree-icon-badge" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <IconCard className="w-5 h-5" />
            </div>
            <div className="syt-tree-text">Hình thức chi trả</div>
          </div>

          <div className="syt-tree-item" onClick={() => scrollToSection('sec-tiensu')}>
            <div className="syt-tree-icon-badge" style={{ background: '#efedff', color: '#6c5ce7' }}>
              <IconHistory className="w-5 h-5" />
            </div>
            <div className="syt-tree-text">Tiền sử bản thân & gia đình</div>
          </div>

          <div className="syt-tree-item" onClick={() => scrollToSection('sec-theluc')}>
            <div className="syt-tree-icon-badge" style={{ background: '#fff1f1', color: '#d63031' }}>
              <IconHeartPulse className="w-5 h-5" />
            </div>
            <div className="syt-tree-text">Khám lâm sàng & thể lực</div>
          </div>

          <div className="syt-tree-item" onClick={() => scrollToSection('sec-canlamsang')}>
            <div className="syt-tree-icon-badge" style={{ background: '#0080001c', color: 'green' }}>
              <IconStethoscope className="w-5 h-5" />
            </div>
            <div className="syt-tree-text">Khám cận lâm sàng</div>
          </div>

          <div className="syt-tree-item" onClick={() => scrollToSection('sec-ketluan')}>
            <div className="syt-tree-icon-badge" style={{ background: '#fff1f1', color: '#d63031' }}>
              <IconUser className="w-5 h-5" />
            </div>
            <div className="syt-tree-text">V. Kết luận sức khỏe</div>
          </div>
        </aside>

        {/* MAIN FORM CARD */}
        <div className="syt-form-card">
          
          {/* HEADER INFORMATION & CLINIC UNIT */}
          <div className="dx-form-group-content">
            <div className="syt-grid">
              <div className="syt-field col-6">
                <label className="syt-label"><IconBuilding /> Đơn vị khám</label>
                <input 
                  type="text" 
                  className="syt-input" 
                  value={formData.donViKham} 
                  onChange={e => handleChange('donViKham', e.target.value)}
                />
              </div>
              
              <div className="syt-field col-2">
                <label className="syt-label"><IconCalendar /> Ngày khám</label>
                <input 
                  type="date" 
                  className="syt-input" 
                  value={formData.ngayKham} 
                  onChange={e => handleChange('ngayKham', e.target.value)}
                />
              </div>

              <div className="syt-field col-2">
                <label className="syt-label">Đối tượng</label>
                <select 
                  className="syt-input" 
                  value={formData.doiTuong} 
                  onChange={e => handleChange('doiTuong', e.target.value)}
                >
                  <option value="Khám sức khỏe định kỳ">Khám sức khỏe định kỳ</option>
                  <option value="Khám đi học / đi làm">Khám đi học / đi làm</option>
                  <option value="Khám tuyển dụng">Khám tuyển dụng</option>
                  <option value="Khám sức khỏe người lao động">Khám sức khỏe người lao động</option>
                </select>
              </div>

              <div className="syt-field col-2">
                <label className="syt-label">Địa điểm khám</label>
                <input 
                  type="text" 
                  className="syt-input" 
                  value={formData.diaDiemKham} 
                  onChange={e => handleChange('diaDiemKham', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* SECTION I: THÔNG TIN HÀNH CHÍNH */}
          <div id="sec-hanhchinh" className="syt-section-header">
            <IconUser /> I. THÔNG TIN HÀNH CHÍNH
          </div>

          <div className="dx-form-group-content">
            <div className="syt-grid">
              <div className="syt-field col-4">
                <label className="syt-label">
                  Số CCCD / Mã định danh / Hộ chiếu <span className="syt-required-star">*</span>
                </label>
                <div className="syt-input-container">
                  <input 
                    type="text" 
                    className="syt-input" 
                    placeholder="Nhập số CCCD (12 chữ số)..."
                    value={formData.soCCCD}
                    onChange={e => handleChange('soCCCD', e.target.value)}
                  />
                  <div className="syt-input-group-append">
                    <button className="syt-icon-btn" title="Quét vân tay" onClick={() => setShowFingerprintModal(true)}>
                      <IconFingerprint />
                    </button>
                    <button className="syt-icon-btn" title="Quét khuôn mặt" onClick={() => setShowScanFaceModal(true)}>
                      <IconScanFace />
                    </button>
                  </div>
                </div>
              </div>

              <div className="syt-field col-4">
                <label className="syt-label">
                  Họ và tên <span className="syt-required-star">*</span>
                </label>
                <input 
                  type="text" 
                  className="syt-input syt-input-uppercase" 
                  placeholder="NHẬP HỌ VÀ TÊN (CHỮ IN HOA)"
                  value={formData.hoTen}
                  onChange={e => handleChange('hoTen', e.target.value)}
                />
              </div>

              <div className="syt-field col-2">
                <label className="syt-label">
                  Ngày sinh <span className="syt-required-star">*</span>
                </label>
                <input 
                  type="date" 
                  className="syt-input" 
                  value={formData.ngaySinh}
                  onChange={e => handleChange('ngaySinh', e.target.value)}
                />
              </div>

              <div className="syt-field col-2">
                <label className="syt-label">Tuổi (tự động)</label>
                <input 
                  type="text" 
                  className="syt-input" 
                  readOnly 
                  value={`${calculateAge(formData.ngaySinh)} tuổi`}
                />
              </div>

              <div className="syt-field col-3">
                <label className="syt-label">Giới tính</label>
                <div className="syt-radio-group">
                  <label className="syt-radio-label">
                    <input 
                      type="radio" 
                      name="gioiTinh" 
                      value="Nam" 
                      checked={formData.gioiTinh === 'Nam'}
                      onChange={() => handleChange('gioiTinh', 'Nam')}
                    /> Nam
                  </label>
                  <label className="syt-radio-label">
                    <input 
                      type="radio" 
                      name="gioiTinh" 
                      value="Nữ" 
                      checked={formData.gioiTinh === 'Nữ'}
                      onChange={() => handleChange('gioiTinh', 'Nữ')}
                    /> Nữ
                  </label>
                </div>
              </div>

              <div className="syt-field col-2">
                <label className="syt-label">Dân tộc</label>
                <select className="syt-input" value={formData.danToc} onChange={e => handleChange('danToc', e.target.value)}>
                  {ETHNIC_GROUPS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              <div className="syt-field col-2">
                <label className="syt-label">Nhóm máu</label>
                <select className="syt-input" value={formData.nhomMau} onChange={e => handleChange('nhomMau', e.target.value)}>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                  <option value="Chưa xác định">Chưa xác định</option>
                </select>
              </div>

              <div className="syt-field col-2">
                <label className="syt-label">Yếu tố Rh</label>
                <select className="syt-input" value={formData.rhFactor} onChange={e => handleChange('rhFactor', e.target.value)}>
                  <option value="Rh+">Rh+</option>
                  <option value="Rh-">Rh-</option>
                  <option value="Chưa xác định">Chưa xác định</option>
                </select>
              </div>

              <div className="syt-field col-3">
                <label className="syt-label">Số thẻ BHYT</label>
                <input 
                  type="text" 
                  className="syt-input" 
                  placeholder="Mã thẻ BHYT 15 ký tự"
                  value={formData.soBHYT}
                  onChange={e => handleChange('soBHYT', e.target.value)}
                />
              </div>

              <div className="syt-field col-3">
                <label className="syt-label">
                  Điện thoại di động <span className="syt-required-star">*</span>
                </label>
                <input 
                  type="text" 
                  className="syt-input" 
                  placeholder="090x xxx xxx"
                  value={formData.dienThoai}
                  onChange={e => handleChange('dienThoai', e.target.value)}
                />
              </div>

              <div className="syt-field col-9">
                <label className="syt-label"><IconMapPin /> Nơi ở hiện tại (Số nhà, tên đường)</label>
                <input 
                  type="text" 
                  className="syt-input" 
                  placeholder="Số nhà, tên đường, khu phố/thôn..."
                  value={formData.noiOHienTai}
                  onChange={e => handleChange('noiOHienTai', e.target.value)}
                />
              </div>

              <div className="syt-field col-3">
                <label className="syt-label">Thành phố / Tỉnh</label>
                <select 
                  className="syt-input" 
                  value={formData.tinhThanh}
                  onChange={e => handleChange('tinhThanh', e.target.value)}
                >
                  {Object.keys(ADMINISTRATIVE_DIVISIONS).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="syt-field col-3">
                <label className="syt-label">Quận / Huyện</label>
                <select 
                  className="syt-input" 
                  value={formData.quanHuyen}
                  onChange={e => handleChange('quanHuyen', e.target.value)}
                >
                  {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="syt-field col-3">
                <label className="syt-label">Xã / Phường</label>
                <select 
                  className="syt-input" 
                  value={formData.xaPhuong}
                  onChange={e => handleChange('xaPhuong', e.target.value)}
                >
                  {availableWards.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>

              <div className="syt-field col-3">
                <label className="syt-label"><IconBriefcase /> Nghề nghiệp</label>
                <input 
                  type="text" 
                  className="syt-input" 
                  value={formData.ngheNghiep}
                  onChange={e => handleChange('ngheNghiep', e.target.value)}
                />
              </div>

              <div className="syt-field col-3">
                <label className="syt-label">Nơi công tác / học tập</label>
                <input 
                  type="text" 
                  className="syt-input" 
                  value={formData.noiCongTac}
                  onChange={e => handleChange('noiCongTac', e.target.value)}
                />
              </div>

              <div className="syt-field col-6">
                <label className="syt-label">Lý do khám</label>
                <input 
                  type="text" 
                  className="syt-input" 
                  value={formData.lyDoKham}
                  onChange={e => handleChange('lyDoKham', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* SECTION II: THÔNG TIN ĐỐI TƯỢNG - CHI TRẢ */}
          <div id="sec-chitra" className="syt-section-header">
            <IconCard /> II. THÔNG TIN ĐỐI TƯỢNG - CHI TRẢ
          </div>

          <div className="dx-form-group-content">
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

            <div className="syt-grid">
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
          </div>

          {/* SECTION III & IV: TIỀN SỬ BẢN THÂN & GIA ĐÌNH */}
          <div id="sec-tiensu" className="syt-section-header">
            <IconFileText /> III & IV. TIỀN SỬ BẢN THÂN VÀ GIA ĐÌNH
          </div>

          <div className="dx-form-group-content">
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

            {(formData.isFemale || formData.gioiTinh === 'Nữ') && (
              <div style={{ marginTop: '20px', padding: '14px', background: '#fdf2f8', border: '1px solid #fbcfe8', borderRadius: '6px' }}>
                <div className="syt-group-title" style={{ color: '#be185d' }}>
                  Tiền sử Sản phụ khoa (Dành cho nữ giới):
                </div>
                
                <div className="syt-grid">
                  <div className="syt-field col-3">
                    <label className="syt-label">Số lần mang thai (Para)</label>
                    <input type="number" className="syt-input" value={formData.soLanMangThai} onChange={e => handleChange('soLanMangThai', e.target.value)} />
                  </div>
                  <div className="syt-field col-3">
                    <label className="syt-label">Số lần sinh</label>
                    <input type="number" className="syt-input" value={formData.soLanSinh} onChange={e => handleChange('soLanSinh', e.target.value)} />
                  </div>
                  <div className="syt-field col-3">
                    <label className="syt-label">Số lần sảy / nạo hút</label>
                    <input type="number" className="syt-input" value={formData.soLanSay} onChange={e => handleChange('soLanSay', e.target.value)} />
                  </div>
                  <div className="syt-field col-3">
                    <label className="syt-label">Tuổi bắt đầu có kinh</label>
                    <input type="text" className="syt-input" placeholder="VD: 13 tuổi" value={formData.tuoiBatDauKinh} onChange={e => handleChange('tuoiBatDauKinh', e.target.value)} />
                  </div>
                  <div className="syt-field col-4">
                    <label className="syt-label">Chu kỳ kinh nguyệt</label>
                    <input type="text" className="syt-input" placeholder="VD: 28-30 ngày, đều" value={formData.chuKyKinh} onChange={e => handleChange('chuKyKinh', e.target.value)} />
                  </div>
                  <div className="syt-field col-4">
                    <label className="syt-label">Ngày thấy kinh gần nhất</label>
                    <input type="date" className="syt-input" value={formData.ngayKinhGanNhat} onChange={e => handleChange('ngayKinhGanNhat', e.target.value)} />
                  </div>
                  <div className="syt-field col-4">
                    <label className="syt-label">Bệnh phụ khoa đã/đang điều trị</label>
                    <input type="text" className="syt-input" value={formData.benhPhuKhoa} onChange={e => handleChange('benhPhuKhoa', e.target.value)} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION V: KHÁM THỂ LỰC & THÔNG SỐ SỨC KHỎE */}
          <div id="sec-theluc" className="syt-section-header">
            <IconHeartPulse /> V. KHÁM THỂ LỰC & CHỈ SỐ SỨC KHỎE
          </div>

          <div className="dx-form-group-content">
            <div className="syt-grid">
              <div className="syt-field col-3">
                <label className="syt-label">Chiều cao (cm)</label>
                <input 
                  type="number" 
                  className="syt-input" 
                  placeholder="VD: 170"
                  value={formData.chieuCao} 
                  onChange={e => handleChange('chieuCao', e.target.value)}
                />
              </div>

              <div className="syt-field col-3">
                <label className="syt-label">Cân nặng (kg)</label>
                <input 
                  type="number" 
                  className="syt-input" 
                  placeholder="VD: 65"
                  value={formData.canNang} 
                  onChange={e => handleChange('canNang', e.target.value)}
                />
              </div>

              <div className="syt-field col-3">
                <label className="syt-label">BMI (Tự động tính)</label>
                <div className="syt-input-container">
                  <input 
                    type="text" 
                    className="syt-input" 
                    readOnly 
                    value={formData.bmi} 
                  />
                </div>
                {getBmiCategory(formData.bmi) && (
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: getBmiCategory(formData.bmi)!.color, marginTop: '2px' }}>
                    {getBmiCategory(formData.bmi)!.text}
                  </span>
                )}
              </div>

              <div className="syt-field col-3">
                <label className="syt-label">Mạch (lần/phút)</label>
                <input 
                  type="text" 
                  className="syt-input" 
                  placeholder="VD: 75"
                  value={formData.mach} 
                  onChange={e => handleChange('mach', e.target.value)}
                />
              </div>

              <div className="syt-field col-3">
                <label className="syt-label">Huyết áp (mmHg)</label>
                <input 
                  type="text" 
                  className="syt-input" 
                  placeholder="VD: 120/80"
                  value={formData.huyetAp} 
                  onChange={e => handleChange('huyetAp', e.target.value)}
                />
              </div>
            </div>
          </div>

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

    </div>
  );
};

export default App;
