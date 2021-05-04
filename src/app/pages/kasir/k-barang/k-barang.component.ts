import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { LandaService } from "src/app/core/services/landa.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-k-barang",
  templateUrl: "./k-barang.component.html",
  styleUrls: ["./k-barang.component.scss"],
})
export class KBarangComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  dtOptions: DataTables.Settings;
  breadCrumbItems: Array<{}>;
  pageTitle: string;
  isView: boolean;
  isEdit: boolean;
  showForm: boolean;
  listData: any;
  listSupplier: any;
  listUnit: any;
  modelParam: { nama };
  model: any = {};

  constructor(private landaService: LandaService) {}

  ngOnInit(): void {
    this.pageTitle = "Barang";
    this.listUnit = [
      {
        id: 1,
        nama: "kg",
      },
      {
        id: 2,
        nama: "liter",
      },
      {
        id: 3,
        nama: "butir",
      },
    ];
    this.breadCrumbItems = [
      {
        label: "Kasir",
      },
      {
        label: "Barang",
        active: true,
      },
    ];
    this.modelParam = {
      nama: "",
    };
    this.empty();
    this.getData();
  }

  reloadDataTable() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  empty() {
    this.model = {};
  }

  index() {
    this.getData();
    this.empty();
    this.showForm = !this.showForm;
    this.pageTitle = "Barang";
  }

  create() {
    this.empty();
    this.getSupplier();
    this.showForm = !this.showForm;
    this.pageTitle = "Tambah data barang";
    this.isView = false;
    this.isEdit = false;
  }

  view(val) {
    this.empty();
    this.getSupplier();
    this.model = val;
    this.model.supplier_id = val.id_supplier;
    this.model.id_supplier = val.supplier;
    this.showForm = !this.showForm;
    this.pageTitle = val.nama;
    this.isView = true;
    this.isEdit = false;
  }

  edit(val) {
    this.empty();
    this.getSupplier();
    this.model = val;
    this.model.supplier_id = val.id_supplier;
    this.model.id_supplier = val.supplier;
    this.showForm = !this.showForm;
    this.pageTitle = val.nama;
    this.isView = false;
    this.isEdit = true;
  }

  delete(val) {
    const data = {
      id: val.id ? val.id : null,
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
          .DataPost("/k_barang/delete", data)
          .subscribe((res: any) => {
            if (res.status_code == 200) {
              this.landaService.alertSuccess(
                "Berhasil",
                "Data telah terhapus!"
              );
              this.reloadDataTable();
            } else {
              this.landaService.alertError("Mohon Maaf", res.errors);
            }
          });
      }
    });
  }

  save() {
    const final = Object.assign(this.model);
    this.landaService
      .DataPost("/k_barang/save", final)
      .subscribe((res: any) => {
        console.log(res);
        if (res.status_code === 200) {
          this.landaService.alertSuccess(
            "Berhasil",
            "Data Barang telah disimpan!"
          );
          this.index();
        } else {
          this.landaService.alertError("Mohon Maaf", res.errors);
        }
      });
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
          .DataGet("/k_barang/index", params)
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

  getSupplier() {
    this.landaService.DataGet("/m_supplier/index", {}).subscribe((res: any) => {
      this.listSupplier = res.data.list;
    });
  }
}
