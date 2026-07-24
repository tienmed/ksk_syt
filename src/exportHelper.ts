import { ETHNIC_GROUPS } from './data/mockData';
export const buildExportPayload = (formData: any) => {
    // Helper to map Loai I -> 1016, Loai II -> 1017, etc.
    const mapPhanLoai = (loai: string) => {
        switch(loai) {
            case 'Loại I': return 1016;
            case 'Loại II': return 1017;
            case 'Loại III': return 1018;
            case 'Loại IV': return 1019;
            case 'Loại V': return 1020;
            default: return 1016;
        }
    };

    // Helper to map specialty
    const mapSpecialty = (prefix: string, data: any) => {
        if (!data) return {};
        return {
            [`${prefix}_chuaphathienbatthuong`]: data.normal ? 1 : 0,
            [`${prefix}_chandoansobo`]: data.icdPreliminary ? 1 : 0,
            [`${prefix}_chandoansobo_icd`]: data.icdPreliminary || "",
            [`${prefix}_chandoanxacdinh`]: data.icdFinal ? 1 : 0,
            [`${prefix}_chandoanxacdinh_icd`]: data.icdFinal || "",
            [`${prefix}_phanloai`]: mapPhanLoai(data.classification)
        };
    };

    const chi_tiet_kham_rang: Record<string, number> = {};
    if (formData.rangStatuses) {
        Object.keys(formData.rangStatuses).forEach(k => {
            if (formData.rangStatuses[k as any] !== 0 && formData.rangStatuses[k as any] !== undefined) {
                chi_tiet_kham_rang[k] = formData.rangStatuses[k as any];
            }
        });
    }

    return {
        tthc: {
            ngay_kham: new Date().toISOString().split('T')[0],
            doituongkham: Number(formData.doiTuong) || 16,
            diadiemkham: 4052,
            dinh_danh_ca_nhan: formData.cccd || "050201009818",
            ho_ten: formData.hoTen || "Nguyễn văn Duc",
            ngay_sinh: formData.ngaySinh ? formData.ngaySinh.split('-').reverse().join('/') : "10/01/2001",
            gioi_tinh: formData.gioiTinh === 'Nam' ? 1 : (formData.gioiTinh === 'Nữ' ? 2 : 1),
            the_bhyt: "123",
            dan_toc_id: ETHNIC_GROUPS.indexOf(formData.danToc) !== -1 ? ETHNIC_GROUPS.indexOf(formData.danToc) + 1 : 1,
            sdt: formData.soDienThoai || "0326628622",
            nhom_mau_id: 1,
            yeu_to_nhom_mau_id: 1,
            dia_chi_hien_tai: formData.diaChi || "123 Đường Số 1",
            wardId: 2,
            wardCode: "26803",
            nghenghiep_id: 228,
            nghenghiep_code: "",
            noi_cong_tac: 1,
            noi_cong_tac_xa_phuong: 1,
            hinh_thuc_chi_tra_khamsk: "4040",
            hinh_thuc_chi_tra_khamsk_chi_tiet: "5083",
            nguonkhac_ghiro: "test nguonkhac_ghiro",
            lydokham: formData.lyDoKham || "ly do kham"
        },
        tien_su: {
            giadinh_macbenh: formData.tienSuGiaDinh?.length > 0 ? 1 : 0,
            giadinh_danhsachbenh: (formData.tienSuGiaDinh || []).map((x: any) => x.disease).join(','),
            giadinh_danhsachbenh_icd: (formData.tienSuGiaDinh || []).map((x: any) => x.icd).join(','),
            giadinh_macbenh_tenbenh: "",
            ds_benh_ban_than: {
                benh_5nam: 1, benh_than_kinh: 1, benh_mat: 1, benh_tai: 1, benh_tim: 1,
                pt_tim_mach: 1, tang_ha: 1, kho_tho: 1, benh_phoi: 1, benh_than: 1,
                nghien_ruou_bia: 1, dai_thao_duong: 1, benh_tam_than: 1, mat_y_thuc: 1,
                ngat_chong_mat: 1, benh_tieu_hoa: 1, roi_loan_giac_ngu: 1, tai_bien_mach_mau_nao: 1,
                cot_song: 1, su_dung_ruou_bia: 1, su_dung_ma_tuy: 1, benh_khac: ""
            },
            dieu_tri_benh_co_khong: 1,
            dieu_tri_benh_liet_ke: "",
            thai_san_co_khong: formData.mangThai || formData.bienChungThaiSan ? 1 : 0,
            thai_san_liet_ke: formData.thaiSanLietKe || ""
        },
        kham_the_luc: {
            chieucao: Number(formData.chieuCao) || 185,
            cannang: Number(formData.canNang) || 55.5,
            bmi: Number(formData.bmi) || 12.5,
            mach: Number(formData.mach) || 65,
            huyetaptamthu: Number(formData.huyetApTamThu) || 120,
            huyetaptamtruong: Number(formData.huyetApTamTruong) || 80,
            phanloai: mapPhanLoai(formData.phanLoaiTheLuc)
        },
        kham_lam_san: {
            ...mapSpecialty('noikhoa', formData.tuanHoan),
            ...mapSpecialty('hohap', formData.hoHap),
            ...mapSpecialty('tieuhoa', formData.tieuHoa),
            ...mapSpecialty('thantietnieu', formData.thanTietNieu),
            ...mapSpecialty('noitiet', formData.noiTiet),
            ...mapSpecialty('coxuongkhop', formData.coXuongKhop),
            ...mapSpecialty('thankinh', formData.thanKinh),
            ...mapSpecialty('tamthan', formData.tamThan),
            ...mapSpecialty('ngoaikhoa', formData.ngoaiKhoa),
            ...mapSpecialty('dalieu', formData.daLieu),
            ...mapSpecialty('sankhoa', formData.sanKhoa),
            ...mapSpecialty('phukhoa', formData.phuKhoa),
            
            mat_khongkinh_mp: Number(formData.khongKinhPhai) || 2.0,
            mat_khongkinh_mt: Number(formData.khongKinhTrai) || 2.0,
            mat_kinhlo_mp: Number(formData.kinhLoPhai) || 2.0,
            mat_kinhlo_mt: Number(formData.kinhLoTrai) || 2.0,
            mat_cokinh_mp: Number(formData.coKinhPhai) || 2.0,
            mat_cokinh_mt: Number(formData.coKinhTrai) || 2.0,
            mat_docau_mp: Number(formData.khucXaPhaiCau) || 2.0,
            mat_docau_mt: Number(formData.khucXaTraiCau) || 2.0,
            mat_dotru_mp: Number(formData.khucXaPhaiTru) || 2.0,
            mat_dotru_mt: Number(formData.khucXaTraiTru) || 2.0,
            mat_truc_mp: Number(formData.khucXaPhaiTruc) || 2.0,
            mat_truc_mt: Number(formData.khucXaTraiTruc) || 2.0,
            ...mapSpecialty('mat', formData.mat),

            tmh_taitrai_noithuong: Number(formData.taiTraiNoiThuong) || 22.0,
            tmh_taitrai_noitham: Number(formData.taiTraiNoiTham) || 8.0,
            tmh_taiphai_noithuong: Number(formData.taiPhaiNoiThuong) || 8.0,
            tmh_taiphai_noitham: Number(formData.taiPhaiNoiTham) || 8.0,
            ...mapSpecialty('tmh', formData.taiMuiHong),

            ...mapSpecialty('rhm', formData.rangHamMat),
            chi_tiet_kham_rang: chi_tiet_kham_rang
        },
        can_lam_san: {
            xnm_slhc: Number(formData.soLuongHC) || 4.5,
            xnm_huyetsacto: Number(formData.huyetSacTo) || 1,
            xnm_hematocrit: Number(formData.hematocrit) || 1,
            xnm_mcv: Number(formData.mcv) || 1,
            xnm_mch: Number(formData.mch) || 1,
            xnm_mchc: Number(formData.mchc) || 1,
            xnm_rdw: Number(formData.rdw) || 1,
            xnm_slbc: Number(formData.soLuongBC) || 7.2,
            xnm_slbc_trungtinh: Number(formData.bcTrungTinh) || 250,
            xnm_slbc_lympho: Number(formData.bcLympho) || 1,
            xnm_slbc_donnhan: Number(formData.bcDonNhan) || 1,
            xnm_slbc_aitoan: Number(formData.bcAiToan) || 1,
            xnm_slbc_aikiem: Number(formData.bcAiKiem) || 1,
            xnm_sltc: Number(formData.soLuongTC) || 1,

            shm_duongmau: formData.duongMau || "5.1",
            shm_ure: formData.ureMau || "4.2",
            shm_creatinin: formData.creatinin || "80",
            shm_asat_got: formData.asat || "20",
            shm_alat_gpt: formData.alat || "25",

            xnnt_titrong: Number(formData.tiTrong) || 1,
            xnnt_ph: Number(formData.pH) || 1,
            xnnt_bachcau: Number(formData.bachCauNT) || 1,
            xnnt_hongcau: Number(formData.hongCauNT) || 1,
            xnnt_nitrit: 5119,
            xnnt_protein: Number(formData.proteinNT) || 1,
            xnnt_glucose: 1,
            xnnt_cetonic: 1,
            xnnt_bilirubin: 1,
            xnnt_urobilinogen: 1,
            xnnt_khac: "",

            chuan_doan_hinh_anh: "",
            can_lam_sang_khac: 1,
            can_lam_sang_khac_chi_tiet: "",

            kskdk_xnm_slhc: 4.5,
            kskdk_xnm_huyetsacto: 1,
            kskdk_xnm_hematocrit: 1,
            kskdk_xnm_mcv: 1,
            kskdk_xnm_mch: 1,
            kskdk_xnm_mchc: 1,
            kskdk_xnm_rdw: 1,
            kskdk_xnm_slbc: 7.2,
            kskdk_xnm_slbc_trungtinh: 250,
            kskdk_xnm_slbc_lympho: 1,
            kskdk_xnm_slbc_donnhan: 1,
            kskdk_xnm_slbc_aitoan: 1,
            kskdk_xnm_slbc_aikiem: 1,
            kskdk_xnm_sltc: 1,

            kskdk_shm_duongmau: "5.1",
            kskdk_shm_ure: "4.2",
            kskdk_shm_creatinin: "80",
            kskdk_shm_asat_got: "20",
            kskdk_shm_alat_gpt: "25",

            kskdk_xnnt_titrong: 1,
            kskdk_xnnt_ph: 1,
            kskdk_xnnt_bachcau: 1,
            kskdk_xnnt_hongcau: 1,
            kskdk_xnnt_nitrit: 5119,
            kskdk_xnnt_protein: 1,
            kskdk_xnnt_glucose: 1,
            kskdk_xnnt_cetonic: 1,
            kskdk_xnnt_bilirubin: 1,
            kskdk_xnnt_urobilinogen: 1,
            kskdk_xnnt_khac: "",

            kskdk_chuan_doan_hinh_anh: "",
            xet_nghiem_te_bao_co_tu_cung: "",
            xet_nghiem_hpv: "",
            xquang_nhu: "",
            sieu_am_2_tuyen_vu: ""
        },
        ket_luan: {
            de_nghi: formData.ketLuan || "không có"
        }
    };
};
