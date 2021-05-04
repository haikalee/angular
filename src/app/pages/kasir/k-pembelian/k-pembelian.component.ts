import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { LandaService } from "src/app/core/services/landa.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-k-pembelian",
  templateUrl: "./k-pembelian.component.html",
  styleUrls: ["./k-pembelian.component.scss"],
})
export class KPembelianComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  dtOptions: DataTables.Settings;
  pageTitle: string;
  breadCrumbItems: Array<{}>;
  isView: boolean;
  isEdit: boolean;
  showForm: boolean;
  listPembelian: any;
  listCustomer: any;
  listType: any;
  listBarang: any;
  listSupplier: any;
  modelParam: { id_supplier };
  model: any = {};
  update: boolean;
  constructor(private landaService: LandaService) {}

  ngOnInit(): void {
    this.pageTitle = "Penjualan";
    this.breadCrumbItems = [
      {
        label: "Kasir",
      },
      {
        label: "Penjualan",
        activate: true,
      },
    ];
    this.modelParam = {
      id_supplier: "",
    };
    this.listType = [
      {
        id: 1,
        nama: "kg",
      },
      {
        id: 2,
        nama: "liter",
      },
      {
        id: 2,
        nama: "bungkus",
      },
    ];
    this.listPembelian = [];
    this.update = false;
    this.getSupplier();
    this.getData();
    this.empty();
  }

  index() {
    this.empty();
    this.getData();
    this.getSupplier();
    this.showForm = !this.showForm;
    this.pageTitle = "Pembelian";
    this.isView = false;
    this.isEdit = false;
  }

  view(val) {
    console.log(this.listPembelian);
    this.empty();
    this.getSupplier();
    // this.getBarang(val.id_supplier);
    this.getDetail(val.id);
    this.showForm = !this.showForm;
    this.isView = true;
    this.isEdit = false;
    this.model = val;
    const filter = this.listSupplier.filter((item) => {
      return item.id == val.id_supplier;
    })[0];
    this.model.alamat = filter.alamat;
    this.model.tanggal = this.toDate(val.tanggal);
    this.pageTitle = "Pembelian";
  }

  create() {
    this.empty();
    this.getSupplier();
    this.showForm = !this.showForm;
    this.isView = false;
    this.isEdit = false;
    this.pageTitle = "Tambah Pembelian";
  }

  selected() {
    if (this.model.id_supplier) {
      const { alamat } = this.listSupplier.filter((item) => {
        return item.id == this.model.id_supplier;
      })[0];
      this.model.alamat = alamat;
      this.landaService
        .DataGet("/k_pembelian/detail_sup", { id: this.model.id_supplier })
        .subscribe((res: any) => {
          if (res.data.length == 0) {
            this.update = false;
          } else {
            this.update = true;
          }
          this.listPembelian = res.data;
          this.listPembelian.forEach((item) => (item.stok = 0));
          this.total();
        });
    } else {
      this.model.alamat = "";
    }
  }

  save() {
    const final = {
      model: this.model,
      pembelian: this.listPembelian,
      isUpdate: this.update,
    };
    this.landaService
      .DataPost("/k_pembelian/save", final)
      .subscribe((res: any) => {
        if (res.status_code === 200) {
          this.landaService.alertSuccess("berhasil", "data berhasi dimasukkan");
          this.index();
        } else {
          this.landaService.alertError("Mohon Maaf", res.errors);
          this.index();
        }
      });
  }

  delete(val) {
    const data = {
      id: val != null ? val.id : null,
      is_deleted: 1,
    };
    Swal.fire({
      title: "Apakah anda yakin ?",
      text: "Menghapus data Hp akan berpengaruh terhadap data lainnya",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Ya, Hapus data ini !",
    }).then((result) => {
      if (result.value) {
        this.landaService
          .DataPost("/k_pembelian/delete", data)
          .subscribe((res: any) => {
            if (res.status_code === 200) {
              this.landaService.alertSuccess(
                "berhasil",
                "data telah tersimpan"
              );
              this.reloadDataTable();
            } else {
              this.landaService.alertError("Mohon maaf", res.errors);
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

  edit(val) {
    this.empty();
    this.getSupplier();
    this.getDetail(val.id);
    const { alamat } = this.listSupplier.filter((item) => {
      return item.id == val.id_supplier;
    })[0];
    this.showForm = !this.showForm;
    this.model = val;
    this.model.alamat = alamat;
    this.model.tanggal = this.toDate(val.tanggal);
    this.isView = false;
    this.isEdit = true;
    this.pageTitle = "Pembelian";
  }

  // getDetailPembelian(val, id) {
  //   this.landaService
  //     .DataGet("/k_pembelian/detail", { id })
  //     .subscribe((res: any) => {
  //       this.listPembelian = res.data;
  //     });
  // }

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
          .DataGet("/k_pembelian/index", params)
          .subscribe((res: any) => {
            this.listPembelian = res.data.list;
            callback({
              recordsTotal: res.data.totalItems,
              recordsFiltered: res.data.totalItems,
              data: [],
            });
          });
      },
    };
  }

  empty() {
    this.model = {};
    this.listPembelian = [];
    this.listBarang = [];
  }

  addRow(listPembelian) {
    const newRow = {
      nama_barang: "",
      id_k_pembelian: 0,
      jumlah: 0,
      harga: 0,
      total: 0,
    };

    listPembelian.push(newRow);
  }

  removeRow(i, total) {
    this.listPembelian.splice(i, 1);
  }

  total() {
    let total = 0;
    this.listPembelian.forEach((val) => {
      if (val.stok) {
        val.total = 0;
        val.total = val.harga_beli * val.stok;
      }
      total += val.total;
    });
    this.model.total = total;
  }

  getSupplier() {
    this.landaService.DataGet("/m_supplier/index", {}).subscribe((res: any) => {
      this.listSupplier = res.data.list;
    });
  }

  getDetail(id = null) {
    this.landaService
      .DataGet("/k_pembelian/detail", {
        id,
      })
      .subscribe((res: any) => {
        this.listPembelian = res.data;
      });
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

  print() {}
}
