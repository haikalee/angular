import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { LandaService } from "src/app/core/services/landa.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-pembelian",
  templateUrl: "./pembelian.component.html",
  styleUrls: ["./pembelian.component.scss"],
})
export class PembelianComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings;
  dtInstance: Promise<DataTables.Api>;
  breadCrumbItems: Array<{}>;
  pageTitle: string;
  isView: boolean;
  isEdit: boolean;
  modelParam: { nama; id_supplier; id_hp };
  model: any = {};
  showForm: boolean;
  listData: any;
  listSupplier: any;
  listPembelian: any;
  listHp: any;
  constructor(private landaService: LandaService) {}

  ngOnInit(): void {
    this.pageTitle = "Pembelian";
    this.breadCrumbItems = [
      {
        label: "Transaksi",
      },
      {
        label: "Pembelian",
        active: true,
      },
    ];

    this.modelParam = {
      nama: "",
      id_supplier: "",
      id_hp: "",
    };
    this.listPembelian = [];
    this.getData();
    this.empty();
    this.getListSupplier();
  }

  reloadDataTable() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
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
          .DataGet("/t_pembelian/index", params)
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

  index() {
    this.showForm = !this.showForm;
    this.pageTitle = "Data Pembelian";
    this.getData();
    this.empty();
    this.listPembelian = [];
    this.isEdit = false;
  }

  create() {
    this.empty();
    this.showForm = !this.showForm;
    this.pageTitle = "Tambah data pembelian";
    this.isView = false;
    this.isEdit = false;
    this.listPembelian = [];
    this.getListSupplier();
    this.getListHp();
  }

  view(val) {
    this.getData();
    this.getListSupplier();
    this.model = val;
    this.pageTitle = `Pembelian`;
    this.model.tanggal = this.toDate(val.tanggal);
    this.showForm = !this.showForm;
    this.isView = true;
    this.isEdit = false;
    const { alamat, no_hp, email } = this.listSupplier.filter(
      (item) => item.nama == val.supplier
    )[0];
    this.model.alamat = alamat;
    this.model.no_hp = no_hp;
    this.model.email = email;
    this.getDetailPembelian(val.id);
    this.getListHp();
  }

  save() {
    const final = {
      model: this.model,
      pembelian: this.listPembelian,
    };
    this.landaService
      .DataPost("/t_pembelian/save", final)
      .subscribe((res: any) => {
        if (res.status_code === 200) {
          this.landaService.alertSuccess("Berhasil", "Data telah tersimpan");
          this.index();
        } else {
          this.landaService.alertError("Mohon Maaf", res.errors);
        }
      });
  }

  edit(val) {
    this.getData();
    this.getListSupplier();
    this.model = val;
    this.pageTitle = `Pembelian`;
    this.model.tanggal = this.toDate(val.tanggal);
    this.showForm = !this.showForm;
    this.isView = false;
    this.isEdit = true;
    const { alamat, no_hp, email } = this.listSupplier.filter(
      (item) => item.nama == val.supplier
    )[0];
    this.model.alamat = alamat;
    this.model.no_hp = no_hp;
    this.model.email = email;
    this.getDetailPembelian(val.id);
    this.getListHp();
    // this.getHp(val.id);
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
          .DataPost("/t_pembelian/delete", data)
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

  empty() {
    this.model = {
      kode: "",
      id_supplier: "",
      tanggal: "",
    };
    this.getData();
  }

  getDetailPembelian(id) {
    this.landaService
      .DataGet("/t_pembelian/detailpembelian", { id })
      .subscribe((res: any) => {
        this.listPembelian = res.data.list;
      });
  }

  getListHp() {
    this.landaService.DataGet("/m_hp/index", {}).subscribe((res: any) => {
      this.listHp = res.data.list;
    });
  }

  getListSupplier() {
    this.landaService.DataGet("/m_supplier/index", {}).subscribe((res: any) => {
      this.listSupplier = res.data.list;
    });
  }

  pembelian(val, id) {
    this.landaService
      .DataGet("/t_pembelian/id_hp", { id })
      .subscribe((res: any) => {
        val.harga_beli = res.data;
        val.jumlah = 1;
        val.diskon = 0;
        val.jumlah_diskon = 0;
        this.total();
      });
  }

  total() {
    let total = 0;
    this.listPembelian.forEach((val) => {
      if (val.jumlah) {
        val.amount = 0;
        val.amount = val.harga_beli * val.jumlah;
      }

      if (val.diskon != "") {
        val.amount = 0;
        val.jumlah_diskon = val.harga_beli * val.jumlah * (val.diskon / 100);
        val.amount = val.jumlah * val.harga_beli - val.jumlah_diskon;
        console.log(val.amount);
      }
      total += val.amount;
    });
    this.model.total = total;
  }

  selected(id) {
    const supplier = this.listSupplier.filter((item) => item.id == id)[0];
    this.model.alamat = supplier.alamat;
    this.model.no_hp = supplier.no_hp;
    this.model.email = supplier.email;
  }

  addRow(val) {
    const newRow = {
      id_m_hp: "",
      jumlah: 0,
      harga_beli: 0,
      diskon: 0,
      jumlah_diskon: 0,
      amount: 0,
    };

    val.push(newRow);
  }

  removeRow(i, val) {
    this.listPembelian.splice(i, 1);
    this.model.total -= val;
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
}
