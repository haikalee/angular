import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { LandaService } from "src/app/core/services/landa.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-m-barang",
  templateUrl: "./m-barang.component.html",
  styleUrls: ["./m-barang.component.scss"],
})
export class MBarangComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  dtOptions: any;
  pageTitle: string;
  isView: boolean;
  isEdit: boolean;
  listData: any;
  listKategori: any;
  showForm: boolean;
  breadCrumbItems: Array<{}>;
  model: any = {};
  tg: any = {};
  modelParam: { nama; kategori; deskripsi; tanggal };

  constructor(private landaService: LandaService) {}

  ngOnInit(): void {
    this.pageTitle = "Master Barang";
    this.breadCrumbItems = [
      {
        label: "Master",
      },
      { label: "Master", active: true },
    ];
    this.modelParam = {
      nama: "",
      kategori: "",
      deskripsi: "",
      tanggal: {},
    };
    this.tg = {
      year: 0,
      month: 0,
      day: 0,
    };
    this.getData();
    this.empty();
    this.fungsi();
    console.log(this.listKategori);
  }

  getData() {
    this.dtOptions = {
      serverSide: true,
      processing: true,
      ordering: false,
      pagingType: "full_numbers",
      ajax: (dataTablesParameters: any, callback) => {
        const params = {
          filter: JSON.stringify(this.modelParam),
          offset: dataTablesParameters.start,
          limit: dataTablesParameters.length,
        };
        this.landaService
          .DataGet("/m_barang/index", params)
          .subscribe((res: any) => {
            this.listData = res.data.list;
            // const tanggal = res.data.list.map((item) => {
            //   if (item.tanggal != null) {
            //     const tglArr = item.tanggal.split("-");
            //     const tgl = {
            //       year: parseInt(tglArr[0]),
            //       month: parseInt(tglArr[1]),
            //       day: parseInt(tglArr[2]),
            //     };
            //     return Object.assign(tgl, item.tgl);
            //   }
            // });
            // console.log(tanggal);
            callback({
              recordsTotal: res.data.totalItems,
              recordsFiltered: res.data.totalItems,
              data: [],
            });
          });
      },
    };
  }

  index() {
    this.showForm = !this.showForm;
    this.pageTitle = "Data Master Barang";
    this.getData();
  }

  create() {
    this.empty();
    this.showForm = !this.showForm;
    this.pageTitle = "Tambah Data Barang";
    this.isView = false;
  }

  edit(val) {
    this.fungsi();
    // const arrTgl = val.tanggal.split("-");
    // const year = arrTgl[0];
    // const month = arrTgl[1];
    // const day = arrTgl[2];
    // const tgl = { year, month, day };
    // const result = Object.assign({ ...val, tgl });
    this.showForm = !this.showForm;
    this.model = val;
    this.model.tanggal = this.toDate(this.model.tanggal);
    // this.model = result;
    // console.log(this.model);

    // this.model.tanggal = tgl;
    this.pageTitle = `Master Barang ${val.nama}`;
    this.isView = false;
  }

  view(val) {
    console.log(val);
    this.fungsi();
    const tanggal = val.tanggal;
    console.log("View tanggal: ", tanggal);
    this.tg.year = tanggal.year;
    this.tg.month = tanggal.month;
    this.tg.day = tanggal.day;
    this.showForm = !this.showForm;
    this.model = val;
    this.model.tanggal = this.toDate(this.model.tanggal);
    this.pageTitle = `Master Barang ${val.nama}`;
    // this.isEdit = false;
    this.isView = true;
  }

  lain(event) {
    // this.model.tanggal = `${event.year}-${event.month}-${event.day}`;
    this.model.tanggal = event;
  }

  save() {
    const final = Object.assign(this.model);
    console.log(final);
    this.landaService
      .DataPost("/m_barang/save", final)
      .subscribe((res: any) => {
        if (res.status_code === 200) {
          this.landaService.alertSuccess(
            "Berhasil",
            "Data barang telah tersimpan."
          );
          this.index();
        } else {
          this.landaService.alertSuccess("Mohon maaf", `${res.errors}.`);
        }
      });
  }

  delete(val) {
    const data = {
      id: val != null ? val.id : null,
      is_deleted: 1,
    };
    Swal.fire({
      title: "Apakah anda yakin? ",
      text: "Menghapus data master akan berpengaruh kepada yang lainnya",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Ya, hapus data ini!",
    }).then((result) => {
      if (result.value) {
        this.landaService
          .DataPost("/m_barang/hapus", data)
          .subscribe((res: any) => {
            if (res.status_code === 200) {
              this.landaService.alertSuccess(
                "Berhasil",
                "Data barang telah terhapus."
              );
              this.reloadDataTable();
            } else {
              this.landaService.alertSuccess("Mohon maaf", `${res.errors}.`);
            }
          });
      }
    });
  }

  reloadDataTable() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  empty() {
    this.model = {};
    this.getData();
  }

  toDate(dob) {
    if (dob) {
      const [year, month, day] = dob.split("-");
      const obj = {
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
      };
      return obj;
    }
  }

  fungsi() {
    this.landaService.DataGet("/m_kategori/index", {}).subscribe((res: any) => {
      this.listKategori = res.data.list;
      console.log(this.listKategori);
    });
  }
}
