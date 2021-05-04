import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { LandaService } from "src/app/core/services/landa.service";
import { environment } from "../../../../environments/environment";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Swal from "sweetalert2";

@Component({
  selector: "app-k-penjualan",
  templateUrl: "./k-penjualan.component.html",
  styleUrls: ["./k-penjualan.component.scss"],
})
export class KPenjualanComponent implements OnInit {
  apiUrl = environment.apiURL;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  dtOptions: DataTables.Settings;
  pageTitle: string;
  breadCrumbItems: Array<{}>;
  isView: boolean;
  isEdit: boolean;
  isMember: boolean;
  showForm: boolean;
  listData: any;
  listPenjualan: any;
  listCustomer: any;
  listType: any;
  listBarang: any;
  modelParam: { customer };
  model: any = {};

  idPenjualan: any;
  bonus: number;

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
      customer: "",
    };
    this.listType = [
      {
        id: 1,
        nama: "biasa",
      },
      {
        id: 2,
        nama: "member",
      },
    ];
    this.bonus = 0;
    this.isMember = false;
    this.listPenjualan = [];
    this.getData();
    this.empty();
    this.getCustomer();
    this.getBarang();
  }

  changeType() {
    this.empty();
    this.isMember = !this.isMember;
    if (!this.isMember) {
      this.model.dataLength = 0;
      this.bonus = 0;
    }
  }

  reloadDataTable() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  index() {
    this.empty();
    this.getData();
    this.getCustomer();
    this.showForm = !this.showForm;
    this.pageTitle = "Penjualan";
    this.isView = false;
    this.isEdit = false;
  }

  view(val) {
    if (val.nama_customer == null && val.id_customer == null) {
      this.isMember = false;
    } else {
      this.isMember = true;
    }
    this.empty();
    this.getCustomer();
    this.getBarang();
    this.getDetailPenjualan(val.id);
    this.showForm = !this.showForm;
    if (this.isMember) {
      const { alamat, type } = this.listCustomer.filter((item) => {
        return item.id == val.id_customer;
      })[0];
      this.model.alamat = alamat;
      this.model.type = type;
    }
    this.model = val;
    this.model.alamat = val.alamat;
    this.model.type = val.type;
    this.model.tanggal = this.toDate(val.tanggal);
    this.isView = true;
    this.isEdit = false;
    this.idPenjualan = val.id;
    this.pageTitle = "Customer: " + val.customer;
  }

  create() {
    this.isMember = false;
    this.empty();
    this.getCustomer();
    this.getBarang();
    this.showForm = !this.showForm;
    this.isView = false;
    this.isEdit = false;
    this.pageTitle = "Tambah Penjualan";
  }

  save() {
    const final = {
      model: this.model,
      penjualan: this.listPenjualan,
      isMember: this.isMember,
    };
    this.landaService
      .DataPost("/k_penjualan/save", final)
      .subscribe((res: any) => {
        if (res.status_code === 200) {
          this.landaService.alertSuccess("berhasil", "data berhasi dimasukkan");
          this.index();
        } else {
          this.landaService.alertError("Mohon Maaf", res.errors);
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
          .DataPost("/k_penjualan/delete", data)
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

  edit(val) {
    this.isMember = false;
    this.empty();
    this.getCustomer();
    this.getBarang();
    this.getDetailPenjualan(val.id);
    this.showForm = !this.showForm;
    const { alamat, type } = this.listCustomer.filter((item) => {
      return item.id == val.id_customer;
    })[0];
    this.model = val;
    this.model.alamat = alamat;
    this.model.type = type;
    this.model.tanggal = this.toDate(val.tanggal);
    this.isView = false;
    this.isEdit = true;
    this.pageTitle = "Customer: " + val.customer;
  }

  getData() {
    this.dtOptions = {
      serverSide: true,
      processing: true,
      ordering: false,
      pagingType: "full_numbers",
      ajax: (dataTablesParameter: any, callback) => {
        const params = {
          filter: JSON.stringify(this.modelParam),
          offset: dataTablesParameter.start,
          limit: dataTablesParameter.length,
        };

        this.landaService
          .DataGet("/k_penjualan/index", params)
          .subscribe((res: any) => {
            this.listData = res.data.list;

            callback({
              recordsTotal: res.data.totalItems,
              recordsFiltered: res.data.totalItems,
              data: [],
            });
          });
      },
    };
  }

  selected() {
    this.landaService
      .DataGet("/k_penjualan/customer", { id: this.model.id_customer })
      .subscribe((res: any) => {
        this.model.dataLength = res.data;
      });
    this.landaService
      .DataGet("/k_customer/id", { id: this.model.id_customer })
      .subscribe((res: any) => {
        this.model.alamat = res.data.alamat;
        this.model.type = res.data.type;
      });
  }

  getCustomer() {
    this.landaService.DataGet("/k_customer/index", {}).subscribe((res: any) => {
      this.listCustomer = res.data.list;
    });
  }

  getBarang() {
    this.landaService.DataGet("/k_barang/index", {}).subscribe((res: any) => {
      this.listBarang = res.data.list;
    });
  }

  pembelian(val, id) {
    this.landaService
      .DataGet("/k_barang/id_barang", { id })
      .subscribe((res: any) => {
        val.harga_beli = res.data.harga_beli;
        val.diskon_barang = res.data.diskon_barang;
        val.diskon_total = 0;
        val.jumlah = 1;
        this.total();
      });
  }

  addRow(listPenjualan) {
    if (this.model.dataLength != 0 && this.isMember == true) {
      if ((this.model.dataLength + 1) % 10 == 0) {
        this.bonus = 20;
      }
    }
    const newRow = {
      id_barang: 0,
      id_k_penjualan: 0,
      jumlah: 0,
      harga_beli: 0,
      diskon_barang: 0,
      diskon_bonus: this.bonus,
      diskon_total: 0,
      total: 0,
    };

    listPenjualan.push(newRow);
  }

  removeRow(i, total) {
    this.listPenjualan.splice(i, 1);
  }

  getDetailPenjualan(id) {
    this.landaService
      .DataGet("/k_penjualan/detail", { id })
      .subscribe((res: any) => {
        this.listPenjualan = res.data;
      });
  }

  total() {
    let total = 0;
    this.listPenjualan.forEach((val) => {
      if (val.jumlah) {
        val.total = 0;
        val.total = val.harga_beli * val.jumlah;
      }

      if (val.diskon_barang != 0) {
        val.total = 0;
        val.diskon_total =
          val.harga_beli * val.jumlah * (val.diskon_barang / 100);
        val.total = val.jumlah * val.harga_beli - val.diskon_total;
      }

      if (val.diskon_bonus != 0) {
        val.total = 0;
        if (val.diskon_barang != 0) {
          let jumlah = val.harga_beli * val.jumlah;
          let diskonAwal = jumlah * (val.diskon_barang / 100);
          let totalAwal = jumlah - diskonAwal;
          let diskonAkhir = totalAwal * (val.diskon_bonus / 100);
          val.diskon_total = diskonAwal + diskonAkhir;
          val.total = val.jumlah * val.harga_beli - val.diskon_total;
        } else if (val.diskon_barang == 0) {
          val.diskon_total =
            val.harga_beli * val.jumlah * (val.diskon_bonus / 100);
          val.total = val.jumlah * val.harga_beli - val.diskon_total;
        }
      }
      total += val.total;
    });
    this.model.total = total;
  }

  empty() {
    this.model = {};
    this.listPenjualan = [];
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

  print() {
    // const el = document.getElementById("transaksi");

    // html2canvas(el).then((canvas) => {
    //   console.log(canvas);
    //   const imgData = canvas.toDataURL("image/png");
    //   const imgHeight = (canvas.height * 500) / canvas.width;
    //   const doc = new jsPDF();
    //   doc.addImage(imgData, 0, 0, 208, imgHeight);
    //   doc.save(`${Math.random() * 999 + 1}.pdf`);
    // });
    const data = this.idPenjualan;
    // window.open(`${this.apiUrl}/k_penjualan/print?${$.param(data)}_blank`);
    window.open(this.apiUrl + "/k_penjualan/print?id=" + data, "_blank");
  }
}
